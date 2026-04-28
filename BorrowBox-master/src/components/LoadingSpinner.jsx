import React from 'react';

/**
 * Loading spinner component
 */
const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="text-muted">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;