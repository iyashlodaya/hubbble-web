'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPublicPortal, type PublicPortalData } from '@/lib/api';
import styles from './PublicPortal.module.css';

interface PortalBranding {
  freelancerName: string;
  tagline: string;
  accentColor: string;
}

export default function PublicPortalPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<PublicPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [branding, setBranding] = useState<PortalBranding>({ freelancerName: '', tagline: '', accentColor: '#00A8E8' });

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('hubbble-theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Load branding from localStorage
  useEffect(() => {
    if (slug) {
      try {
        const stored = localStorage.getItem(`portal-branding-${slug}`);
        if (stored) {
          setBranding(JSON.parse(stored));
        }
      } catch {}
    }
  }, [slug]);

  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        const response = await getPublicPortal(slug);
        if (response.data) {
          setData(response.data);
        } else {
          setError('Portal not found');
        }
      } catch (err) {
        console.error('Failed to fetch portal data:', err);
        setError('Failed to load portal data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPortalData();
    }
  }, [slug]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('hubbble-theme', newTheme);
    
    // Play mechanical switch sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Part 1: The 'Click' (Noise)
      const bufferSize = audioCtx.sampleRate * 0.01; // 10ms burst
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.01);
      
      noiseSource.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      
      // Part 2: The 'Resonance' (Sine)
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); 
      
      gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      noiseSource.start();
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } catch (err) {
      console.warn('Audio playback failed', err);
    }
  };

  if (loading) {
    return (
      <div className={`${styles.container} ${theme === 'light' ? styles.whiteTheme : ''}`}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`${styles.container} ${theme === 'light' ? styles.whiteTheme : ''}`}>
        <div className={styles.loadingContainer}>
          <div className={styles.errorContent}>
            <h1>{error || 'Portal not found'}</h1>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string, showTime?: boolean) => {
    if (showTime) {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const accent = branding.accentColor || '#00A8E8';

  return (
    <div
      className={`${styles.container} ${theme === 'light' ? styles.whiteTheme : ''}`}
      style={{ '--accent': accent, '--accent-20': `${accent}33`, '--accent-10': `${accent}1A` } as React.CSSProperties}
    >
      <button 
        className={styles.themeToggle} 
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* Freelancer Branding Bar */}
      {branding.freelancerName && (
        <div className={styles.brandingBar}>
          <div className={styles.brandingAccentLine} style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
          <div className={styles.brandingContent}>
            <span className={styles.brandingName}>{branding.freelancerName}</span>
            {branding.tagline && (
              <>
                <span className={styles.brandingDivider}>·</span>
                <span className={styles.brandingTagline}>{branding.tagline}</span>
              </>
            )}
          </div>
        </div>
      )}

      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerInfo}>
            <h1>{data.client.name}</h1>
            <div className={styles.projectName}>
              {data.name}
              <span className={`${styles.statusBadge} ${styles[data.status]}`}>
                {data.status}
              </span>
            </div>
          </div>
        </header>

        {/* Project Overview */}
        {data.description && (
          <section className={styles.overviewSection}>
            <div className={styles.overviewCard}>
              <div className={styles.overviewAccent} style={{ background: `linear-gradient(180deg, ${accent}, transparent)` }} />
              <div className={styles.overviewBody}>
                <h2 className={styles.overviewLabel}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  Project Overview
                </h2>
                <p className={styles.overviewText}>{data.description}</p>
              </div>
            </div>
          </section>
        )}

        {/* Dashboard Grid - Bird's Eye View */}
        <section className={styles.dashboardGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Latest Update</span>
            <div className={styles.statValue}>
              {data.updates.length > 0 ? (
                <>
                  {formatDate(data.updates[0].created_at)}
                  <div className={styles.statSubtext}>
                    {new Date(data.updates[0].created_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </>
              ) : 'N/A'}
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Files</span>
            <div className={styles.statValue}>{data.files.filter(f => f.type === 'file').length}</div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Quick Links</span>
            <div className={styles.statValue}>{data.files.filter(f => f.type === 'link').length}</div>
          </div>
        </section>

        {/* Two Column Layout for Desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '60px' }}>
          
          {/* Timeline Section */}
          <section>
            <h2 className={styles.sectionTitle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20v-6M12 8V2M20 12l-8 8-8-8"/>
              </svg>
              Project Timeline
            </h2>
            
            <div className={styles.timeline}>
              {data.updates.length > 0 ? (
                data.updates.map((update) => (
                  <div key={update.id} className={styles.updateItem}>
                    <div className={styles.updateDate}>{formatDate(update.created_at, true)}</div>
                    <div className={styles.updateContent}>
                      <h3 className={styles.updateTitle}>{update.title}</h3>
                      <p className={styles.updateText}>{update.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.updateContent}>
                  <p className={styles.updateText} style={{ textAlign: 'center' }}>No updates posted yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Files & Links Section */}
          <aside>
            <h2 className={styles.sectionTitle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              Resources
            </h2>
            
            <div className={styles.filesGrid} style={{ gridTemplateColumns: '1fr' }}>
              {data.files.length > 0 ? (
                data.files.map((file) => (
                  <a 
                    key={file.id} 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.fileCard}
                  >
                    <div className={styles.fileIcon}>
                      {file.type === 'file' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                      )}
                    </div>
                    <div className={styles.fileInfo}>
                      <div className={styles.fileTitle}>{file.title}</div>
                      <div className={styles.fileMeta}>{file.type}</div>
                    </div>
                  </a>
                ))
              ) : (
                <div className={styles.updateContent}>
                  <p className={styles.updateText} style={{ textAlign: 'center' }}>No resources shared yet.</p>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Footer */}
        {branding.freelancerName && (
          <footer className={styles.portalFooter}>
            <span>Powered by</span>
            <span className={styles.footerBrand}>{branding.freelancerName}</span>
          </footer>
        )}
      </main>
    </div>
  );
}

