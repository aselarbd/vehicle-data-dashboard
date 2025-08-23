import './App.css';
import SearchFilters from './components/SearchFilters';
import ResultsPanel from './components/ResultsPanel';
import { useVehicleIds } from './hooks/useVehicleIds';
import { useFormState } from './hooks/useFormState';
import { useVehicleData } from './hooks/useVehicleData';

function App() {
  // Vehicle IDs management
  const { vehicleIds, loading: loadingVehicleIds, error: vehicleIdsError } = useVehicleIds();
  
  // Form state management
  const { 
    selectedVehicleId, 
    setSelectedVehicleId, 
    startDateTime, 
    setStartDateTime, 
    endDateTime, 
    setEndDateTime, 
    clearForm 
  } = useFormState();
  
  // Vehicle data management
  const {
    vehicleData,
    totalCount,
    currentPage,
    loading: dataLoading,
    error: dataError,
    searchData,
    clearResults
  } = useVehicleData();

  const handleSearch = async () => {
    await searchData(selectedVehicleId, startDateTime, endDateTime, 1);
  };

  const handlePageChange = async (page: number) => {
    await searchData(selectedVehicleId, startDateTime, endDateTime, page);
  };

  const handleClear = () => {
    clearForm();
    clearResults();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Vehicle Data Dashboard</h1>
        <p>View and analyze vehicle telemetry data</p>
        {vehicleIdsError && (
          <div className="status-badge warning">
            ⚠️ {vehicleIdsError}
          </div>
        )}
      </header>

      <main className="App-main">
        <SearchFilters
          vehicleIds={vehicleIds}
          loadingVehicleIds={loadingVehicleIds}
          selectedVehicleId={selectedVehicleId}
          setSelectedVehicleId={setSelectedVehicleId}
          startDateTime={startDateTime}
          setStartDateTime={setStartDateTime}
          endDateTime={endDateTime}
          setEndDateTime={setEndDateTime}
          loading={dataLoading}
          onSearch={handleSearch}
          onClear={handleClear}
        />
        
        <ResultsPanel
          data={vehicleData}
          loading={dataLoading}
          error={dataError}
          totalCount={totalCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}

export default App;