'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WarrantyClaimForm } from '@/components/features/WarrantyClaimForm';
import { 
  WarrantyClaim, 
  ClaimStatus,
  ClaimType 
} from '@/lib/models/warranty-client';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Package
} from 'lucide-react';

export default function WarrantyClaimsPage() {
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<WarrantyClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(null);
  const [editingClaim, setEditingClaim] = useState<WarrantyClaim | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadClaims();
  }, [currentPage, statusFilter, typeFilter, priorityFilter]);

  useEffect(() => {
    filterClaims();
  }, [claims, searchQuery, statusFilter, typeFilter, priorityFilter]);

  const loadClaims = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        params.append('claimType', typeFilter);
      }

      if (priorityFilter !== 'all') {
        params.append('priority', priorityFilter);
      }

      const response = await fetch(`/api/warranties/claims?${params}`);
      const data = await response.json();

      if (data.success) {
        setClaims(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
      }
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterClaims = () => {
    let filtered = claims;

    if (searchQuery) {
      filtered = filtered.filter(claim =>
        claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.issueDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredClaims(filtered);
  };

  const handleCreateClaim = async (data: any) => {
    try {
      const response = await fetch('/api/warranties/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        loadClaims();
      } else {
        console.error('Error creating claim:', result.error);
      }
    } catch (error) {
      console.error('Error creating claim:', error);
    }
  };

  const handleUpdateClaim = async (data: any) => {
    if (!editingClaim?._id) return;

    try {
      const response = await fetch(`/api/warranties/claims/${editingClaim._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        setEditingClaim(null);
        loadClaims();
      } else {
        console.error('Error updating claim:', result.error);
      }
    } catch (error) {
      console.error('Error updating claim:', error);
    }
  };

  const handleDeleteClaim = async (claim: WarrantyClaim) => {
    if (!claim._id) return;

    if (!confirm('Are you sure you want to delete this claim?')) {
      return;
    }

    try {
      const response = await fetch(`/api/warranties/claims/${claim._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        loadClaims();
      } else {
        console.error('Error deleting claim:', result.error);
      }
    } catch (error) {
      console.error('Error deleting claim:', error);
    }
  };

  const getStatusIcon = (status: ClaimStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'major':
        return 'bg-orange-100 text-orange-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'minor':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Warranty Claims</h1>
          <p className="text-gray-600">Manage warranty claims and resolutions</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Claim
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingClaim ? 'Edit Warranty Claim' : 'Create Warranty Claim'}
                </DialogTitle>
              </DialogHeader>
              <WarrantyClaimForm
                claim={editingClaim}
                onSave={editingClaim ? handleUpdateClaim : handleCreateClaim}
                onCancel={() => {
                  setShowForm(false);
                  setEditingClaim(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search claims..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="defect">Defect</SelectItem>
                  <SelectItem value="malfunction">Malfunction</SelectItem>
                  <SelectItem value="damage">Damage</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle>Warranty Claims ({totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim Number</TableHead>
                    <TableHead>Warranty</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.map((claim) => (
                    <TableRow key={claim._id?.toString()}>
                      <TableCell className="font-medium">
                        {claim.claimNumber}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">Warranty Card</div>
                          <div className="text-gray-500">ID: {claim.warrantyCardId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {claim.issueDescription}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(claim.status)}
                          <Badge className={getStatusColor(claim.status)}>
                            {claim.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(claim.priority)}>
                          {claim.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(claim.severity)}>
                          {claim.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(claim.reportedDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedClaim(claim)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingClaim(claim);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClaim(claim)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredClaims.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No warranty claims found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Claim Details Dialog */}
      {selectedClaim && (
        <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getStatusIcon(selectedClaim.status)}
                Claim Details - {selectedClaim.claimNumber}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Claim Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Claim Number</label>
                  <p className="text-sm">{selectedClaim.claimNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedClaim.status)}
                    <Badge className={getStatusColor(selectedClaim.status)}>
                      {selectedClaim.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Priority</label>
                  <Badge className={getPriorityColor(selectedClaim.priority)}>
                    {selectedClaim.priority}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Severity</label>
                  <Badge className={getSeverityColor(selectedClaim.severity)}>
                    {selectedClaim.severity}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Reported Date</label>
                  <p className="text-sm">{new Date(selectedClaim.reportedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Claim Type</label>
                  <p className="text-sm">{selectedClaim.claimType}</p>
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <label className="text-sm font-medium text-gray-600">Issue Description</label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                  {selectedClaim.issueDescription}
                </p>
              </div>

              {/* Evidence */}
              {selectedClaim.evidence && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Evidence</label>
                  <div className="mt-2 space-y-2">
                    {selectedClaim.evidence.photos && selectedClaim.evidence.photos.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Photos:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedClaim.evidence.photos.map((photo, index) => (
                            <Badge key={index} variant="secondary">{photo}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedClaim.evidence.documents && selectedClaim.evidence.documents.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Documents:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedClaim.evidence.documents.map((doc, index) => (
                            <Badge key={index} variant="outline">{doc}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedClaim.evidence.videos && selectedClaim.evidence.videos.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Videos:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedClaim.evidence.videos.map((video, index) => (
                            <Badge key={index} variant="destructive">{video}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resolution */}
              {selectedClaim.resolution && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Resolution</label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm"><span className="font-medium">Type:</span> {selectedClaim.resolution.type}</p>
                        <p className="text-sm"><span className="font-medium">Cost:</span> ${selectedClaim.resolution.cost}</p>
                      </div>
                      <div>
                        <p className="text-sm"><span className="font-medium">Approved By:</span> {selectedClaim.resolution.approvedBy || 'N/A'}</p>
                        <p className="text-sm"><span className="font-medium">Approved Date:</span> {selectedClaim.resolution.approvedDate ? new Date(selectedClaim.resolution.approvedDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm"><span className="font-medium">Description:</span></p>
                      <p className="text-sm mt-1">{selectedClaim.resolution.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
