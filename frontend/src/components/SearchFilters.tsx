import type { FC } from 'react';
import VehicleDropdown from './VehicleDropdown';
import DatePicker from './DatePicker';

const SearchFilters: FC = () => {
  return (
    <div className="search-section">
      <div className="section-header">
        <h2>🔍 Search Filters</h2>
        <p>Filter vehicle data by ID and time range</p>
      </div>
      
      <div className="controls-container">
        <VehicleDropdown />

        <div className="date-controls">
          <DatePicker
            label="Start Date/Time"
            id="start-datetime"
          />
          
          <DatePicker
            label="End Date/Time"
            id="end-datetime"
          />
        </div>

        <div className="action-buttons">
          <button className="search-btn">
            🔎 Search Data
          </button>
          
          <button className="clear-btn">
            🗑️ Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;