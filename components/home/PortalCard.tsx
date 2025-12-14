import React from 'react';
import styles from './PortalCard.module.css';

export type PortalStatus = 'active' | 'waiting' | 'completed';

export interface PortalCardProps {
  id: string;
  title: string;
  clientName: string;
  status: PortalStatus;
  lastUpdated: string;
  description?: string;
  onClick?: () => void;
}

export default function PortalCard({
  title,
  clientName,
  status,
  lastUpdated,
  description,
  onClick,
}: PortalCardProps) {
  const statusClass = {
    active: styles.statusActive,
    waiting: styles.statusWaiting,
    completed: styles.statusCompleted,
  }[status];

  const statusLabel = {
    active: 'Active',
    waiting: 'Waiting',
    completed: 'Completed',
  }[status];

  return (
    <div className={styles.card} onClick={onClick}>
      {/* Top Row: Client Name + Status Badge */}
      <div className={styles.topRow}>
        <h3 className={styles.clientName}>{clientName}</h3>
        <span className={`${styles.status} ${statusClass}`}>{statusLabel}</span>
      </div>

      {/* Middle: Project Name + Description */}
      <div className={styles.middle}>
        <h4 className={styles.projectName}>{title}</h4>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
      </div>

      {/* Bottom Row: Last Updated + Arrow */}
      <div className={styles.bottomRow}>
        <span className={styles.lastUpdated}>Updated {lastUpdated}</span>
        <span className={styles.openHint}>
          Open
          <svg
            className={styles.arrowIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

