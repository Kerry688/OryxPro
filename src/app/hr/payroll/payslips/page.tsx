'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Download,
  FileText,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Printer,
  Send
} from 'lucide-react';
import Link from 'next/link';

interface PayslipRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriod: {
    month: number;
    year: number;
    startDate: Date;
    endDate: Date;
  };
  grossSalary: number;
  netSalary: number;
  status: 'generated' | 'sent' | 'viewed' | 'downloaded';
  generatedDate: Date;
  sentDate?: Date;
  viewedDate?: Date;
  downloadedDate?: Date;
  payslipUrl: string;
}

export default function PayslipsPage() {
  const [payslips, setPayslips] = useState<PayslipRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchPayslips();
  }, [searchQuery, employeeFilter, monthFilter, yearFilter, statusFilter]);

  const fetchPayslips = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockPayslips: PayslipRecord[] = [
        {
          id: 'PSL001',
          employeeId: 'EMP009',
          employeeName: 'Ahmed Mahmoud',
          payPeriod: {
            month: 12,
            year: 2024,
            startDate: new Date('2024-12-01'),
            endDate: new Date('2024-12-31')
          },
          grossSalary: 35000,
          netSalary: 28000,
          status: 'viewed',
          generatedDate: new Date('2024-12-31'),
          sentDate: new Date('2024-12-31'),
          viewedDate: new Date('2025-01-02'),
          payslipUrl: '/payslips/PSL001.pdf'
        },
        {
          id: 'PSL002',
          employeeId: 'EMP010',
          employeeName: 'Fatma Hassan',
          payPeriod: {
            month: 12,
            year: 2024,
            startDate: new Date('2024-12-01'),
            endDate: new Date('2024-12-31')
          },
          grossSalary: 18000,
          netSalary: 14500,
          status: 'sent',
          generatedDate: new Date('2024-12-31'),
          sentDate: new Date('2024-12-31'),
          payslipUrl: '/payslips/PSL002.pdf'
        },
        {
          id: 'PSL003',
          employeeId: 'EMP011',
          employeeName: 'Mohamed Ali',
          payPeriod: {
            month: 12,
            year: 2024,
            startDate: new Date('2024-12-01'),
            endDate: new Date('2024-12-31')
          },
          grossSalary: 22000,
          netSalary: 17800,
          status: 'downloaded',
          generatedDate: new Date('2024-12-31'),
          sentDate: new Date('2024-12-31'),
          viewedDate: new Date('2025-01-01'),
          downloadedDate: new Date('2025-01-01'),
          payslipUrl: '/payslips/PSL003.pdf'
        }
      ];

      // Apply filters
      let filteredPayslips = mockPayslips;
      
      if (searchQuery) {
        filteredPayslips = filteredPayslips.filter(p => 
          p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (employeeFilter) {
        filteredPayslips = filteredPayslips.filter(p => 
          p.employeeId.toLowerCase().includes(employeeFilter.toLowerCase())
        );
      }
      
      if (monthFilter) {
        filteredPayslips = filteredPayslips.filter(p => 
          p.payPeriod.month === parseInt(monthFilter)
        );
      }
      
      if (yearFilter) {
        filteredPayslips = filteredPayslips.filter(p => 
          p.payPeriod.year === parseInt(yearFilter)
        );
      }
      
      if (statusFilter) {
        filteredPayslips = filteredPayslips.filter(p => p.status === statusFilter);
      }

      setPayslips(filteredPayslips);
    } catch (error) {
      console.error('Error fetching payslips:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'generated': { 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <FileText className="h-3 w-3" />
      },
      'sent': { 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Send className="h-3 w-3" />
      },
      'viewed': { 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <Eye className="h-3 w-3" />
      },
      'downloaded': { 
        className: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <Download className="h-3 w-3" />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.generated;
    
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || 'Unknown';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payslips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payslips</h1>
          <p className="text-muted-foreground">
            Generate and manage employee payslips
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Bulk Print
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate Payslips
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payslips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Input
              placeholder="Employee ID"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
            />

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month.toString()}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Status</option>
              <option value="generated">Generated</option>
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="downloaded">Downloaded</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Payslips Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payslips ({payslips.length})
          </CardTitle>
          <CardDescription>
            Manage employee payslips and distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payslips.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No payslips found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by generating your first payslips.
              </p>
              <Button asChild>
                <Link href="/hr/payroll/batches">
                  <Plus className="h-4 w-4 mr-2" />
                  Process Payroll
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Pay Period</TableHead>
                  <TableHead>Gross Salary</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payslip.employeeName}</div>
                        <div className="text-sm text-muted-foreground">
                          {payslip.employeeId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {getMonthName(payslip.payPeriod.month)} {payslip.payPeriod.year}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(payslip.payPeriod.startDate)} - {formatDate(payslip.payPeriod.endDate)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {payslip.grossSalary.toLocaleString()} EGP
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">
                          {payslip.netSalary.toLocaleString()} EGP
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(payslip.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatDate(payslip.generatedDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={payslip.payslipUrl} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={payslip.payslipUrl} download>
                            <Download className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4" />
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
      {payslips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payslips</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payslips.length}</div>
              <p className="text-xs text-muted-foreground">
                Generated payslips
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sent</CardTitle>
              <Send className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payslips.filter(p => p.status === 'sent' || p.status === 'viewed' || p.status === 'downloaded').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully sent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Viewed</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payslips.filter(p => p.status === 'viewed' || p.status === 'downloaded').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Viewed by employees
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloaded</CardTitle>
              <Download className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payslips.filter(p => p.status === 'downloaded').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Downloaded by employees
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
