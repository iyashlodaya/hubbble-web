'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { getCurrentUser, logout } from '@/lib/api/services/auth.service';
import { LogOut, User as UserIcon, ChevronDown, Settings } from 'lucide-react';
import styles from './UserMenu.module.css';

interface User {
  full_name: string;
  email: string;
  profession?: string;
}

export default function UserMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <div className={styles.container} ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`${styles.trigger} ${isOpen ? styles.active : ''}`}
      >
        <Avatar 
            initials={getInitials(user.full_name)} 
            size="lg" 
            className="border-2 border-white shadow-sm"
        />
        <ChevronDown size={14} className={styles.chevron} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.full_name}</p>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
          
          <div className={styles.divider} />
          
          <button className={styles.menuItem} onClick={() => router.push('/settings')}>
            <Settings size={16} />
            <span>Settings</span>
          </button>
          
          <button className={styles.menuItem} onClick={() => router.push('/profile')}>
            <UserIcon size={16} />
            <span>Profile</span>
          </button>
          
          <div className={styles.divider} />
          
          <button className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
