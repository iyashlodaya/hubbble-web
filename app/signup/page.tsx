'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/auth/Logo';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PasswordStrength from '@/components/auth/PasswordStrength';
import ProfessionSelector from '@/components/auth/ProfessionSelector';
import { validateSignupForm, type SignupFormData, type SignupFormErrors } from '@/lib/validation';
import { isLoggedIn } from '@/lib/auth';
import { signup } from '@/lib/api';
import type { ApiError } from '@/lib/api';
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
  const [apiError, setApiError] = useState<string | null>(null);
  const [additionalFields, setAdditionalFields] = useState({
    full_name: '',
    profession: '',
  });

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

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalFields((prev) => ({ ...prev, full_name: e.target.value }));
    // Clear error when user starts typing
    if ((errors as any).full_name) {
      setErrors((prev) => ({ ...prev, full_name: undefined }));
    }
  };

  const handleProfessionChange = (value: string) => {
    setAdditionalFields((prev) => ({ ...prev, profession: value }));
    // Clear error when user selects/changes profession
    if ((errors as any).profession) {
      setErrors((prev) => ({ ...prev, profession: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous API errors
    setApiError(null);
    
    const validation = validateSignupForm(formData);
    setErrors(validation.errors);
    
    // Validate additional required fields
    if (!additionalFields.full_name.trim()) {
      setErrors((prev) => ({ ...prev, full_name: 'Full name is required' }));
    }
    if (!additionalFields.profession.trim()) {
      setErrors((prev) => ({ ...prev, profession: 'Profession is required' }));
    }
    
    if (!validation.isValid || !additionalFields.full_name.trim() || !additionalFields.profession.trim()) {
      // Mark all fields as touched to show errors
      setTouched({
        email: true,
        password: true,
        confirmPassword: true,
        full_name: true,
        profession: true,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call signup API
      const response = await signup({
        email: formData.email,
        password: formData.password,
        full_name: additionalFields.full_name,
        profession: additionalFields.profession,
      });

      console.log('Response --->', response);

      // Check if signup was successful
      if (response.data) {
        // Token is automatically stored in localStorage by the service
        setIsSuccess(true);
        // Redirect to onboarding after a brief delay to show success message
        setTimeout(() => {
          console.log('sending to home')
          router.push('/onboarding');
        }, 2000);
      } else {
        setApiError(response.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      // Handle API errors
      const apiError = error as ApiError;
      
      // Handle field-specific errors
      if (apiError.errors) {
        const fieldErrors: SignupFormErrors & { full_name?: string; profession?: string } = {};
        Object.keys(apiError.errors).forEach((key) => {
          if (['email', 'password', 'confirmPassword', 'full_name', 'profession'].includes(key)) {
            fieldErrors[key as keyof typeof fieldErrors] = apiError.errors![key][0];
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
            Welcome to Hubbble. Let&apos;s get you set up.
          </p>
          <Button
            onClick={() => {
              // Navigate to onboarding using Next.js router
              router.push('/onboarding');
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
          <h1 className={styles.title}>Create your Hubbble account</h1>
          <p className={styles.subtitle}>
            Start managing clients with clarity and confidence
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            id="full_name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            value={additionalFields.full_name}
            onChange={handleFullNameChange}
            onBlur={() => setTouched((prev) => ({ ...prev, full_name: true }))}
            error={touched.full_name ? (errors as any).full_name : undefined}
            autoComplete="name"
            required
          />

          <ProfessionSelector
            value={additionalFields.profession}
            onChange={handleProfessionChange}
            onBlur={() => setTouched((prev) => ({ ...prev, profession: true }))}
            error={touched.profession ? (errors as any).profession : undefined}
          />

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

          {apiError && (
            <div className={styles.apiError} role="alert">
              {apiError}
            </div>
          )}

          <div className={styles.actions}>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!isFormValid || isSubmitting || !additionalFields.full_name.trim() || !additionalFields.profession.trim()}
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

