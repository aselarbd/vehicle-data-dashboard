import type { FC } from 'react';
import VehicleDropdown from './VehicleDropdown';
import DatePicker from './DatePicker';

const SearchFilters: FC = () => {
  return (
    <div className="search-section">
      <h2>Search Filters</h2>
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
            Search
          </button>
          
          <button className="clear-btn">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;