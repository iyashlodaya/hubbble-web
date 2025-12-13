import { redirect } from 'next/navigation';
import { getAuthRedirectPath } from '@/lib/auth';

export default function RootPage() {
  // Redirect based on auth state
  redirect(getAuthRedirectPath());
}
