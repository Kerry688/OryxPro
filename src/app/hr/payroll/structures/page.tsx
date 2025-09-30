'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Users,
  TrendingUp,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { SalaryStructure } from '@/lib/models/payroll';

export default function SalaryStructuresPage() {
  const [structures, setStructures] = useState<SalaryStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchStructures();
  }, [searchQuery, gradeFilter, levelFilter, statusFilter]);

  const fetchStructures = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (gradeFilter) params.append('grade', gradeFilter);
      if (levelFilter) params.append('level', levelFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/hr/payroll/structures?${params}`);
      const data = await response.json();

      if (data.success) {
        setStructures(data.data);
      } else {
        console.error('Error fetching salary structures:', data.error);
      }
    } catch (error) {
      console.error('Error fetching salary structures:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { className: 'bg-green-100 text-green-800 border-green-200' },
      'inactive': { className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'archived': { className: 'bg-red-100 text-red-800 border-red-200' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const calculateTotalAllowances = (allowances: any[]) => {
    return allowances.reduce((total, allowance) => {
      if (allowance.type === 'fixed') {
        return total + (allowance.amount || 0);
      } else if (allowance.type === 'percentage') {
        return total + (allowance.percentage || 0);
      }
      return total;
    }, 0);
  };

  const calculateTotalDeductions = (deductions: any[]) => {
    return deductions.reduce((total, deduction) => {
      if (deduction.type === 'fixed') {
        return total + (deduction.amount || 0);
      } else if (deduction.type === 'percentage') {
        return total + (deduction.percentage || 0);
      }
      return total;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading salary structures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Salary Structures</h1>
          <p className="text-muted-foreground">
            Manage employee salary structures, grades, and compensation packages
          </p>
        </div>
        <Button asChild>
          <Link href="/hr/payroll/structures/new">
            <Plus className="h-4 w-4 mr-2" />
            New Structure
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search structures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Input
              placeholder="Grade"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            />

            <Input
              placeholder="Level"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Structures Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Salary Structures ({structures.length})
          </CardTitle>
          <CardDescription>
            Manage all salary structures and compensation packages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {structures.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No salary structures found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first salary structure.
              </p>
              <Button asChild>
                <Link href="/hr/payroll/structures/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Structure
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Structure</TableHead>
                  <TableHead>Grade & Level</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Allowances</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Benefits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {structures.map((structure) => (
                  <TableRow key={structure.structureId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{structure.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {structure.structureId} • {structure.description.substring(0, 50)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{structure.grade}</div>
                        <div className="text-sm text-muted-foreground">{structure.level}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {structure.components.basic.amount.toLocaleString()} {structure.components.basic.currency}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          {structure.components.allowances.length} items
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="text-sm">
                          {structure.components.deductions.length} items
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">
                          {structure.benefits.healthInsurance.provided ? 'Health' : 'None'}
                          {structure.benefits.retirementPlan.provided && ', Retirement'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(structure.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hr/payroll/structures/${structure.structureId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hr/payroll/structures/${structure.structureId}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
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
      {structures.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Structures</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {structures.filter(s => s.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently in use
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Grades</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(structures.map(s => s.grade)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Different grade levels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Base Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(structures.reduce((sum, s) => sum + s.components.basic.amount, 0) / structures.length).toLocaleString()} EGP
              </div>
              <p className="text-xs text-muted-foreground">
                Across all structures
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
