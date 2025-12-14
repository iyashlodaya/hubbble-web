'use client';

import React, { useState } from 'react';
import Chip from '@/components/ui/Chip';
import Input from '@/components/ui/Input';
import styles from './ProfessionSelector.module.css';

interface ProfessionSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

// Most common professions - reduced list for better UX
const PROFESSIONS = [
  'Designer',
  'Developer',
  'Writer',
  'Consultant',
  'Photographer',
  'Marketer',
  'Other',
];

export default function ProfessionSelector({
  value,
  onChange,
  onBlur,
  error,
}: ProfessionSelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleChipClick = (profession: string) => {
    if (profession === 'Other') {
      setShowCustomInput(true);
      setCustomValue(value && !PROFESSIONS.includes(value) ? value : '');
      onChange('');
    } else {
      setShowCustomInput(false);
      setCustomValue('');
      onChange(profession);
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomValue(newValue);
    onChange(newValue);
  };

  const handleCustomInputBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Profession</label>
      <div className={styles.chipsContainer}>
        {PROFESSIONS.map((profession) => {
          const isSelected = profession === 'Other' 
            ? showCustomInput 
            : value === profession && !showCustomInput;
          
          return (
            <Chip
              key={profession}
              label={profession}
              selected={isSelected}
              onClick={() => handleChipClick(profession)}
              variant={profession === 'Other' ? 'custom' : 'default'}
            />
          );
        })}
      </div>
      
      {showCustomInput && (
        <div className={styles.customInputWrapper}>
          <Input
            id="custom-profession"
            type="text"
            placeholder="Enter your profession"
            value={customValue}
            onChange={handleCustomInputChange}
            onBlur={handleCustomInputBlur}
            error={error}
            autoComplete="organization-title"
            autoFocus
          />
        </div>
      )}

      {error && !showCustomInput && (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

