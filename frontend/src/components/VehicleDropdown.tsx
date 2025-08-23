import type { FC } from 'react';

interface VehicleDropdownProps {
  vehicleIds: string[];
  selectedVehicleId: string;
  onSelectVehicle: (vehicleId: string) => void;
  loading?: boolean;
}

const VehicleDropdown: FC<VehicleDropdownProps> = ({
  vehicleIds,
  selectedVehicleId,
  onSelectVehicle,
  loading = false,
}) => {
  return (
    <div className="form-group">
      <label htmlFor="vehicle-select">Vehicle ID</label>
      <select
        id="vehicle-select"
        className="form-control"
        value={selectedVehicleId}
        onChange={(e) => onSelectVehicle(e.target.value)}
        disabled={loading || vehicleIds.length === 0}
      >
        <option value="">
          {loading ? 'Loading vehicles...' : 'Select a vehicle'}
        </option>
        {vehicleIds.map((vehicleId) => (
          <option key={vehicleId} value={vehicleId}>
            {vehicleId}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VehicleDropdown;