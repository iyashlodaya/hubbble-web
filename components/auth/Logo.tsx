import React from 'react';
import styles from './Logo.module.css';

export default function Logo() {
  return (
    <div className={styles.container}>
      <div className={styles.logoIcon}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="url(#logoGradient)"/>
          <path d="M16 8L20 14H12L16 8Z" fill="white" opacity="0.9"/>
          <path d="M10 18L14 24H6L10 18Z" fill="white" opacity="0.9"/>
          <path d="M22 18L26 24H18L22 18Z" fill="white" opacity="0.9"/>
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00A8E8"/>
              <stop offset="1" stopColor="#0077B6"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className={styles.brandName}>Hubble</span>
    </div>
  );
}

