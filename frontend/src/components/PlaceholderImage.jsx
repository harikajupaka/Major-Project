import React from 'react';

const PlaceholderImage = ({ name, width = '100%', height = '150px', style }) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontWeight: 'bold',
        border: '1px dashed #999',
        borderRadius: '8px',
        ...style,
      }}
    >
      {name}
    </div>
  );
};

export default PlaceholderImage;
