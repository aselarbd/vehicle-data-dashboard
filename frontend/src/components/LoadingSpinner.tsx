import type { FC } from 'react';

const LoadingSpinner: FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading vehicle data...</p>
    </div>
  );
};

export default LoadingSpinner;