'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { UserType, LoginPortal, UserRole } from '@/lib/models/user';

export interface User {
  _id?: string;
  userId?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: UserType;
  role: UserRole;
  loginPortal: LoginPortal;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  roleId?: string;
  branchId?: string;
  department?: string;
  position?: string;
  isActive: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  employeeId?: string;
  customerId?: string;
  companyName?: string;
  lastLoginAt?: string;
  lastLogin?: Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  permissions?: string[];
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
  login: (email: string, password: string, portal: LoginPortal, rememberMe?: boolean) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  getRedirectUrl: () => string;
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


  const login = async (email: string, password: string, portal: LoginPortal, rememberMe: boolean = false): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, portal, rememberMe }),
      });

      const result = await response.json();

      if (result.success) {
        const { user, token, redirectUrl } = result;

        // Store auth data in localStorage (only in browser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Set cookie for middleware
          document.cookie = `token=${token}; path=/; ${rememberMe ? 'max-age=604800' : ''}`;
        }

        setAuthState({
          user,
          role: null,
          branch: null,
          employee: null,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        toast.success('Welcome back!', {
          description: `Hello ${user.firstName} ${user.lastName}`,
        });

        // Redirect to the appropriate portal
        router.push(redirectUrl);
        return true;
      } else if (result.mustResetPassword) {
        // Handle password reset requirement
        toast.error('Password reset required', {
          description: result.message,
        });
        
        // Redirect to password reset page with token
        router.push(`/reset-password?token=${result.resetToken}`);
        return false;
      } else {
        toast.error(result.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
      return false;
    }
  };

  const signOut = async () => {
    try {
      // Call signout API to clear server-side session
      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Signout API error:', error);
      // Continue with client-side cleanup even if API fails
    }

    // Clear localStorage (only in browser)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_role');
      localStorage.removeItem('auth_branch');
      localStorage.removeItem('auth_employee');
      
      // Clear cookies
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
    router.push('/login');
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

  const getRedirectUrl = (): string => {
    if (!authState.user) return '/login';
    
    switch (authState.user.userType) {
      case UserType.EMPLOYEE:
        return '/employee';
      case UserType.CUSTOMER:
        return '/customer-portal';
      case UserType.ERP_USER:
        return '/';
      default:
        return '/login';
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signOut,
    updateProfile,
    changePassword,
    refreshUser,
    getRedirectUrl,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
