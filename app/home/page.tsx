'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import { isLoggedIn } from '@/lib/auth';
import { Button, Select } from '@/components/ui';
import { PortalCard, type PortalStatus } from '@/components/home';
import styles from './home.module.css';
import { listClients } from '@/lib/api';

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

  useEffect(() => {
    const fetchPortals = async () => {
      const response = await listClients();
      console.log('Response from List Clients ->', response);
      // setPortals(response.data);
    };
    fetchPortals();
  }, [])

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn()) {
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
    router.push('/create-portal');
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
      <Header />

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
                  d="M12 4.5l2.598 1.5 2.902-.5-1.5 2.598 1.5 2.902-2.598-1.5-2.902 1.5.5-2.902-1.5-2.598 2.598 1.5L12 4.5zM6 15l1.5-2.598L9 15l-1.5 2.598L6 15zm9 3l1-1.732L17 18l-1 1.732L15 18zM5 9l.75-1.299L6 9l-.75 1.299L5 9z"
                />
              </svg>
              <h3 className={styles.emptyTitle}>
                {filter === 'all' ? 'No client portals yet' : 'No portals found'}
              </h3>
              <p className={styles.emptyText}>
                {filter === 'all'
                  ? 'Create your first client portal to share updates, files, and progress.'
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
                  Create Your First Client Portal
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

