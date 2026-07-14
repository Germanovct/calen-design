import React from 'react';

const Skeleton = ({ width = '100%', height = '20px', style }) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: 'var(--gray-mid)',
        border: '1px solid #222',
        position: 'relative',
        overflow: 'hidden',
        animation: 'skeleton-pulse 1.5s ease-in-out infinite',
        ...style
      }}
    >
      <style>{`
        @keyframes skeleton-pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: 'var(--border-brutal)',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      height: '380px',
      gap: '0'
    }}>
      <Skeleton height="260px" style={{ borderBottom: 'var(--border-brutal-sm)' }} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
        <Skeleton width="70%" height="16px" />
        <Skeleton width="40%" height="16px" />
        <div style={{ marginTop: 'auto', display: 'flex', gap: '6px' }}>
          <Skeleton width="30px" height="20px" />
          <Skeleton width="30px" height="20px" />
          <Skeleton width="30px" height="20px" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
