'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/auth/Logo';
import styles from './Header.module.css';

export default function Header() {
    const router = useRouter();

    return (
        <header className={styles.header}>
            <Logo />
            <nav className={styles.nav}>
                <button
                    className={styles.logoutButton}
                    onClick={() => {
                        localStorage.clear();
                        router.push('/login');
                    }}
                >
                    Log out
                </button>
            </nav>
        </header>
    );
}
