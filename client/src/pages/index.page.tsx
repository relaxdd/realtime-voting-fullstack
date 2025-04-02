import { Card, CardContent } from '@shadcn/card.tsx';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink, PaginationNext,
  PaginationPrevious,
} from '@shadcn/pagination.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@shadcn/select.tsx';
import { GetAllActiveVotingDocument } from '@/graphql/generated.ts';
import { usePreferencesContext } from '@/providers/preferences.provider.tsx';
import { AppLinks, TimeConst } from '@/shared/defines.ts';
import { numDeclineVotes } from '@/shared/helpers.ts';
import language from '@/shared/language.ts';
import { useQuery } from '@apollo/client';
import { Link, useSearchParams } from 'react-router';

const IndexPage = () => {
  const [{ lang }] = usePreferencesContext();
  const [searchParams] = useSearchParams();
  
  const { loading, data, error } = useQuery(GetAllActiveVotingDocument, {
    pollInterval: TimeConst.minute / 2,
    ...(searchParams.has('s') ? { variables: { search: searchParams.get('s') } } : {}),
  });
  
  if (loading) return <h1>Loading data...</h1>;
  if (error || !data) return <div style={{ marginTop: '0.67em' }}><p>Something went wrong.</p></div>;
  
  return (
    <main role="main">
      <h1 className="mt-0! mb-7! leading-[1.2]">{language.allVoting[lang]}</h1>
      
      <div className="page-wrapper">
        <div className="page-content">
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
                    
                    <div>
                      <small className="inline-block mt-3">
                        <span>{language.published[lang]}</span>:{' '}
                        <time dateTime={post.createdAt.date}>{post.createdAt.pretty}</time>
                      </small>
                    </div>
                    
                    <div><small>@awenn2015</small> <small>#аниме #разное</small></div>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
          
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                
                <PaginationItem>
                  <PaginationLink href="#" isActive>2</PaginationLink>
                </PaginationItem>
                
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
        
        <div className="page-sidebar">
          <Card className="py-5">
            <CardContent>
              <div className="mb-3">
                <h2>{language.sidebar[lang]}</h2>
                
                <Link
                  to={AppLinks.post}
                  className="text-[#ad1619]"
                >
                  <small>{language.createNewVoting[lang]}</small>
                </Link>
              </div>
              
              <div className="mb-3">
                <h2>Популярные теги</h2>
                <small>#аниме #разное #кулинария</small>
              </div>
              
              <div>
                <h2 className="mb-2">Категория</h2>
                
                <Select defaultValue="est">
                  <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>North America</SelectLabel>
                      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                      <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                      <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                    </SelectGroup>
                    
                    <SelectGroup>
                      <SelectLabel>Europe & Africa</SelectLabel>
                      <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="cet">Central European Time (CET)</SelectItem>
                      <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                      <SelectItem value="west">
                        Western European Summer Time (WEST)
                      </SelectItem>
                      <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                      <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;