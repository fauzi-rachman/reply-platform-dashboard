export interface User {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
}

export interface Website {
  id: string;
  user_id: string;
  domain: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://reply-platform-api.red-frog-895a.workers.dev';

export const api = {
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