'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Building2,
  Calendar,
  FileText,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { ClearanceChecklist } from '@/lib/models/separation';

export default function ClearanceProcessPage() {
  const [checklists, setChecklists] = useState<ClearanceChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChecklist, setSelectedChecklist] = useState<ClearanceChecklist | null>(null);

  useEffect(() => {
    fetchChecklists();
  }, []);

  const fetchChecklists = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockChecklists: ClearanceChecklist[] = [
        {
          checklistId: 'CLEAR001',
          separationId: 'SEP001',
          employeeId: 'EMP003',
          employeeName: 'Youssef El Abbasi',
          
          categories: [
            {
              categoryId: 'CAT001',
              categoryName: 'IT Assets & Access',
              items: [
                {
                  itemId: 'ITEM001',
                  itemName: 'Laptop Return',
                  description: 'Return company laptop and accessories',
                  department: 'IT',
                  responsiblePerson: 'IT_ADMIN',
                  responsiblePersonName: 'IT Administrator',
                  status: 'completed',
                  dueDate: new Date('2024-12-22'),
                  completedDate: new Date('2024-12-20'),
                  comments: 'Laptop returned in good condition'
                },
                {
                  itemId: 'ITEM002',
                  itemName: 'Desktop Computer',
                  description: 'Return desktop computer and peripherals',
                  department: 'IT',
                  responsiblePerson: 'IT_ADMIN',
                  responsiblePersonName: 'IT Administrator',
                  status: 'not_applicable',
                  dueDate: new Date('2024-12-22'),
                  comments: 'Employee did not have desktop computer'
                },
                {
                  itemId: 'ITEM003',
                  itemName: 'Mobile Device',
                  description: 'Return company mobile device',
                  department: 'IT',
                  responsiblePerson: 'IT_ADMIN',
                  responsiblePersonName: 'IT Administrator',
                  status: 'pending',
                  dueDate: new Date('2024-12-22'),
                  comments: ''
                },
                {
                  itemId: 'ITEM004',
                  itemName: 'Email Account Deactivation',
                  description: 'Deactivate company email account',
                  department: 'IT',
                  responsiblePerson: 'IT_ADMIN',
                  responsiblePersonName: 'IT Administrator',
                  status: 'completed',
                  dueDate: new Date('2024-12-18'),
                  completedDate: new Date('2024-12-18'),
                  comments: 'Email account deactivated successfully'
                },
                {
                  itemId: 'ITEM005',
                  itemName: 'System Access Removal',
                  description: 'Remove access from all company systems',
                  department: 'IT',
                  responsiblePerson: 'IT_ADMIN',
                  responsiblePersonName: 'IT Administrator',
                  status: 'completed',
                  dueDate: new Date('2024-12-18'),
                  completedDate: new Date('2024-12-18'),
                  comments: 'All system access removed'
                }
              ]
            },
            {
              categoryId: 'CAT002',
              categoryName: 'Finance & Settlements',
              items: [
                {
                  itemId: 'ITEM006',
                  itemName: 'Salary Advance Settlement',
                  description: 'Clear any outstanding salary advances',
                  department: 'Finance',
                  responsiblePerson: 'FINANCE_MGR',
                  responsiblePersonName: 'Finance Manager',
                  status: 'completed',
                  dueDate: new Date('2024-12-25'),
                  completedDate: new Date('2024-12-23'),
                  comments: 'No outstanding advances'
                },
                {
                  itemId: 'ITEM007',
                  itemName: 'Expense Claims',
                  description: 'Submit and process final expense claims',
                  department: 'Finance',
                  responsiblePerson: 'FINANCE_MGR',
                  responsiblePersonName: 'Finance Manager',
                  status: 'in_progress',
                  dueDate: new Date('2024-12-25'),
                  comments: 'Processing final expense claim of EGP 500'
                },
                {
                  itemId: 'ITEM008',
                  itemName: 'Loan Settlement',
                  description: 'Settle any outstanding company loans',
                  department: 'Finance',
                  responsiblePerson: 'FINANCE_MGR',
                  responsiblePersonName: 'Finance Manager',
                  status: 'completed',
                  dueDate: new Date('2024-12-25'),
                  completedDate: new Date('2024-12-22'),
                  comments: 'No outstanding loans'
                },
                {
                  itemId: 'ITEM009',
                  itemName: 'Final Settlement',
                  description: 'Process final salary and benefits settlement',
                  department: 'Finance',
                  responsiblePerson: 'FINANCE_MGR',
                  responsiblePersonName: 'Finance Manager',
                  status: 'pending',
                  dueDate: new Date('2024-12-29'),
                  comments: ''
                },
                {
                  itemId: 'ITEM010',
                  itemName: 'Tax Documents',
                  description: 'Provide final tax documents and certificates',
                  department: 'Finance',
                  responsiblePerson: 'FINANCE_MGR',
                  responsiblePersonName: 'Finance Manager',
                  status: 'pending',
                  dueDate: new Date('2024-12-29'),
                  comments: ''
                }
              ]
            },
            {
              categoryId: 'CAT003',
              categoryName: 'HR & Documentation',
              items: [
                {
                  itemId: 'ITEM011',
                  itemName: 'ID Card Return',
                  description: 'Return company ID card',
                  department: 'HR',
                  responsiblePerson: 'HR_MGR',
                  responsiblePersonName: 'HR Manager',
                  status: 'pending',
                  dueDate: new Date('2024-12-20'),
                  comments: ''
                },
                {
                  itemId: 'ITEM012',
                  itemName: 'Access Cards',
                  description: 'Return all building and office access cards',
                  department: 'HR',
                  responsiblePerson: 'HR_MGR',
                  responsiblePersonName: 'HR Manager',
                  status: 'pending',
                  dueDate: new Date('2024-12-20'),
                  comments: ''
                },
                {
                  itemId: 'ITEM013',
                  itemName: 'Company Uniforms',
                  description: 'Return company uniforms and branded items',
                  department: 'HR',
                  responsiblePerson: 'HR_MGR',
                  responsiblePersonName: 'HR Manager',
                  status: 'not_applicable',
                  dueDate: new Date('2024-12-20'),
                  comments: 'Employee did not receive uniforms'
                },
                {
                  itemId: 'ITEM014',
                  itemName: 'Leave Balance Settlement',
                  description: 'Calculate and process leave balance',
                  department: 'HR',
                  responsiblePerson: 'HR_MGR',
                  responsiblePersonName: 'HR Manager',
                  status: 'completed',
                  dueDate: new Date('2024-12-22'),
                  completedDate: new Date('2024-12-21'),
                  comments: 'Leave balance calculated: 15 days'
                },
                {
                  itemId: 'ITEM015',
                  itemName: 'Experience Certificate',
                  description: 'Prepare and issue experience certificate',
                  department: 'HR',
                  responsiblePerson: 'HR_MGR',
                  responsiblePersonName: 'HR Manager',
                  status: 'in_progress',
                  dueDate: new Date('2024-12-29'),
                  comments: 'Certificate being prepared'
                }
              ]
            },
            {
              categoryId: 'CAT004',
              categoryName: 'Operations & Handover',
              items: [
                {
                  itemId: 'ITEM016',
                  itemName: 'Client Handover',
                  description: 'Complete client handover and transition',
                  department: 'Operations',
                  responsiblePerson: 'OPS_MGR',
                  responsiblePersonName: 'Operations Manager',
                  status: 'completed',
                  dueDate: new Date('2024-12-29'),
                  completedDate: new Date('2024-12-24'),
                  comments: 'Client handover completed successfully'
                },
                {
                  itemId: 'ITEM017',
                  itemName: 'Project Handover',
                  description: 'Transfer project responsibilities and documentation',
                  department: 'Operations',
                  responsiblePerson: 'OPS_MGR',
                  responsiblePersonName: 'Operations Manager',
                  status: 'completed',
                  dueDate: new Date('2024-12-29'),
                  completedDate: new Date('2024-12-24'),
                  comments: 'Project documentation transferred'
                },
                {
                  itemId: 'ITEM018',
                  itemName: 'Knowledge Transfer',
                  description: 'Complete knowledge transfer sessions',
                  department: 'Operations',
                  responsiblePerson: 'OPS_MGR',
                  responsiblePersonName: 'Operations Manager',
                  status: 'completed',
                  dueDate: new Date('2024-12-25'),
                  completedDate: new Date('2024-12-23'),
                  comments: 'Knowledge transfer sessions completed'
                },
                {
                  itemId: 'ITEM019',
                  itemName: 'Training Materials',
                  description: 'Return training materials and resources',
                  department: 'Operations',
                  responsiblePerson: 'OPS_MGR',
                  responsiblePersonName: 'Operations Manager',
                  status: 'pending',
                  dueDate: new Date('2024-12-22'),
                  comments: ''
                },
                {
                  itemId: 'ITEM020',
                  itemName: 'Contact List',
                  description: 'Provide updated contact list for ongoing projects',
                  department: 'Operations',
                  responsiblePerson: 'OPS_MGR',
                  responsiblePersonName: 'Operations Manager',
                  status: 'completed',
                  dueDate: new Date('2024-12-22'),
                  completedDate: new Date('2024-12-21'),
                  comments: 'Updated contact list provided'
                }
              ]
            }
          ],
          
          status: 'in_progress',
          completionPercentage: 65,
          
          itAssets: {
            laptop: true,
            desktop: false,
            mobile: false,
            tablet: false,
            accessories: true,
            software: true,
            email: true,
            systemAccess: true,
            dataTransfer: true
          },
          
          finance: {
            salaryAdvance: true,
            expenseClaims: false,
            loanSettlement: true,
            finalSettlement: false,
            taxDocuments: false,
            benefitsTermination: false
          },
          
          hr: {
            idCard: false,
            accessCards: false,
            uniforms: false,
            equipment: false,
            leaveBalance: true,
            finalDocuments: false
          },
          
          operations: {
            clientHandover: true,
            projectHandover: true,
            knowledgeTransfer: true,
            trainingMaterials: false,
            contacts: true
          },
          
          createdAt: new Date('2024-12-15'),
          updatedAt: new Date('2024-12-24'),
          createdBy: 'system',
          updatedBy: 'system'
        }
      ];

      setChecklists(mockChecklists);
    } catch (error) {
      console.error('Error fetching checklists:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'not_started': { 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Clock className="h-3 w-3" />
      },
      'in_progress': { 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <AlertTriangle className="h-3 w-3" />
      },
      'completed': { 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-3 w-3" />
      },
      'overdue': { 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-3 w-3" />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
    
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </div>
    );
  };

  const getItemStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-3 w-3" />
      },
      'in_progress': { 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <AlertTriangle className="h-3 w-3" />
      },
      'completed': { 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-3 w-3" />
      },
      'not_applicable': { 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <XCircle className="h-3 w-3" />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
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

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading clearance checklists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clearance Process</h1>
          <p className="text-muted-foreground">
            Track and manage employee clearance checklists
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Checklists</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checklists.length}</div>
            <p className="text-xs text-muted-foreground">
              Active clearance processes
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
              {checklists.filter(c => c.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Fully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {checklists.filter(c => c.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <CheckSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {checklists.length > 0 
                ? Math.round(checklists.reduce((sum, c) => sum + c.completionPercentage, 0) / checklists.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Checklists */}
      <div className="space-y-6">
        {checklists.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No clearance checklists found</h3>
                <p className="text-muted-foreground">
                  Clearance checklists will appear here when separation requests are processed.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          checklists.map((checklist) => (
            <Card key={checklist.checklistId} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5" />
                      {checklist.employeeName}
                    </CardTitle>
                    <CardDescription>
                      Clearance checklist for employee separation
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(checklist.status)}
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Overview */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-muted-foreground">{checklist.completionPercentage}%</span>
                    </div>
                    <Progress value={checklist.completionPercentage} className="h-2" />
                  </div>

                  {/* Categories Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {checklist.categories.map((category) => {
                      const totalItems = category.items.length;
                      const completedItems = category.items.filter(item => item.status === 'completed').length;
                      const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
                      
                      return (
                        <div key={category.categoryId} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{category.categoryName}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            {completedItems}/{totalItems} completed
                          </div>
                          <Progress value={percentage} className="h-1" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Created: {formatDate(checklist.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Updated: {formatDate(checklist.updatedAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detailed View Modal would go here */}
      {selectedChecklist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Clearance Checklist - {selectedChecklist.employeeName}</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedChecklist(null)}>
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Detailed checklist view would be implemented here */}
              <p>Detailed checklist view coming soon...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
