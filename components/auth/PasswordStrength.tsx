'use client';

import React from 'react';
import styles from './PasswordStrength.module.css';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const getStrength = (pwd: string): { level: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;

    if (score <= 2) return { level: 1, label: 'Weak', color: '#ef4444' };
    if (score <= 3) return { level: 2, label: 'Fair', color: '#f59e0b' };
    if (score <= 4) return { level: 3, label: 'Good', color: '#3b82f6' };
    return { level: 4, label: 'Strong', color: '#10b981' };
  };

  const strength = getStrength(password);

  return (
    <div className={styles.container}>
      <div className={styles.bars}>
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`${styles.bar} ${level <= strength.level ? styles.active : ''}`}
            style={level <= strength.level ? { backgroundColor: strength.color } : {}}
          />
        ))}
      </div>
      <span className={styles.label} style={{ color: strength.color }}>
        {strength.label}
      </span>
    </div>
  );
}

