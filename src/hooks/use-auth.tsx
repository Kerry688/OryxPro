'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { users, roles, permissions } from '@/lib/data';
import type { User, Role, Permission } from '@/lib/data';

interface UserSession {
  user: User;
  role: Role;
  loginTime: string;
}

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (module: string, action: string) => boolean;
  hasAnyPermission: (permissionIds: string[]) => boolean;
  hasAllPermissions: (permissionIds: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const session: UserSession = JSON.parse(userSession);
        const foundUser = users.find(u => u.id === session.user.id);
        const foundRole = roles.find(r => r.id === session.user.roleId);
        
        if (foundUser && foundRole) {
          setUser(foundUser);
          setRole(foundRole);
        } else {
          // Invalid session, clear it
          localStorage.removeItem('userSession');
        }
      } catch (error) {
        // Invalid session data, clear it
        localStorage.removeItem('userSession');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Find user by username or email
      const foundUser = users.find(u => 
        u.username === username || u.email === username
      );

      if (!foundUser) {
        return false;
      }

      if (foundUser.status !== 'active') {
        return false;
      }

      // In a real app, you would verify the password hash here
      // For demo purposes, we'll accept any password with at least 6 characters
      if (password.length < 6) {
        return false;
      }

      const foundRole = roles.find(r => r.id === foundUser.roleId);
      if (!foundRole) {
        return false;
      }

      // Store user session
      const userSession: UserSession = {
        user: foundUser,
        role: foundRole,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem('userSession', JSON.stringify(userSession));
      setUser(foundUser);
      setRole(foundRole);
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('userSession');
    setUser(null);
    setRole(null);
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (!role) return false;
    
    const permission = permissions.find(p => p.module === module && p.action === action);
    if (!permission) return false;
    
    return role.permissions.includes(permission.id);
  };

  const hasAnyPermission = (permissionIds: string[]): boolean => {
    if (!role) return false;
    return permissionIds.some(id => role.permissions.includes(id));
  };

  const hasAllPermissions = (permissionIds: string[]): boolean => {
    if (!role) return false;
    return permissionIds.every(id => role.permissions.includes(id));
  };

  const value: AuthContextType = {
    user,
    role,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
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

// Permission checking hooks
export function usePermission(module: string, action: string) {
  const { hasPermission } = useAuth();
  return hasPermission(module, action);
}

export function useAnyPermission(permissionIds: string[]) {
  const { hasAnyPermission } = useAuth();
  return hasAnyPermission(permissionIds);
}

export function useAllPermissions(permissionIds: string[]) {
  const { hasAllPermissions } = useAuth();
  return hasAllPermissions(permissionIds);
}
