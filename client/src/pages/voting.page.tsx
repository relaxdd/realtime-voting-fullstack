import '../assets/css/voting.css';
import { AppLinks } from '@/shared/defines.ts';
import { Button } from '@shadcn/button.tsx';
import { Card, CardContent, CardFooter } from '@shadcn/card.tsx';
import {
  CheckAnswerDocument,
  CompleteVotingDocument,
  DeleteVotingDocument,
  GetVotingByIdDocument,
  UpdateVotingDocument,
} from '@/graphql/generated.ts';
import BackwardHeader from '@/components/backward-header.tsx';
import { useAuthContext } from '@/providers/auth-provider.tsx';
import WsEventService from '@/shared/services/WsEventService.ts';
import { useMutation, useQuery } from '@apollo/client';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { getPercent, numDeclinePeople, numDeclineVotes } from '@/shared/helpers.ts';
import { Progress } from '@shadcn/progress.tsx';
import { Label } from '@shadcn/label';
import { RadioGroup, RadioGroupItem } from '@shadcn/radio-group';
import { Link, Navigate, useNavigate, useParams } from 'react-router';

/*
 * =====================================
 */

const VotingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isDisabled, setDisabled] = useState(true);
  const [isActive, setActive] = useState(false);
  const params = useParams<{ id: string }>();
  const [nowOnline, setNowOnline] = useState(0);
  const [connectionState, setConnectionState] = useState('offline');
  
  const deleteVoting = useMutation(DeleteVotingDocument);
  const updateVoting = useMutation(UpdateVotingDocument);
  const completeVoting = useMutation(CompleteVotingDocument);
  
  const votingById = useQuery(GetVotingByIdDocument, { variables: { id: params.id! } });
  
  const votingId = useMemo(() => {
    return votingById?.data?.oneVoting?.id || null;
  }, [votingById?.data?.oneVoting?.id]);
  
  const checkAnswer = useQuery(CheckAnswerDocument, {
    skip: !votingId,
    variables: { votingId: votingId! },
  });
  
  /*
   * =======================================
   */
  
  const initEventService = useCallback((service: WsEventService) => {
    service.onConnect(() => {
      if (typeof checkAnswer?.data?.checkAnswer === 'boolean') {
        setDisabled(Boolean(checkAnswer.data.checkAnswer));
      }
    });
    
    service.onMessage((data) => {
      switch (data.type) {
        case 'refresh':
          setNowOnline(data?.payload);
          break;
        case 'update':
          votingById.refetch().then();
          break;
        case 'completed':
          alert('Голосование было завершено.');
          setDisabled(true);
          votingById.refetch().then();
          break;
      }
    });
    
    service.onChangeConnectionState((state) => {
      setConnectionState(state);
      
      if (state !== 'online') {
        setNowOnline(0);
        setDisabled(true);
      }
    });
    
    service.onClose(() => {
      setNowOnline(0);
      setDisabled(true);
    });
  }, [checkAnswer?.data?.checkAnswer, votingById.refetch]);
  
  useEffect(() => {
    const url = import.meta.env?.VITE_WS_CONNECT_URL || '';
    if (!url) return;
    
    const isActive = votingById?.data?.oneVoting?.isActive || false;
    if (!isActive) return;
    
    const wsEventService = new WsEventService(`${url}/${params.id!}`);
    initEventService(wsEventService);
    
    function beforeUnloadHandler() {
      wsEventService.disconnect();
    }
    
    window.addEventListener('beforeunload', beforeUnloadHandler);
    
    return () => {
      wsEventService.disconnect();
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, [votingById?.data?.oneVoting?.isActive, initEventService, params.id]);
  
  useEffect(() => {
    setActive(Boolean(votingById?.data?.oneVoting?.isActive || false));
  }, [votingById?.data?.oneVoting?.isActive]);
  
  useEffect(() => {
    if (!checkAnswer?.data) return;
    
    if (typeof checkAnswer?.data?.checkAnswer === 'boolean') {
      setDisabled(Boolean(checkAnswer.data.checkAnswer));
    }
  }, [checkAnswer.data]);
  
  /*
   * =======================================
   */
  
  async function onSubmitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    const shortId = String(formData.get('shortId') ?? '');
    const votingId = String(formData.get('votingId') ?? '');
    const choiceName = String(formData.get('choiceName') ?? '');
    
    if (!choiceName || !votingId) return;
    
    await updateVoting[0]({
      variables: {
        input: {
          shortId: shortId!,
          votingId: votingId!,
          choiceName: choiceName,
        },
      },
      refetchQueries: [{
        query: CheckAnswerDocument,
        variables: { votingId },
      }],
      onError: (err) => {
        alert(err?.message);
      },
      onCompleted: ({ updateVoting }) => {
        if (updateVoting === true) {
          setDisabled(true);
          alert('Ваш ответ успешно записан');
        }
      },
    });
  }
  
  async function onDeleteHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const votingId = String(formData.get('votingId') ?? '');
    
    if (!votingId) {
      alert('Неопределённая ошибка, попробуйте позже');
      return;
    }
    
    const message = 'Вы уверены что хотите удалить это голосование?';
    if (!window.confirm(message)) return;
    
    await deleteVoting[0]({
      variables: { id: votingId },
      onError: (err) => {
        alert(err?.message);
      },
      onCompleted: () => {
        alert('Голосование успешно удалено');
        navigate(AppLinks.root);
      },
    });
  }
  
  async function onCompleteHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const votingId = String(formData.get('votingId') ?? '');
    
    if (!votingId) {
      alert('Неопределённая ошибка, попробуйте позже');
      return;
    }
    
    const message = 'Вы уверены что хотите завершить это голосование?';
    if (!window.confirm(message)) return;
    
    await completeVoting[0]({
      variables: { id: votingId },
      onError: (err) => {
        alert(err?.message);
      },
      onCompleted: ({ completeVoting }) => {
        if (completeVoting) {
          setDisabled(true);
        }
      },
    });
  }
  
  /*
   * =======================================
   */
  
  const choices = useMemo(() => {
    return votingById.data ? (votingById.data?.oneVoting?.choices ?? []) : [];
  }, [votingById.data]);
  
  const total = useMemo(() => {
    return choices.reduce((acc, it) => acc + it.votes, 0);
  }, [choices]);
  
  const isOwner = useMemo(() => {
    return votingById?.data?.oneVoting?.authorId === user?.userId;
  }, [user?.userId, votingById?.data?.oneVoting?.authorId]);
  
  /*
   * =======================================
   */
  
  if (votingById.loading) return <h1>Loading data...</h1>;
  if (votingById.error || !votingById.data) return <h1>Error loading data</h1>;
  if (votingById.data.oneVoting === null) return <Navigate to={AppLinks.root} />;
  
  return (
    <>
      <BackwardHeader title={votingById.data.oneVoting?.title} />
      
      <div className="page-wrapper">
        <div className="page-content">
          {votingById.data.oneVoting?.description && (
            <p className="mb-8">{votingById.data.oneVoting.description}</p>
          )}
          
          {!votingById.loading && votingById.data && (
            <>
              <div className="flex flex-col gap-5 md:gap-6 items-stretch md:flex-row">
                <form
                  style={!isDisabled ? {} : { opacity: '0.7' }}
                  onSubmit={onSubmitHandler}
                >
                  <input type="hidden" name="shortId" value={params.id!} />
                  <input type="hidden" name="votingId" value={votingId!} />
                  
                  <Card className="w-[100%] md:w-[280px] h-[100%] flex-col justify-between">
                    <CardContent>
                      <RadioGroup defaultValue={choices?.[0]?.value ?? ''} className="gap-y-4" name="choiceName">
                        {choices.map((it) => (
                          <div className="flex items-center gap-x-2" key={it.id}>
                            <RadioGroupItem
                              value={it.value}
                              disabled={isDisabled}
                              id={`option-${it.id}`}
                            />
                            
                            <Label htmlFor={`option-${it.id}`}>{it.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                    
                    <CardFooter>
                      <Button type="submit" disabled={!user || isDisabled || isActive}>Голосовать</Button>
                    </CardFooter>
                  </Card>
                </form>
                
                <Card className="w-[100%] md:w-[300px]">
                  <CardContent className="flex flex-col gap-y-4">
                    {choices.map((it) => {
                      const percent = getPercent(it.votes, total);
                      
                      return (
                        <div className="grid w-full gap-y-2.5" key={it.id}>
                          <Label title={numDeclineVotes(it.votes)}>{it.label} - {percent}%</Label>
                          <Progress value={percent} max={100} />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 mb-4">
                <div>Сейчас смотрит: {numDeclinePeople(nowOnline)}</div>
                <div>Всего проголосовало: {numDeclinePeople(total)}</div>
              </div>
              
              {isOwner && (
                <div className="flex items-center gap-x-2">
                  <Link to={`/${params.id!}/edit`} className="text-[#ad1619]">Редактировать</Link>
                  {' | '}
                  <form onSubmit={onDeleteHandler} className="inline-block">
                    <input type="hidden" name="votingId" value={votingId!} />
                    
                    <Button
                      type="submit"
                      children="Удалить"
                      variant="link"
                      className="p-0"
                    />
                  </form>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="page-sidebar">
          <Card className="py-5">
            <CardContent>
              <h2>Sidebar</h2>
              
              <div className="flex flex-row items-center gap-x-1.5 mb-4">
                <span className="circle-status" data-type={connectionState}></span>
                <small>{connectionState.charAt(0).toUpperCase() + connectionState.slice(1)}</small>
              </div>
              
              {isOwner && (
                <>
                {isActive
                  ? (
                    <form onSubmit={onCompleteHandler}>
                      <input type="hidden" name="votingId" value={String(votingId ?? '')} />
                      <Button type="submit" children="Завершить голосование" />
                    </form>
                  )
                  : (
                    <Button type="button" children="Голосование завершено" disabled />
                  )
                }
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default VotingPage;