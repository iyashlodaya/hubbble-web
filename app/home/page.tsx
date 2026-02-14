'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import { isLoggedIn } from '@/lib/auth';
import { getCurrentUser } from '@/lib/api/services/auth.service';
import { Button, Select } from '@/components/ui';
import { PortalCard, type PortalStatus, type PortalCardProps } from '@/components/home';
import StatsRow from '@/components/home/StatsRow';
import RecentActivity from '@/components/home/RecentActivity';
import styles from './home.module.css';
import { listProjects } from '@/lib/api/services/projects.service';

type FilterStatus = 'all' | 'active' | 'waiting' | 'completed';

export default function HomePage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [portals, setPortals] = useState<PortalCardProps[]>([]);
  const [user, setUser] = useState<{ full_name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const filteredPortals = useMemo(() => {
    if (filter === 'all') return portals;
    return portals.filter((portal) => portal.status === filter);
  }, [portals, filter]);

  // Derived stats
  const activeCount = portals.filter(p => p.status === 'active').length;
  const waitingCount = portals.filter(p => p.status === 'waiting').length;
  const totalClients = new Set(portals.map(p => p.clientName)).size;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, userRes] = await Promise.all([
           listProjects(),
           getCurrentUser()
        ]);

        if (projectsRes.data) {
          const mappedPortals = projectsRes.data.map((project) => ({
            id: project.id.toString(),
            title: project.name,
            clientName: project.client.name,
            status: project.status as PortalStatus,
            lastUpdated: new Date(project.updated_at).toLocaleDateString(),
            description: project.description,
          }));
          setPortals(mappedPortals);
        }

        if (userRes.data) {
            setUser(userRes.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
    }
  }, [router]);

  const handleCreatePortal = () => {
    router.push('/create-portal');
  };

  const handlePortalClick = (id: string) => {
    router.push(`/portals/${id}`);
  };

  const filterOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'active', label: 'Active Only' },
    { value: 'waiting', label: 'Waiting Only' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.heroSection}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
             <div>
                {user && <div className={styles.greeting}>Welcome back, {user.full_name.split(' ')[0]} 👋</div>}
                <h1 className={styles.title}>Home</h1>
                <p className={styles.subtitle}>
                  Manage all your client portals in one place
                </p>
             </div>
             <Button onClick={handleCreatePortal} className={styles.createButton}>
               <svg
                 width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                 style={{ marginRight: '8px' }}
               >
                 <line x1="12" y1="5" x2="12" y2="19"></line>
                 <line x1="5" y1="12" x2="19" y2="12"></line>
               </svg>
               Create Client Portal
             </Button>
          </div>
      </div>

      <main className={styles.main}>
        <StatsRow 
            activeCount={activeCount} 
            waitingCount={waitingCount} 
            totalClients={totalClients} 
        />

        <div className={styles.contentGrid}>
            <div className={styles.leftColumn}>
                <div className={styles.filters}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>Projects</h2>
                  <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as FilterStatus)}
                    options={filterOptions}
                    className={styles.filterSelect}
                  />
                </div>

                <div className={styles.portalsGrid}>
                  {filteredPortals.length > 0 ? (
                    filteredPortals.map((portal) => (
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
                          Create Your First Client Portal
                        </Button>
                      )}
                    </div>
                  )}
                </div>
            </div>

            <div className={styles.rightColumn}>
                <RecentActivity activities={[]} />
            </div>
        </div>
      </main>

      {/* Sticky mobile button */}
      <Button
        onClick={handleCreatePortal}
        className={styles.stickyCreateButton}
      >
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ marginRight: '8px' }}
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Create Client Portal
      </Button>
    </div>
  );
}

