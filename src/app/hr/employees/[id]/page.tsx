'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  Clock,
  User,
  Shield,
  UserPlus,
  Monitor
} from 'lucide-react';
import Link from 'next/link';
import { Employee } from '@/lib/models/employee';
import EmployeeDetailTabs from '@/components/hr/EmployeeDetailTabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Portal invitation state
  const [invitationDialogOpen, setInvitationDialogOpen] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState('');
  const [invitationMessage, setInvitationMessage] = useState('');
  const [sendingInvitation, setSendingInvitation] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchEmployee(params.id as string);
    }
  }, [params.id]);

  const fetchEmployee = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hr/employees/${id}`);
      if (response.ok) {
        const data = await response.json();
        setEmployee(data.data);
      } else {
        console.error('Failed to fetch employee');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string | undefined | null) => {
    // Handle undefined, null, or empty status
    if (!status || typeof status !== 'string') {
      status = 'inactive'; // Default to inactive if status is not provided
    }

    const statusConfig = {
      active: { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      inactive: { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' },
      terminated: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      'on-leave': { variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const getEmploymentTypeBadge = (type: string | undefined | null) => {
    // Handle undefined, null, or empty type
    if (!type || typeof type !== 'string') {
      type = 'full-time'; // Default to full-time if type is not provided
    }

    return (
      <Badge variant="outline">
        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  // Portal invitation functions
  const handleSendInvitation = () => {
    if (!employee) return;
    
    setSelectedPortal('employee_portal'); // Auto-set to employee portal
    setInvitationMessage(`Hello ${employee.personalInfo.firstName},\n\nWe're excited to invite you to join our employee portal where you can access your personal information, payslips, leave requests, and more.\n\nPlease use your employee credentials to log in.\n\nBest regards,\nHR Team`);
    setInvitationDialogOpen(true);
  };

  const handleSubmitInvitation = async () => {
    if (!employee) {
      alert('Employee information is missing');
      return;
    }

    // Always use employee portal with employee role
    const portal = 'employee_portal';
    const role = 'employee';

    setSendingInvitation(true);
    try {
      const response = await fetch('/api/users/send-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: employee.personalInfo.email,
          firstName: employee.personalInfo.firstName,
          lastName: employee.personalInfo.lastName,
          portal: portal,
          role: role,
          employeeId: employee.employeeId,
          message: invitationMessage
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Invitation sent successfully!');
        setInvitationDialogOpen(false);
        setSelectedPortal('');
        setInvitationMessage('');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setSendingInvitation(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Employee Not Found</h1>
          <p className="text-muted-foreground mb-4">The employee you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/hr/employees">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
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
            <Link href="/hr/employees">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {employee.personalInfo.firstName} {employee.personalInfo.lastName}
            </h1>
            <p className="text-muted-foreground">{employee.employeeId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(employee.employmentInfo.employmentStatus)}
          <Button variant="outline" size="sm" onClick={handleSendInvitation}>
            <UserPlus className="h-4 w-4 mr-2" />
            Portal Invitation
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/hr/employees/${employee.employeeId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Employee Detail Tabs */}
      <EmployeeDetailTabs employee={employee} />

      {/* Portal Invitation Dialog */}
      <Dialog open={invitationDialogOpen} onOpenChange={setInvitationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Send Portal Invitation</span>
            </DialogTitle>
            <DialogDescription>
              Send a portal access invitation to {employee?.personalInfo.firstName} {employee?.personalInfo.lastName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portal">Portal Access</Label>
              <div className="flex items-center justify-center p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
                <div className="text-center">
                  <Monitor className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-900">Employee Portal</h3>
                  <p className="text-sm text-blue-700">Self-service portal with employee role</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Invitation will grant access to employee self-service portal
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Invitation Message</Label>
              <Textarea
                id="message"
                value={invitationMessage}
                onChange={(e) => setInvitationMessage(e.target.value)}
                className="min-h-[120px]"
                placeholder="Enter your invitation message..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setInvitationDialogOpen(false)}
              disabled={sendingInvitation}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitInvitation}
              disabled={sendingInvitation}
            >
              {sendingInvitation ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
