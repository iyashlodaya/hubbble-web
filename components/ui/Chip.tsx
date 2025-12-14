'use client';

import React from 'react';
import styles from './Chip.module.css';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
  variant?: 'default' | 'custom';
}

export default function Chip({ label, selected = false, onClick, variant = 'default' }: ChipProps) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${selected ? styles.selected : ''} ${variant === 'custom' ? styles.custom : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

