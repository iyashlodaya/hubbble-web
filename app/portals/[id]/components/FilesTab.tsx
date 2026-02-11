'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Input, ConfirmModal, Toast } from '@/components/ui';
import { getProjectFiles, addProjectFileLink, deleteProjectFileLink, uploadProjectFile } from '@/lib/api';
import type { ProjectFileLink } from '@/lib/api';
import styles from './FilesTab.module.css';

interface FilesTabProps {
  projectId: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.gz,.txt,.csv';

function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string | null): string {
  if (!mimeType) return '📄';
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📕';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('.sheet')) return '📊';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint') || mimeType.includes('.presentation')) return '📽️';
  if (mimeType.includes('word') || mimeType.includes('.document')) return '📝';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('gzip')) return '📦';
  if (mimeType.startsWith('text/')) return '📃';
  return '📄';
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Upload state
  const [addMode, setAddMode] = useState<'upload' | 'link'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCountRef = useRef(0);

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

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" exceeds 5 MB limit (${formatFileSize(file.size)})`;
    }
    return null;
  };

  const handleUpload = async (file: File, customTitle?: string) => {
    const error = validateFile(file);
    if (error) {
      setToast({ message: error, type: 'error' });
      return;
    }

    setUploading(true);
    setUploadProgress(`Uploading ${file.name}...`);
    try {
      const response = await uploadProjectFile(
        parseInt(projectId),
        file,
        customTitle || undefined
      );
      if (response.data) {
        setItems(prev => [response.data, ...prev]);
        setToast({ message: 'File uploaded successfully!', type: 'success' });
        setSelectedFile(null);
        setUploadTitle('');
      }
    } catch (err: any) {
      const message = err?.message || 'Upload failed. Please try again.';
      setToast({ message, type: 'error' });
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setToast({ message: error, type: 'error' });
      return;
    }
    setSelectedFile(file);
    setUploadTitle('');
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current++;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current--;
    if (dragCountRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current = 0;
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

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
        setItems(prev => [response.data, ...prev]);
        setTitle('');
        setUrl('');
        setToast({ message: 'Link added successfully', type: 'success' });
      }
    } catch (error) {
      console.error('Failed to add link:', error);
      setToast({ message: 'Failed to add link.', type: 'error' });
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
      setToast({ message: 'Item deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Failed to delete:', error);
      setToast({ message: 'Failed to delete item.', type: 'error' });
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
      {/* Mode Tabs */}
      <div className={styles.addSection}>
        <div className={styles.modeTabs}>
          <button
            className={`${styles.modeTab} ${addMode === 'upload' ? styles.modeTabActive : ''}`}
            onClick={() => setAddMode('upload')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload File
          </button>
          <button
            className={`${styles.modeTab} ${addMode === 'link' ? styles.modeTabActive : ''}`}
            onClick={() => setAddMode('link')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            Add Link
          </button>
        </div>

        {addMode === 'upload' ? (
          <div className={styles.uploadArea}>
            {/* Drop Zone */}
            <div
              className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''} ${selectedFile ? styles.dropZoneHasFile : ''}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !selectedFile && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                  e.target.value = '';
                }}
                className={styles.hiddenInput}
              />

              {uploading ? (
                <div className={styles.uploadingState}>
                  <div className={styles.uploadSpinner} />
                  <p className={styles.uploadProgressText}>{uploadProgress}</p>
                </div>
              ) : selectedFile ? (
                <div className={styles.selectedFilePreview}>
                  <div className={styles.selectedFileInfo}>
                    <span className={styles.selectedFileIcon}>{getFileIcon(selectedFile.type)}</span>
                    <div>
                      <p className={styles.selectedFileName}>{selectedFile.name}</p>
                      <p className={styles.selectedFileMeta}>{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button
                      className={styles.clearFileBtn}
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setUploadTitle(''); }}
                      title="Remove"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                  <div className={styles.uploadFormRow}>
                    <Input
                      placeholder="Custom title (optional)"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className={styles.input}
                    />
                    <Button
                      onClick={() => handleUpload(selectedFile, uploadTitle)}
                      disabled={uploading}
                      isLoading={uploading}
                    >
                      Upload
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={styles.dropZoneContent}>
                  <div className={styles.dropZoneIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p className={styles.dropZoneText}>
                    <strong>Drop a file here</strong> or click to browse
                  </p>
                  <p className={styles.dropZoneHint}>
                    Max 5 MB · Images, PDFs, Documents, Archives
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Files & Links List */}
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
              <div className={styles.colSize}>Size</div>
              <div className={styles.colDate}>Date Added</div>
              <div className={styles.colAction}></div>
            </div>
            <div className={styles.tableBody}>
              {items.map((item) => (
                <div key={item.id} className={styles.row}>
                  <div className={styles.colName}>
                    <span className={styles.rowIcon}>
                      {item.type === 'file' ? getFileIcon(item.mime_type) : '🔗'}
                    </span>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      {item.title}
                    </a>
                  </div>
                  <div className={styles.colType}>
                    <span className={`${styles.badge} ${item.type === 'file' ? styles.fileBadge : styles.linkBadge}`}>
                      {item.type === 'file' ? (item.mime_type?.split('/')[1]?.toUpperCase() || 'File') : 'Link'}
                    </span>
                  </div>
                  <div className={styles.colSize}>
                    {item.type === 'file' ? formatFileSize(item.file_size) : '—'}
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
        message="Are you sure you want to delete this item? This action cannot be undone."
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

