import React, { useEffect, useState, createContext, useContext } from 'react';
import { User, AuthState, UserRole } from '../types';
interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  logout: () => void;
  verifyMagicLink: (token: string) => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Mock users database
const MOCK_USERS: Record<string, User> = {
  'admin@wildguard.org': {
    id: 'u1',
    email: 'admin@wildguard.org',
    name: 'John Doe',
    role: 'ADMIN',
    organization: 'WildGuard Plus',
    avatar: undefined
  },
  'ranger@kws.go.ke': {
    id: 'u2',
    email: 'ranger@kws.go.ke',
    name: 'Sarah Mwangi',
    role: 'RANGER',
    organization: 'Kenya Wildlife Service',
    avatar: undefined
  },
  'observer@krcs.org': {
    id: 'u3',
    email: 'observer@krcs.org',
    name: 'David Kamau',
    role: 'OBSERVER',
    organization: 'Kenya Red Cross',
    avatar: undefined
  },
  'community@mtakuja.org': {
    id: 'u4',
    email: 'community@mtakuja.org',
    name: 'Grace Wanjiku',
    role: 'COMMUNITY',
    organization: 'Mtakuja Community',
    avatar: undefined
  }
};
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('wildguard_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        localStorage.removeItem('wildguard_user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }, []);
  const login = async (email: string): Promise<void> => {
    // Simulate sending magic link email
    return new Promise(resolve => {
      setTimeout(() => {
        // Generate a mock token
        const token = btoa(email + ':' + Date.now());
        console.log('🔗 Magic link sent to:', email);
        console.log('🔑 Token:', token);
        // In a real app, this would send an email
        // For demo, we'll store the token temporarily
        sessionStorage.setItem('pending_magic_link', token);
        sessionStorage.setItem('pending_email', email);
        resolve();
      }, 1000);
    });
  };
  const verifyMagicLink = async (token: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Decode token to get email
          const decoded = atob(token);
          const email = decoded.split(':')[0];
          // Find user
          const user = MOCK_USERS[email];
          if (user) {
            const updatedUser = {
              ...user,
              lastLogin: new Date().toISOString()
            };
            // Store in localStorage
            localStorage.setItem('wildguard_user', JSON.stringify(updatedUser));
            // Update state
            setAuthState({
              user: updatedUser,
              isAuthenticated: true,
              isLoading: false
            });
            // Clear pending token
            sessionStorage.removeItem('pending_magic_link');
            sessionStorage.removeItem('pending_email');
            resolve();
          } else {
            reject(new Error('Invalid magic link'));
          }
        } catch (error) {
          reject(new Error('Invalid magic link'));
        }
      }, 800);
    });
  };
  const logout = () => {
    localStorage.removeItem('wildguard_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };
  return <AuthContext.Provider value={{
    ...authState,
    login,
    logout,
    verifyMagicLink
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}