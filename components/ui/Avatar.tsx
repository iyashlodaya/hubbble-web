import Image from 'next/image';
import React, { useState } from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string | null;
  initials?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeClasses = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
  '2xl': styles.xxl,
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  initials,
  alt = 'Avatar',
  size = 'xl',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // If we have an image src and no error, show image
  const showImage = src && !imageError;

  return (
    <div
      className={`${styles.avatar} ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: showImage ? 'transparent' : 'var(--accent, var(--accent-color, #00A8E8))',
        color: showImage ? 'inherit' : '#ffffff',
      }}
    >
      {showImage ? (
        <Image
          src={src!}
          alt={alt}
          fill
          className={styles.image}
          onError={() => setImageError(true)}
        />
      ) : (
        <span className={styles.initials}>
          {initials || '?'}
        </span>
      )}
    </div>
  );
};
