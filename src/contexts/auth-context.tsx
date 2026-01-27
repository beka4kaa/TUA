'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  authApi,
  tokenStorage,
  UserWithSubscription,
  ApiClientError,
} from '@/lib/api';

// ============================================
// Types
// ============================================

interface AuthState {
  user: UserWithSubscription | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<{ email: string; verificationUrl?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; image?: string }) => Promise<void>;
  clearError: () => void;
}

// ============================================
// Context
// ============================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================
// Provider
// ============================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Set error helper
  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (!tokenStorage.isLoggedIn()) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const user = await authApi.getMe();
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } catch (err) {
        // Token is invalid or expired
        tokenStorage.clearTokens();
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authApi.login(credentials.email, credentials.password);
      
      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (err) {
      const message = err instanceof ApiClientError 
        ? err.message 
        : 'Login failed. Please try again.';
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      
      throw err;
    }
  }, []);

  // Sign up
  const signUp = useCallback(async (data: SignUpData) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authApi.signUp(data);
      
      setState((prev) => ({ ...prev, isLoading: false }));
      
      return { email: response.email, verificationUrl: response.verificationUrl };
    } catch (err) {
      const message = err instanceof ApiClientError 
        ? err.message 
        : 'Sign up failed. Please try again.';
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      
      throw err;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!tokenStorage.isLoggedIn()) return;

    try {
      const user = await authApi.getMe();
      setState((prev) => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));
    } catch {
      // Token might be expired
      tokenStorage.clearTokens();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  }, []);

  // Verify email
  const verifyEmail = useCallback(async (token: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      await authApi.verifyEmail(token);
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (err) {
      const message = err instanceof ApiClientError 
        ? err.message 
        : 'Email verification failed.';
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      
      throw err;
    }
  }, []);

  // Resend verification email
  const resendVerification = useCallback(async (email: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      await authApi.resendVerification(email);
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (err) {
      const message = err instanceof ApiClientError 
        ? err.message 
        : 'Failed to resend verification email.';
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      
      throw err;
    }
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (email: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      await authApi.forgotPassword(email);
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (err) {
      const message = err instanceof ApiClientError 
        ? err.message 
        : 'Failed to send password reset email.';
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      
      throw err;
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      await authApi.resetPassword(token, password);
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (err) {
      const message = err instanceof ApiClientError 
        ? err.message 
        : 'Password reset failed.';
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      
      throw err;
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: { firstName?: string; lastName?: string; image?: string }) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const user = await authApi.updateMe(data);
      setState((prev) => ({ ...prev, user, isLoading: false }));
    } catch (err) {
      const message = err instanceof ApiClientError 
        ? err.message 
        : 'Profile update failed.';
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      
      throw err;
    }
  }, []);

  // Memoize context value
  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      signUp,
      logout,
      refreshUser,
      verifyEmail,
      resendVerification,
      forgotPassword,
      resetPassword,
      updateProfile,
      clearError,
    }),
    [
      state,
      login,
      signUp,
      logout,
      refreshUser,
      verifyEmail,
      resendVerification,
      forgotPassword,
      resetPassword,
      updateProfile,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// Hook
// ============================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// ============================================
// Helper hooks
// ============================================

export function useUser(): UserWithSubscription | null {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function useRequireAuth(redirectTo: string = '/login'): AuthContextValue {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, redirectTo]);
  
  return auth;
}

export function useRequireRole(allowedRoles: string[], redirectTo: string = '/'): AuthContextValue {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && auth.user) {
      if (!allowedRoles.includes(auth.user.role)) {
        // Redirect if role not allowed
        if (typeof window !== 'undefined') {
          window.location.href = redirectTo;
        }
      }
    }
  }, [auth.isLoading, auth.user, allowedRoles, redirectTo]);
  
  return auth;
}
