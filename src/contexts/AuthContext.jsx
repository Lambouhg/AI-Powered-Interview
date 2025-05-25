import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  useEffect(() => {
    // First check if Clerk user is available
    if (clerkLoaded) {
      if (clerkUser) {
        // If user is logged in with Clerk, use that
        setUser(clerkUser);
        setLoading(false);
      } else {
        // Fallback to localStorage if no Clerk user
        try {
          if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        } finally {
          setLoading(false);
        }
      }
    }
  }, [clerkUser, clerkLoaded]);  const login = async (credentials) => {
    try {
      // This is a fallback login for the custom auth system
      // Primarily, you should use Clerk's signIn methods
      const userData = { id: 1, ...credentials }; // Replace with actual user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    // Note: This doesn't sign out from Clerk
    // Use Clerk's signOut method for that
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    setUser(null);
    router.push('/sign-in');
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 