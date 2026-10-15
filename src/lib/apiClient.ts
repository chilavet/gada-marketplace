/**
 * API Client matching REST/GraphQL backend architecture with interceptors
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'gada_auth_token';

export interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

export interface ClientResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  }

  setToken(token: string | null): void {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        document.cookie = `gada_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
      } else {
        localStorage.removeItem(TOKEN_KEY);
        document.cookie = 'gada_token=; path=/; max-age=0; SameSite=Lax';
      }
    } catch (e) {
      console.warn('Failed to store token:', e);
    }
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ClientResponse<T>> {
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    if (options.params) {
      const query = new URLSearchParams(
        Object.entries(options.params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
      ).toString();
      if (query) url += `?${query}`;
    }

    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {})
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    let data: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error: any = new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return {
      data: data as T,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    };
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ClientResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, body?: any): Promise<ClientResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ClientResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<ClientResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
