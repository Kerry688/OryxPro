'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Video, 
  Phone, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { ExitInterview } from '@/lib/models/separation';

export default function ExitInterviewsPage() {
  const [interviews, setInterviews] = useState<ExitInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<ExitInterview | null>(null);
  const [showInterviewForm, setShowInterviewForm] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockInterviews: ExitInterview[] = [
        {
          interviewId: 'EINT001',
          separationId: 'SEP001',
          employeeId: 'EMP003',
          employeeName: 'Youssef El Abbasi',
          interviewerId: 'EMP002',
          interviewerName: 'Fatma Hassan',
          interviewerRole: 'HR Manager',
          
          interviewDate: new Date('2024-12-20T14:00:00'),
          interviewDuration: 45,
          interviewType: 'face_to_face',
          interviewLocation: 'HR Office',
          
          status: 'completed',
          
          questions: [
            {
              questionId: 'Q001',
              category: 'job_satisfaction',
              question: 'How would you rate your overall job satisfaction?',
              response: 'I would rate it 4 out of 5. I enjoyed my role and the team, but felt there were limited growth opportunities.',
              rating: 4,
              isRequired: true
            },
            {
              questionId: 'Q002',
              category: 'job_satisfaction',
              question: 'What did you enjoy most about your role?',
              response: 'I really enjoyed the technical challenges and working with new technologies. The team collaboration was also great.',
              rating: 5,
              isRequired: true
            },
            {
              questionId: 'Q003',
              category: 'management',
              question: 'How would you rate your relationship with your direct manager?',
              response: 'My relationship with my manager was good. They were supportive and provided regular feedback.',
              rating: 4,
              isRequired: true
            },
            {
              questionId: 'Q004',
              category: 'work_environment',
              question: 'How would you describe the work environment and culture?',
              response: 'The work environment was generally positive. Good team spirit and collaborative atmosphere.',
              rating: 4,
              isRequired: true
            },
            {
              questionId: 'Q005',
              category: 'compensation',
              question: 'How would you rate your compensation and benefits?',
              response: 'Compensation was competitive, but I felt that benefits could be improved, especially health insurance.',
              rating: 3,
              isRequired: true
            },
            {
              questionId: 'Q006',
              category: 'other',
              question: 'What are the main reasons for leaving the company?',
              response: 'I found a better opportunity with more growth potential and higher compensation.',
              rating: 0,
              isRequired: true
            },
            {
              questionId: 'Q007',
              category: 'suggestions',
              question: 'Would you recommend this company to others?',
              response: 'Yes, I would recommend it to others, especially for those starting their careers.',
              rating: 4,
              isRequired: true
            }
          ],
          
          overallSatisfaction: 4,
          wouldRecommend: true,
          mainReasonsForLeaving: ['Better opportunity', 'Career growth', 'Compensation'],
          suggestionsForImprovement: 'Consider improving the benefits package and providing more career development opportunities.',
          additionalComments: 'Overall, it was a positive experience. I learned a lot and grew professionally.',
          
          followUpActions: [
            {
              actionId: 'ACTION001',
              action: 'Review benefits package',
              assignedTo: 'EMP002',
              assignedToName: 'Fatma Hassan',
              dueDate: new Date('2025-01-15'),
              status: 'pending',
              notes: 'Consider improving health insurance and retirement benefits'
            },
            {
              actionId: 'ACTION002',
              action: 'Develop career advancement program',
              assignedTo: 'EMP009',
              assignedToName: 'Ahmed Mahmoud',
              dueDate: new Date('2025-02-01'),
              status: 'pending',
              notes: 'Create structured career development paths for all employees'
            }
          ],
          
          attachments: [],
          
          createdAt: new Date('2024-12-15T10:00:00'),
          updatedAt: new Date('2024-12-20T15:00:00'),
          createdBy: 'EMP002',
          updatedBy: 'EMP002'
        },
        {
          interviewId: 'EINT002',
          separationId: 'SEP002',
          employeeId: 'EMP004',
          employeeName: 'Mariam Hassan',
          interviewerId: 'EMP002',
          interviewerName: 'Fatma Hassan',
          interviewerRole: 'HR Manager',
          
          interviewDate: new Date('2024-12-18T10:00:00'),
          interviewDuration: 60,
          interviewType: 'video_call',
          interviewLocation: 'Microsoft Teams',
          
          status: 'scheduled',
          
          questions: [],
          
          overallSatisfaction: 0,
          wouldRecommend: false,
          mainReasonsForLeaving: [],
          suggestionsForImprovement: '',
          additionalComments: '',
          
          followUpActions: [],
          
          attachments: [],
          
          createdAt: new Date('2024-12-10T14:00:00'),
          updatedAt: new Date('2024-12-10T14:00:00'),
          createdBy: 'EMP002',
          updatedBy: 'EMP002'
        }
      ];

      setInterviews(mockInterviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'scheduled': { 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Calendar className="h-3 w-3" />
      },
      'completed': { 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-3 w-3" />
      },
      'cancelled': { 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-3 w-3" />
      },
      'rescheduled': { 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-3 w-3" />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'face_to_face':
        return <User className="h-4 w-4" />;
      case 'video_call':
        return <Video className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getInterviewTypeLabel = (type: string) => {
    switch (type) {
      case 'face_to_face':
        return 'Face to Face';
      case 'video_call':
        return 'Video Call';
      case 'phone':
        return 'Phone Call';
      case 'online_form':
        return 'Online Form';
      case 'email':
        return 'Email';
      default:
        return type;
    }
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'job_satisfaction':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'management':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'work_environment':
        return <BarChart3 className="h-4 w-4 text-green-500" />;
      case 'compensation':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'career_development':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'job_satisfaction':
        return 'Job Satisfaction';
      case 'management':
        return 'Management';
      case 'work_environment':
        return 'Work Environment';
      case 'compensation':
        return 'Compensation';
      case 'career_development':
        return 'Career Development';
      case 'company_culture':
        return 'Company Culture';
      case 'suggestions':
        return 'Suggestions';
      default:
        return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exit interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exit Interviews</h1>
          <p className="text-muted-foreground">
            Manage exit interviews and collect employee feedback
          </p>
        </div>
        <Button onClick={() => setShowInterviewForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviews.length}</div>
            <p className="text-xs text-muted-foreground">
              All time interviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {interviews.filter(i => i.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {interviews.filter(i => i.status === 'scheduled').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Upcoming interviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {interviews.filter(i => i.overallSatisfaction > 0).length > 0 
                ? Math.round(interviews.filter(i => i.overallSatisfaction > 0)
                    .reduce((sum, i) => sum + i.overallSatisfaction, 0) / 
                    interviews.filter(i => i.overallSatisfaction > 0).length * 10) / 10
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 5.0 rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interviews List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interviews Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Exit Interviews ({interviews.length})
              </CardTitle>
              <CardDescription>
                All exit interviews and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {interviews.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No exit interviews found</h3>
                  <p className="text-muted-foreground mb-4">
                    Schedule your first exit interview to get started.
                  </p>
                  <Button onClick={() => setShowInterviewForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Interviewer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interviews.map((interview) => (
                      <TableRow 
                        key={interview.interviewId}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedInterview(interview)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{interview.employeeName}</div>
                              <div className="text-sm text-muted-foreground">{interview.employeeId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{interview.interviewerName}</div>
                              <div className="text-sm text-muted-foreground">{interview.interviewerRole}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getInterviewTypeIcon(interview.interviewType)}
                            <span className="text-sm">{getInterviewTypeLabel(interview.interviewType)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatDate(interview.interviewDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(interview.status)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Interview Details */}
        <div className="lg:col-span-1">
          {selectedInterview ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Interview Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Employee</h4>
                  <p className="text-sm text-muted-foreground">{selectedInterview.employeeName}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Interviewer</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedInterview.interviewerName} ({selectedInterview.interviewerRole})
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Interview Details</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Type: {getInterviewTypeLabel(selectedInterview.interviewType)}</p>
                    <p>• Date: {formatDate(selectedInterview.interviewDate)}</p>
                    <p>• Duration: {selectedInterview.interviewDuration} minutes</p>
                    {selectedInterview.interviewLocation && (
                      <p>• Location: {selectedInterview.interviewLocation}</p>
                    )}
                  </div>
                </div>
                
                {selectedInterview.status === 'completed' && (
                  <>
                    <div className="space-y-2">
                      <h4 className="font-medium">Overall Satisfaction</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < selectedInterview.overallSatisfaction 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {selectedInterview.overallSatisfaction}/5
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Would Recommend</h4>
                      <Badge variant={selectedInterview.wouldRecommend ? 'default' : 'destructive'}>
                        {selectedInterview.wouldRecommend ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    
                    {selectedInterview.mainReasonsForLeaving.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Main Reasons for Leaving</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedInterview.mainReasonsForLeaving.map((reason, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedInterview.followUpActions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Follow-up Actions</h4>
                        <div className="space-y-2">
                          {selectedInterview.followUpActions.map((action) => (
                            <div key={action.actionId} className="p-2 bg-gray-50 rounded text-sm">
                              <div className="font-medium">{action.action}</div>
                              <div className="text-xs text-muted-foreground">
                                Assigned to: {action.assignedToName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Due: {formatDate(action.dueDate)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                <div className="pt-4 border-t">
                  <Button className="w-full" variant="outline">
                    View Full Interview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select an interview</h3>
                  <p className="text-muted-foreground">
                    Choose an interview from the list to view its details.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
