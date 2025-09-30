'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
  Users,
  User,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { TrainingSchedule } from '@/lib/models/training';

export default function TrainingSchedulesPage() {
  const [schedules, setSchedules] = useState<TrainingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, [searchQuery, programFilter, statusFilter, instructorFilter]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (programFilter) params.append('programId', programFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (instructorFilter) params.append('instructor', instructorFilter);

      const response = await fetch(`/api/hr/training/schedules?${params}`);
      const data = await response.json();

      if (data.success) {
        setSchedules(data.data);
      } else {
        console.error('Error fetching training schedules:', data.error);
      }
    } catch (error) {
      console.error('Error fetching training schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'scheduled': { 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Clock className="h-3 w-3" />
      },
      'in-progress': { 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-3 w-3" />
      },
      'completed': { 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <CheckCircle className="h-3 w-3" />
      },
      'cancelled': { 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-3 w-3" />
      },
      'postponed': { 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <AlertCircle className="h-3 w-3" />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
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

  const formatTime = (time: string) => {
    return time;
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'online':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'classroom':
        return <MapPin className="h-4 w-4" />;
      case 'hybrid':
        return <div className="flex gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div><MapPin className="h-4 w-4" /></div>;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getCapacityStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'bg-red-100 text-red-800 border-red-200';
    if (percentage >= 75) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading training schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Schedules</h1>
          <p className="text-muted-foreground">
            Manage training sessions, schedules, and enrollments
          </p>
        </div>
        <Button asChild>
          <Link href="/hr/training/schedules/new">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Training
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
                placeholder="Search schedules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Input
              placeholder="Program ID"
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="postponed">Postponed</option>
            </select>

            <Input
              placeholder="Instructor name"
              value={instructorFilter}
              onChange={(e) => setInstructorFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Training Schedules ({schedules.length})
          </CardTitle>
          <CardDescription>
            Manage all training sessions and schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No training schedules found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by scheduling your first training session.
              </p>
              <Button asChild>
                <Link href="/hr/training/schedules/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Training
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.scheduleId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{schedule.programTitle}</div>
                        <div className="text-sm text-muted-foreground">
                          {schedule.scheduleId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{schedule.instructor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {schedule.instructor.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(schedule.schedule.startDate)} - {formatDate(schedule.schedule.endDate)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {schedule.schedule.sessions.length} sessions
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLocationIcon(schedule.location.type)}
                        <div>
                          <div className="capitalize">{schedule.location.type}</div>
                          {schedule.location.address && (
                            <div className="text-sm text-muted-foreground">
                              {schedule.location.room || schedule.location.address}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {schedule.currentEnrollments}/{schedule.capacity.maxParticipants}
                          </div>
                          <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getCapacityStatus(schedule.currentEnrollments, schedule.capacity.maxParticipants)}`}>
                            {Math.round((schedule.currentEnrollments / schedule.capacity.maxParticipants) * 100)}%
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hr/training/schedules/${schedule.scheduleId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hr/training/schedules/${schedule.scheduleId}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
}
