/**
 * Centralized API HTTP Client with Token Interceptor & Mock Adapter Fallback
 * Works with live REST/GraphQL APIs or local mock fallback seamlessly.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'gada_auth_token';

class ApiClient {
  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
    this.interceptors = {
      request: [],
      response: []
    };

    // Default request interceptor for Bearer Token
    this.useRequestInterceptor((config) => {
      const token = this.getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      config.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config.headers
      };
      return config;
    });
  }

  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  }

  setToken(token) {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        // Also set cookie for SSR / multi-tab support
        document.cookie = `gada_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
      } else {
        localStorage.removeItem(TOKEN_KEY);
        document.cookie = 'gada_token=; path=/; max-age=0; SameSite=Lax';
      }
    } catch (e) {
      console.warn('Failed to store token:', e);
    }
  }

  useRequestInterceptor(fn) {
    this.interceptors.request.push(fn);
  }

  useResponseInterceptor(fn) {
    this.interceptors.response.push(fn);
  }

  async request(endpoint, options = {}) {
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    let config = {
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.body ? JSON.stringify(options.body) : undefined,
      ...options
    };

    // Execute request interceptors
    for (const interceptor of this.interceptors.request) {
      config = await interceptor(config);
    }

    try {
      const response = await fetch(url, config);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error = new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      // Global error handler
      console.warn(`[API ${config.method} ${endpoint}] Error:`, error.message);
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, body = {}) {
    return this.request(endpoint, { method: 'POST', body });
  }

  put(endpoint, body = {}) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
