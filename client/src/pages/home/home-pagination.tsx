import usePagination from '@/shared/hooks/usePagination.ts';
import useValidateZodProps from '@/shared/hooks/useValidateZodProps.ts';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink, PaginationNext,
  PaginationPrevious,
} from '@shadcn/pagination.tsx';
import { FC, useCallback, useRef } from 'react';
import { z } from 'zod';

type PaginationSchema = ({ type: 'page' | 'link', page: number | string } | { type: 'dot' })

const propsSchema = z.object({
  total: z.number().int(),
  limit: z.number().int(),
  page: z.number().int().min(1),
  setPage: z.function().args(z.number().int().min(1)),
});

type Props = z.infer<typeof propsSchema>

const HomePagination: FC<Props> = (props) => {
  const { page, total, limit, setPage } = useValidateZodProps(props, propsSchema);
  const pagination = usePagination({ page, total, limit });
  const dotSymbol = useRef('…');
  
  const getTemplatePagination = useCallback(() => {
    return pagination.map<PaginationSchema>(it => {
      return it === dotSymbol.current
        ? { type: 'dot' }
        : { type: String(page) === it ? 'page' : 'link', page: it };
    });
  }, [dotSymbol.current, page, pagination]);
  
  if (total <= limit) {
    return null;
  }
  
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={page > 1 ? `/?paged=${page - 1}` : '#'} />
          {/* <PaginationPrevious href={page > 1 ? `/page/${page - 1}` : '#'} /> */}
        </PaginationItem>
        
        {getTemplatePagination().map((it, i) => {
          switch (it.type) {
            case 'dot': {
              return (
                <PaginationItem key={i}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            case 'link': {
              return (
                <PaginationItem key={i}>
                  <PaginationLink href="#">{it.page}</PaginationLink>
                </PaginationItem>
              );
            }
            case 'page': {
              return (
                <PaginationItem key={i}>
                  <PaginationLink href="#" isActive>{it.page}</PaginationLink>
                </PaginationItem>
              );
            }
          }
        })}
        
        <PaginationItem>
          <PaginationNext href={page < Math.ceil(total / limit) ? `/?paged=${page + 1}` : '#'} />
          {/* <PaginationNext href={page < Math.ceil(total / limit) ? `/page/${page + 1}` : '#'} /> */}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default HomePagination;