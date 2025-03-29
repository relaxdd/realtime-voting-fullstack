import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { GetAllActiveVotingDocument } from '@/gql/generated.ts';
import { TimeConst } from '@/shared/defines.ts';
import { numDeclineVotes } from '@/shared/helpers.ts';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router';
import css from '@/assets/css/pages/index.page.module.css';

const IndexPage = () => {
  const { loading, data, error } = useQuery(GetAllActiveVotingDocument, { pollInterval: TimeConst.minute / 2 });
  
  if (loading) return <h1>Loading data...</h1>;
  if (error || !data) return <div style={{ marginTop: '0.67em' }}><p>Something went wrong.</p></div>;
  
  return (
    <main role="main">
      <h1>Hello world!</h1>
      
      <div className={css.wrapper}>
        <div className={css.content}>
          <div className="flex flex-col gap-y-4">
            {data.manyVoting.map((post) => (
              <article key={post.id}>
                <Card className="w-[100%] gap-2 py-5">
                  <CardContent>
                    <header className="flex justify-between">
                      <Link
                        to={String(post.id)}
                        className="inline-block hover:opacity-70"
                      >
                        <h2>{post.title}</h2>
                      </Link>
                      
                      <small>{numDeclineVotes(post.votesNumber)}</small>
                    </header>
                    
                    {post.description && (
                      <>
                        <Separator className="my-2" />
                        <p>{post.description}</p>
                      </>
                    )}
                    
                    <small className="inline-block mt-3">
                      Опубликовано: <time dateTime={post.createdAt.date}>{post.createdAt.pretty}</time>
                    </small>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        </div>
        
        <div className={css.sidebar}>
          <Card className="py-5">
            <CardHeader>
              <h2>Сайдбар</h2>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;