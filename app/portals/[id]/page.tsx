'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Header from '@/app/components/Header';
import { Tabs, Button, Chip, Toast } from '@/components/ui';
import { getProject } from '@/lib/api';
import type { ListProjectResponse, PortalStatus } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import styles from './PortalEditor.module.css';

// Components for tabs
import { UpdatesTab, FilesTab, SettingsTab, Sidebar, type SidebarItem, ShareModal } from './components';

const SIDEBAR_ITEMS: SidebarItem[] = [
  { 
    id: 'updates', 
    label: 'Updates', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )
  },
  { 
    id: 'files', 
    label: 'Files & Links', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
    )
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    )
  },
];

export default function PortalEditorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const activeTab = searchParams.get('tab') || 'updates';

  const [project, setProject] = useState<ListProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProject(parseInt(projectId));
        if (response.data) {
          setProject(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleTabChange = (tabId: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('tab', tabId);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/portals/${projectId}${query}`);
  };

  const shareUrl = project ? `${window.location.origin}/public/${project.public_slug}` : '';

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Header />
        <div className={styles.skeletonContainer}>
           <div className={styles.skeletonLayout}>
             <div className={styles.skeletonSidebar} />
             <div className={styles.skeletonMain}>
               <div className={styles.skeletonHeader} />
               <div className={styles.skeletonContent} />
             </div>
           </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.errorContainer}>
        <Header />
        <div className={styles.errorContent}>
          <h1>Project not found</h1>
          <Button onClick={() => router.push('/home')}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.layout}>
        <Sidebar 
          items={SIDEBAR_ITEMS}
          activeId={activeTab}
          isCollapsed={isSidebarCollapsed}
          onItemClick={handleTabChange}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className={styles.main}>
          <div className={styles.portalHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.projectContext}>
                <h1 className={styles.clientName}>{project.client.name}</h1>
                <div className={styles.projectInfo}>
                  <span className={styles.projectName}>{project.name}</span>
                  <Chip 
                    label={project.status.charAt(0).toUpperCase() + project.status.slice(1)} 
                    variant={project.status as any}
                  />
                </div>
              </div>
            </div>
            <div className={styles.headerRight}>
              <Button variant="secondary" onClick={() => setIsShareModalOpen(true)} className={styles.copyButton}>
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </Button>
            </div>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'updates' && <UpdatesTab projectId={projectId} />}
            {activeTab === 'files' && <FilesTab projectId={projectId} />}
            {activeTab === 'settings' && <SettingsTab project={project} onUpdate={(updated: ListProjectResponse) => setProject(updated)} />}
          </div>

          <ShareModal 
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            shareUrl={shareUrl}
            projectName={project.name}
          />

          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </main>
      </div>
    </div>
  );
}
