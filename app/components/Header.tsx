'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/auth/Logo';
import UserMenu from './UserMenu';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <Link href="/home" className={styles.logoLink}>
                <Logo />
            </Link>
            <nav className={styles.nav}>
                <UserMenu />
            </nav>
        </header>
    );
}
