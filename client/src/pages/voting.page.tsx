import '../assets/css/voting.css';
import { AppLinks } from '@/shared/defines.ts';
import { Button } from '@shadcn/button.tsx';
import { Card, CardContent, CardFooter } from '@shadcn/card.tsx';
import { GetVotingByIdDocument, UpdateVotingDocument } from '@/graphql/generated.ts';
import BackwardHeader from '@/components/backward-header.tsx';
import { useAuthContext } from '@/providers/auth-provider.tsx';
import WsEventService from '@/shared/services/WsEventService.ts';
import { useMutation, useQuery } from '@apollo/client';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { getPercent, numDeclinePeople, numDeclineVotes } from '@/shared/helpers.ts';
import { Progress } from '@shadcn/progress.tsx';
import { Label } from '@shadcn/label';
import { RadioGroup, RadioGroupItem } from '@shadcn/radio-group';
import { Link, Navigate, useParams } from 'react-router';

/*
 * =====================================
 */

const VotingPage = () => {
  const params = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const [isDisabled] = useState(false);
  const [nowOnline, setNowOnline] = useState(0);
  const [connectionState, setConnectionState] = useState('offline');
  
  const votingById = useQuery(GetVotingByIdDocument, { variables: { id: params.id! } });
  const updateVoting = useMutation(UpdateVotingDocument);
  
  const choices = useMemo(() => {
    return votingById.data ? (votingById.data?.oneVoting?.choices ?? []) : [];
  }, [votingById.data]);
  
  const total = useMemo(() => {
    return choices.reduce((acc, it) => acc + it.votes, 0);
  }, [choices]);
  
  async function onSubmitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const value = String(formData.get('voting'));
    
    if (!value) return;
    
    await updateVoting[0]({
      variables: {
        input: {
          votingId: params.id!,
          choiceName: value,
        },
      },
      onError: (err) => {
        alert(err?.message);
      },
      onCompleted: (data) => {
        console.log(data?.updateVoting);
      },
    });
    
    // setDisabled(true);
  }
  
  const initEventService = useCallback((service: WsEventService) => {
    service.onMessage((data) => {
      switch (data.type) {
        case 'refresh':
          setNowOnline(data?.payload);
          break;
        case 'update':
          votingById.refetch().then();
          break;
      }
    });
    
    service.onChangeConnectionState((state) => {
      setConnectionState(state);
      if (state !== 'online') setNowOnline(0);
    });
    
    service.onClose(() => {
      setNowOnline(0);
    });
  }, [votingById.refetch]);
  
  useEffect(() => {
    const url = import.meta.env?.VITE_WS_CONNECT_URL || '';
    if (!url) return;
    
    const wsEventService = new WsEventService(`${url}/${params.id!}`);
    initEventService(wsEventService);
    
    function testHandler() {
      wsEventService.disconnect();
    }
    
    window.addEventListener('beforeunload', testHandler);
    
    return () => {
      wsEventService.disconnect();
      window.removeEventListener('beforeunload', testHandler);
    };
  }, [initEventService, params.id]);
  
  if (votingById.loading) return <h1>Loading data...</h1>;
  if (votingById.error || !votingById.data) return <h1>Error loading data</h1>;
  if (votingById.data.oneVoting === null) return <Navigate to={AppLinks.root} />;
  
  return (
    <>
      <BackwardHeader title={votingById.data.oneVoting?.title} />
      
      {votingById.data.oneVoting?.description && (
        <p>{votingById.data.oneVoting.description}</p>
      )}
      
      {!votingById.loading && votingById.data && (
        <>
          <div className="flex flex-col gap-5 md:gap-6 items-stretch md:flex-row">
            <form
              style={!isDisabled ? {} : { opacity: '0.7' }}
              onSubmit={onSubmitHandler}
            >
              <Card className="w-[100%] md:w-[280px] h-[100%] flex-col justify-between">
                <CardContent>
                  <RadioGroup defaultValue={choices?.[0]?.value ?? ''} className="gap-y-4" name="voting">
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
                  <Button type="submit" disabled={!user}>Голосовать</Button>
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
          
          <div className="mt-6 mb-4">
            <div>
              Всего проголосовало | {numDeclinePeople(total)}
            </div>
            
            <div className="flex gap-2 items-baseline">
              Сейчас смотрит | {numDeclinePeople(nowOnline)}
              
              <div className="flex flex-row items-center gap-x-1.5">
                <span className="circle-status" data-type={connectionState}></span>
                <small>{connectionState.charAt(0).toUpperCase() + connectionState.slice(1)}</small>
              </div>
            </div>
          </div>
          
          <Link to={`/${params.id!}/edit`}>Редактировать</Link>
        </>
      )}
    </>
  );
};

export default VotingPage;