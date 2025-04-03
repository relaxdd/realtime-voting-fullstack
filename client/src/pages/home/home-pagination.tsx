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
import { FC, MouseEvent, useCallback, useRef } from 'react';
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
  
  function onChangePageHandler(e: MouseEvent<HTMLAnchorElement>, page: number) {
    e.preventDefault();
    setPage(page);
  }
  
  if (total <= limit) {
    return null;
  }
  
  return (
    <Pagination>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={(e) => onChangePageHandler(e, page - 1)} />
          </PaginationItem>
        )}
        
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
                  <PaginationLink onClick={(e) => onChangePageHandler(e, +it.page)}>
                    {it.page}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            case 'page': {
              return (
                <PaginationItem key={i}>
                  <PaginationLink isActive>{it.page}</PaginationLink>
                </PaginationItem>
              );
            }
          }
        })}
        
        {page < Math.ceil(total / limit) && (
          <PaginationItem>
            <PaginationNext onClick={(e) => onChangePageHandler(e, page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default HomePagination;