'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Search, 
  Filter,
  AlertTriangle,
  Info,
  Calendar,
  User,
  FileText,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { Announcement } from '@/lib/models/employee-portal';

export default function EmployeeAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    // Mock employee ID - in real app, this would come from auth context
    const employeeId = 'EMP009';
    fetchAnnouncements(employeeId);
  }, [searchQuery, typeFilter, priorityFilter]);

  const fetchAnnouncements = async (employeeId: string) => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockAnnouncements: Announcement[] = [
        {
          announcementId: 'ANN001',
          title: 'Holiday Schedule 2025',
          content: 'Please find attached the complete holiday schedule for 2025. All employees are required to plan their leave requests accordingly. The schedule includes both national holidays and company-specific holidays.',
          type: 'general',
          priority: 'urgent',
          targetAudience: {
            allEmployees: true,
            departments: [],
            positions: [],
            specificEmployees: []
          },
          authorId: 'EMP009',
          authorName: 'Ahmed Mahmoud',
          authorRole: 'CEO',
          attachments: [
            {
              name: 'Holiday_Schedule_2025.pdf',
              url: '/attachments/holiday-schedule-2025.pdf',
              type: 'application/pdf',
              size: 1024000
            }
          ],
          publishDate: new Date('2024-12-15'),
          isActive: true,
          readBy: [],
          isRead: false,
          createdAt: new Date('2024-12-15'),
          updatedAt: new Date('2024-12-15')
        },
        {
          announcementId: 'ANN002',
          title: 'New HR Policies Update',
          content: 'We have updated our HR policies effective January 1, 2025. The changes include updates to leave policies, remote work guidelines, and performance review processes. Please review the updated policies in the employee handbook.',
          type: 'policy',
          priority: 'high',
          targetAudience: {
            allEmployees: true,
            departments: [],
            positions: [],
            specificEmployees: []
          },
          authorId: 'EMP012',
          authorName: 'Nora El Sharif',
          authorRole: 'HR Manager',
          attachments: [
            {
              name: 'HR_Policies_2025.pdf',
              url: '/attachments/hr-policies-2025.pdf',
              type: 'application/pdf',
              size: 2048000
            }
          ],
          publishDate: new Date('2024-12-10'),
          isActive: true,
          readBy: ['EMP009'],
          isRead: true,
          createdAt: new Date('2024-12-10'),
          updatedAt: new Date('2024-12-10')
        },
        {
          announcementId: 'ANN003',
          title: 'Company All-Hands Meeting',
          content: 'Join us for our quarterly all-hands meeting on January 15, 2025, at 2:00 PM in the main conference room. We will discuss company performance, upcoming projects, and Q&A session. Light refreshments will be provided.',
          type: 'event',
          priority: 'medium',
          targetAudience: {
            allEmployees: true,
            departments: [],
            positions: [],
            specificEmployees: []
          },
          authorId: 'EMP009',
          authorName: 'Ahmed Mahmoud',
          authorRole: 'CEO',
          attachments: [],
          publishDate: new Date('2024-12-05'),
          isActive: true,
          readBy: ['EMP009'],
          isRead: true,
          createdAt: new Date('2024-12-05'),
          updatedAt: new Date('2024-12-05')
        },
        {
          announcementId: 'ANN004',
          title: 'IT System Maintenance',
          content: 'Scheduled system maintenance will occur on January 10, 2025, from 10:00 PM to 2:00 AM. During this time, all systems including email, HR portal, and file servers will be temporarily unavailable. Please plan accordingly.',
          type: 'general',
          priority: 'high',
          targetAudience: {
            allEmployees: true,
            departments: [],
            positions: [],
            specificEmployees: []
          },
          authorId: 'EMP013',
          authorName: 'Youssef El Abbasi',
          authorRole: 'IT Specialist',
          attachments: [],
          publishDate: new Date('2024-12-01'),
          isActive: true,
          readBy: [],
          isRead: false,
          createdAt: new Date('2024-12-01'),
          updatedAt: new Date('2024-12-01')
        }
      ];

      // Apply filters
      let filteredAnnouncements = mockAnnouncements;
      
      if (searchQuery) {
        filteredAnnouncements = filteredAnnouncements.filter(announcement => 
          announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          announcement.authorName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (typeFilter) {
        filteredAnnouncements = filteredAnnouncements.filter(announcement => 
          announcement.type === typeFilter
        );
      }
      
      if (priorityFilter) {
        filteredAnnouncements = filteredAnnouncements.filter(announcement => 
          announcement.priority === priorityFilter
        );
      }

      setAnnouncements(filteredAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'general': { className: 'bg-blue-100 text-blue-800 border-blue-200', label: 'General' },
      'department': { className: 'bg-green-100 text-green-800 border-green-200', label: 'Department' },
      'urgent': { className: 'bg-red-100 text-red-800 border-red-200', label: 'Urgent' },
      'policy': { className: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Policy' },
      'event': { className: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Event' }
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.general;
    
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.label}
      </div>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'low': { 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Info className="h-3 w-3" />
      },
      'medium': { 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Bell className="h-3 w-3" />
      },
      'high': { 
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: <AlertTriangle className="h-3 w-3" />
      },
      'urgent': { 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertTriangle className="h-3 w-3" />
      }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.icon}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const markAsRead = async (announcementId: string) => {
    try {
      // In a real app, this would call the API
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement.announcementId === announcementId 
            ? { ...announcement, isRead: true }
            : announcement
        )
      );
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">
            Stay updated with company news and important information
          </p>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Types</option>
              <option value="general">General</option>
              <option value="department">Department</option>
              <option value="urgent">Urgent</option>
              <option value="policy">Policy</option>
              <option value="event">Event</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No announcements found</h3>
                <p className="text-muted-foreground">
                  No announcements match your current filters.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.announcementId} className={`${!announcement.isRead ? 'border-blue-200 bg-blue-50' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      {!announcement.isRead && (
                        <Badge variant="default" className="bg-blue-600">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeBadge(announcement.type)}
                      {getPriorityBadge(announcement.priority)}
                    </div>
                    <CardDescription className="text-sm">
                      By {announcement.authorName} • {announcement.authorRole} • {formatDate(announcement.publishDate)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed">
                    {announcement.content}
                  </p>
                  
                  {announcement.attachments && announcement.attachments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Attachments:</h4>
                      <div className="space-y-1">
                        {announcement.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{attachment.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({formatFileSize(attachment.size)})
                            </span>
                            <Button variant="outline" size="sm" className="ml-auto">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      {announcement.isRead ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">Read</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-blue-600">
                          <EyeOff className="h-4 w-4" />
                          <span className="text-sm">Unread</span>
                        </div>
                      )}
                    </div>
                    {!announcement.isRead && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAsRead(announcement.announcementId)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {announcements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{announcements.length}</div>
              <p className="text-xs text-muted-foreground">
                Available announcements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <EyeOff className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {announcements.filter(a => !a.isRead).length}
              </div>
              <p className="text-xs text-muted-foreground">
                New announcements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {announcements.filter(a => a.priority === 'urgent').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Urgent announcements
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}