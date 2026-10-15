import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';
import { apiClient } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setTokenState] = useState(() => apiClient.getToken());

  // Initialize session state on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const storedToken = apiClient.getToken();
        if (storedToken) {
          const user = await authApi.getMe();
          if (user) {
            setCurrentUser(user);
          }
        }
      } catch (err) {
        console.warn('Session restoration failed:', err);
        apiClient.setToken(null);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async ({ email, phone, password }) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, phone, password });
      setCurrentUser(res.user);
      setTokenState(res.token);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async ({ phone, email }) => {
    return authApi.requestOtp({ phone, email });
  };

  const verifyOtp = async ({ phone, email, otp }) => {
    setIsLoading(true);
    try {
      const res = await authApi.verifyOtp({ phone, email, otp });
      setCurrentUser(res.user);
      setTokenState(res.token);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(userData);
      setCurrentUser(res.user);
      setTokenState(res.token);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setCurrentUser(null);
    setTokenState(null);
  };

  const updateProfile = async (updates) => {
    const updated = await authApi.updateProfile(updates);
    setCurrentUser(updated);
    return updated;
  };

  const addAddress = async (newAddress) => {
    if (!currentUser) return null;
    const currentAddresses = currentUser.addresses || [];
    const formatted = {
      id: `addr-${Date.now()}`,
      label: newAddress.label || 'Home',
      address: newAddress.address,
      landmark: newAddress.landmark || '',
      deliveryNotes: newAddress.deliveryNotes || '',
      isDefault: currentAddresses.length === 0 || !!newAddress.isDefault
    };

    let updatedList = [...currentAddresses];
    if (formatted.isDefault) {
      updatedList = updatedList.map(a => ({ ...a, isDefault: false }));
    }
    updatedList.push(formatted);

    return updateProfile({ addresses: updatedList });
  };

  const setDefaultAddress = async (addressId) => {
    if (!currentUser) return null;
    const updated = (currentUser.addresses || []).map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));
    return updateProfile({ addresses: updated });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated: !!currentUser,
        token,
        isLoading,
        login,
        requestOtp,
        verifyOtp,
        register,
        logout,
        updateProfile,
        addAddress,
        setDefaultAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
