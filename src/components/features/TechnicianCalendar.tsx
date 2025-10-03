'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScheduleForm } from './ScheduleForm';
import { 
  TechnicianSchedule, 
  ScheduleStatus,
  ScheduleType 
} from '@/lib/models/schedule';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Wrench,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface TechnicianCalendarProps {
  schedules: TechnicianSchedule[];
  technicians: any[];
  onScheduleCreate: (data: any) => void;
  onScheduleUpdate: (data: any) => void;
  onScheduleDelete: (schedule: TechnicianSchedule) => void;
  onScheduleView: (schedule: TechnicianSchedule) => void;
}

type ViewMode = 'month' | 'week' | 'day';

export function TechnicianCalendar({
  schedules,
  technicians,
  onScheduleCreate,
  onScheduleUpdate,
  onScheduleDelete,
  onScheduleView
}: TechnicianCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TechnicianSchedule | null>(null);
  const [hoveredSchedule, setHoveredSchedule] = useState<TechnicianSchedule | null>(null);

  // Get schedules for the current view
  const getSchedulesForDate = (date: Date) => {
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.toDateString() === date.toDateString();
    });
  };

  // Get schedules for the current week
  const getSchedulesForWeek = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate >= startDate && scheduleDate <= endDate;
    });
  };

  // Get schedules for the current month
  const getSchedulesForMonth = (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate >= startOfMonth && scheduleDate <= endOfMonth;
    });
  };

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get status color
  const getStatusColor = (status: ScheduleStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'busy':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'unavailable':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'on_break':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'off_duty':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get type color
  const getTypeColor = (type: ScheduleType) => {
    switch (type) {
      case 'work':
        return 'bg-blue-500';
      case 'break':
        return 'bg-yellow-500';
      case 'training':
        return 'bg-purple-500';
      case 'meeting':
        return 'bg-orange-500';
      case 'maintenance':
        return 'bg-gray-500';
      case 'emergency':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get status icon
  const getStatusIcon = (status: ScheduleStatus) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-3 w-3" />;
      case 'busy':
        return <Wrench className="h-3 w-3" />;
      case 'unavailable':
        return <XCircle className="h-3 w-3" />;
      case 'on_break':
        return <Clock className="h-3 w-3" />;
      case 'off_duty':
        return <XCircle className="h-3 w-3" />;
      default:
        return <AlertTriangle className="h-3 w-3" />;
    }
  };

  // Render month view
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === month;
          const isToday = day.toDateString() === new Date().toDateString();
          const daySchedules = getSchedulesForDate(day);
          
          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border border-gray-200 ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
              onClick={() => {
                setSelectedDate(day);
                if (daySchedules.length === 0) {
                  setShowForm(true);
                  setEditingSchedule(null);
                }
              }}
            >
              <div className={`text-sm font-medium ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                {day.getDate()}
              </div>
              
              <div className="mt-1 space-y-1">
                {daySchedules.slice(0, 3).map((schedule, scheduleIndex) => (
                  <div
                    key={scheduleIndex}
                    className={`text-xs p-1 rounded cursor-pointer border-l-2 ${getStatusColor(schedule.status)}`}
                    style={{ borderLeftColor: getTypeColor(schedule.type) }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onScheduleView(schedule);
                    }}
                    onMouseEnter={() => setHoveredSchedule(schedule)}
                    onMouseLeave={() => setHoveredSchedule(null)}
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(schedule.status)}
                      <span className="truncate">{schedule.title}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                    </div>
                  </div>
                ))}
                
                {daySchedules.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{daySchedules.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const weekSchedules = getSchedulesForWeek(startOfWeek);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {days.map((day, index) => (
          <div key={index} className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50">
            <div>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}</div>
            <div className="text-lg font-bold">{day.getDate()}</div>
          </div>
        ))}
        
        {/* Week content */}
        {days.map((day, index) => {
          const daySchedules = getSchedulesForDate(day);
          const isToday = day.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`min-h-[400px] p-2 border border-gray-200 ${
                isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
              }`}
              onClick={() => {
                setSelectedDate(day);
                if (daySchedules.length === 0) {
                  setShowForm(true);
                  setEditingSchedule(null);
                }
              }}
            >
              <div className="space-y-1">
                {daySchedules.map((schedule, scheduleIndex) => (
                  <div
                    key={scheduleIndex}
                    className={`text-xs p-2 rounded cursor-pointer border-l-2 ${getStatusColor(schedule.status)}`}
                    style={{ borderLeftColor: getTypeColor(schedule.type) }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onScheduleView(schedule);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(schedule.status)}
                      <span className="font-medium truncate">{schedule.title}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {schedule.technicianName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const daySchedules = getSchedulesForDate(currentDate);
    const isToday = currentDate.toDateString() === new Date().toDateString();
    
    // Generate time slots (8 AM to 8 PM)
    const timeSlots = [];
    for (let hour = 8; hour <= 20; hour++) {
      timeSlots.push(hour);
    }

    return (
      <div className="grid grid-cols-8 gap-1">
        {/* Time column */}
        <div className="p-2 text-sm font-medium text-gray-600 bg-gray-50">
          Time
        </div>
        
        {/* Day content */}
        <div className="col-span-7">
          <div className="grid grid-cols-1 gap-1">
            {timeSlots.map((hour, index) => {
              const hourSchedules = daySchedules.filter(schedule => {
                const scheduleHour = new Date(schedule.startTime).getHours();
                return scheduleHour === hour;
              });
              
              return (
                <div
                  key={index}
                  className={`min-h-[60px] p-2 border border-gray-200 ${
                    isToday ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    {hour}:00
                  </div>
                  
                  <div className="space-y-1">
                    {hourSchedules.map((schedule, scheduleIndex) => (
                      <div
                        key={scheduleIndex}
                        className={`text-xs p-2 rounded cursor-pointer border-l-2 ${getStatusColor(schedule.status)}`}
                        style={{ borderLeftColor: getTypeColor(schedule.type) }}
                        onClick={() => onScheduleView(schedule)}
                      >
                        <div className="flex items-center gap-1">
                          {getStatusIcon(schedule.status)}
                          <span className="font-medium truncate">{schedule.title}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {schedule.technicianName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">
            {viewMode === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            {viewMode === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            {viewMode === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          
          <div className="flex gap-1 border rounded-md">
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button size="sm">
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
                onSave={editingSchedule ? onScheduleUpdate : onScheduleCreate}
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

      {/* Calendar Content */}
      <Card>
        <CardContent className="p-0">
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-md">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm">Busy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-sm">On Break</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-sm">Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded"></div>
          <span className="text-sm">Off Duty</span>
        </div>
      </div>
    </div>
  );
}
