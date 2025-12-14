'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/auth/Logo';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { isLoggedIn } from '@/lib/auth';
import { login } from '@/lib/api';
import type { ApiError } from '@/lib/api';
import styles from '../signup/signup.module.css';
import Link from 'next/link';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
}

function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  return { isValid: true };
}

function validateLoginForm(data: LoginFormData): {
  isValid: boolean;
  errors: LoginFormErrors;
} {
  const errors: LoginFormErrors = {};
  
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      console.log('isLoggedIn -', isLoggedIn())
      router.push('/home');
    }
  }, [router]);

  const handleChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof LoginFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Validate on blur
    const validation = validateLoginForm(formData);
    if (validation.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validation.errors[field] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous API errors
    setApiError(null);
    
    const validation = validateLoginForm(formData);
    setErrors(validation.errors);
    
    if (!validation.isValid) {
      // Mark all fields as touched to show errors
      setTouched({
        email: true,
        password: true,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call login API
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      // Check if login was successful
      if (response.data) {
        // Update auth state (you might want to use a context or state management)
        // For now, we'll rely on the token being stored in localStorage by the interceptor
        
        // Redirect to home
        router.push('/home');
      } else {
        setApiError(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      // Handle API errors
      const apiError = error as ApiError;
      
      // Handle field-specific errors
      if (apiError.errors) {
        const fieldErrors: LoginFormErrors = {};
        Object.keys(apiError.errors).forEach((key) => {
          if (key === 'email' || key === 'password') {
            fieldErrors[key] = apiError.errors![key][0];
          }
        });
        setErrors(fieldErrors);
      } else {
        // Show general error message
        setApiError(apiError.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = validateLoginForm(formData).isValid;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Logo />
        
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>
            Sign in to your Hubbble account
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
            autoComplete="email"
            required
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            error={touched.password ? errors.password : undefined}
            showPasswordToggle
            autoComplete="current-password"
            required
          />

          {apiError && (
            <div className={styles.apiError} role="alert">
              {apiError}
            </div>
          )}

          <div className={styles.actions}>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!isFormValid || isSubmitting}
            >
              Sign in
            </Button>
          </div>
        </form>

        <p className={styles.loginLink}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

