import React from 'react';

function Loading({ size = "40px" }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <img 
        src="/assets/loading.svg" 
        alt="Loading..." 
        style={{ width: size, verticalAlign: 'middle' }}
      />
    </div>
  );
}

export default Loading;
