'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download,
  MapPin,
  Flag,
  Star,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { Holiday } from '@/lib/models/leave';

export default function LeaveCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  useEffect(() => {
    fetchHolidays();
  }, [currentDate]);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      
      // Mock holiday data for Egypt
      const mockHolidays: Holiday[] = [
        {
          holidayId: 'HOL001',
          name: 'New Year\'s Day',
          description: 'New Year celebration',
          date: new Date('2025-01-01'),
          type: 'national',
          country: 'Egypt',
          isRecurring: true,
          recurringPattern: 'yearly',
          isActive: true,
          isPublicHoliday: true,
          workDayCompensation: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          holidayId: 'HOL002',
          name: 'Coptic Christmas',
          description: 'Orthodox Christmas',
          date: new Date('2025-01-07'),
          type: 'religious',
          country: 'Egypt',
          isRecurring: true,
          recurringPattern: 'yearly',
          isActive: true,
          isPublicHoliday: true,
          workDayCompensation: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          holidayId: 'HOL003',
          name: 'Revolution Day',
          description: 'January 25 Revolution',
          date: new Date('2025-01-25'),
          type: 'national',
          country: 'Egypt',
          isRecurring: true,
          recurringPattern: 'yearly',
          isActive: true,
          isPublicHoliday: true,
          workDayCompensation: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          holidayId: 'HOL004',
          name: 'Labor Day',
          description: 'International Workers\' Day',
          date: new Date('2025-05-01'),
          type: 'national',
          country: 'Egypt',
          isRecurring: true,
          recurringPattern: 'yearly',
          isActive: true,
          isPublicHoliday: true,
          workDayCompensation: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          holidayId: 'HOL005',
          name: 'Revolution Day',
          description: 'July 23 Revolution',
          date: new Date('2025-07-23'),
          type: 'national',
          country: 'Egypt',
          isRecurring: true,
          recurringPattern: 'yearly',
          isActive: true,
          isPublicHoliday: true,
          workDayCompensation: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      setHolidays(mockHolidays);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHolidayTypeIcon = (type: string) => {
    switch (type) {
      case 'national':
        return <Flag className="h-4 w-4" />;
      case 'religious':
        return <Star className="h-4 w-4" />;
      case 'regional':
        return <MapPin className="h-4 w-4" />;
      case 'company':
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getHolidayTypeColor = (type: string) => {
    switch (type) {
      case 'national':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'religious':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'regional':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'company':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getHolidaysForDate = (date: Date) => {
    return holidays.filter(holiday => 
      holiday.date.toDateString() === date.toDateString()
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Holiday Calendar</h1>
          <p className="text-muted-foreground">
            View and manage company holidays and events
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/hr/leave/holidays/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Holiday
            </Link>
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((date, index) => {
              if (!date) {
                return <div key={index} className="p-2 h-16"></div>;
              }
              
              const dayHolidays = getHolidaysForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  className={`p-2 h-16 border rounded-lg ${
                    isToday ? 'bg-blue-100 border-blue-300' : 'bg-background border-border'
                  }`}
                >
                  <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
                    {date.getDate()}
                  </div>
                  {dayHolidays.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {dayHolidays.slice(0, 2).map((holiday) => (
                        <div
                          key={holiday.holidayId}
                          className={`text-xs px-1 py-0.5 rounded text-white truncate ${
                            holiday.type === 'national' ? 'bg-blue-500' :
                            holiday.type === 'religious' ? 'bg-purple-500' :
                            holiday.type === 'regional' ? 'bg-green-500' :
                            'bg-orange-500'
                          }`}
                          title={holiday.name}
                        >
                          {holiday.name}
                        </div>
                      ))}
                      {dayHolidays.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayHolidays.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Holidays */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Holidays
          </CardTitle>
          <CardDescription>
            Next 30 days holidays and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {holidays
              .filter(holiday => {
                const holidayDate = new Date(holiday.date);
                const today = new Date();
                const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                return holidayDate >= today && holidayDate <= thirtyDaysFromNow;
              })
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((holiday) => (
                <div key={holiday.holidayId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getHolidayTypeColor(holiday.type)}`}>
                      {getHolidayTypeIcon(holiday.type)}
                    </div>
                    <div>
                      <div className="font-medium">{holiday.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(new Date(holiday.date))}
                      </div>
                      {holiday.description && (
                        <div className="text-xs text-muted-foreground">
                          {holiday.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getHolidayTypeColor(holiday.type)}`}>
                      {holiday.type.charAt(0).toUpperCase() + holiday.type.slice(1)}
                    </div>
                    {holiday.isPublicHoliday && (
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200">
                        Public Holiday
                      </div>
                    )}
                  </div>
                </div>
              ))}
            
            {holidays.filter(holiday => {
              const holidayDate = new Date(holiday.date);
              const today = new Date();
              const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
              return holidayDate >= today && holidayDate <= thirtyDaysFromNow;
            }).length === 0 && (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming holidays</h3>
                <p className="text-muted-foreground mb-4">
                  No holidays scheduled for the next 30 days.
                </p>
                <Button asChild>
                  <Link href="/hr/leave/holidays/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Holiday
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Holiday Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Holidays</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holidays.length}</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Holidays</CardTitle>
            <Flag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {holidays.filter(h => h.isPublicHoliday).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Official holidays
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">National</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {holidays.filter(h => h.type === 'national').length}
            </div>
            <p className="text-xs text-muted-foreground">
              National holidays
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Religious</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {holidays.filter(h => h.type === 'religious').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Religious holidays
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
