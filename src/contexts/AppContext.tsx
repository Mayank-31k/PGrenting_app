'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  provider?: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  userInquiries: any[];
  setUserInquiries: (inquiries: any[]) => void;
  showUserProfile: boolean;
  setShowUserProfile: (show: boolean) => void;
  showEditProfile: boolean;
  setShowEditProfile: (show: boolean) => void;
  showAllInquiries: boolean;
  setShowAllInquiries: (show: boolean) => void;
  editFormData: { name: string; phone: string };
  setEditFormData: (data: { name: string; phone: string }) => void;
  isUpdatingProfile: boolean;
  setIsUpdatingProfile: (updating: boolean) => void;
  authModal: 'login' | 'register' | null;
  setAuthModal: (modal: 'login' | 'register' | null) => void;
  login: (userData: User) => void;
  register: (userData: User) => void;
  logout: () => void;
  fetchUserInquiries: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userInquiries, setUserInquiries] = useState<any[]>([]);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAllInquiries, setShowAllInquiries] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', phone: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

  // Clear localStorage on app start to ensure fresh sessions
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Fetch user inquiries
  const fetchUserInquiries = useCallback(async () => {
    if (user) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No token found, cannot fetch inquiries');
          return;
        }

        console.log('Fetching inquiries for user:', user.email, 'with token length:', token.length);

        const response = await fetch(`/api/user/inquiries`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Successfully fetched inquiries:', data);
          setUserInquiries(data.inquiries || []);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch inquiries:', response.status, errorText);
          setUserInquiries([]);
        }
      } catch (error) {
        console.error('Error fetching inquiries:', error);
        setUserInquiries([]);
      }
    } else {
      console.log('No user logged in, clearing inquiries');
      setUserInquiries([]);
    }
  }, [user]);

  // Fetch inquiries when user logs in
  useEffect(() => {
    fetchUserInquiries();
  }, [fetchUserInquiries]);

  const login = useCallback((userData: User) => {
    setUser(userData);
    setAuthModal(null);
    
    // Create a simple token with user email for demo purposes
    const token = btoa(JSON.stringify({ email: userData.email, id: userData.id, timestamp: Date.now() }));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('Login successful:', userData);
    
    // Show success message
    if (userData.provider === 'google') {
      alert(`Welcome ${userData.name}! You've successfully signed in with Google.`);
    } else {
      alert(`Welcome ${userData.name}! You've successfully signed in.`);
    }
  }, []);

  const register = useCallback((userData: User) => {
    setUser(userData);
    setAuthModal(null);
    
    // Create a simple token with user email for demo purposes
    const token = btoa(JSON.stringify({ email: userData.email, id: userData.id, timestamp: Date.now() }));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('Registration successful:', userData);
    
    // Show success message
    if (userData.provider === 'google') {
      alert(`Welcome ${userData.name}! Your account has been created successfully with Google.`);
    } else {
      alert(`Welcome ${userData.name}! Your account has been created successfully.`);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setUserInquiries([]);
    setShowUserProfile(false);
    setShowEditProfile(false);
    setShowAllInquiries(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('User logged out');
  }, []);

  const value: AppContextType = {
    user,
    setUser,
    userInquiries,
    setUserInquiries,
    showUserProfile,
    setShowUserProfile,
    showEditProfile,
    setShowEditProfile,
    showAllInquiries,
    setShowAllInquiries,
    editFormData,
    setEditFormData,
    isUpdatingProfile,
    setIsUpdatingProfile,
    authModal,
    setAuthModal,
    login,
    register,
    logout,
    fetchUserInquiries
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}