'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  RotateCcw,
  DollarSign,
  Calendar,
  User,
  Hash
} from 'lucide-react';
import { JournalEntry, JournalEntryLine, JournalEntryType, JournalEntryStatus } from '@/lib/models/finance';

// Mock data
const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    entryNumber: 'JE-2024-001',
    entryDate: new Date('2024-01-15'),
    reference: 'INV-001',
    description: 'Recording sales invoice for customer ABC Corp',
    entryType: JournalEntryType.MANUAL,
    isReversed: false,
    status: JournalEntryStatus.POSTED,
    approvedBy: 'john.doe',
    approvedDate: new Date('2024-01-15'),
    requiresApproval: true,
    companyId: 'company1',
    currency: 'USD',
    exchangeRate: 1.0,
    lines: [
      {
        id: '1-1',
        accountId: '6',
        accountCode: '1120',
        accountName: 'Accounts Receivable',
        debitAmount: 1000,
        creditAmount: 0,
        description: 'Customer invoice ABC-001',
        currency: 'USD',
        exchangeRate: 1.0
      },
      {
        id: '1-2',
        accountId: '11',
        accountCode: '4000',
        accountName: 'Income',
        debitAmount: 0,
        creditAmount: 1000,
        description: 'Sales revenue',
        currency: 'USD',
        exchangeRate: 1.0
      }
    ],
    totalDebit: 1000,
    totalCredit: 1000,
    isBalanced: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'jane.smith',
    updatedBy: 'jane.smith'
  },
  {
    id: '2',
    entryNumber: 'JE-2024-002',
    entryDate: new Date('2024-01-16'),
    reference: 'PO-001',
    description: 'Recording purchase of office supplies',
    entryType: JournalEntryType.AUTOMATED,
    isReversed: false,
    status: JournalEntryStatus.APPROVED,
    approvedBy: 'john.doe',
    approvedDate: new Date('2024-01-16'),
    requiresApproval: true,
    companyId: 'company1',
    currency: 'USD',
    exchangeRate: 1.0,
    lines: [
      {
        id: '2-1',
        accountId: '12',
        accountCode: '5000',
        accountName: 'Expenses',
        debitAmount: 150,
        creditAmount: 0,
        description: 'Office supplies expense',
        currency: 'USD',
        exchangeRate: 1.0
      },
      {
        id: '2-2',
        accountId: '9',
        accountCode: '2110',
        accountName: 'Accounts Payable',
        debitAmount: 0,
        creditAmount: 150,
        description: 'Vendor invoice SUP-001',
        currency: 'USD',
        exchangeRate: 1.0
      }
    ],
    totalDebit: 150,
    totalCredit: 150,
    isBalanced: true,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: '3',
    entryNumber: 'JE-2024-003',
    entryDate: new Date('2024-01-17'),
    reference: 'REV-001',
    description: 'Reversal of incorrect entry JE-2024-001',
    entryType: JournalEntryType.REVERSAL,
    isReversed: false,
    reversalEntryId: '1',
    status: JournalEntryStatus.DRAFT,
    requiresApproval: true,
    companyId: 'company1',
    currency: 'USD',
    exchangeRate: 1.0,
    lines: [
      {
        id: '3-1',
        accountId: '11',
        accountCode: '4000',
        accountName: 'Income',
        debitAmount: 1000,
        creditAmount: 0,
        description: 'Reversal of sales revenue',
        currency: 'USD',
        exchangeRate: 1.0
      },
      {
        id: '3-2',
        accountId: '6',
        accountCode: '1120',
        accountName: 'Accounts Receivable',
        debitAmount: 0,
        creditAmount: 1000,
        description: 'Reversal of customer invoice',
        currency: 'USD',
        exchangeRate: 1.0
      }
    ],
    totalDebit: 1000,
    totalCredit: 1000,
    isBalanced: true,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    createdBy: 'jane.smith',
    updatedBy: 'jane.smith'
  }
];

