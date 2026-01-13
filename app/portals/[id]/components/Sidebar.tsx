'use client';

import React from 'react';
import styles from './Sidebar.module.css';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  activeId: string;
  isCollapsed: boolean;
  onItemClick: (id: string) => void;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeId,
  isCollapsed,
  onItemClick,
  onToggleCollapse,
}) => {
  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.topSection}>
        {/* Placeholder for future logo/title */}
        {!isCollapsed && <span className={styles.sidebarTitle}>Portal Menu</span>}
        {isCollapsed && <span className={styles.sidebarTitleShort}>P</span>}
      </div>

      <nav className={styles.nav}>
        {items.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeId === item.id ? styles.active : ''}`}
            onClick={() => onItemClick(item.id)}
            title={isCollapsed ? item.label : ''}
          >
            <span className={styles.icon}>{item.icon}</span>
            {!isCollapsed && <span className={styles.label}>{item.label}</span>}
            {activeId === item.id && <div className={styles.activeIndicator} />}
          </button>
        ))}
      </nav>

      <button className={styles.collapseToggle} onClick={onToggleCollapse}>
        <svg 
          className={`${styles.toggleIcon} ${isCollapsed ? styles.rotated : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    </aside>
  );
};
