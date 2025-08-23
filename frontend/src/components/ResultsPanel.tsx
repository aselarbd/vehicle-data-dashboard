import type { FC } from 'react';
import { useState, useMemo } from 'react';
import type { VehicleDataPoint } from '../hooks/useVehicleData';
import LoadingSpinner from './LoadingSpinner';

type SortDirection = 'asc' | 'desc' | null;
type SortableColumn = 'id' | 'timestamp' | 'speed' | 'odometer' | 'soc' | 'elevation' | 'shift_state';

interface ResultsPanelProps {
  data: VehicleDataPoint[];
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
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Sort the data based on current sort settings
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      return data;
    }

    return [...data].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      // Handle null values
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return sortDirection === 'asc' ? 1 : -1;
      if (bVal === null) return sortDirection === 'asc' ? -1 : 1;

      // Handle different data types
      if (sortColumn === 'timestamp') {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: SortableColumn) => {
    if (sortColumn !== column) {
      return (
        <span className="sort-icons">
          <span className="sort-icon">▲</span>
          <span className="sort-icon">▼</span>
        </span>
      );
    }

    if (sortDirection === 'asc') {
      return <span className="sort-icons active"><span className="sort-icon active">▲</span></span>;
    } else if (sortDirection === 'desc') {
      return <span className="sort-icons active"><span className="sort-icon active">▼</span></span>;
    }

    return (
      <span className="sort-icons">
        <span className="sort-icon">▲</span>
        <span className="sort-icon">▼</span>
      </span>
    );
  };
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
              <th 
                className="sortable-header" 
                onClick={() => handleSort('id')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSort('id')}
              >
                ID {getSortIcon('id')}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('timestamp')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSort('timestamp')}
              >
                Timestamp {getSortIcon('timestamp')}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('speed')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSort('speed')}
              >
                Speed (mph) {getSortIcon('speed')}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('odometer')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSort('odometer')}
              >
                Odometer {getSortIcon('odometer')}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('soc')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSort('soc')}
              >
                SOC (%) {getSortIcon('soc')}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('elevation')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSort('elevation')}
              >
                Elevation (ft) {getSortIcon('elevation')}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('shift_state')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSort('shift_state')}
              >
                Shift State {getSortIcon('shift_state')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
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