import { renderHook, act } from '@testing-library/react';
import { useFinancialData } from './useFinancialData';
import type { Instrument } from '../types';

const mockData: Instrument[] = Array.from({ length: 25 }, (_, i) => ({
  ticker: `TICKER${i}`,
  price: 100 + i,
  assetClass: i % 3 === 0 ? 'Equities' : i % 3 === 1 ? 'Macro' : 'Credit'
}));

describe('useFinancialData', () => {
  it('should paginate data correctly (default 10 items)', () => {
    const { result } = renderHook(() => useFinancialData(mockData));
    
    expect(result.current.paginatedData.length).toBe(10);
    expect(result.current.pagination.totalPages).toBe(3); // 25 items / 10 = 2.5 -> 3 pages
    expect(result.current.pagination.currentPage).toBe(1);
  });

  it('should navigate to next page', () => {
    const { result } = renderHook(() => useFinancialData(mockData));

    act(() => {
      result.current.pagination.nextPage();
    });

    expect(result.current.pagination.currentPage).toBe(2);
    expect(result.current.paginatedData[0].ticker).toBe('TICKER10'); // 0-9 on p1, 10-19 on p2
  });

  it('should navigate to previous page', () => {
    const { result } = renderHook(() => useFinancialData(mockData));

    act(() => {
      result.current.pagination.setPage(2);
    });
    expect(result.current.pagination.currentPage).toBe(2);

    act(() => {
      result.current.pagination.prevPage();
    });
    expect(result.current.pagination.currentPage).toBe(1);
  });

  it('should reset to page 1 on sort', () => {
    const { result } = renderHook(() => useFinancialData(mockData));

    act(() => {
      result.current.pagination.nextPage();
    });
    expect(result.current.pagination.currentPage).toBe(2);

    act(() => {
      result.current.requestSort('price');
    });
    expect(result.current.pagination.currentPage).toBe(1);
  });
});
