import React from 'react';

interface XiaohongshuProps {
  size?: number;
  className?: string;
}

export default function Xiaohongshu({ size = 24, className = '' }: XiaohongshuProps) {
  return (
    <span style={{ fontSize: size, fontWeight: 'bold' }} className={className}>
      红
    </span>
  );
}
