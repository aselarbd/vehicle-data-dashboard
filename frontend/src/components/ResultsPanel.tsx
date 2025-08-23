import type { FC } from 'react';

// Mock data for UI development
const mockData = [
  {
    id: 1,
    timestamp: '2024-01-15T10:30:00Z',
    speed: 65,
    odometer: 12500,
    soc: 85,
    elevation: 120,
    shift_state: 'D'
  },
  {
    id: 2,
    timestamp: '2024-01-15T10:31:00Z',
    speed: 68,
    odometer: 12501,
    soc: 84,
    elevation: 125,
    shift_state: 'D'
  },
  {
    id: 3,
    timestamp: '2024-01-15T10:32:00Z',
    speed: 72,
    odometer: 12502,
    soc: 84,
    elevation: 128,
    shift_state: 'D'
  },
  {
    id: 4,
    timestamp: '2024-01-15T10:33:00Z',
    speed: null,
    odometer: 12503,
    soc: 83,
    elevation: 130,
    shift_state: 'P'
  },
  {
    id: 5,
    timestamp: '2024-01-15T10:34:00Z',
    speed: 0,
    odometer: 12503,
    soc: 83,
    elevation: 130,
    shift_state: 'P'
  }
];

const ResultsPanel: FC = () => {
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

  return (
    <div className="results-section">
      <div className="results-header">
        <h2>Vehicle Data Results</h2>
        <div className="results-summary">
          <span className="results-count">Showing 5 of 1,247 records</span>
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
            {mockData.map((row) => (
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

      <div className="pagination">
        <button className="pagination-btn" disabled>‹ Previous</button>
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <button className="pagination-btn">3</button>
        <span>...</span>
        <button className="pagination-btn">125</button>
        <button className="pagination-btn">Next ›</button>
      </div>
    </div>
  );
};

export default ResultsPanel;