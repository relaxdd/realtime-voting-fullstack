import { useMemo } from 'react';

interface UsePaginationProps {
  total: number,
  limit: number,
  page: number,
  siblings?: number,
  dotSymbol?: string
}

type UsePagination = ((config: UsePaginationProps) => string[])

const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const usePagination: UsePagination = (
  { total, limit, page, siblings = 1, dotSymbol = '…' },
) => {
  const pagination = useMemo(() => {
    const totalPageCount = Math.ceil(total / limit);
    const totalPageNumbers = siblings + 5;
    
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }
    
    const leftSiblingIndex = Math.max(page - siblings, 1);
    const rightSiblingIndex = Math.min(page + siblings, totalPageCount);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
    const lastPageIndex = totalPageCount;
    const firstPageIndex = 1;
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblings;
      const leftRange = range(1, leftItemCount);
      
      return [...leftRange, dotSymbol, totalPageCount];
    }
    
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblings;
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount,
      );
      return [firstPageIndex, dotSymbol, ...rightRange];
    }
    
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, dotSymbol, ...middleRange, dotSymbol, lastPageIndex];
    }
    
    return [];
  }, [total, limit, siblings, page, dotSymbol]);
  
  return pagination && pagination.map(it => String(it));
};

export default usePagination;