'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Settings, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  AlertTriangle,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { LeaveType } from '@/lib/models/leave';

export default function LeaveTypesPage() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('');

  useEffect(() => {
    fetchLeaveTypes();
  }, [searchQuery, categoryFilter, isActiveFilter]);

  const fetchLeaveTypes = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockLeaveTypes: LeaveType[] = [
        {
          leaveTypeId: 'LT001',
          name: 'Annual Leave',
          code: 'ANNUAL',
          description: 'Annual vacation leave for employees',
          category: 'annual',
          isPaid: true,
          maxDaysPerYear: 21,
          requiresApproval: true,
          advanceNoticeDays: 7,
          maxConsecutiveDays: 15,
          carryForward: true,
          carryForwardDays: 5,
          accrualRate: 1.75,
          color: '#3B82F6',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        {
          leaveTypeId: 'LT002',
          name: 'Sick Leave',
          code: 'SICK',
          description: 'Medical leave for illness or injury',
          category: 'sick',
          isPaid: true,
          maxDaysPerYear: 10,
          requiresApproval: false,
          advanceNoticeDays: 0,
          maxConsecutiveDays: 30,
          carryForward: false,
          accrualRate: 0.83,
          color: '#EF4444',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        {
          leaveTypeId: 'LT003',
          name: 'Personal Leave',
          code: 'PERSONAL',
          description: 'Personal time off for various reasons',
          category: 'personal',
          isPaid: true,
          maxDaysPerYear: 5,
          requiresApproval: true,
          advanceNoticeDays: 3,
          maxConsecutiveDays: 3,
          carryForward: false,
          accrualRate: 0.42,
          color: '#10B981',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        {
          leaveTypeId: 'LT004',
          name: 'Maternity Leave',
          code: 'MATERNITY',
          description: 'Leave for new mothers',
          category: 'maternity',
          isPaid: true,
          maxDaysPerYear: 90,
          requiresApproval: true,
          advanceNoticeDays: 30,
          maxConsecutiveDays: 90,
          carryForward: false,
          color: '#F59E0B',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        {
          leaveTypeId: 'LT005',
          name: 'Paternity Leave',
          code: 'PATERNITY',
          description: 'Leave for new fathers',
          category: 'paternity',
          isPaid: true,
          maxDaysPerYear: 10,
          requiresApproval: true,
          advanceNoticeDays: 14,
          maxConsecutiveDays: 10,
          carryForward: false,
          color: '#8B5CF6',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        {
          leaveTypeId: 'LT006',
          name: 'Emergency Leave',
          code: 'EMERGENCY',
          description: 'Leave for family emergencies',
          category: 'emergency',
          isPaid: false,
          maxDaysPerYear: 3,
          requiresApproval: true,
          advanceNoticeDays: 0,
          maxConsecutiveDays: 3,
          carryForward: false,
          color: '#DC2626',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        }
      ];

      // Apply filters
      let filteredTypes = mockLeaveTypes;
      
      if (searchQuery) {
        filteredTypes = filteredTypes.filter(type => 
          type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          type.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          type.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (categoryFilter) {
        filteredTypes = filteredTypes.filter(type => type.category === categoryFilter);
      }
      
      if (isActiveFilter !== '') {
        filteredTypes = filteredTypes.filter(type => type.isActive === (isActiveFilter === 'true'));
      }

      setLeaveTypes(filteredTypes);
    } catch (error) {
      console.error('Error fetching leave types:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      'annual': { className: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Annual' },
      'sick': { className: 'bg-red-100 text-red-800 border-red-200', label: 'Sick' },
      'personal': { className: 'bg-green-100 text-green-800 border-green-200', label: 'Personal' },
      'maternity': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Maternity' },
      'paternity': { className: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Paternity' },
      'emergency': { className: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Emergency' },
      'unpaid': { className: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Unpaid' },
      'other': { className: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Other' }
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.other;
    
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.label}
      </div>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'
      }`}>
        {isActive ? (
          <>
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </>
        )}
      </div>
    );
  };

  const getPaidBadge = (isPaid: boolean) => {
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        isPaid ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
      }`}>
        {isPaid ? (
          <>
            <DollarSign className="h-3 w-3 mr-1" />
            Paid
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3 mr-1" />
            Unpaid
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leave types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Types</h1>
          <p className="text-muted-foreground">
            Manage different types of leave and their configurations
          </p>
        </div>
        <Button asChild>
          <Link href="/hr/leave/types/new">
            <Plus className="h-4 w-4 mr-2" />
            New Leave Type
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leave types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Categories</option>
              <option value="annual">Annual</option>
              <option value="sick">Sick</option>
              <option value="personal">Personal</option>
              <option value="maternity">Maternity</option>
              <option value="paternity">Paternity</option>
              <option value="emergency">Emergency</option>
              <option value="unpaid">Unpaid</option>
              <option value="other">Other</option>
            </select>

            <select
              value={isActiveFilter}
              onChange={(e) => setIsActiveFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Leave Types Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Leave Types ({leaveTypes.length})
          </CardTitle>
          <CardDescription>
            Configure different types of leave available to employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leaveTypes.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No leave types found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first leave type.
              </p>
              <Button asChild>
                <Link href="/hr/leave/types/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Leave Type
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Days/Year</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Notice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveTypes.map((leaveType) => (
                  <TableRow key={leaveType.leaveTypeId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: leaveType.color }}
                        ></div>
                        <div>
                          <div className="font-medium">{leaveType.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {leaveType.code}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(leaveType.category)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {leaveType.maxDaysPerYear || 'Unlimited'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getPaidBadge(leaveType.isPaid)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {leaveType.requiresApproval ? (
                          <>
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm">Required</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Auto</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {leaveType.advanceNoticeDays || 0} days
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(leaveType.isActive)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hr/leave/types/${leaveType.leaveTypeId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hr/leave/types/${leaveType.leaveTypeId}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {leaveTypes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Types</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveTypes.length}</div>
              <p className="text-xs text-muted-foreground">
                Leave types configured
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Types</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {leaveTypes.filter(t => t.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Types</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {leaveTypes.filter(t => t.isPaid).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Paid leave types
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Require Approval</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {leaveTypes.filter(t => t.requiresApproval).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Need approval
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
