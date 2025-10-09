/**
 * User account information
 */
export interface User {
  /** Unique user identifier (UUID) */
  id: string;
  /** User's email address */
  email: string;
  /** User's display name (nullable) */
  name: string | null;
  /** Profile picture URL (nullable) */
  picture: string | null;
}

/**
 * Website/domain registered for chatbot integration
 */
export interface Website {
  /** Unique website identifier (UUID) */
  id: string;
  /** Owner's user ID (foreign key) */
  user_id: string;
  /** Website domain/URL */
  domain: string;
  /** Creation timestamp (ISO 8601) */
  created_at: string;
  /** Last update timestamp (ISO 8601) */
  updated_at: string;
}

/**
 * Authentication response from login endpoints
 */
export interface AuthResponse {
  /** JWT authentication token */
  token: string;
  /** User object with profile information */
  user: User;
}

/**
 * Base API URL - configurable via environment variable
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://reply-platform-api.red-frog-895a.workers.dev';

/**
 * API client for Reply Platform backend
 * 
 * Provides typed methods for all API endpoints including:
 * - Authentication (Google OAuth, email/password)
 * - User management
 * - Website CRUD operations
 * 
 * @example
 * ```typescript
 * import { api } from '@/lib/api';
 * 
 * // Authenticate with Google OAuth
 * const response = await api.auth(code, redirectUri);
 * 
 * // Get user's websites
 * const websites = await api.getWebsites(token);
 * ```
 */
export const api = {
  /**
   * Exchange Google OAuth authorization code for JWT token
   * 
   * @param code - OAuth authorization code from Google
   * @param redirectUri - Redirect URI used in OAuth flow (must match Google Console)
   * @returns Authentication response with JWT token and user data
   * @throws Error if authentication fails
   * 
   * @example
   * ```typescript
   * const response = await api.auth(authCode, 'http://localhost:3000/auth/callback');
   * localStorage.setItem('token', response.token);
   * ```
   */
  async auth(code: string, redirectUri: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri }),
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    return response.json();
  },

  /**
   * Authenticate with email and password
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns Authentication response with JWT token and user data
   * @throws Error if credentials are invalid
   * 
   * @example
   * ```typescript
   * try {
   *   const response = await api.login('user@example.com', 'password123');
   *   localStorage.setItem('token', response.token);
   * } catch (error) {
   *   console.error('Login failed:', error.message);
   * }
   * ```
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  },

  /**
   * Request OTP code to be sent to email
   * 
   * @param email - User's email address
   * @returns Success message
   * @throws Error if email is invalid or sending fails
   * 
   * @example
   * ```typescript
   * try {
   *   await api.requestOTP('user@example.com');
   *   console.log('OTP sent to email');
   * } catch (error) {
   *   console.error('Failed to send OTP:', error.message);
   * }
   * ```
   */
  async requestOTP(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send OTP');
    }
    
    return response.json();
  },

  /**
   * Verify OTP code and authenticate
   * 
   * @param email - User's email address
   * @param otp - OTP code received via email
   * @returns Authentication response with JWT token and user data
   * @throws Error if OTP is invalid or expired
   * 
   * @example
   * ```typescript
   * try {
   *   const response = await api.verifyOTP('user@example.com', '123456');
   *   localStorage.setItem('token', response.token);
   * } catch (error) {
   *   console.error('OTP verification failed:', error.message);
   * }
   * ```
   */
  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'OTP verification failed');
    }
    
    return response.json();
  },

  /**
   * Get current authenticated user's information
   * 
   * @param token - JWT authentication token
   * @returns User object with profile information
   * @throws Error if token is invalid or user not found
   * 
   * @example
   * ```typescript
   * const token = localStorage.getItem('token');
   * if (token) {
   *   const user = await api.getMe(token);
   *   console.log('Current user:', user.email);
   * }
   * ```
   */
  async getMe(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }
    
    const data = await response.json();
    return data.user;
  },

  /**
   * Get list of all websites owned by authenticated user
   * 
   * @param token - JWT authentication token
   * @returns Array of website objects
   * @throws Error if token is invalid
   * 
   * @example
   * ```typescript
   * const websites = await api.getWebsites(token);
   * console.log(`You have ${websites.length} websites`);
   * ```
   */
  async getWebsites(token: string): Promise<Website[]> {
    const response = await fetch(`${API_URL}/websites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get websites');
    }
    
    const data = await response.json();
    return data.websites;
  },

  /**
   * Add a new website to user's account
   * 
   * @param token - JWT authentication token
   * @param domain - Website domain to add (e.g., "example.com")
   * @returns Newly created website object
   * @throws Error if domain is invalid or already exists
   * 
   * @example
   * ```typescript
   * const newWebsite = await api.addWebsite(token, 'example.com');
   * console.log('Website ID:', newWebsite.id);
   * ```
   */
  async addWebsite(token: string, domain: string): Promise<Website> {
    const response = await fetch(`${API_URL}/websites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ domain }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add website');
    }
    
    const data = await response.json();
    return data.website;
  },

  /**
   * Delete a website from user's account
   * 
   * @param token - JWT authentication token
   * @param id - Website ID to delete
   * @throws Error if website doesn't exist or doesn't belong to user
   * 
   * @example
   * ```typescript
   * await api.deleteWebsite(token, websiteId);
   * console.log('Website deleted successfully');
   * ```
   */
  async deleteWebsite(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_URL}/websites/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete website');
    }
  },
};