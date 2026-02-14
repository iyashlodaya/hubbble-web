import React from 'react';
import Button from './Button';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  variant?: 'default' | 'dashed';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  variant = 'default',
}) => {
  return (
    <div 
      className={`
        ${styles.container} 
        ${variant === 'dashed' ? styles.dashed : ''} 
        ${className}
      `}
    >
      {icon && (
        <div className={styles.iconWrapper}>
          {icon}
        </div>
      )}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      
      {actionLabel && onAction && (
        <div className={styles.actions}>
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
