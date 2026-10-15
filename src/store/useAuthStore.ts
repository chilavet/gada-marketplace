import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Address } from '@/types/marketplace';
import { apiClient } from '@/lib/apiClient';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setSession: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addAddress: (address: Address) => void;
  setDefaultAddress: (addressId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setSession: (user, token) => {
        apiClient.setToken(token);
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        apiClient.setToken(null);
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updates) => {
        const current = get().user;
        if (!current) return;
        set({
          user: {
            ...current,
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      addAddress: (address) => {
        const current = get().user;
        if (!current) return;
        const savedAddresses = [...(current.savedAddresses || [])];
        if (address.isDefault) {
          savedAddresses.forEach((a) => (a.isDefault = false));
        }
        savedAddresses.push(address);
        set({
          user: {
            ...current,
            savedAddresses,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      setDefaultAddress: (addressId) => {
        const current = get().user;
        if (!current) return;
        const savedAddresses = (current.savedAddresses || []).map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        }));
        set({
          user: {
            ...current,
            savedAddresses,
            updatedAt: new Date().toISOString(),
          },
        });
      },
    }),
    {
      name: 'gada_zustand_auth',
    }
  )
);
