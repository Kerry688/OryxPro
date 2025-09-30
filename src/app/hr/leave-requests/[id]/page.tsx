'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Calendar,
  Edit,
  Trash2,
  User,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Download,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { LeaveRequest } from '@/lib/models/leaveRequest';
import { formatDate, formatDateTime } from '@/lib/utils/date';

export default function LeaveRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);

  useEffect(() => {
    fetchLeaveRequest();
  }, []);

  const fetchLeaveRequest = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hr/leave-requests/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setLeaveRequest(data.data);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch leave request",
          variant: "destructive",
        });
        router.push('/hr/leave-requests');
      }
    } catch (error) {
      console.error('Error fetching leave request:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leave request",
        variant: "destructive",
      });
      router.push('/hr/leave-requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!leaveRequest) return;

    try {
      setActionLoading(true);
      const updateData: any = {
        status: newStatus
      };

      if (newStatus === 'approved' || newStatus === 'rejected') {
        updateData.approvedBy = 'current-user'; // TODO: Get from auth
        updateData.approvedDate = new Date();
      }

      const response = await fetch(`/api/hr/leave-requests/${leaveRequest._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Leave request ${newStatus} successfully`,
        });
        fetchLeaveRequest();
      } else {
        toast({
          title: "Error",
          description: data.error || `Failed to ${newStatus} leave request`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error ${newStatus} leave request:`, error);
      toast({
        title: "Error",
        description: `Failed to ${newStatus} leave request`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !leaveRequest) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/hr/leave-requests/${leaveRequest._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comments: [{
            comment: newComment,
            commentedBy: 'current-user', // TODO: Get from auth
            isInternal: isInternalComment
          }]
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Comment added successfully",
        });
        setNewComment('');
        setIsInternalComment(false);
        fetchLeaveRequest();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add comment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getLeaveTypeBadge = (leaveType: string) => {
    const typeColors = {
      annual: 'bg-blue-100 text-blue-800',
      sick: 'bg-red-100 text-red-800',
      personal: 'bg-purple-100 text-purple-800',
      maternity: 'bg-pink-100 text-pink-800',
      paternity: 'bg-indigo-100 text-indigo-800',
      unpaid: 'bg-gray-100 text-gray-800',
      emergency: 'bg-orange-100 text-orange-800',
      study: 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={typeColors[leaveType as keyof typeof typeColors] || 'bg-gray-100 text-gray-800'}>
        {leaveType.charAt(0).toUpperCase() + leaveType.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading leave request...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!leaveRequest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Leave Request Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested leave request could not be found.</p>
          <Button asChild>
            <Link href="/hr/leave-requests">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leave Requests
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/hr/leave-requests">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leave Requests
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{leaveRequest.requestId}</h1>
            <p className="text-muted-foreground">Leave Request Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/hr/leave-requests/${leaveRequest._id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Request Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Request ID</label>
                  <p className="text-sm font-medium">{leaveRequest.requestId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(leaveRequest.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                  <p className="text-sm font-medium flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{leaveRequest.employeeId}</span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Leave Type</label>
                  <div className="mt-1">{getLeaveTypeBadge(leaveRequest.leaveType)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="text-sm font-medium text-muted-foreground">Reason</label>
                <p className="text-sm mt-1">{leaveRequest.reason}</p>
              </div>
            </CardContent>
          </Card>

          {/* Leave Period */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Leave Period</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                  <p className="text-sm font-medium">{formatDate(leaveRequest.startDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">End Date</label>
                  <p className="text-sm font-medium">{formatDate(leaveRequest.endDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Days</label>
                  <p className="text-sm font-medium">{leaveRequest.totalDays} day{leaveRequest.totalDays !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Comments ({leaveRequest.comments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Comment */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isInternalComment}
                      onChange={(e) => setIsInternalComment(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-muted-foreground">Internal comment (not visible to employee)</span>
                  </label>
                  <Button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || actionLoading}
                    size="sm"
                  >
                    Add Comment
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              {leaveRequest.comments.length > 0 ? (
                <div className="space-y-3">
                  {leaveRequest.comments.map((comment, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      comment.isInternal ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{comment.commentedBy}</span>
                        <div className="flex items-center space-x-2">
                          {comment.isInternal && (
                            <Badge variant="outline" className="text-xs">Internal</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(comment.commentedAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet. Add the first comment above.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaveRequest.status === 'pending' && (
                <>
                  <Button 
                    className="w-full" 
                    onClick={() => handleStatusChange('approved')}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Request
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => handleStatusChange('rejected')}
                    disabled={actionLoading}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Request
                  </Button>
                </>
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/hr/leave-requests/${leaveRequest._id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Request
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Request Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Request Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(leaveRequest.appliedDate)}
                    </p>
                  </div>
                </div>
                
                {leaveRequest.approvedDate && (
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      leaveRequest.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium">
                        {leaveRequest.status === 'approved' ? 'Request Approved' : 'Request Rejected'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(leaveRequest.approvedDate)}
                      </p>
                      {leaveRequest.approvedBy && (
                        <p className="text-xs text-muted-foreground">
                          by {leaveRequest.approvedBy}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Request Info */}
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Applied Date</label>
                <p className="text-sm">{formatDateTime(leaveRequest.appliedDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created By</label>
                <p className="text-sm">{leaveRequest.systemInfo.createdBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm">{formatDateTime(leaveRequest.systemInfo.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
