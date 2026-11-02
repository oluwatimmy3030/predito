import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

const PREVIEW_AUTH_KEY = 'predito_preview_auth';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  togglePreviewAuth: () => void;
  isAuthenticated: boolean;
  isPreviewSession: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode JWT and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch {
    return true; // If we can't decode, treat as expired
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isPreviewSession, setIsPreviewSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem(PREVIEW_AUTH_KEY);
    setToken(null);
    setUser(null);
    setIsPreviewSession(false);
  }, []);

  useEffect(() => {
    // Check for stored auth on mount
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser && storedUser !== 'undefined') {
      // Check if token is expired
      if (isTokenExpired(storedToken)) {
        console.log('Token expired, logging out');
        logout();
      } else {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser) as User);
        } catch (error) {
          // Clear invalid data
          logout();
          console.error('Failed to parse stored user data:', error);
        }
      }
    } else if (localStorage.getItem(PREVIEW_AUTH_KEY) === 'true') {
      // Frontend preview session (not real auth)
      setUser({
        id: 'preview-user',
        email: '',
      });
      setIsPreviewSession(true);
    }
    setIsLoading(false);
  }, [logout]);

  const login = (newToken: string, newUser: User) => {
    if (!newToken || !newUser) {
      console.error('Invalid login data provided');
      return;
    }
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    localStorage.removeItem(PREVIEW_AUTH_KEY);
    setToken(newToken);
    setUser(newUser);
    setIsPreviewSession(false);
  };

  const togglePreviewAuth = () => {
    if (isPreviewSession) {
      // Log out of preview session
      localStorage.removeItem(PREVIEW_AUTH_KEY);
      setUser(null);
      setIsPreviewSession(false);
    } else {
      // Enter preview session
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.setItem(PREVIEW_AUTH_KEY, 'true');
      setUser({
        id: 'preview-user',
        email: '',
      });
      setIsPreviewSession(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        togglePreviewAuth,
        isAuthenticated: isPreviewSession || (!!token && !isTokenExpired(token)),
        isPreviewSession,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};