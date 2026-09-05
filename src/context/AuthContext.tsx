import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: UserProfile | null;
  allUsers: any[];
  isLoading: boolean;
  login: (userId?: string, role?: 'employee' | 'admin') => Promise<void>;
  logout: () => void;
  switchUser: (userId: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  const refreshUser = async () => {
    try {
      const user = await api.getMe();
      setCurrentUser(user);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const [me, users] = await Promise.all([api.getMe(), api.getAllUsers()]);
        setCurrentUser(me);
        setAllUsers(users);
      } catch (err) {
        console.error('Failed to init auth:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const login = async (userId?: string, role?: 'employee' | 'admin') => {
    setIsLoading(true);
    try {
      const user = await api.login(userId, role);
      setCurrentUser(user);
      showToast(`Welcome, ${user.name} (${user.designation})`);
    } catch (err) {
      console.error('Login error:', err);
      showToast('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Switch to landing or default
    showToast('Logged out of session');
  };

  const switchUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const user = await api.switchUser(userId);
      setCurrentUser(user);
      showToast(`Switched active profile to ${user.name} (${user.designation})`);
    } catch (err) {
      console.error('Switch user error:', err);
      showToast('Failed to switch user.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const updated = await api.updateProfile(data);
      setCurrentUser(updated);
      showToast('Profile and competencies successfully updated in database!');
    } catch (err) {
      console.error('Update profile error:', err);
      showToast('Failed to update profile.');
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isLoading,
        login,
        logout,
        switchUser,
        updateProfile,
        refreshUser,
        isAdmin,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
