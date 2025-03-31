import '../assets/css/voting.css';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardFooter } from '@/components/ui/card.tsx';
import { GetVotingByIdDocument } from '@/graphql/generated.ts';
import BackwardHeader from '@/components/backward-header.tsx';
import { useAuthContext } from '@/providers/auth-provider.tsx';
import WsEventService from '@/shared/services/WsEventService.ts';
import { useQuery } from '@apollo/client';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { getPercent, numDeclinePeople, numDeclineVotes } from '@/shared/helpers.ts';
import { Progress } from '@/components/ui/progress.tsx';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link, Navigate, useParams } from 'react-router';

/*
 * =====================================
 */

const VotingPage = () => {
  const params = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const [isDisabled, setDisabled] = useState(false);
  const [nowOnline, setNowOnline] = useState(0);
  const [connectionState, setConnectionState] = useState('offline');
  
  const { data, loading, error, refetch } = useQuery(GetVotingByIdDocument, { variables: { id: params.id! } });
  
  const choices = useMemo(() => {
    return data ? (data?.oneVoting?.choices ?? []) : [];
  }, [data]);
  
  const total = useMemo(() => {
    return choices.reduce((acc, it) => acc + it.votes, 0);
  }, [choices]);
  
  function onSubmitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const value = formData.get('voting');
    
    if (!value) return;
    
    // setOptions(prev => prev.map(it => it.value !== value ? it : { ...it, votes: it.votes + 1 }));
    setDisabled(true);
  }
  
  useEffect(() => {
    const url = import.meta.env?.VITE_WS_CONNECT_URL || '';
    if (!url) return;
    
    const wsEventService = new WsEventService(`${url}/${params.id!}`, {
      onMessage(data) {
        switch (data.type) {
          case 'refresh':
            setNowOnline(data?.payload);
            break;
          case 'update':
            refetch().then();
            break;
        }
      },
      onChangeConnectionState: (state) => {
        if (error && state === 'online') window.location.reload();
        setConnectionState(state);
      },
    });
    
    function onBeforeunloadHandler() {
      wsEventService.disconnect();
    }
    
    window.addEventListener('beforeunload', onBeforeunloadHandler);
    
    return () => {
      wsEventService.disconnect();
      window.removeEventListener('beforeunload', onBeforeunloadHandler);
    };
  }, [error]);
  
  if (loading) return <h1>Loading data...</h1>;
  if (error || !data) return <h1>Error loading data</h1>;
  if (data.oneVoting === null) return <Navigate to="/" />;
  
  return (
    <>
      <BackwardHeader title={data.oneVoting?.title} />
      
      {data.oneVoting?.description && (
        <p>{data.oneVoting.description}</p>
      )}
      
      {!loading && data && (
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
          
          <div className="mt-6">
            Всего проголосовало - {numDeclinePeople(total)}
          </div>
          
          <div className="flex gap-2 items-baseline">
            Сейчас смотрит - {numDeclinePeople(nowOnline)}
            
            <div className="flex flex-row items-center gap-x-1.5">
              <span className="circle-status" data-type={connectionState}></span>
              <small>{connectionState.charAt(0).toUpperCase() + connectionState.slice(1)}</small>
            </div>
          </div>
          
          <Link to={`/${params.id!}/edit`}>Редактировать</Link>
        </>
      )}
    </>
  );
};

export default VotingPage;