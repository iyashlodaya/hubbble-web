"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Select } from "@/components/ui";
import { updateProject } from "@/lib/api";
import type { ListProjectResponse } from "@/lib/api";
import styles from "./SettingsTab.module.css";

interface SettingsTabProps {
  project: ListProjectResponse;
  onUpdate: (updated: ListProjectResponse) => void;
}

export interface PortalBranding {
  freelancerName: string;
  tagline: string;
  accentColor: string;
  avatarType: 'initials' | 'image' | 'emoji';
  avatarValue: string;
}

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "waiting", label: "Waiting" },
  { value: "completed", label: "Completed" },
];

const ACCENT_PRESETS = [
  { color: "#00A8E8", label: "Electric Blue" },
  { color: "#7B61FF", label: "Purple" },
  { color: "#4ade80", label: "Green" },
  { color: "#f97316", label: "Orange" },
  { color: "#f43f5e", label: "Rose" },
  { color: "#06b6d4", label: "Cyan" },
  { color: "#a855f7", label: "Violet" },
  { color: "#eab308", label: "Yellow" },
];

function getBrandingKey(slug: string) {
  return `portal-branding-${slug}`;
}

const DEFAULT_BRANDING: PortalBranding = { 
  freelancerName: "", 
  tagline: "", 
  accentColor: "#00A8E8",
  avatarType: 'initials',
  avatarValue: ''
};

export function loadBranding(slug: string): PortalBranding {
  if (typeof window === "undefined") return DEFAULT_BRANDING;
  try {
    const stored = localStorage.getItem(getBrandingKey(slug));
    if (stored) return { ...DEFAULT_BRANDING, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_BRANDING;
}

export default function SettingsTab({ project, onUpdate }: SettingsTabProps) {
  const [name, setName] = useState(project.name);
  const [status, setStatus] = useState(project.status);
  const [description, setDescription] = useState(project.description || "");
  const [saving, setSaving] = useState(false);

  // Branding state
  const [branding, setBranding] = useState<PortalBranding>(DEFAULT_BRANDING);
  const [brandingSaved, setBrandingSaved] = useState(false);

  useEffect(() => {
    if (project.public_slug) {
      setBranding(loadBranding(project.public_slug));
    }
  }, [project.public_slug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await updateProject(project.id, {
        project_name: name,
        project_status: status,
        description: description,
        client_id: project.client.id,
      });
      if (response.data) {
        onUpdate(response.data);
        alert("Project updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(project.name);
    setStatus(project.status);
    setDescription(project.description || "");
  };

  const handleSaveBranding = () => {
    if (project.public_slug) {
      localStorage.setItem(
        getBrandingKey(project.public_slug),
        JSON.stringify(branding),
      );
      setBrandingSaved(true);
      setTimeout(() => setBrandingSaved(false), 2000);
    }
  };

  const hasChanges =
    name !== project.name ||
    status !== project.status ||
    description !== (project.description || "");

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

      {/* Portal Branding */}
      <div className={styles.card} style={{ marginTop: "2rem" }}>
        <h3 className={styles.title}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              display: "inline",
              marginRight: "8px",
              verticalAlign: "middle",
            }}
          >
            <circle cx="13.5" cy="6.5" r="2.5" />
            <path d="M17 2h4v4" />
            <path d="M15.59 4.41 20 0" />
            <circle cx="8.5" cy="12.5" r="2.5" />
            <path d="M5 21V5a2 2 0 0 1 2-2h10" />
          </svg>
          Portal Branding
        </h3>
        <p className={styles.brandingHint}>
          Customize how your client portal looks to clients. These settings are
          applied to the public portal page.
        </p>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Your Name / Business Name</label>
            <Input
              value={branding.freelancerName}
              onChange={(e) =>
                setBranding({ ...branding, freelancerName: e.target.value })
              }
              placeholder="e.g. Jane Studio"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tagline</label>
            <Input
              value={branding.tagline}
              onChange={(e) =>
                setBranding({ ...branding, tagline: e.target.value })
              }
              placeholder="e.g. Design & Development"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Avatar Style</label>
            <div className={styles.avatarOptions}>
              <label className={styles.avatarOption}>
                <input 
                  type="radio" 
                  name="avatarType" 
                  checked={branding.avatarType === 'initials'}
                  onChange={() => setBranding({ ...branding, avatarType: 'initials' })}
                />
                Initials
              </label>
              <label className={styles.avatarOption}>
                <input 
                  type="radio" 
                  name="avatarType" 
                  checked={branding.avatarType === 'emoji'}
                  onChange={() => setBranding({ ...branding, avatarType: 'emoji' })}
                />
                Emoji
              </label>
              <label className={styles.avatarOption}>
                <input 
                  type="radio" 
                  name="avatarType" 
                  checked={branding.avatarType === 'image'}
                  onChange={() => setBranding({ ...branding, avatarType: 'image' })}
                />
                Image
              </label>
            </div>

            {branding.avatarType === 'emoji' && (
              <Input
                value={branding.avatarValue}
                onChange={(e) => setBranding({ ...branding, avatarValue: e.target.value })}
                placeholder="🚀"
                className={styles.emojiInput}
                maxLength={2}
              />
            )}

            {branding.avatarType === 'image' && (
              <Input
                value={branding.avatarValue}
                onChange={(e) => setBranding({ ...branding, avatarValue: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Accent Color</label>
            <div className={styles.colorSwatches}>
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.color}
                  type="button"
                  className={`${styles.swatch} ${branding.accentColor === preset.color ? styles.swatchActive : ""}`}
                  style={{ backgroundColor: preset.color }}
                  onClick={() =>
                    setBranding({ ...branding, accentColor: preset.color })
                  }
                  title={preset.label}
                />
              ))}
            </div>
            <div className={styles.customColorRow}>
              <input
                type="color"
                value={branding.accentColor}
                onChange={(e) =>
                  setBranding({ ...branding, accentColor: e.target.value })
                }
                className={styles.colorInput}
              />
              <Input
                value={branding.accentColor}
                onChange={(e) =>
                  setBranding({ ...branding, accentColor: e.target.value })
                }
                placeholder="#00A8E8"
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className={styles.field}>
            <label className={styles.label}>Preview</label>
            <div
              className={styles.brandingPreview}
              style={
                {
                  "--preview-accent": branding.accentColor,
                } as React.CSSProperties
              }
            >
              <div
                className={styles.previewAccentBar}
                style={{
                  background: `linear-gradient(90deg, ${branding.accentColor}, transparent)`,
                }}
              />
              <div className={styles.previewContent}>
                <span className={styles.previewName}>
                  {branding.freelancerName || "Your Name"}
                </span>
                {branding.tagline && (
                  <span className={styles.previewTagline}>
                    {branding.tagline}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button type="button" onClick={handleSaveBranding}>
              {brandingSaved ? "✓ Saved!" : "Save Branding"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
