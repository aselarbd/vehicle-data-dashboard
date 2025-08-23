import { useState } from 'react';
import { vehicleApi } from '../services/api';

interface VehicleActionsProps {
  onDataPopulated?: () => void; // Callback to refresh data after population
}

const VehicleActions: React.FC<VehicleActionsProps> = ({ onDataPopulated }) => {
  const [isPopulating, setIsPopulating] = useState(false);
  const [populateStatus, setPopulateStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

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

  return (
    <section className="search-section">
      <div className="section-header">
        <h2>🔧 Vehicle Data Management</h2>
        <p>Populate and export vehicle data in the database</p>
      </div>

      <div className="actions-container">
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
      </div>
    </section>
  );
};

export default VehicleActions;
