/**
 * Auth utility functions
 * Checks LOGGED_IN environment variable to determine auth state
 */

export function isLoggedIn(): boolean {
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

