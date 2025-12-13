'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/auth/Logo';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PasswordStrength from '@/components/auth/PasswordStrength';
import { validateSignupForm, type SignupFormData, type SignupFormErrors } from '@/lib/validation';
import { isLoggedIn } from '@/lib/auth';
import styles from './signup.module.css';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      router.push('/home');
    }
  }, [router]);

  const handleChange = (field: keyof SignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof SignupFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Validate on blur
    const validation = validateSignupForm(formData);
    if (validation.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validation.errors[field] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateSignupForm(formData);
    setErrors(validation.errors);
    
    if (!validation.isValid) {
      // Mark all fields as touched to show errors
      setTouched({
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // In a real app, you'd redirect to onboarding here
    // router.push('/onboarding');
  };

  const isFormValid = validateSignupForm(formData).isValid;

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successAnimation}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#10b981" opacity="0.1"/>
              <path
                d="M22 32L28 38L42 24"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className={styles.successTitle}>Account created!</h1>
          <p className={styles.successText}>
            Welcome to Hubble. Let&apos;s get you set up.
          </p>
          <Button
            onClick={() => {
              // Navigate to onboarding
              window.location.href = '/onboarding';
            }}
          >
            Continue to onboarding
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Logo />
        
        <div className={styles.header}>
          <h1 className={styles.title}>Create your Hubble account</h1>
          <p className={styles.subtitle}>
            Start managing clients with clarity and confidence
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            error={touched.email ? errors.email : undefined}
            helperText="We&apos;ll never share your email"
            autoComplete="email"
            required
          />

          <div>
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password ? errors.password : undefined}
              showPasswordToggle
              autoComplete="new-password"
              required
            />
            {formData.password && (
              <PasswordStrength password={formData.password} />
            )}
          </div>

          <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            showPasswordToggle
            autoComplete="new-password"
            required
          />

          <div className={styles.actions}>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!isFormValid || isSubmitting}
            >
              Create account
            </Button>
            
            <p className={styles.trustHint}>
              No credit card required
            </p>
          </div>
        </form>

        <p className={styles.loginLink}>
          Already have an account?{' '}
          <Link href="/login" className={styles.link}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

