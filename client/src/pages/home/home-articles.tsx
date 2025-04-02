import { IGetAllActiveVotingQuery } from '@/graphql/generated.ts';
import { usePreferencesContext } from '@/providers/preferences.provider.tsx';
import { AppLinks } from '@/shared/defines.ts';
import { numDeclineVotes } from '@/shared/helpers.ts';
import language from '@/shared/language.ts';
import { Card, CardContent } from '@shadcn/card.tsx';
import { Link } from 'react-router';

const HomeArticles = ({ data }: { data: IGetAllActiveVotingQuery }) => {
  const [{ lang }] = usePreferencesContext();
  
  return (
    <div className="flex flex-col gap-y-4">
      {data.manyVoting.map((post) => (
        <article key={post.id}>
          <Card className="w-[100%] gap-2 py-5">
            <CardContent>
              <header className="flex justify-between">
                <Link
                  className="inline-block hover:opacity-70 text-[#ad1619]"
                  to={AppLinks.voting.get(String(post.shortId))}
                >
                  <h2>{post.title}</h2>
                </Link>
                
                <small>{numDeclineVotes(post.votesNumber)}</small>
              </header>
              
              <div className="mt-3"><small>@awenn2015</small> <small>#аниме #разное</small></div>
              
              <small className="inline-block">
                <span>{language.published[lang]}</span>:{' '}
                <time dateTime={post.createdAt.date}>{post.createdAt.pretty}</time>
              </small>
            </CardContent>
          </Card>
        </article>
      ))}
    </div>
  );
};

export default HomeArticles;