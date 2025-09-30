'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart3, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { LeaveBalance } from '@/lib/models/leave';

export default function LeaveBalancesPage() {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    fetchBalances();
  }, [searchQuery, yearFilter, leaveTypeFilter, departmentFilter]);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockBalances: LeaveBalance[] = [
        {
          balanceId: 'LB001',
          employeeId: 'EMP009',
          leaveTypeId: 'LT001',
          leaveTypeName: 'Annual Leave',
          year: 2025,
          allocatedDays: 21,
          usedDays: 5,
          pendingDays: 3,
          carriedForwardDays: 2,
          availableDays: 15,
          lastUpdated: new Date('2024-12-01')
        },
        {
          balanceId: 'LB002',
          employeeId: 'EMP009',
          leaveTypeId: 'LT002',
          leaveTypeName: 'Sick Leave',
          year: 2025,
          allocatedDays: 10,
          usedDays: 2,
          pendingDays: 0,
          carriedForwardDays: 0,
          availableDays: 8,
          lastUpdated: new Date('2024-12-01')
        },
        {
          balanceId: 'LB003',
          employeeId: 'EMP010',
          leaveTypeId: 'LT001',
          leaveTypeName: 'Annual Leave',
          year: 2025,
          allocatedDays: 21,
          usedDays: 8,
          pendingDays: 2,
          carriedForwardDays: 1,
          availableDays: 12,
          lastUpdated: new Date('2024-12-01')
        },
        {
          balanceId: 'LB004',
          employeeId: 'EMP010',
          leaveTypeId: 'LT002',
          leaveTypeName: 'Sick Leave',
          year: 2025,
          allocatedDays: 10,
          usedDays: 1,
          pendingDays: 0,
          carriedForwardDays: 0,
          availableDays: 9,
          lastUpdated: new Date('2024-12-01')
        },
        {
          balanceId: 'LB005',
          employeeId: 'EMP011',
          leaveTypeId: 'LT001',
          leaveTypeName: 'Annual Leave',
          year: 2025,
          allocatedDays: 21,
          usedDays: 15,
          pendingDays: 5,
          carriedForwardDays: 0,
          availableDays: 1,
          lastUpdated: new Date('2024-12-01')
        }
      ];

      // Apply filters
      let filteredBalances = mockBalances;
      
      if (searchQuery) {
        filteredBalances = filteredBalances.filter(balance => 
          balance.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          balance.leaveTypeName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (yearFilter) {
        filteredBalances = filteredBalances.filter(balance => 
          balance.year === parseInt(yearFilter)
        );
      }
      
      if (leaveTypeFilter) {
        filteredBalances = filteredBalances.filter(balance => 
          balance.leaveTypeId === leaveTypeFilter
        );
      }

      setBalances(filteredBalances);
    } catch (error) {
      console.error('Error fetching leave balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUtilizationPercentage = (balance: LeaveBalance) => {
    const total = balance.allocatedDays + balance.carriedForwardDays;
    const used = balance.usedDays + balance.pendingDays;
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUtilizationBadge = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-100 text-red-800 border-red-200';
    if (percentage >= 70) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leave balances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Balances</h1>
          <p className="text-muted-foreground">
            Track employee leave balances and utilization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/hr/leave/balances/update">
              <Plus className="h-4 w-4 mr-2" />
              Update Balances
            </Link>
          </Button>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search balances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Input
              type="number"
              placeholder="Year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            />

            <select
              value={leaveTypeFilter}
              onChange={(e) => setLeaveTypeFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Leave Types</option>
              <option value="LT001">Annual Leave</option>
              <option value="LT002">Sick Leave</option>
              <option value="LT003">Personal Leave</option>
              <option value="LT004">Maternity Leave</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Departments</option>
              <option value="Executive">Executive</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Balances Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Leave Balances ({balances.length})
          </CardTitle>
          <CardDescription>
            Current leave balances and utilization for {yearFilter}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {balances.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No leave balances found</h3>
              <p className="text-muted-foreground mb-4">
                No leave balances found for the selected filters.
              </p>
              <Button asChild>
                <Link href="/hr/leave/balances/update">
                  <Plus className="h-4 w-4 mr-2" />
                  Update Balances
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Allocated</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balances.map((balance) => {
                  const utilization = getUtilizationPercentage(balance);
                  return (
                    <TableRow key={balance.balanceId}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{balance.employeeId}</div>
                          <div className="text-sm text-muted-foreground">
                            Employee Name
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: '#3B82F6' }}></div>
                            <span>{balance.leaveTypeName}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="font-medium">{balance.allocatedDays}</span>
                          <div className="text-xs text-muted-foreground">days</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="font-medium text-red-600">{balance.usedDays}</span>
                          <div className="text-xs text-muted-foreground">days</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="font-medium text-yellow-600">{balance.pendingDays}</span>
                          <div className="text-xs text-muted-foreground">days</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="font-medium text-green-600">{balance.availableDays}</span>
                          <div className="text-xs text-muted-foreground">days</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className={`font-medium ${getUtilizationColor(utilization)}`}>
                            {utilization}%
                          </span>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                utilization >= 90 ? 'bg-red-500' :
                                utilization >= 70 ? 'bg-orange-500' :
                                utilization >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(utilization, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getUtilizationBadge(utilization)}`}>
                          {utilization >= 90 ? (
                            <>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Critical
                            </>
                          ) : utilization >= 70 ? (
                            <>
                              <TrendingUp className="h-3 w-3 mr-1" />
                              High
                            </>
                          ) : utilization >= 50 ? (
                            <>
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Medium
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Good
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {balances.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(balances.map(b => b.employeeId)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                With leave balances
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {balances.reduce((sum, b) => sum + b.allocatedDays, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Days allocated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Used</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {balances.reduce((sum, b) => sum + b.usedDays, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Days used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {balances.reduce((sum, b) => sum + b.availableDays, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Days available
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
