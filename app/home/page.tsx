'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/auth/Logo';
import { isLoggedIn } from '@/lib/auth';
import styles from './home.module.css';

export default function HomePage() {
  const router = useRouter();

  // Redirect to login if not logged in
  useEffect(() => {
    console.log('isLoggedIn ---', isLoggedIn())
    if (!isLoggedIn()) {
      console.log('Redireccting to login page')
      router.push('/login');
    }
  }, [router]);

  // Don't render if not logged in (will redirect)
  if (!isLoggedIn()) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />
        <nav className={styles.nav}>
          <button className={styles.logoutButton} onClick={() => router.push('/login')}>
            Log out
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Welcome to Hubbble</h1>
          <p className={styles.subtitle}>
            Your client portal dashboard
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Get Started</h2>
            <p className={styles.cardText}>
              Start creating client portals to share updates, files, and invoices.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

