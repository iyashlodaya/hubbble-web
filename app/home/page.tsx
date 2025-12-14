'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/auth/Logo';
import { isLoggedIn } from '@/lib/auth';
import { Button, Select } from '@/components/ui';
import { PortalCard, type PortalStatus } from '@/components/home';
import styles from './home.module.css';

type FilterStatus = 'all' | 'active' | 'waiting' | 'completed';

// Mock data - replace with actual API call
const mockPortals = [
  {
    id: '1',
    title: 'Website Redesign Project',
    clientName: 'Acme Corporation',
    status: 'active' as PortalStatus,
    lastUpdated: '2 hours ago',
    description: 'Complete UI/UX overhaul with modern design system and responsive layouts',
  },
  {
    id: '2',
    title: 'Brand Identity Package',
    clientName: 'TechStart Inc.',
    status: 'waiting' as PortalStatus,
    lastUpdated: 'yesterday',
    description: 'Logo design, brand guidelines, and marketing collateral',
  },
  {
    id: '3',
    title: 'Mobile App Development',
    clientName: 'Innovate Labs',
    status: 'completed' as PortalStatus,
    lastUpdated: '3 weeks ago',
    description: 'iOS and Android app with real-time synchronization',
  },
  {
    id: '4',
    title: 'E-commerce Platform',
    clientName: 'Retail Pro',
    status: 'active' as PortalStatus,
    lastUpdated: '5 hours ago',
    description: 'Full-stack e-commerce solution with payment integration',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [portals, setPortals] = useState(mockPortals);

  // Redirect to login if not logged in
  useEffect(() => {
    console.log('isLoggedIn  in home ---', isLoggedIn());
    if (!isLoggedIn()) {
      console.log('Redireccting to login page');
      router.push('/login');
    }
  }, [router]);

  // Filter portals based on selected status
  useEffect(() => {
    if (filter === 'all') {
      setPortals(mockPortals);
    } else {
      setPortals(mockPortals.filter((portal) => portal.status === filter));
    }
  }, [filter]);

  const handleCreatePortal = () => {
    // TODO: Navigate to create portal page or open modal
    console.log('Create portal clicked');
  };

  const handlePortalClick = (id: string) => {
    // TODO: Navigate to portal detail page
    console.log('Portal clicked:', id);
  };

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'waiting', label: 'Waiting' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />
        <nav className={styles.nav}>
          <button
            className={styles.logoutButton}
            onClick={() => {
              localStorage.clear();
              router.push('/login');
            }}
          >
            Log out
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.homeHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Home</h1>
            <p className={styles.subtitle}>
              Manage all your client portals in one place
            </p>
          </div>
          <Button onClick={handleCreatePortal} className={styles.createButton}>
            <svg
              className={styles.plusIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Client Portal
          </Button>
        </div>

        <div className={styles.filters}>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterStatus)}
            options={filterOptions}
            className={styles.filterSelect}
          />
        </div>

        <div className={styles.portalsGrid}>
          {portals.length > 0 ? (
            portals.map((portal) => (
              <PortalCard
                key={portal.id}
                {...portal}
                onClick={() => handlePortalClick(portal.id)}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <svg
                className={styles.emptyIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className={styles.emptyTitle}>No portals found</h3>
              <p className={styles.emptyText}>
                {filter === 'all'
                  ? "You don't have any client portals yet. Create your first one to get started!"
                  : `No ${filter} portals found.`}
              </p>
              {filter === 'all' && (
                <Button onClick={handleCreatePortal} className={styles.emptyButton}>
                  <svg
                    className={styles.plusIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create Client Portal
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Sticky mobile button */}
      <Button
        onClick={handleCreatePortal}
        className={styles.stickyCreateButton}
      >
        <svg
          className={styles.plusIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Client Portal
      </Button>
    </div>
  );
}

