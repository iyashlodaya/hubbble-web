'use client';

import React, { useRef, useEffect, useState } from 'react';
import styles from './Tabs.module.css';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, className = '' }) => {
  const [underlineStyle, setUnderlineStyle] = useState<React.CSSProperties>({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeTabElement = tabsRef.current[activeIndex];

    if (activeTabElement) {
      setUnderlineStyle({
        width: activeTabElement.offsetWidth,
        transform: `translateX(${activeTabElement.offsetLeft}px)`,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className={`${styles.tabsContainer} ${className}`}>
      <div className={styles.tabsList}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => { tabsRef.current[index] = el; }}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <div className={styles.underline} style={underlineStyle} />
      </div>
    </div>
  );
};
