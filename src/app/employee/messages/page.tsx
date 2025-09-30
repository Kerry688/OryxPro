'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Send,
  Mail,
  User,
  Clock,
  AlertTriangle,
  Archive,
  Trash2,
  Reply,
  Forward,
  Paperclip,
  CheckCircle,
  Star,
  Eye,
  EyeOff
} from 'lucide-react';
import { Message } from '@/lib/models/employee-portal';

export default function EmployeeMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeData, setComposeData] = useState({
    toEmployeeId: '',
    subject: '',
    content: '',
    priority: 'medium'
  });

  useEffect(() => {
    // Mock employee ID - in real app, this would come from auth context
    const employeeId = 'EMP009';
    fetchMessages(employeeId);
  }, [activeTab, searchQuery]);

  const fetchMessages = async (employeeId: string) => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockMessages: Message[] = [
        {
          messageId: 'MSG001',
          fromEmployeeId: 'EMP012',
          fromEmployeeName: 'Nora El Sharif',
          fromEmployeeRole: 'HR Manager',
          toEmployeeId: 'EMP009',
          toEmployeeName: 'Ahmed Mahmoud',
          subject: 'Performance Review Meeting',
          content: 'Hi Ahmed,\n\nI hope you are doing well. I would like to schedule your quarterly performance review meeting. Please let me know your availability for next week.\n\nBest regards,\nNora',
          type: 'direct',
          priority: 'medium',
          attachments: [],
          isRead: false,
          isImportant: false,
          isArchived: false,
          sentDate: new Date('2024-12-15T10:30:00'),
          repliedTo: undefined,
          threadId: undefined
        },
        {
          messageId: 'MSG002',
          fromEmployeeId: 'EMP009',
          fromEmployeeName: 'Ahmed Mahmoud',
          fromEmployeeRole: 'CEO',
          toEmployeeId: 'EMP013',
          toEmployeeName: 'Youssef El Abbasi',
          subject: 'Project Update Required',
          content: 'Hi Youssef,\n\nCould you please provide an update on the website redesign project? I need to present the progress to the board next week.\n\nThanks,\nAhmed',
          type: 'direct',
          priority: 'high',
          attachments: [],
          isRead: true,
          isImportant: true,
          isArchived: false,
          sentDate: new Date('2024-12-14T14:15:00'),
          repliedTo: undefined,
          threadId: undefined
        },
        {
          messageId: 'MSG003',
          fromEmployeeId: 'EMP014',
          fromEmployeeName: 'Mariam Hassan',
          fromEmployeeRole: 'Sales Manager',
          toEmployeeId: 'EMP009',
          toEmployeeName: 'Ahmed Mahmoud',
          subject: 'Monthly Sales Report',
          content: 'Dear Ahmed,\n\nPlease find attached the monthly sales report for December. We have exceeded our targets by 15% this month. The team has done an excellent job.\n\nRegards,\nMariam',
          type: 'direct',
          priority: 'low',
          attachments: [
            {
              name: 'Sales_Report_December_2024.pdf',
              url: '/attachments/sales-report-dec-2024.pdf',
              type: 'application/pdf',
              size: 512000
            }
          ],
          isRead: true,
          isImportant: false,
          isArchived: false,
          sentDate: new Date('2024-12-13T16:45:00'),
          repliedTo: undefined,
          threadId: undefined
        },
        {
          messageId: 'MSG004',
          fromEmployeeId: 'EMP009',
          fromEmployeeName: 'Ahmed Mahmoud',
          fromEmployeeRole: 'CEO',
          toEmployeeId: 'EMP015',
          toEmployeeName: 'Omar Farouk',
          subject: 'Meeting Cancellation',
          content: 'Hi Omar,\n\nI need to cancel our meeting scheduled for tomorrow due to an urgent client meeting. Let\'s reschedule for next week.\n\nBest,\nAhmed',
          type: 'direct',
          priority: 'medium',
          attachments: [],
          isRead: false,
          isImportant: false,
          isArchived: false,
          sentDate: new Date('2024-12-12T09:20:00'),
          repliedTo: undefined,
          threadId: undefined
        }
      ];

      // Apply filters
      let filteredMessages = mockMessages;
      
      if (activeTab === 'inbox') {
        filteredMessages = filteredMessages.filter(msg => msg.toEmployeeId === employeeId);
      } else if (activeTab === 'sent') {
        filteredMessages = filteredMessages.filter(msg => msg.fromEmployeeId === employeeId);
      } else if (activeTab === 'important') {
        filteredMessages = filteredMessages.filter(msg => msg.isImportant);
      } else if (activeTab === 'archived') {
        filteredMessages = filteredMessages.filter(msg => msg.isArchived);
      }
      
      if (searchQuery) {
        filteredMessages = filteredMessages.filter(msg => 
          msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.fromEmployeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.toEmployeeName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setMessages(filteredMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'low': { className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'medium': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'high': { className: 'bg-orange-100 text-orange-800 border-orange-200' },
      'urgent': { className: 'bg-red-100 text-red-800 border-red-200' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const markAsRead = async (messageId: string) => {
    try {
      setMessages(prev => 
        prev.map(msg => 
          msg.messageId === messageId ? { ...msg, isRead: true } : msg
        )
      );
      
      if (selectedMessage?.messageId === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, isRead: true } : null);
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const toggleImportant = async (messageId: string) => {
    try {
      setMessages(prev => 
        prev.map(msg => 
          msg.messageId === messageId ? { ...msg, isImportant: !msg.isImportant } : msg
        )
      );
    } catch (error) {
      console.error('Error toggling message importance:', error);
    }
  };

  const archiveMessage = async (messageId: string) => {
    try {
      setMessages(prev => 
        prev.map(msg => 
          msg.messageId === messageId ? { ...msg, isArchived: true } : msg
        )
      );
    } catch (error) {
      console.error('Error archiving message:', error);
    }
  };

  const handleComposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, this would call the API
      const newMessage: Message = {
        messageId: `MSG${Date.now()}`,
        fromEmployeeId: 'EMP009',
        fromEmployeeName: 'Ahmed Mahmoud',
        fromEmployeeRole: 'CEO',
        toEmployeeId: composeData.toEmployeeId,
        toEmployeeName: 'Recipient Name', // Would be fetched from API
        subject: composeData.subject,
        content: composeData.content,
        type: 'direct',
        priority: composeData.priority as any,
        attachments: [],
        isRead: false,
        isImportant: false,
        isArchived: false,
        sentDate: new Date(),
        repliedTo: undefined,
        threadId: undefined
      };

      setMessages(prev => [newMessage, ...prev]);
      setComposeOpen(false);
      setComposeData({ toEmployeeId: '', subject: '', content: '', priority: 'medium' });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Internal communication and messaging
          </p>
        </div>
        <Button onClick={() => setComposeOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </div>

      {/* Compose Modal */}
      {composeOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleComposeSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">To</label>
                  <Input
                    placeholder="Employee ID or Name"
                    value={composeData.toEmployeeId}
                    onChange={(e) => setComposeData(prev => ({ ...prev, toEmployeeId: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    value={composeData.priority}
                    onChange={(e) => setComposeData(prev => ({ ...prev, priority: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="Message subject"
                  value={composeData.subject}
                  onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message here..."
                  value={composeData.content}
                  onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  required
                />
              </div>
              
              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setComposeOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="important">Important</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>

        {/* Messages List */}
        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({messages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {messages.length === 0 ? (
                    <div className="p-6 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No messages found</h3>
                      <p className="text-muted-foreground">
                        No messages in your {activeTab} folder.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {messages.map((message) => (
                        <div
                          key={message.messageId}
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                            selectedMessage?.messageId === message.messageId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          } ${!message.isRead ? 'bg-blue-50' : ''}`}
                          onClick={() => {
                            setSelectedMessage(message);
                            if (!message.isRead) {
                              markAsRead(message.messageId);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm truncate">
                                  {activeTab === 'sent' ? message.toEmployeeName : message.fromEmployeeName}
                                </h4>
                                {!message.isRead && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1 truncate">
                                {message.subject}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {message.content.substring(0, 60)}...
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs text-gray-500">
                                {formatDate(message.sentDate)}
                              </span>
                              <div className="flex items-center gap-1">
                                {message.isImportant && (
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                )}
                                {getPriorityBadge(message.priority)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{selectedMessage.fromEmployeeName} • {selectedMessage.fromEmployeeRole}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(selectedMessage.sentDate)}</span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(selectedMessage.priority)}
                        {selectedMessage.isImportant && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {selectedMessage.content}
                      </p>
                    </div>
                    
                    {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Attachments:</h4>
                        <div className="space-y-1">
                          {selectedMessage.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <Paperclip className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{attachment.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({formatFileSize(attachment.size)})
                              </span>
                              <Button variant="outline" size="sm" className="ml-auto">
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        {selectedMessage.isRead ? (
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
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => toggleImportant(selectedMessage.messageId)}>
                          <Star className={`h-4 w-4 ${selectedMessage.isImportant ? 'fill-current text-yellow-500' : ''}`} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => archiveMessage(selectedMessage.messageId)}>
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Forward className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Select a message</h3>
                      <p className="text-muted-foreground">
                        Choose a message from the list to view its details.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
