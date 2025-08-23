import './App.css';
import SearchFilters from './components/SearchFilters';
import ResultsPanel from './components/ResultsPanel';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Vehicle Data Dashboard</h1>
        <p>View and analyze vehicle telemetry data</p>
      </header>

      <main className="App-main">
        <SearchFilters />
        <ResultsPanel />
      </main>
    </div>
  );
}

export default App;