/**
 * Auth utility functions
 * Checks LOGGED_IN environment variable to determine auth state
 */

export function isLoggedIn(): boolean {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return false;
  }
  
  console.log('IsLoggedIn called');
  const accessToken = localStorage.getItem('auth_token');

  console.log('Access Token', accessToken)
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

