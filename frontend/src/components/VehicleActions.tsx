import { useState } from 'react';
import { vehicleApi } from '../services/api';
import VehicleDropdown from './VehicleDropdown';

interface VehicleActionsProps {
  onDataPopulated?: () => void; // Callback to refresh data after population
  vehicleIds?: string[]; // Available vehicle IDs for export
}

const VehicleActions: React.FC<VehicleActionsProps> = ({ onDataPopulated, vehicleIds = [] }) => {
  const [isPopulating, setIsPopulating] = useState(false);
  const [populateStatus, setPopulateStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedExportType, setSelectedExportType] = useState<'JSON' | 'CSV' | 'EXCEL'>('CSV');

  const handlePopulate = async () => {
    setIsPopulating(true);
    setPopulateStatus({ type: null, message: '' });

    try {
      await vehicleApi.populateData();
      setPopulateStatus({
        type: 'success',
        message: ''
      });
      
      // Call the callback to refresh data if provided
      if (onDataPopulated) {
        onDataPopulated();
      }
    } catch (error) {
      setPopulateStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to populate data'
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const handleExport = async () => {
    if (!selectedVehicleId) {
      setExportStatus({
        type: 'error',
        message: 'Please select a vehicle ID'
      });
      return;
    }

    setIsExporting(true);
    setExportStatus({ type: null, message: '' });

    try {
      const blob = await vehicleApi.exportData(selectedVehicleId, selectedExportType);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename based on export type
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const extension = selectedExportType.toLowerCase() === 'excel' ? 'xlsx' : selectedExportType.toLowerCase();
      link.download = `vehicle_data_${selectedVehicleId}_${timestamp}.${extension}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setExportStatus({
        type: 'success',
        message: ''
      });
    } catch (error) {
      setExportStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to export data'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="search-section">
      <div className="section-header">
        <h2>🔧 Vehicle Data Management</h2>
        <p>Populate and export vehicle data in the database</p>
      </div>

      <div className="actions-container">
        {/* Populate Data Section */}
        <div className="action-group">
          <div className="action-description">
            <h3>
              Populate Sample Data
              {populateStatus.type === 'success' && (
                <span className="success-checkmark"> ✅</span>
              )}
            </h3>
            <p>Populate database with sample vehicle data from CSV files</p>
          </div>
          
          <div className="action-controls">
            <button
              className={`action-btn populate-btn ${isPopulating ? 'loading' : ''}`}
              onClick={handlePopulate}
              disabled={isPopulating}
            >
              {isPopulating ? (
                <>
                  <span className="spinner"></span>
                  Populating...
                </>
              ) : (
                <>
                  📊 Populate Data
                </>
              )}
            </button>
          </div>
        </div>

        {populateStatus.type === 'error' && (
          <div className="status-message error">
            ❌ {populateStatus.message}
          </div>
        )}

        {/* Export Data Section */}
        <div className="action-group">
          <div className="action-description">
            <h3>
              Export Data
              {exportStatus.type === 'success' && (
                <span className="success-checkmark"> ✅</span>
              )}
            </h3>
            <p>Export vehicle data to different file formats</p>
          </div>
          
          <div className="action-controls">
            <div className="export-controls">
              <VehicleDropdown
                vehicleIds={vehicleIds}
                selectedVehicleId={selectedVehicleId}
                onSelectVehicle={setSelectedVehicleId}
                loading={false}
              />
              
              <div className="form-group">
                <label htmlFor="export-format">File Format</label>
                <select
                  id="export-format"
                  className="form-control"
                  value={selectedExportType}
                  onChange={(e) => setSelectedExportType(e.target.value as 'JSON' | 'CSV' | 'EXCEL')}
                >
                  <option value="CSV">CSV</option>
                  <option value="JSON">JSON</option>
                  <option value="EXCEL">Excel</option>
                </select>
              </div>
              
              <button
                className={`action-btn export-btn ${isExporting ? 'loading' : ''}`}
                onClick={handleExport}
                disabled={isExporting || !selectedVehicleId}
              >
                {isExporting ? (
                  <>
                    <span className="spinner"></span>
                    Exporting...
                  </>
                ) : (
                  <>
                    📁 Export Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {exportStatus.type === 'error' && (
          <div className="status-message error">
            ❌ {exportStatus.message}
          </div>
        )}
      </div>
    </section>
  );
};

export default VehicleActions;
