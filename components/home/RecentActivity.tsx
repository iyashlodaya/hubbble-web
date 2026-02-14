import React from 'react';
import styles from './RecentActivity.module.css';

export interface ActivityItem {
  id: number;
  project_id: number;
  title: string;
  content: string; // "Updated Dashboard Design..."
  created_at: string;
  project?: {
    name: string;
  };
}

interface RecentActivityProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

export default function RecentActivity({ activities, isLoading = false }: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Recent Activity</h3>
        <div className={styles.loadingSkeleton}>
          <div className={styles.skeletonItem} />
          <div className={styles.skeletonItem} />
          <div className={styles.skeletonItem} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Recent Activity</h3>
      
      <div className={styles.list}>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className={styles.item}>
              <div className={styles.dot} />
              <div className={styles.content}>
                <p className={styles.activityText}>
                  <span className={styles.bold}>{activity.title}</span>
                  {activity.project && <span className={styles.projectRef}> in {activity.project.name}</span>}
                </p>
                <span className={styles.date}>
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No recent activity yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
