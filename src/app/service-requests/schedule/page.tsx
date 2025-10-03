'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScheduleForm } from '@/components/features/ScheduleForm';
import { TechnicianCalendar } from '@/components/features/TechnicianCalendar';
import { 
  TechnicianSchedule, 
  ScheduleStatus,
  ScheduleType 
} from '@/lib/models/schedule';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin, 
  Wrench, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List
} from 'lucide-react';

export default function TechnicianSchedulePage() {
  const [schedules, setSchedules] = useState<TechnicianSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<TechnicianSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [technicianFilter, setTechnicianFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<TechnicianSchedule | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<TechnicianSchedule | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [technicians, setTechnicians] = useState<any[]>([]);

  useEffect(() => {
    loadSchedules();
    loadTechnicians();
  }, [currentPage, statusFilter, typeFilter, technicianFilter]);

  useEffect(() => {
    filterSchedules();
  }, [schedules, searchQuery, statusFilter, typeFilter, technicianFilter]);

  const loadSchedules = async () => {
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
        params.append('type', typeFilter);
      }

      if (technicianFilter !== 'all') {
        params.append('technicianId', technicianFilter);
      }

      const response = await fetch(`/api/schedules?${params}`);
      const data = await response.json();

      if (data.success) {
        setSchedules(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTechnicians = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.success) {
        setTechnicians(data.data.filter((user: any) => 
          user.role === 'technician' || user.role === 'service' || user.role === 'admin'
        ));
      }
    } catch (error) {
      console.error('Error loading technicians:', error);
    }
  };

  const filterSchedules = () => {
    let filtered = schedules;

    if (searchQuery) {
      filtered = filtered.filter(schedule =>
        schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSchedules(filtered);
  };

  const handleCreateSchedule = async (data: any) => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        loadSchedules();
      } else {
        console.error('Error creating schedule:', result.error);
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handleUpdateSchedule = async (data: any) => {
    if (!editingSchedule?._id) return;

    try {
      const response = await fetch(`/api/schedules/${editingSchedule._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        setEditingSchedule(null);
        loadSchedules();
      } else {
        console.error('Error updating schedule:', result.error);
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const handleDeleteSchedule = async (schedule: TechnicianSchedule) => {
    if (!schedule._id) return;

    if (!confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    try {
      const response = await fetch(`/api/schedules/${schedule._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        loadSchedules();
      } else {
        console.error('Error deleting schedule:', result.error);
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const getStatusIcon = (status: ScheduleStatus) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'unavailable':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'on_break':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'off_duty':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ScheduleStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-blue-100 text-blue-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      case 'on_break':
        return 'bg-yellow-100 text-yellow-800';
      case 'off_duty':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: ScheduleType) => {
    switch (type) {
      case 'work':
        return 'bg-blue-100 text-blue-800';
      case 'break':
        return 'bg-yellow-100 text-yellow-800';
      case 'training':
        return 'bg-purple-100 text-purple-800';
      case 'meeting':
        return 'bg-orange-100 text-orange-800';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Technician Schedule</h1>
          <p className="text-gray-600">Manage technician schedules and availability</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 border rounded-md">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSchedule ? 'Edit Schedule' : 'Add Schedule'}
                </DialogTitle>
              </DialogHeader>
              <ScheduleForm
                schedule={editingSchedule}
                onSave={editingSchedule ? handleUpdateSchedule : handleCreateSchedule}
                onCancel={() => {
                  setShowForm(false);
                  setEditingSchedule(null);
                }}
                technicians={technicians}
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
                  placeholder="Search schedules..."
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
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                  <SelectItem value="on_break">On Break</SelectItem>
                  <SelectItem value="off_duty">Off Duty</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="break">Break</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
              <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technicians</SelectItem>
                  {technicians.map((tech) => (
                    <SelectItem key={tech._id} value={tech._id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedules Content */}
      {viewMode === 'list' ? (
        <Card>
          <CardHeader>
            <CardTitle>Schedules ({totalCount})</CardTitle>
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
                      <TableHead>Title</TableHead>
                      <TableHead>Technician</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedules.map((schedule) => (
                      <TableRow key={schedule._id?.toString()}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{schedule.title}</div>
                            {schedule.customerName && (
                              <div className="text-sm text-gray-500">{schedule.customerName}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{schedule.technicianName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(schedule.date)}</div>
                            <div className="text-gray-500">
                              {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(schedule.status)}
                            <Badge className={getStatusColor(schedule.status)}>
                              {schedule.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(schedule.type)}>
                            {schedule.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(schedule.priority)}>
                            {schedule.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {schedule.estimatedDuration} min
                            {schedule.actualDuration && (
                              <div className="text-gray-500">
                                Actual: {schedule.actualDuration} min
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedSchedule(schedule)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingSchedule(schedule);
                                setShowForm(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSchedule(schedule)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredSchedules.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No schedules found
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <TechnicianCalendar
          schedules={filteredSchedules}
          technicians={technicians}
          onScheduleCreate={handleCreateSchedule}
          onScheduleUpdate={handleUpdateSchedule}
          onScheduleDelete={handleDeleteSchedule}
          onScheduleView={setSelectedSchedule}
        />
      )}

      {/* Pagination */}
      {viewMode === 'list' && totalPages > 1 && (
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

      {/* Schedule Details Dialog */}
      {selectedSchedule && (
        <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getStatusIcon(selectedSchedule.status)}
                Schedule Details - {selectedSchedule.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Schedule Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Title</label>
                  <p className="text-sm">{selectedSchedule.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedSchedule.status)}
                    <Badge className={getStatusColor(selectedSchedule.status)}>
                      {selectedSchedule.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <Badge className={getTypeColor(selectedSchedule.type)}>
                    {selectedSchedule.type}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Priority</label>
                  <Badge className={getPriorityColor(selectedSchedule.priority)}>
                    {selectedSchedule.priority}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p className="text-sm">{formatDate(selectedSchedule.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Time</label>
                  <p className="text-sm">
                    {formatTime(selectedSchedule.startTime)} - {formatTime(selectedSchedule.endTime)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Duration</label>
                  <p className="text-sm">
                    {selectedSchedule.estimatedDuration} minutes
                    {selectedSchedule.actualDuration && (
                      <span className="text-gray-500">
                        (Actual: {selectedSchedule.actualDuration} min)
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Recurring</label>
                  <p className="text-sm">{selectedSchedule.isRecurring ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* Technician Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Technician Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Technician</label>
                    <p className="text-sm">{selectedSchedule.technicianName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Technician ID</label>
                    <p className="text-sm">{selectedSchedule.technicianId}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              {selectedSchedule.customerName && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Customer Name</label>
                      <p className="text-sm">{selectedSchedule.customerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Customer ID</label>
                      <p className="text-sm">{selectedSchedule.customerId}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Location */}
              {selectedSchedule.location && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </h3>
                  <p className="text-sm">{selectedSchedule.location}</p>
                </div>
              )}

              {/* Description */}
              {selectedSchedule.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedSchedule.description}
                  </p>
                </div>
              )}

              {/* Notes */}
              {selectedSchedule.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedSchedule.notes}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
