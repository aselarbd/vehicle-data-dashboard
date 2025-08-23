import type { FC } from 'react';

const VehicleDropdown: FC = () => {
  return (
    <div className="form-group">
      <label htmlFor="vehicle-select">Vehicle ID</label>
      <select
        id="vehicle-select"
        className="form-control"
        defaultValue=""
      >
        <option value="">Select a vehicle</option>
        <option value="vehicle-001">vehicle-001</option>
        <option value="vehicle-002">vehicle-002</option>
        <option value="vehicle-003">vehicle-003</option>
      </select>
    </div>
  );
};

export default VehicleDropdown;