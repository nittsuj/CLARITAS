import React from 'react';

/**
 * A simple spinning circle used while waiting for analysis results.
 */
const LoadingCircle: React.FC = () => {
  return (
    <div
      style={{
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #2563eb',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
      }}
    ></div>
  );
};

export default LoadingCircle;