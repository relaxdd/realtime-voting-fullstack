import HomeArticles from '@/pages/home/home-articles.tsx';
import HomePagination from '@/pages/home/home-pagination.tsx';
import HomeSidebar from '@/pages/home/home-sidebar.tsx';
import { GetAllActiveVotingDocument } from '@/graphql/generated.ts';
import { usePreferencesContext } from '@/providers/preferences.provider.tsx';
import { TimeConst } from '@/shared/defines.ts';
import language from '@/shared/language.ts';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

const HARD_LIMIT = 20;

const HomePage = () => {
  const [{ lang }] = usePreferencesContext();
  const [searchParams] = useSearchParams();
  
  const [paged, setPaged] = useState(() => {
    const paged = searchParams.get('paged');
    return paged ? +paged : 1;
  });
  
  const { loading, data, error } = useQuery(GetAllActiveVotingDocument, {
    pollInterval: TimeConst.minute / 2,
    variables: {
      paged, limit: HARD_LIMIT,
      ...(searchParams.get('s') ? { search: searchParams.get('s') } : {}),
    },
  });
  
  useEffect(() => {
    setPaged(1);
  }, [searchParams]);
  
  if (loading) return <h1>Loading data...</h1>;
  if (error || !data) return <div style={{ marginTop: '0.67em' }}><p>Something went wrong.</p></div>;
  
  return (
    <main role="main">
      <h1 className="mt-0! mb-7! leading-[1.2]">{language.allVoting[lang]}</h1>
      
      <div className="page-wrapper">
        <div className="page-content">
          <HomeArticles data={data} />
          
          <div className="mt-6">
            <HomePagination
              page={paged}
              setPage={setPaged}
              limit={HARD_LIMIT}
              total={5}
            />
          </div>
        </div>
        
        <div className="page-sidebar">
          <HomeSidebar />
        </div>
      </div>
    </main>
  );
};

export default HomePage;