export function JournalEntries() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = 
      entry.entryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesType = typeFilter === 'all' || entry.entryType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: JournalEntryStatus) => {
    const configs = {
      [JournalEntryStatus.DRAFT]: { color: 'bg-gray-100 text-gray-800', icon: FileText },
      [JournalEntryStatus.PENDING_APPROVAL]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      [JournalEntryStatus.APPROVED]: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      [JournalEntryStatus.POSTED]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [JournalEntryStatus.REJECTED]: { color: 'bg-red-100 text-red-800', icon: XCircle },
      [JournalEntryStatus.CANCELLED]: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };

    const config = configs[status];
    if (!config) {
      return <Badge variant="secondary">Unknown</Badge>;
    }

    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getTypeBadge = (type: JournalEntryType) => {
    const configs = {
      [JournalEntryType.MANUAL]: { color: 'bg-blue-100 text-blue-800', text: 'Manual' },
      [JournalEntryType.AUTOMATED]: { color: 'bg-green-100 text-green-800', text: 'Automated' },
      [JournalEntryType.RECURRING]: { color: 'bg-purple-100 text-purple-800', text: 'Recurring' },
      [JournalEntryType.REVERSAL]: { color: 'bg-orange-100 text-orange-800', text: 'Reversal' },
      [JournalEntryType.ADJUSTMENT]: { color: 'bg-red-100 text-red-800', text: 'Adjustment' }
    };

    const config = configs[type];
    if (!config) {
      return <Badge variant="secondary">Unknown</Badge>;
    }

    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const canEdit = (entry: JournalEntry | null) => {
    if (!entry || !entry.status) return false;
    return entry.status === JournalEntryStatus.DRAFT || entry.status === JournalEntryStatus.REJECTED;
  };

  const canPost = (entry: JournalEntry | null) => {
    if (!entry || !entry.status) return false;
    return entry.status === JournalEntryStatus.APPROVED && entry.isBalanced;
  };

  const canReverse = (entry: JournalEntry | null) => {
    if (!entry || !entry.status) return false;
    return entry.status === JournalEntryStatus.POSTED && !entry.isReversed;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Journal Entries</h2>
          <p className="text-muted-foreground">Manage manual and automated journal entries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reverse Entry
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Entries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {journalEntries.filter(e => e.status === JournalEntryStatus.DRAFT).length}
            </div>
            <p className="text-xs text-muted-foreground">Pending creation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {journalEntries.filter(e => e.status === JournalEntryStatus.PENDING_APPROVAL).length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {journalEntries.filter(e => e.status === JournalEntryStatus.APPROVED).length}
            </div>
            <p className="text-xs text-muted-foreground">Ready to post</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posted Today</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {journalEntries.filter(e => 
                e.status === JournalEntryStatus.POSTED && 
                e.updatedAt.toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully posted</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Journal Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by entry number, description, reference, or creator..."
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
                  <SelectItem value={JournalEntryStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={JournalEntryStatus.PENDING_APPROVAL}>Pending Approval</SelectItem>
                  <SelectItem value={JournalEntryStatus.APPROVED}>Approved</SelectItem>
                  <SelectItem value={JournalEntryStatus.POSTED}>Posted</SelectItem>
                  <SelectItem value={JournalEntryStatus.REJECTED}>Rejected</SelectItem>
                  <SelectItem value={JournalEntryStatus.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={JournalEntryType.MANUAL}>Manual</SelectItem>
                  <SelectItem value={JournalEntryType.AUTOMATED}>Automated</SelectItem>
                  <SelectItem value={JournalEntryType.RECURRING}>Recurring</SelectItem>
                  <SelectItem value={JournalEntryType.REVERSAL}>Reversal</SelectItem>
                  <SelectItem value={JournalEntryType.ADJUSTMENT}>Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Journal Entries Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Entry Number</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Balanced</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="border-b">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{entry.entryNumber}</div>
                          {entry.reference && (
                            <div className="text-sm text-muted-foreground">Ref: {entry.reference}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {entry.entryDate.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="max-w-xs">
                          <div className="font-medium truncate">{entry.description}</div>
                          <div className="text-sm text-muted-foreground">by {entry.createdBy}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getTypeBadge(entry.entryType)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(entry.status)}
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium">
                          ${entry.totalDebit.toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4">
                        {entry.isBalanced ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Balanced
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Unbalanced
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEntry(entry);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canEdit(entry) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedEntry(entry);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {canPost(entry) && (
                            <Button variant="ghost" size="sm">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {canReverse(entry) && (
                            <Button variant="ghost" size="sm">
                              <RotateCcw className="h-4 w-4" />
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

      {/* View Journal Entry Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Journal Entry Details</DialogTitle>
            <DialogDescription>
              Complete information for entry {selectedEntry?.entryNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEntry && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Entry Details</TabsTrigger>
                <TabsTrigger value="lines">Journal Lines</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Entry Number</Label>
                    <div className="text-sm font-medium">{selectedEntry.entryNumber}</div>
                  </div>
                  <div>
                    <Label>Entry Date</Label>
                    <div className="text-sm font-medium">{selectedEntry.entryDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Label>Reference</Label>
                    <div className="text-sm font-medium">{selectedEntry.reference || 'N/A'}</div>
                  </div>
                  <div>
                    <Label>Entry Type</Label>
                    <div>{getTypeBadge(selectedEntry.entryType)}</div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div>{getStatusBadge(selectedEntry.status)}</div>
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <div className="text-sm font-medium">{selectedEntry.currency}</div>
                  </div>
                  <div>
                    <Label>Total Debit</Label>
                    <div className="text-sm font-medium">${selectedEntry.totalDebit.toLocaleString()}</div>
                  </div>
                  <div>
                    <Label>Total Credit</Label>
                    <div className="text-sm font-medium">${selectedEntry.totalCredit.toLocaleString()}</div>
                  </div>
                  <div>
                    <Label>Balanced</Label>
                    <div>
                      {selectedEntry.isBalanced ? (
                        <Badge className="bg-green-100 text-green-800">Yes</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">No</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Created By</Label>
                    <div className="text-sm font-medium">{selectedEntry.createdBy}</div>
                  </div>
                  <div className="col-span-2">
                    <Label>Description</Label>
                    <div className="text-sm font-medium">{selectedEntry.description}</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="lines" className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Account</th>
                        <th className="h-10 px-4 text-left font-medium">Description</th>
                        <th className="h-10 px-4 text-right font-medium">Debit</th>
                        <th className="h-10 px-4 text-right font-medium">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEntry.lines.map((line) => (
                        <tr key={line.id} className="border-b">
                          <td className="p-4">
                            <div>
                              <div className="font-mono text-sm">{line.accountCode}</div>
                              <div className="text-sm text-muted-foreground">{line.accountName}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">{line.description || 'N/A'}</div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="text-sm font-medium">
                              {line.debitAmount > 0 ? `$${line.debitAmount.toLocaleString()}` : '-'}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="text-sm font-medium">
                              {line.creditAmount > 0 ? `$${line.creditAmount.toLocaleString()}` : '-'}
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 font-medium">
                        <td className="p-4" colSpan={2}>
                          <div className="text-right">Total</div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="text-sm font-bold">
                            ${selectedEntry.totalDebit.toLocaleString()}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="text-sm font-bold">
                            ${selectedEntry.totalCredit.toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Created</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedEntry.createdAt.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Created by {selectedEntry.createdBy}
                    </div>
                  </div>
                  
                  {selectedEntry.approvedBy && (
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Approved</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedEntry.approvedDate?.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Approved by {selectedEntry.approvedBy}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        <span className="font-medium">Last Updated</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedEntry.updatedAt.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Updated by {selectedEntry.updatedBy}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedEntry && canEdit(selectedEntry) && (
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                setIsEditDialogOpen(true);
              }}>
                Edit Entry
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Journal Entry Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Journal Entry</DialogTitle>
            <DialogDescription>
              Create a new journal entry with debit and credit lines
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="header" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="header">Entry Header</TabsTrigger>
              <TabsTrigger value="lines">Journal Lines</TabsTrigger>
            </TabsList>
            
            <TabsContent value="header" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entryDate">Entry Date</Label>
                  <Input id="entryDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="reference">Reference</Label>
                  <Input id="reference" placeholder="Optional reference" />
                </div>
                <div>
                  <Label htmlFor="entryType">Entry Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={JournalEntryType.MANUAL}>Manual</SelectItem>
                      <SelectItem value={JournalEntryType.ADJUSTMENT}>Adjustment</SelectItem>
                      <SelectItem value={JournalEntryType.REVERSAL}>Reversal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="EGP">EGP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Enter entry description" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lines" className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Journal Lines</h4>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Line
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Account</th>
                        <th className="h-10 px-4 text-left font-medium">Description</th>
                        <th className="h-10 px-4 text-right font-medium">Debit</th>
                        <th className="h-10 px-4 text-right font-medium">Credit</th>
                        <th className="h-10 px-4 text-center font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-4">
                          <div className="text-sm text-muted-foreground">No lines added yet</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div className="font-medium">Total Debit: $0.00</div>
                  <div className="font-medium">Total Credit: $0.00</div>
                  <div className="font-medium">Balance: $0.00</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              Create Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
