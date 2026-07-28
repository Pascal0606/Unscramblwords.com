import React from 'react';

const BackgroundLayer = () => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, #F5E6D3 0%, #E8F4F8 100%)',
        filter: 'blur(40px)',
        opacity: '0.25',
        zIndex: '0',
        pointerEvents: 'none'
      }}
    />
  );
};

export default BackgroundLayer;