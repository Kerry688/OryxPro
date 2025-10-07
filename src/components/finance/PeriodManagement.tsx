'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Lock,
  Unlock,
  Settings,
  AlertTriangle,
  Clock,
  DollarSign,
  Building
} from 'lucide-react';
import { FiscalPeriod, PeriodStatus, CalendarType } from '@/lib/models/finance';

// Mock data
const mockFiscalPeriods: FiscalPeriod[] = [
  {
    id: '1',
    fiscalYear: '2024',
    periodNumber: 1,
    periodName: 'January 2024',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    status: PeriodStatus.CLOSED,
    isCurrent: false,
    calendarType: CalendarType.CALENDAR_YEAR,
    companyId: 'company1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '2',
    fiscalYear: '2024',
    periodNumber: 2,
    periodName: 'February 2024',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-29'),
    status: PeriodStatus.CLOSED,
    isCurrent: false,
    calendarType: CalendarType.CALENDAR_YEAR,
    companyId: 'company1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '3',
    fiscalYear: '2024',
    periodNumber: 3,
    periodName: 'March 2024',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-31'),
    status: PeriodStatus.CLOSED,
    isCurrent: false,
    calendarType: CalendarType.CALENDAR_YEAR,
    companyId: 'company1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '4',
    fiscalYear: '2024',
    periodNumber: 4,
    periodName: 'April 2024',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-30'),
    status: PeriodStatus.OPEN,
    isCurrent: true,
    calendarType: CalendarType.CALENDAR_YEAR,
    companyId: 'company1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '5',
    fiscalYear: '2024',
    periodNumber: 5,
    periodName: 'May 2024',
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-05-31'),
    status: PeriodStatus.OPEN,
    isCurrent: false,
    calendarType: CalendarType.CALENDAR_YEAR,
    companyId: 'company1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '6',
    fiscalYear: '2024',
    periodNumber: 6,
    periodName: 'June 2024',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-30'),
    status: PeriodStatus.OPEN,
    isCurrent: false,
    calendarType: CalendarType.CALENDAR_YEAR,
    companyId: 'company1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

export function PeriodManagement() {
  const [fiscalPeriods, setFiscalPeriods] = useState<FiscalPeriod[]>(mockFiscalPeriods);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<FiscalPeriod | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredPeriods = fiscalPeriods.filter(period => {
    const matchesSearch = 
      period.periodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      period.fiscalYear.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || period.status === statusFilter;
    const matchesYear = yearFilter === 'all' || period.fiscalYear === yearFilter;
    
    return matchesSearch && matchesStatus && matchesYear;
  });

  const getStatusBadge = (status: PeriodStatus) => {
    const configs = {
      [PeriodStatus.OPEN]: { color: 'bg-green-100 text-green-800', icon: Unlock, text: 'Open' },
      [PeriodStatus.CLOSED]: { color: 'bg-gray-100 text-gray-800', icon: Lock, text: 'Closed' },
      [PeriodStatus.LOCKED]: { color: 'bg-red-100 text-red-800', icon: Lock, text: 'Locked' }
    };

    const config = configs[status];
    if (!config) {
      return <Badge variant="secondary">Unknown</Badge>;
    }

    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getCalendarTypeBadge = (type: CalendarType) => {
    const configs = {
      [CalendarType.CALENDAR_YEAR]: { color: 'bg-blue-100 text-blue-800', text: 'Calendar Year' },
      [CalendarType.FISCAL_YEAR]: { color: 'bg-purple-100 text-purple-800', text: 'Fiscal Year' },
      [CalendarType.FOUR_FOUR_FIVE]: { color: 'bg-orange-100 text-orange-800', text: '4-4-5' },
      [CalendarType.CUSTOM]: { color: 'bg-gray-100 text-gray-800', text: 'Custom' }
    };

    const config = configs[type];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const canClose = (period: FiscalPeriod) => {
    return period.status === PeriodStatus.OPEN && !period.isCurrent;
  };

  const canOpen = (period: FiscalPeriod) => {
    return period.status === PeriodStatus.CLOSED;
  };

  const canLock = (period: FiscalPeriod) => {
    return period.status === PeriodStatus.CLOSED;
  };

  const canUnlock = (period: FiscalPeriod) => {
    return period.status === PeriodStatus.LOCKED;
  };

  const openPeriods = fiscalPeriods.filter(p => p.status === PeriodStatus.OPEN).length;
  const closedPeriods = fiscalPeriods.filter(p => p.status === PeriodStatus.CLOSED).length;
  const lockedPeriods = fiscalPeriods.filter(p => p.status === PeriodStatus.LOCKED).length;
  const currentPeriod = fiscalPeriods.find(p => p.isCurrent);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Period & Year Management</h2>
          <p className="text-muted-foreground">Manage fiscal periods and calendar settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Calendar Settings
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Period
          </Button>
        </div>
      </div>

      {/* Current Period Alert */}
      {currentPeriod && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Current Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <h4 className="font-medium text-blue-900">{currentPeriod.periodName}</h4>
                <p className="text-sm text-blue-700">
                  {currentPeriod.startDate.toLocaleDateString()} - {currentPeriod.endDate.toLocaleDateString()}
                </p>
                <p className="text-sm text-blue-700">
                  Period {currentPeriod.periodNumber} of {currentPeriod.fiscalYear}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(currentPeriod.status)}
                {getCalendarTypeBadge(currentPeriod.calendarType)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Periods</CardTitle>
            <Unlock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openPeriods}</div>
            <p className="text-xs text-muted-foreground">Available for posting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Periods</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedPeriods}</div>
            <p className="text-xs text-muted-foreground">Completed periods</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Periods</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lockedPeriods}</div>
            <p className="text-xs text-muted-foreground">Finalized periods</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Year</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPeriod?.fiscalYear || '2024'}</div>
            <p className="text-xs text-muted-foreground">Fiscal year</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Fiscal Periods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by period name or fiscal year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={PeriodStatus.OPEN}>Open</SelectItem>
                  <SelectItem value={PeriodStatus.CLOSED}>Closed</SelectItem>
                  <SelectItem value={PeriodStatus.LOCKED}>Locked</SelectItem>
                </SelectContent>
              </Select>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter by year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Periods Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Period</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Fiscal Year</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date Range</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Calendar Type</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Current</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPeriods.map((period) => (
                    <tr key={period.id} className="border-b">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{period.periodName}</div>
                          <div className="text-sm text-muted-foreground">Period {period.periodNumber}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{period.fiscalYear}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {period.startDate.toLocaleDateString()} - {period.endDate.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(period.status)}
                      </td>
                      <td className="p-4">
                        {getCalendarTypeBadge(period.calendarType)}
                      </td>
                      <td className="p-4">
                        {period.isCurrent ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Current
                          </Badge>
                        ) : (
                          <div className="text-sm text-muted-foreground">-</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPeriod(period);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canClose(period) && (
                            <Button variant="ghost" size="sm" title="Close Period">
                              <Lock className="h-4 w-4" />
                            </Button>
                          )}
                          {canOpen(period) && (
                            <Button variant="ghost" size="sm" title="Open Period">
                              <Unlock className="h-4 w-4" />
                            </Button>
                          )}
                          {canLock(period) && (
                            <Button variant="ghost" size="sm" title="Lock Period">
                              <Lock className="h-4 w-4" />
                            </Button>
                          )}
                          {canUnlock(period) && (
                            <Button variant="ghost" size="sm" title="Unlock Period">
                              <Unlock className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Period Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Period Details</DialogTitle>
            <DialogDescription>
              Complete information for period {selectedPeriod?.periodName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPeriod && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Period Name</Label>
                  <div className="text-sm font-medium">{selectedPeriod.periodName}</div>
                </div>
                <div>
                  <Label>Period Number</Label>
                  <div className="text-sm font-medium">{selectedPeriod.periodNumber}</div>
                </div>
                <div>
                  <Label>Fiscal Year</Label>
                  <div className="text-sm font-medium">{selectedPeriod.fiscalYear}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>{getStatusBadge(selectedPeriod.status)}</div>
                </div>
                <div>
                  <Label>Start Date</Label>
                  <div className="text-sm font-medium">{selectedPeriod.startDate.toLocaleDateString()}</div>
                </div>
                <div>
                  <Label>End Date</Label>
                  <div className="text-sm font-medium">{selectedPeriod.endDate.toLocaleDateString()}</div>
                </div>
                <div>
                  <Label>Calendar Type</Label>
                  <div>{getCalendarTypeBadge(selectedPeriod.calendarType)}</div>
                </div>
                <div>
                  <Label>Is Current</Label>
                  <div>
                    {selectedPeriod.isCurrent ? (
                      <Badge className="bg-blue-100 text-blue-800">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Created By</Label>
                  <div className="text-sm font-medium">{selectedPeriod.createdBy}</div>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <div className="text-sm font-medium">{selectedPeriod.updatedAt.toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              setIsEditDialogOpen(true);
            }}>
              Edit Period
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Period Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Period</DialogTitle>
            <DialogDescription>
              Create a new fiscal period
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fiscalYear">Fiscal Year</Label>
                <Input id="fiscalYear" placeholder="2024" />
              </div>
              <div>
                <Label htmlFor="periodNumber">Period Number</Label>
                <Input id="periodNumber" type="number" placeholder="1" />
              </div>
              <div>
                <Label htmlFor="periodName">Period Name</Label>
                <Input id="periodName" placeholder="January 2024" />
              </div>
              <div>
                <Label htmlFor="calendarType">Calendar Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select calendar type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CalendarType.CALENDAR_YEAR}>Calendar Year</SelectItem>
                    <SelectItem value={CalendarType.FISCAL_YEAR}>Fiscal Year</SelectItem>
                    <SelectItem value={CalendarType.FOUR_FOUR_FIVE}>4-4-5</SelectItem>
                    <SelectItem value={CalendarType.CUSTOM}>Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              Add Period
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
