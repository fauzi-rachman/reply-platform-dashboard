/**
 * Authentication utilities for token management
 * 
 * Provides methods to store, retrieve, and manage JWT tokens in localStorage.
 * All methods safely handle server-side rendering (SSR) where window is undefined.
 * 
 * @example
 * ```typescript
 * import { auth } from '@/lib/auth';
 * 
 * // After login
 * auth.setToken(response.token);
 * 
 * // Check authentication
 * if (auth.isAuthenticated()) {
 *   // User is logged in
 * }
 * 
 * // Logout
 * auth.removeToken();
 * ```
 */
export const auth = {
  /**
   * Store authentication token in localStorage
   * 
   * @param token - JWT token from authentication response
   * 
   * @example
   * ```typescript
   * const response = await api.auth(code, redirectUri);
   * auth.setToken(response.token);
   * ```
   */
  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  /**
   * Retrieve authentication token from localStorage
   * 
   * @returns JWT token or null if not authenticated
   * 
   * @example
   * ```typescript
   * const token = auth.getToken();
   * if (token) {
   *   const user = await api.getMe(token);
   * }
   * ```
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  /**
   * Remove authentication token from localStorage (logout)
   * 
   * @example
   * ```typescript
   * auth.removeToken();
   * router.push('/login');
   * ```
   */
  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  /**
   * Check if user is authenticated
   * 
   * @returns true if token exists, false otherwise
   * 
   * @example
   * ```typescript
   * if (!auth.isAuthenticated()) {
   *   router.push('/login');
   *   return;
   * }
   * ```
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};