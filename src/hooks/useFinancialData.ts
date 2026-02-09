import { useState, useMemo } from 'react';
import type { Instrument } from '../types';

type SortKey = keyof Instrument;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export const useFinancialData = (initialData: Instrument[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    
    if (key === 'price') {
      if (sortConfig && sortConfig.key === 'price' && sortConfig.direction === 'desc') {
        direction = 'asc';
      } else {
        direction = 'desc';
      }
    } else {
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); 
  };

  const sortedData = useMemo(() => {
    let dataToSort = [...initialData];

    if (sortConfig) {
      dataToSort.sort((a, b) => {
        const { key, direction } = sortConfig;
        
        if (key === 'assetClass') {
          const order = { 'Equities': 0, 'Macro': 1, 'Credit': 2 };
          const valA = order[a.assetClass];
          const valB = order[b.assetClass];
          
          if (valA < valB) return direction === 'asc' ? -1 : 1;
          if (valA > valB) return direction === 'asc' ? 1 : -1;
          return 0;
        }
        
        if (key === 'price') {
          if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
          if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
          return 0;
        }

        if (key === 'ticker') {
           if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
           if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
           return 0;
        }

        return 0;
      });
    }
    return dataToSort;
  }, [initialData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
  const setPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return { 
    sortedData, 
    paginatedData,
    requestSort, 
    sortConfig,
    pagination: {
      currentPage,
      totalPages,
      nextPage,
      prevPage,
      setPage,
      itemsPerPage
    }
  };
};
