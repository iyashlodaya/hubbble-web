'use client';

import React, { useState, useEffect } from 'react';
import { Button, ConfirmModal, Toast, EmptyState } from '@/components/ui';
import { getProjectUpdates, addProjectUpdate, deleteProjectUpdate } from '@/lib/api';
import type { ProjectUpdate } from '@/lib/api';
import styles from './UpdatesTab.module.css';

interface UpdatesTabProps {
  projectId: string;
}

export default function UpdatesTab({ projectId }: UpdatesTabProps) {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateToDelete, setUpdateToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await getProjectUpdates(parseInt(projectId));
        const updatesData = (response as any).data || (Array.isArray(response) ? response : []);
        
        if (Array.isArray(updatesData)) {
          setUpdates(updatesData.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ));
        }
      } catch (error) {
        console.error('Failed to fetch updates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [projectId]);

  const handlePostUpdate = async () => {
    if (!newContent.trim() || !newTitle.trim()) return;

    setPosting(true);
    try {
      const response = await addProjectUpdate(parseInt(projectId), newTitle, newContent);
      const updateData = (response as any).data || response;
      
      if (updateData && updateData.id) {
        setUpdates(prev => [updateData, ...prev]);
        setNewTitle('');
        setNewContent('');
      }
    } catch (error) {
      console.error('Failed to post update:', error);
      setToast({ message: 'Failed to post update. Please try again.', type: 'error' });
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteUpdate = async () => {
    if (!updateToDelete) return;

    setDeleting(true);
    try {
      console.log('projectId', projectId, 'updateToDelete', updateToDelete);
      await deleteProjectUpdate(parseInt(projectId), updateToDelete);
      setUpdates(prev => prev.filter(u => u.id !== updateToDelete));
      setDeleteModalOpen(false);
      setUpdateToDelete(null);
      setToast({ message: 'Update deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Failed to delete update:', error);
      setToast({ message: error instanceof Error ? error.message : 'Failed to delete update', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (id: number) => {
    setUpdateToDelete(id);
    setDeleteModalOpen(true);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.addUpdateSection}>
        <input
          type="text"
          className={styles.titleInput}
          placeholder="Update Title (e.g., Design Prototype Finished)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={posting}
        />
        <textarea
          className={styles.textarea}
          placeholder="Describe what's been accomplished..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          disabled={posting}
        />
        <div className={styles.actions}>
          <Button 
            onClick={handlePostUpdate} 
            disabled={!newContent.trim() || !newTitle.trim() || posting}
            isLoading={posting}
          >
            Post Update
          </Button>
        </div>
      </div>

      <div className={styles.timeline}>
        {loading ? (
          <div className={styles.loadingState}>Loading updates...</div>
        ) : updates.length === 0 ? (
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            }
            title="No updates yet"
            description="Share your first project update to keep your client informed."
          />
        ) : (
          updates.map((update) => (
            <div key={update.id} className={styles.updateCard}>
              <div className={styles.cardHeader}>
                <span className={styles.timestamp}>{formatTimestamp(update.created_at)}</span>
                <button 
                  className={styles.deleteButton}
                  onClick={() => openDeleteModal(update.id)}
                  title="Delete update"
                >
                  <svg className={styles.deleteIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className={styles.updateTitle}>{update.title}</div>
              <div className={styles.cardContent}>
                {update.content}
              </div>
            </div>
          ))
        )}
      </div>
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteUpdate}
        message="Are you sure you want to delete this update? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleting}
      />
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
