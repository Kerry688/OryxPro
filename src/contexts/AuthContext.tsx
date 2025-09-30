'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export interface User {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  roleId: string;
  branchId?: string;
  department: string;
  position: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  twoFactorEnabled: boolean;
  employeeId?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface Branch {
  _id: string;
  name: string;
  address: string;
}

export interface Employee {
  _id: string;
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
  };
  employmentInfo: {
    position: string;
    jobTitle: string;
  };
}

export interface AuthState {
  user: User | null;
  role: Role | null;
  branch: Branch | null;
  employee: Employee | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    branch: null,
    employee: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check if we're in the browser environment
        if (typeof window === 'undefined') {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('auth_user');

        if (token && userData) {
          setAuthState({
            user: JSON.parse(userData),
            role: JSON.parse(localStorage.getItem('auth_role') || 'null'),
            branch: JSON.parse(localStorage.getItem('auth_branch') || 'null'),
            employee: JSON.parse(localStorage.getItem('auth_employee') || 'null'),
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        const { user, token, role, branch, employee } = result.data;

        // Store auth data in localStorage (only in browser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(user));
          if (role) localStorage.setItem('auth_role', JSON.stringify(role));
          if (branch) localStorage.setItem('auth_branch', JSON.stringify(branch));
          if (employee) localStorage.setItem('auth_employee', JSON.stringify(employee));
        }

        setAuthState({
          user,
          role,
          branch,
          employee,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        toast.success('Welcome back!', {
          description: `Hello ${user.firstName} ${user.lastName}`,
        });

        return true;
      } else {
        toast.error(result.error || 'Sign in failed');
        return false;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Sign in failed. Please try again.');
      return false;
    }
  };

  const signOut = () => {
    // Clear localStorage (only in browser)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_role');
      localStorage.removeItem('auth_branch');
      localStorage.removeItem('auth_employee');
    }

    // Reset auth state
    setAuthState({
      user: null,
      role: null,
      branch: null,
      employee: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    toast.success('Signed out successfully');
    router.push('/signin');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        const { profile } = result.data;
        
        // Update localStorage (only in browser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(profile));
        }
        
        // Update auth state
        setAuthState(prev => ({
          ...prev,
          user: profile,
        }));

        toast.success('Profile updated successfully');
        return true;
      } else {
        toast.error(result.error || 'Failed to update profile');
        return false;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile. Please try again.');
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Password changed successfully');
        return true;
      } else {
        if (result.details) {
          toast.error('Password requirements not met', {
            description: result.details.join(', '),
          });
        } else {
          toast.error(result.error || 'Failed to change password');
        }
        return false;
      }
    } catch (error) {
      console.error('Change password error:', error);
      toast.error('Failed to change password. Please try again.');
      return false;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        const { profile, role, branch, employee } = result.data;
        
        // Update localStorage (only in browser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(profile));
          if (role) localStorage.setItem('auth_role', JSON.stringify(role));
          if (branch) localStorage.setItem('auth_branch', JSON.stringify(branch));
          if (employee) localStorage.setItem('auth_employee', JSON.stringify(employee));
        }

        setAuthState(prev => ({
          ...prev,
          user: profile,
          role,
          branch,
          employee,
        }));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    ...authState,
    signIn,
    signOut,
    updateProfile,
    changePassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
