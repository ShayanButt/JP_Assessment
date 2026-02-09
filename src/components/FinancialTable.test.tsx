import { render, screen, fireEvent } from '@testing-library/react';
import FinancialTable from './FinancialTable';
import type { Instrument } from '../types';

const mockData: Instrument[] = [
  { ticker: 'ALPHA', price: 3150.67, assetClass: 'Credit' },
  { ticker: 'BETA', price: 100.00, assetClass: 'Equities' },
  { ticker: 'GAMMA', price: -50.00, assetClass: 'Macro' },
];

describe('FinancialTable', () => {
  it('renders table headers', () => {
    render(<FinancialTable data={mockData} />);
    expect(screen.getByText(/Ticker/)).toBeInTheDocument();
    expect(screen.getByText(/Price/)).toBeInTheDocument();
    expect(screen.getByText(/Asset Class/)).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(<FinancialTable data={mockData} />);
    expect(screen.getByText('ALPHA')).toBeInTheDocument();
    expect(screen.getByText('BETA')).toBeInTheDocument();
    expect(screen.getByText('GAMMA')).toBeInTheDocument();
  });

  it('applies correct class for Asset Class', () => {
    render(<FinancialTable data={mockData} />);
    
    const creditRow = screen.getByText('ALPHA').closest('tr');
    expect(creditRow).toHaveClass('row-credit');

    const equitiesRow = screen.getByText('BETA').closest('tr');
    expect(equitiesRow).toHaveClass('row-equities');

    const macroRow = screen.getByText('GAMMA').closest('tr');
    expect(macroRow).toHaveClass('row-macro');
  });

  it('applies correct class for Price (Positive/Negative)', () => {
    render(<FinancialTable data={mockData} />);
    
    // 3150.67 -> Positive
    const positivePrice = screen.getByText('3150.67');
    expect(positivePrice).toHaveClass('price-positive');

    // -50.00 -> Negative
    const negativePrice = screen.getByText('-50.00');
    expect(negativePrice).toHaveClass('price-negative');
  });

  it('triggers sort when header is clicked', () => {
    render(<FinancialTable data={mockData} />);
    
    const tickerHeader = screen.getByText(/Ticker/);
    fireEvent.click(tickerHeader);

    // After sort, ALPHA should be first (default mock order is already sorted by chance for ticker, let's check indicator)
    expect(screen.getByText(/Ticker ↑/)).toBeInTheDocument();
  });

  it('renders pagination controls', () => {
    // Create enough data for 2 pages (15 items > 10 itemsPerPage)
    const largeData = Array.from({ length: 15 }, (_, i) => ({
      ticker: `TICKER${i}`,
      price: 100 + i,
      assetClass: 'Equities' as const
    }));

    render(<FinancialTable data={largeData} />);
    
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });
});
