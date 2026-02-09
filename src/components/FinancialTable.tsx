import { useFinancialData } from '../hooks/useFinancialData';
import type { Instrument } from '../types';
import './FinancialTable.css';

interface FinancialTableProps {
  data: Instrument[];
}

const FinancialTable: React.FC<FinancialTableProps> = ({ data }) => {
  const {
    paginatedData,
    requestSort,
    sortConfig,
    pagination: {
      currentPage,
      totalPages,
      nextPage,
      prevPage
    }
  } = useFinancialData(data);

  const getSortIndicator = (name: keyof Instrument) => {
    if (!sortConfig || sortConfig.key !== name) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const getRowClass = (instrument: Instrument) => {
    switch (instrument.assetClass) {
      case 'Macro': return 'row-macro';
      case 'Equities': return 'row-equities';
      case 'Credit': return 'row-credit';
      default: return '';
    }
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  return (
    <div className="financial-table-container">
      <table className="financial-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('ticker')}>
              Ticker {getSortIndicator('ticker')}
            </th>
            <th onClick={() => requestSort('price')}>
              Price {getSortIndicator('price')}
            </th>
            <th onClick={() => requestSort('assetClass')}>
              Asset Class {getSortIndicator('assetClass')}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((instrument, index) => (
            <tr key={`${instrument.ticker}-${index}`} className={getRowClass(instrument)}>
              <td>{instrument.ticker}</td>
              <td className={`price-cell ${instrument.price >= 0 ? 'price-positive' : 'price-negative'}`}>
                {formatPrice(instrument.price)}
              </td>
              <td>
                <span className={`asset-badge ${instrument.assetClass.toLowerCase()}`}>
                  {instrument.assetClass}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FinancialTable;
