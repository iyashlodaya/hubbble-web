'use client';

import React from 'react';
import styles from './Chip.module.css';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'active' | 'waiting' | 'completed' | 'custom';
}

export default function Chip({ label, selected = false, onClick, variant = 'default' }: ChipProps) {
  const variantClass = styles[variant] || '';
  
  return (
    <div
      className={`${styles.chip} ${selected ? styles.selected : ''} ${variantClass}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
}

