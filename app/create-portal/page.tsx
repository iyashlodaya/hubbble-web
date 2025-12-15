"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './create-portal.module.css';

import Logo from '@/components/auth/Logo';

interface FormData {
    clientName: string;
    clientEmail: string;
    projectName: string;
    description: string;
    status: 'Active' | 'Waiting' | 'Completed';
}

export default function CreatePortal() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        clientName: '',
        clientEmail: '',
        projectName: '',
        description: '',
        status: 'Active'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const updateField = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step === 1 && formData.clientName) {
            setStep(2);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            router.back();
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    const handleSubmit = async () => {
        if (!formData.projectName) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);

        // Brief delay to show success state before redirect
        setTimeout(() => {
            router.push('/portal-editor');
        }, 1500);
    };

    return (
        <div className={styles.container}>
            {/* Navbar */}
            <header className={styles.navbar}>
                <Logo />
                <nav className={styles.nav}>
                    <button
                        className={styles.logoutButton}
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                </nav>
            </header>

            <main className={styles.mainContent}>
                <button className={styles.backButton} onClick={handleBack}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Dashboard
                </button>

                {/* Page Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Create Client Portal</h1>
                    <p className={styles.subtitle}>Set up a private workspace for your client in just a few steps</p>
                </div>

                {/* Stepper */}
                <div className={styles.stepper}>
                    <div className={styles.connector}>
                        <div
                            className={styles.connectorFill}
                            style={{ width: step === 2 || isSuccess ? '100%' : '0%' }}
                        />
                    </div>

                    <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''} ${step > 1 || isSuccess ? styles.stepCompleted : ''}`}>
                        <div className={styles.stepCircle}>
                            {step > 1 || isSuccess ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            ) : '1'}
                        </div>
                        <span className={styles.stepLabel}>Client Info</span>
                    </div>

                    <div className={`${styles.step} ${step === 2 || isSuccess ? styles.stepActive : ''} ${isSuccess ? styles.stepCompleted : ''}`} style={{ marginLeft: 'auto' }}>
                        <div className={styles.stepCircle}>
                            {isSuccess ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            ) : '2'}
                        </div>
                        <span className={styles.stepLabel}>Project Details</span>
                    </div>
                </div>

                {/* Form Content */}
                <div className={styles.formCard}>
                    {isSuccess ? (
                        <div className={`${styles.successContainer} ${styles.fadeIn}`}>
                            <div className={styles.successIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3 className={styles.label} style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Client Portal Created!</h3>
                            <p className={styles.helperText}>Redirecting to portal editor...</p>
                        </div>
                    ) : step === 1 ? (
                        <div className={styles.fadeIn}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="clientName">Client Name *</label>
                                <input
                                    id="clientName"
                                    className={styles.input}
                                    type="text"
                                    placeholder="e.g. Acme Corp"
                                    value={formData.clientName}
                                    onChange={(e) => updateField('clientName', e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="clientEmail">Client Email (Optional)</label>
                                <input
                                    id="clientEmail"
                                    className={styles.input}
                                    type="email"
                                    placeholder="client@example.com"
                                    value={formData.clientEmail}
                                    onChange={(e) => updateField('clientEmail', e.target.value)}
                                />
                                <p className={styles.helperText}>Used only for reference. Clients don’t need to log in.</p>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className={`${styles.button} ${styles.buttonPrimary}`}
                                    onClick={handleNext}
                                    disabled={!formData.clientName.trim()}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.fadeIn}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="projectName">Project Name *</label>
                                <input
                                    id="projectName"
                                    className={styles.input}
                                    type="text"
                                    placeholder="e.g. Website Redesign"
                                    value={formData.projectName}
                                    onChange={(e) => updateField('projectName', e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="description">Short Description (Optional)</label>
                                <textarea
                                    id="description"
                                    className={styles.textarea}
                                    placeholder="Briefly describe the project goals..."
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="status">Project Status</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        id="status"
                                        className={styles.select}
                                        value={formData.status}
                                        onChange={(e) => updateField('status', e.target.value as any)}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Waiting">Waiting</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className={`${styles.button} ${styles.buttonSecondary}`}
                                    onClick={handleBack}
                                    disabled={isSubmitting}
                                >
                                    Back
                                </button>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <button
                                        className={`${styles.button} ${styles.buttonPrimary}`}
                                        onClick={handleSubmit}
                                        disabled={!formData.projectName.trim() || isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className={styles.spinner}></span>
                                                Creating...
                                            </>
                                        ) : 'Create Portal'}
                                    </button>
                                    <span className={styles.helperText} style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                                        You can edit everything later.
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div >
    );
}
