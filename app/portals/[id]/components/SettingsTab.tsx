'use client';

import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { updateProject } from '@/lib/api';
import type { ListProjectResponse } from '@/lib/api';
import styles from './SettingsTab.module.css';

interface SettingsTabProps {
  project: ListProjectResponse;
  onUpdate: (updated: ListProjectResponse) => void;
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'completed', label: 'Completed' },
];

export default function SettingsTab({ project, onUpdate }: SettingsTabProps) {
  const [name, setName] = useState(project.name);
  const [status, setStatus] = useState(project.status);
  const [description, setDescription] = useState(project.description || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await updateProject(project.id, {
        project_name: name,
        project_status: status,
        description: description,
        client_id: project.client.id
      });
      if (response.data) {
        onUpdate(response.data);
        alert('Project updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(project.name);
    setStatus(project.status);
    setDescription(project.description || '');
  };

  const hasChanges = name !== project.name || status !== project.status || description !== (project.description || '');

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>Project Settings</h3>
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Project Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={STATUS_OPTIONS}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description..."
            />
          </div>

          <div className={styles.actions}>
            <Button 
                type="button" 
                variant="secondary" 
                onClick={handleCancel}
                disabled={!hasChanges || saving}
            >
              Cancel
            </Button>
            <Button 
                type="submit" 
                disabled={!hasChanges || !name.trim() || saving}
                isLoading={saving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
