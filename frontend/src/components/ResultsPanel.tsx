import type { FC } from 'react';
import type { VehicleData } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

interface ResultsPanelProps {
  data: VehicleData[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const ResultsPanel: FC<ResultsPanelProps> = ({
  data,
  loading,
  error,
  totalCount,
  currentPage,
  onPageChange,
}) => {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    if (typeof value === 'string' && value.includes('T')) {
      return new Date(value).toLocaleString();
    }
    return String(value);
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        ‹ Previous
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next ›
      </button>
    );

    return <div className="pagination">{pages}</div>;
  };

  if (loading) {
    return (
      <div className="results-section">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-section">
        <div className="error-state">
          <h3>⚠️ Error Loading Data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="results-section">
        <div className="empty-state">
          <h3>📊 No Data Found</h3>
          <p>Try adjusting your search criteria or select a different vehicle.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-section">
      <div className="results-header">
        <h2>📈 Vehicle Data Results</h2>
        <div className="results-summary">
          <span className="results-count">
            Showing page {currentPage} of {totalPages} ({totalCount.toLocaleString()} total records)
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>Speed (mph)</th>
              <th>Odometer</th>
              <th>SOC (%)</th>
              <th>Elevation (ft)</th>
              <th>Shift State</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{formatValue(row.id)}</td>
                <td>{formatValue(row.timestamp)}</td>
                <td>{formatValue(row.speed)}</td>
                <td>{formatValue(row.odometer)}</td>
                <td>{formatValue(row.soc)}</td>
                <td>{formatValue(row.elevation)}</td>
                <td>{formatValue(row.shift_state)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderPagination()}
    </div>
  );
};

export default ResultsPanel;