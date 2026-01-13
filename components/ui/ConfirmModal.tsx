'use client';

import React from 'react';
import Modal from './Modal';
import Button from './Button';
import styles from './Modal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'primary';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  variant = 'primary',
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className={styles.message}>{message}</p>
      <div className={styles.footer}>
        <Button 
          variant="secondary" 
          onClick={onClose} 
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button 
          variant={variant === 'danger' ? 'primary' : 'primary'} // Assuming danger is handled by primary for now or add danger styles
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
