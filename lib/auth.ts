/**
 * Auth utility functions
 * Checks LOGGED_IN environment variable to determine auth state
 */

export function isLoggedIn(): boolean {
  return process.env.NEXT_PUBLIC_LOGGED_IN === 'true';
}

export function getAuthRedirectPath(): string {
  return isLoggedIn() ? '/home' : '/login';
}

