'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, ConfirmModal } from '@/components/ui';
import { getProjectFiles, addProjectFileLink, deleteProjectFileLink } from '@/lib/api';
import type { ProjectFileLink } from '@/lib/api';
import styles from './FilesTab.module.css';

interface FilesTabProps {
  projectId: string;
}

export default function FilesTab({ projectId }: FilesTabProps) {
  const [items, setItems] = useState<ProjectFileLink[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await getProjectFiles(parseInt(projectId));
        if (response.data) {
          setItems(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [projectId]);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    setSubmitting(true);
    try {
      const response = await addProjectFileLink(parseInt(projectId), {
        title,
        url,
        type: 'link',
      });
      if (response.data) {
        setItems([...items, response.data]);
        setTitle('');
        setUrl('');
      }
    } catch (error) {
      console.error('Failed to add link:', error);
      alert('Failed to add link.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    try {
      await deleteProjectFileLink(parseInt(projectId), itemToDelete);
      setItems(items.filter(item => item.id !== itemToDelete));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete link:', error);
      alert('Failed to delete item.');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (id: number) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.addSection}>
        <h3 className={styles.sectionTitle}>Add New Link</h3>
        <form onSubmit={handleAddLink} className={styles.form}>
          <div className={styles.inputs}>
            <Input
              placeholder="Title (e.g. Project Specs)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
            <Input
              placeholder="URL (https://...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={styles.input}
            />
          </div>
          <Button type="submit" disabled={!title.trim() || !url.trim() || submitting} isLoading={submitting}>
            Add Link
          </Button>
        </form>
      </div>

      <div className={styles.listSection}>
        {loading ? (
          <div className={styles.loadingState}>Loading items...</div>
        ) : items.length === 0 ? (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No files or links added yet</p>
          </div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div className={styles.colName}>Name</div>
              <div className={styles.colType}>Type</div>
              <div className={styles.colDate}>Date Added</div>
              <div className={styles.colAction}></div>
            </div>
            <div className={styles.tableBody}>
              {items.map((item) => (
                <div key={item.id} className={styles.row}>
                  <div className={styles.colName}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      {item.title}
                    </a>
                  </div>
                  <div className={styles.colType}>
                    <span className={`${styles.badge} ${styles[item.type]}`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </div>
                  <div className={styles.colDate}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  <div className={styles.colAction}>
                    <button 
                      className={styles.deleteButton} 
                      onClick={() => openDeleteModal(item.id)}
                      title="Delete"
                    >
                      <svg className={styles.deleteIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this link? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
