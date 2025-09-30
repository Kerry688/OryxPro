'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DollarSign, 
  Download, 
  Eye, 
  Calendar, 
  FileText,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Payslip } from '@/lib/models/employee-portal';

export default function EmployeePayslipsPage() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [monthFilter, setMonthFilter] = useState('');

  useEffect(() => {
    // Mock employee ID - in real app, this would come from auth context
    const employeeId = 'EMP009';
    fetchPayslips(employeeId);
  }, [searchQuery, yearFilter, monthFilter]);

  const fetchPayslips = async (employeeId: string) => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockPayslips: Payslip[] = [
        {
          payslipId: 'PSL001',
          employeeId: 'EMP009',
          employeeName: 'Ahmed Mahmoud',
          payPeriod: {
            startDate: new Date('2024-12-01'),
            endDate: new Date('2024-12-31'),
            month: 12,
            year: 2024
          },
          basicSalary: 20000,
          allowances: [
            { name: 'Transportation', amount: 2000, taxable: true },
            { name: 'Housing', amount: 5000, taxable: false }
          ],
          deductions: [
            { name: 'Income Tax', amount: 3000, type: 'tax' },
            { name: 'Social Insurance', amount: 2200, type: 'insurance' },
            { name: 'Health Insurance', amount: 500, type: 'insurance' }
          ],
          overtime: {
            hours: 8,
            rate: 125,
            amount: 1000
          },
          bonuses: [
            { name: 'Performance Bonus', amount: 2000, type: 'performance' }
          ],
          grossSalary: 30000,
          netSalary: 24300,
          taxDeductions: {
            incomeTax: 3000,
            socialInsurance: 2200,
            healthInsurance: 500,
            totalTaxes: 5700
          },
          bankDetails: {
            bankName: 'National Bank of Egypt',
            accountNumber: '****1234',
            accountHolderName: 'Ahmed Mahmoud'
          },
          status: 'viewed',
          generatedDate: new Date('2024-12-31'),
          sentDate: new Date('2024-12-31'),
          viewedDate: new Date('2025-01-02'),
          payslipUrl: '/api/employee/payslips/PSL001/download',
          taxSlipUrl: '/api/employee/payslips/PSL001/tax-slip'
        },
        {
          payslipId: 'PSL002',
          employeeId: 'EMP009',
          employeeName: 'Ahmed Mahmoud',
          payPeriod: {
            startDate: new Date('2024-11-01'),
            endDate: new Date('2024-11-30'),
            month: 11,
            year: 2024
          },
          basicSalary: 20000,
          allowances: [
            { name: 'Transportation', amount: 2000, taxable: true },
            { name: 'Housing', amount: 5000, taxable: false }
          ],
          deductions: [
            { name: 'Income Tax', amount: 3000, type: 'tax' },
            { name: 'Social Insurance', amount: 2200, type: 'insurance' },
            { name: 'Health Insurance', amount: 500, type: 'insurance' }
          ],
          overtime: {
            hours: 4,
            rate: 125,
            amount: 500
          },
          bonuses: [],
          grossSalary: 27500,
          netSalary: 21800,
          taxDeductions: {
            incomeTax: 3000,
            socialInsurance: 2200,
            healthInsurance: 500,
            totalTaxes: 5700
          },
          bankDetails: {
            bankName: 'National Bank of Egypt',
            accountNumber: '****1234',
            accountHolderName: 'Ahmed Mahmoud'
          },
          status: 'downloaded',
          generatedDate: new Date('2024-11-30'),
          sentDate: new Date('2024-11-30'),
          viewedDate: new Date('2024-12-01'),
          downloadedDate: new Date('2024-12-01'),
          payslipUrl: '/api/employee/payslips/PSL002/download',
          taxSlipUrl: '/api/employee/payslips/PSL002/tax-slip'
        }
      ];

      // Apply filters
      let filteredPayslips = mockPayslips;
      
      if (yearFilter) {
        filteredPayslips = filteredPayslips.filter(payslip => 
          payslip.payPeriod.year === parseInt(yearFilter)
        );
      }
      
      if (monthFilter) {
        filteredPayslips = filteredPayslips.filter(payslip => 
          payslip.payPeriod.month === parseInt(monthFilter)
        );
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
        icon: <Clock className="h-3 w-3" />
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || 'Unknown';
  };

  const handleDownload = async (payslipId: string, type: 'payslip' | 'tax-slip') => {
    try {
      // In a real app, this would trigger the actual download
      const url = type === 'payslip' 
        ? `/api/employee/payslips/${payslipId}/download`
        : `/api/employee/payslips/${payslipId}/tax-slip`;
      
      // Mark as downloaded
      const response = await fetch('/api/employee/payslips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: 'EMP009',
          payslipId
        }),
      });
      
      if (response.ok) {
        // Simulate download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type === 'payslip' ? 'payslip' : 'tax-slip'}-${payslipId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading payslip:', error);
    }
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
          <h1 className="text-3xl font-bold">Payslips & Documents</h1>
          <p className="text-muted-foreground">
            View and download your payslips and tax documents
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              type="number"
              placeholder="Year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
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
          </div>
        </CardContent>
      </Card>

      {/* Payslips Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payslips ({payslips.length})
          </CardTitle>
          <CardDescription>
            Your payslips and tax documents for {yearFilter}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payslips.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No payslips found</h3>
              <p className="text-muted-foreground mb-4">
                No payslips found for the selected filters.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
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
                  <TableRow key={payslip.payslipId}>
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
                        <Button variant="outline" size="sm" onClick={() => handleDownload(payslip.payslipId, 'payslip')}>
                          <Download className="h-4 w-4 mr-1" />
                          Payslip
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(payslip.payslipId, 'tax-slip')}>
                          <FileText className="h-4 w-4 mr-1" />
                          Tax Slip
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

      {/* Payslip Details Modal would go here */}
      {payslips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payslips</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payslips.length}</div>
              <p className="text-xs text-muted-foreground">
                Available payslips
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Net Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {payslips[0]?.netSalary.toLocaleString()} EGP
              </div>
              <p className="text-xs text-muted-foreground">
                {getMonthName(payslips[0]?.payPeriod.month)} {payslips[0]?.payPeriod.year}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Net Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(payslips.reduce((sum, p) => sum + p.netSalary, 0) / payslips.length).toLocaleString()} EGP
              </div>
              <p className="text-xs text-muted-foreground">
                Last {payslips.length} months
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}