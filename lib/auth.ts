/**
 * Auth utility functions
 * Checks LOGGED_IN environment variable to determine auth state
 */

export function isLoggedIn(): boolean {
  const accessToken = localStorage.getItem('auth_token');

  if(!accessToken) {
    return false
  }
  else {
    return true
  }
}

export function getAuthRedirectPath(): string {
  return isLoggedIn() ? '/home' : '/login';
}

