import type { FC } from 'react';
import VehicleDropdown from './VehicleDropdown';
import DatePicker from './DatePicker';

interface SearchFiltersProps {
  vehicleIds: string[];
  loadingVehicleIds: boolean;
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  startDateTime: string;
  setStartDateTime: (dateTime: string) => void;
  endDateTime: string;
  setEndDateTime: (dateTime: string) => void;
  loading: boolean;
  onSearch: () => void;
  onClear: () => void;
}

const SearchFilters: FC<SearchFiltersProps> = ({
  vehicleIds,
  loadingVehicleIds,
  selectedVehicleId,
  setSelectedVehicleId,
  startDateTime,
  setStartDateTime,
  endDateTime,
  setEndDateTime,
  loading,
  onSearch,
  onClear,
}) => {
  return (
    <div className="search-section">
      <div className="section-header">
        <h2>🔍 Search Filters</h2>
        <p>Filter vehicle data by ID and time range</p>
      </div>
      
      <div className="controls-container">
        <VehicleDropdown
          vehicleIds={vehicleIds}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
          loading={loadingVehicleIds}
        />

        <div className="date-controls">
          <DatePicker
            label="Start Date/Time"
            value={startDateTime}
            onChange={setStartDateTime}
            id="start-datetime"
          />
          
          <DatePicker
            label="End Date/Time"
            value={endDateTime}
            onChange={setEndDateTime}
            id="end-datetime"
          />
        </div>

        <div className="action-buttons">
          <button 
            onClick={onSearch} 
            disabled={!selectedVehicleId || loading}
            className="search-btn"
          >
            {loading ? '⏳ Searching...' : '🔎 Search Data'}
          </button>
          
          <button 
            onClick={onClear}
            className="clear-btn"
          >
            🗑️ Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;