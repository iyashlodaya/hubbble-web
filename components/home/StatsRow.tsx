import React from 'react';
import { Activity, Clock, Users } from 'lucide-react';
import styles from './StatsRow.module.css';

interface StatsRowProps {
  activeCount: number;
  waitingCount: number;
  totalClients: number;
}

export default function StatsRow({ activeCount, waitingCount, totalClients }: StatsRowProps) {
  return (
    <div className={styles.container}>
      <div className={styles.statCard}>
        <div className={`${styles.iconWrapper} ${styles.blue}`}>
          <Activity size={20} />
        </div>
        <div className={styles.content}>
          <span className={styles.value}>{activeCount}</span>
          <span className={styles.label}>Active Projects</span>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={`${styles.iconWrapper} ${styles.orange}`}>
          <Clock size={20} />
        </div>
        <div className={styles.content}>
          <span className={styles.value}>{waitingCount}</span>
          <span className={styles.label}>Waiting</span>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={`${styles.iconWrapper} ${styles.purple}`}>
          <Users size={20} />
        </div>
        <div className={styles.content}>
          <span className={styles.value}>{totalClients}</span>
          <span className={styles.label}>Total Clients</span>
        </div>
      </div>
    </div>
  );
}
