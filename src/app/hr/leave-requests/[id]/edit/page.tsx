'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { LeaveRequest, UpdateLeaveRequestDTO } from '@/lib/models/leaveRequest';
import LeaveRequestForm from '@/components/hr/LeaveRequestForm';

export default function EditLeaveRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

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

  const handleSubmit = async (data: UpdateLeaveRequestDTO) => {
    try {
      setSubmitLoading(true);
      const response = await fetch(`/api/hr/leave-requests/${leaveRequest!._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Leave request updated successfully!",
        });
        router.push(`/hr/leave-requests/${leaveRequest!._id}`);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update leave request",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating leave request:', error);
      toast({
        title: "Error",
        description: "Failed to update leave request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/hr/leave-requests/${params.id}`);
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

  // Only allow editing if status is pending
  if (leaveRequest.status !== 'pending') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cannot Edit Request</h1>
          <p className="text-muted-foreground mb-4">
            This leave request has already been {leaveRequest.status} and cannot be edited.
          </p>
          <Button asChild>
            <Link href={`/hr/leave-requests/${leaveRequest._id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Request Details
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/hr/leave-requests/${leaveRequest._id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Request Details
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Leave Request</h1>
            <p className="text-muted-foreground">Update leave request details for {leaveRequest.requestId}</p>
          </div>
        </div>
      </div>

      <LeaveRequestForm
        initialData={{
          employeeId: leaveRequest.employeeId,
          leaveType: leaveRequest.leaveType,
          startDate: leaveRequest.startDate,
          endDate: leaveRequest.endDate,
          reason: leaveRequest.reason,
          attachments: leaveRequest.attachments
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={submitLoading}
        title="Edit Leave Request Details"
        submitLabel="Update Request"
        mode="edit"
      />
    </div>
  );
}
