'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  Shield,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  Eye,
  EyeOff,
  Key,
  Activity,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Filter,
  X,
  Save,
  ArrowLeft,
  Building2,
  Briefcase,
  ShoppingCart,
  UserPlus,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { UserType, LoginPortal, UserRole } from '@/lib/models/user';
import { toast } from 'sonner';
import { UserInvitationForm } from '@/components/users/UserInvitationForm';

interface EnhancedUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userType: UserType;
  role: UserRole;
  loginPortal: LoginPortal;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  permissions?: string[];
  
  // Customer-specific fields
  customerId?: string;
  companyName?: string;
  
  // Employee-specific fields
  employeeId?: string;
  department?: string;
  position?: string;
  managerId?: string;
  
  // Additional fields
  phone?: string;
  avatar?: string;
  branchId?: string;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userType: UserType;
  role: UserRole;
  loginPortal: LoginPortal;
  password?: string;
  isActive: boolean;
  permissions: string[];
  
  // Customer-specific fields
  customerId?: string;
  companyName?: string;
  
  // Employee-specific fields
  employeeId?: string;
  department?: string;
  position?: string;
  managerId?: string;
  
  // Additional fields
  phone?: string;
  branchId?: string;
}

const mockUsers: EnhancedUser[] = [
  // ERP Users
  {
    _id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@oryxpro.com',
    username: 'admin',
    userType: UserType.ERP_USER,
    role: UserRole.ADMIN,
    loginPortal: LoginPortal.ERP_SYSTEM,
    isActive: true,
    lastLogin: new Date('2024-01-15'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    permissions: ['all'],
    phone: '+1234567890'
  },
  {
    _id: '2',
    firstName: 'Manager',
    lastName: 'User',
    email: 'manager@oryxpro.com',
    username: 'manager',
    userType: UserType.ERP_USER,
    role: UserRole.MANAGER,
    loginPortal: LoginPortal.ERP_SYSTEM,
    isActive: true,
    lastLogin: new Date('2024-01-14'),
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-14'),
    permissions: ['orders', 'products', 'customers', 'reports'],
    phone: '+1234567891'
  },
  
  // Employee Users
  {
    _id: '3',
    firstName: 'John',
    lastName: 'Employee',
    email: 'john.employee@oryxpro.com',
    username: 'john.employee',
    userType: UserType.EMPLOYEE,
    role: UserRole.EMPLOYEE,
    loginPortal: LoginPortal.EMPLOYEE_PORTAL,
    isActive: true,
    lastLogin: new Date('2024-01-13'),
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-13'),
    employeeId: 'EMP-001',
    department: 'IT',
    position: 'Software Developer',
    phone: '+1234567892'
  },
  {
    _id: '4',
    firstName: 'Sarah',
    lastName: 'HR',
    email: 'sarah.hr@oryxpro.com',
    username: 'sarah.hr',
    userType: UserType.EMPLOYEE,
    role: UserRole.HR_MANAGER,
    loginPortal: LoginPortal.EMPLOYEE_PORTAL,
    isActive: true,
    lastLogin: new Date('2024-01-12'),
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-12'),
    employeeId: 'EMP-002',
    department: 'HR',
    position: 'HR Manager',
    phone: '+1234567893'
  },
  
  // Customer Users
  {
    _id: '5',
    firstName: 'Ahmed',
    lastName: 'Customer',
    email: 'ahmed.customer@techsolutions.com',
    username: 'ahmed.customer',
    userType: UserType.CUSTOMER,
    role: UserRole.CUSTOMER,
    loginPortal: LoginPortal.CUSTOMER_PORTAL,
    isActive: true,
    lastLogin: new Date('2024-01-11'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-11'),
    customerId: 'CUST-001',
    companyName: 'Tech Solutions Ltd.',
    phone: '+1234567894'
  },
  {
    _id: '6',
    firstName: 'Fatima',
    lastName: 'Business',
    email: 'fatima.business@businesscorp.com',
    username: 'fatima.business',
    userType: UserType.CUSTOMER,
    role: UserRole.CUSTOMER_ADMIN,
    loginPortal: LoginPortal.CUSTOMER_PORTAL,
    isActive: true,
    lastLogin: new Date('2024-01-10'),
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-10'),
    customerId: 'CUST-002',
    companyName: 'Business Corp',
    phone: '+1234567895'
  }
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<EnhancedUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<EnhancedUser | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    userType: UserType.ERP_USER,
    role: UserRole.ADMIN,
    loginPortal: LoginPortal.ERP_SYSTEM,
    password: '',
    isActive: true,
    permissions: [],
    phone: ''
  });

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUserType = userTypeFilter === 'all' || user.userType === userTypeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesUserType && matchesStatus;
  });

  const getPortalConfig = (portal: LoginPortal) => {
    switch (portal) {
      case LoginPortal.ERP_SYSTEM:
        return { icon: Building2, color: 'bg-blue-100 text-blue-800', name: 'ERP System' };
      case LoginPortal.EMPLOYEE_PORTAL:
        return { icon: Users, color: 'bg-green-100 text-green-800', name: 'Employee Portal' };
      case LoginPortal.CUSTOMER_PORTAL:
        return { icon: ShoppingCart, color: 'bg-purple-100 text-purple-800', name: 'Customer Portal' };
      default:
        return { icon: Shield, color: 'bg-gray-100 text-gray-800', name: 'Unknown' };
    }
  };

  const getUserTypeConfig = (userType: UserType) => {
    switch (userType) {
      case UserType.ERP_USER:
        return { icon: Building2, color: 'bg-blue-100 text-blue-800', name: 'ERP User' };
      case UserType.EMPLOYEE:
        return { icon: Briefcase, color: 'bg-green-100 text-green-800', name: 'Employee' };
      case UserType.CUSTOMER:
        return { icon: ShoppingCart, color: 'bg-purple-100 text-purple-800', name: 'Customer' };
      default:
        return { icon: UserCheck, color: 'bg-gray-100 text-gray-800', name: 'Unknown' };
    }
  };

  const handleCreateUser = async () => {
    try {
      // Simulate API call
      const newUser: EnhancedUser = {
        _id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setUsers(prev => [newUser, ...prev]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success('User created successfully');
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    try {
      // Simulate API call
      setUsers(prev => prev.map(user => 
        user._id === selectedUser._id 
          ? { ...user, ...formData, updatedAt: new Date() }
          : user
      ));
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      resetForm();
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      // Simulate API call
      setUsers(prev => prev.filter(user => user._id !== selectedUser._id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleUserStatus = async (user: EnhancedUser) => {
    try {
      // Simulate API call
      setUsers(prev => prev.map(u => 
        u._id === user._id 
          ? { ...u, isActive: !u.isActive, updatedAt: new Date() }
          : u
      ));
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      userType: UserType.ERP_USER,
      role: UserRole.ADMIN,
      loginPortal: LoginPortal.ERP_SYSTEM,
      password: '',
      isActive: true,
      permissions: [],
      phone: ''
    });
  };

  const openEditDialog = (user: EnhancedUser) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      userType: user.userType,
      role: user.role,
      loginPortal: user.loginPortal,
      isActive: user.isActive,
      permissions: user.permissions || [],
      customerId: user.customerId,
      companyName: user.companyName,
      employeeId: user.employeeId,
      department: user.department,
      position: user.position,
      managerId: user.managerId,
      phone: user.phone,
      branchId: user.branchId
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: EnhancedUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const getRoleOptions = (userType: UserType) => {
    switch (userType) {
      case UserType.ERP_USER:
        return [
          { value: UserRole.SUPER_ADMIN, label: 'Super Admin' },
          { value: UserRole.ADMIN, label: 'Admin' },
          { value: UserRole.MANAGER, label: 'Manager' },
          { value: UserRole.BRANCH_MANAGER, label: 'Branch Manager' },
          { value: UserRole.WAREHOUSE_MANAGER, label: 'Warehouse Manager' },
          { value: UserRole.SALES_REP, label: 'Sales Rep' }
        ];
      case UserType.EMPLOYEE:
        return [
          { value: UserRole.EMPLOYEE_ADMIN, label: 'Employee Admin' },
          { value: UserRole.HR_MANAGER, label: 'HR Manager' },
          { value: UserRole.EMPLOYEE, label: 'Employee' }
        ];
      case UserType.CUSTOMER:
        return [
          { value: UserRole.CUSTOMER_ADMIN, label: 'Customer Admin' },
          { value: UserRole.CUSTOMER, label: 'Customer' }
        ];
      default:
        return [];
    }
  };

  const getPortalOptions = (userType: UserType) => {
    switch (userType) {
      case UserType.ERP_USER:
        return [
          { value: LoginPortal.ERP_SYSTEM, label: 'ERP System' },
          { value: LoginPortal.EMPLOYEE_PORTAL, label: 'Employee Portal' },
          { value: LoginPortal.CUSTOMER_PORTAL, label: 'Customer Portal' }
        ];
      case UserType.EMPLOYEE:
        return [
          { value: LoginPortal.EMPLOYEE_PORTAL, label: 'Employee Portal' }
        ];
      case UserType.CUSTOMER:
        return [
          { value: LoginPortal.CUSTOMER_PORTAL, label: 'Customer Portal' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage users, roles, and portal access across ERP, Employee, and Customer portals
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsInviteDialogOpen(true)} variant="outline" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Invite User</span>
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">ERP Users</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.userType === UserType.ERP_USER).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Employees</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.userType === UserType.EMPLOYEE).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.userType === UserType.CUSTOMER).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-600">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={UserType.ERP_USER}>ERP Users</SelectItem>
                <SelectItem value={UserType.EMPLOYEE}>Employees</SelectItem>
                <SelectItem value={UserType.CUSTOMER}>Customers</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and portal access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type & Portal</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const portalConfig = getPortalConfig(user.loginPortal);
                const userTypeConfig = getUserTypeConfig(user.userType);
                const PortalIcon = portalConfig.icon;
                const UserTypeIcon = userTypeConfig.icon;
                
                return (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.companyName && (
                            <div className="text-xs text-gray-400">{user.companyName}</div>
                          )}
                          {user.department && (
                            <div className="text-xs text-gray-400">{user.department} • {user.position}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={userTypeConfig.color}>
                          <UserTypeIcon className="h-3 w-3 mr-1" />
                          {userTypeConfig.name}
                        </Badge>
                        <Badge className={portalConfig.color}>
                          <PortalIcon className="h-3 w-3 mr-1" />
                          {portalConfig.name}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {user.isActive ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleUserStatus(user)}>
                            {user.isActive ? (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Unlock className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(user)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a new user account with appropriate role and portal access
            </DialogDescription>
          </DialogHeader>
          <UserForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateUser}
            onCancel={() => setIsCreateDialogOpen(false)}
            getRoleOptions={getRoleOptions}
            getPortalOptions={getPortalOptions}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information, role, and portal access
            </DialogDescription>
          </DialogHeader>
          <UserForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditUser}
            onCancel={() => setIsEditDialogOpen(false)}
            getRoleOptions={getRoleOptions}
            getPortalOptions={getPortalOptions}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>? 
              This action cannot be undone and will remove all user data and access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Invite User Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation email to create a new user account with appropriate role and portal access
            </DialogDescription>
          </DialogHeader>
          <UserInvitationForm 
            onSuccess={() => setIsInviteDialogOpen(false)}
            onCancel={() => setIsInviteDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// User Form Component
interface UserFormProps {
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  onSubmit: () => void;
  onCancel: () => void;
  getRoleOptions: (userType: UserType) => { value: UserRole; label: string }[];
  getPortalOptions: (userType: UserType) => { value: LoginPortal; label: string }[];
  isEdit?: boolean;
}

function UserForm({ formData, setFormData, onSubmit, onCancel, getRoleOptions, getPortalOptions, isEdit = false }: UserFormProps) {
  const handleUserTypeChange = (userType: UserType) => {
    const roleOptions = getRoleOptions(userType);
    const portalOptions = getPortalOptions(userType);
    
    setFormData(prev => ({
      ...prev,
      userType,
      role: roleOptions[0]?.value || UserRole.ADMIN,
      loginPortal: portalOptions[0]?.value || LoginPortal.ERP_SYSTEM
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="access">Access & Roles</TabsTrigger>
          <TabsTrigger value="details">Additional Details</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter username"
            />
          </div>

          {!isEdit && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
              />
            </div>
          )}

          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <div>
            <Label htmlFor="userType">User Type</Label>
            <Select value={formData.userType} onValueChange={handleUserTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserType.ERP_USER}>ERP User</SelectItem>
                <SelectItem value={UserType.EMPLOYEE}>Employee</SelectItem>
                <SelectItem value={UserType.CUSTOMER}>Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {getRoleOptions(formData.userType).map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="loginPortal">Login Portal</Label>
            <Select 
              value={formData.loginPortal} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, loginPortal: value as LoginPortal }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select portal" />
              </SelectTrigger>
              <SelectContent>
                {getPortalOptions(formData.userType).map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Active User</Label>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {formData.userType === UserType.CUSTOMER && (
            <>
              <div>
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                  id="customerId"
                  value={formData.customerId}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                  placeholder="Enter customer ID"
                />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>
            </>
          )}

          {formData.userType === UserType.EMPLOYEE && (
            <>
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                  placeholder="Enter employee ID"
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Enter department"
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Enter position"
                />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {isEdit ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </div>
  );
}
