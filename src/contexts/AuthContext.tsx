import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { firebaseApi } from '@/lib/firebase';

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Simple hash function for password (for demo purposes)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Generate a simple UID
function generateUid(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('timetracker_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const emailKey = email.replace(/\./g, ','); // Firebase doesn't allow dots in keys
    const userData = await firebaseApi.get<{ password: string; displayName?: string; uid: string }>(`users/${emailKey}`);
    
    if (!userData) {
      throw new Error('User not found');
    }
    
    if (userData.password !== simpleHash(password)) {
      throw new Error('Invalid password');
    }
    
    const loggedInUser: User = {
      uid: userData.uid,
      email,
      displayName: userData.displayName,
    };
    
    localStorage.setItem('timetracker_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const emailKey = email.replace(/\./g, ',');
    const existingUser = await firebaseApi.get(`users/${emailKey}`);
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const uid = generateUid();
    const newUser = {
      uid,
      email,
      displayName,
      password: simpleHash(password),
      createdAt: new Date().toISOString(),
    };
    
    await firebaseApi.put(`users/${emailKey}`, newUser);
    
    const loggedInUser: User = { uid, email, displayName };
    localStorage.setItem('timetracker_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const signOut = async () => {
    localStorage.removeItem('timetracker_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
