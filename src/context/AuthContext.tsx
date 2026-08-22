import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, NotificationItem } from '../types/hrms';
import { storageService } from '../services/storageService';

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  notifications: NotificationItem[];
  unreadCount: number;
  login: (email: string) => boolean;
  logout: () => void;
  switchRoleUser: (userId: string) => void;
  resetDemoData: () => void;
  markAsRead: (notifId: string) => void;
  markAllAsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refreshState = () => {
    storageService.initialize();
    const users = storageService.getUsers();
    setAllUsers(users);

    const activeId = storageService.getCurrentUserId();
    const user = users.find((u) => u.id === activeId) || users[0] || null;
    setCurrentUser(user);

    if (user) {
      const userNotifs = storageService.getNotifications(user.id);
      setNotifications(userNotifs);
    }
  };

  useEffect(() => {
    refreshState();

    const handleStorageChange = () => {
      refreshState();
    };

    window.addEventListener('dayflow-storage-change', handleStorageChange);
    return () => {
      window.removeEventListener('dayflow-storage-change', handleStorageChange);
    };
  }, []);

  const login = (email: string): boolean => {
    const user = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      storageService.setCurrentUserId(user.id);
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    // For demo purposes, logging out defaults back to login screen
    setCurrentUser(null);
  };

  const switchRoleUser = (userId: string) => {
    storageService.setCurrentUserId(userId);
    const user = allUsers.find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const resetDemoData = () => {
    storageService.resetToSeed();
    refreshState();
  };

  const markAsRead = (notifId: string) => {
    storageService.markNotificationAsRead(notifId);
  };

  const markAllAsRead = () => {
    if (currentUser) {
      storageService.markAllNotificationsAsRead(currentUser.id);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        notifications,
        unreadCount,
        login,
        logout,
        switchRoleUser,
        resetDemoData,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
