'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FileText, 
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  User,
  Lock,
  Eye,
  MoreHorizontal,
  Filter,
  Download,
  Tag,
  Clock,
  AlertCircle,
  CheckCircle,
  Package,
  Info
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { customers, customerNotes, users } from '@/lib/data';
import type { Customer, CustomerNote, User as UserType } from '@/lib/data';

export default function CustomerNotesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');
  const [selectedNoteType, setSelectedNoteType] = useState<string>('all');
  const [selectedNote, setSelectedNote] = useState<CustomerNote | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter notes
  const filteredNotes = customerNotes.filter(note => {
    const customer = customers.find(c => c.id === note.customerId);
    if (!customer) return false;

    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCustomer = selectedCustomer === 'all' || note.customerId === selectedCustomer;
    const matchesType = selectedNoteType === 'all' || note.type === selectedNoteType;

    return matchesSearch && matchesCustomer && matchesType;
  });

  // Helper functions
  const getCustomer = (customerId: string) => customers.find(c => c.id === customerId);
  const getUser = (userId: string) => users.find(u => u.id === userId);
  const getCustomerInitials = (customer: Customer) => {
    if (customer.companyName) {
      return customer.companyName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
    }
    return `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`.toUpperCase();
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'general':
        return 'bg-blue-100 text-blue-800';
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'order':
        return 'bg-purple-100 text-purple-800';
      case 'support':
        return 'bg-orange-100 text-orange-800';
      case 'marketing':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case 'general':
        return <FileText className="h-4 w-4" />;
      case 'payment':
        return <CheckCircle className="h-4 w-4" />;
      case 'order':
        return <Package className="h-4 w-4" />;
      case 'support':
        return <AlertCircle className="h-4 w-4" />;
      case 'marketing':
        return <Mail className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Calculate metrics
  const totalNotes = customerNotes.length;
  const privateNotes = customerNotes.filter(n => n.isPrivate).length;
  const publicNotes = customerNotes.filter(n => !n.isPrivate).length;
  const notesByType = customerNotes.reduce((acc, note) => {
    acc[note.type] = (acc[note.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get recent notes
  const getRecentNotes = () => {
    return customerNotes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Notes & Communication</h1>
          <p className="text-muted-foreground">Manage customer notes, communications, and interactions</p>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Customer Note</DialogTitle>
              <DialogDescription>
                Create a new note or communication record
              </DialogDescription>
            </DialogHeader>
            <NoteForm 
              note={selectedNote} 
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedNote(null);
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNotes}</div>
            <p className="text-xs text-muted-foreground">
              All customer notes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Notes</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{publicNotes}</div>
            <p className="text-xs text-muted-foreground">
              Visible to all users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Private Notes</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{privateNotes}</div>
            <p className="text-xs text-muted-foreground">
              Restricted access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers with Notes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Set(customerNotes.map(n => n.customerId)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Active customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Note Type</Label>
              <Select value={selectedNoteType} onValueChange={setSelectedNoteType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="order">Order</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Notes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="notes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notes">All Notes</TabsTrigger>
          <TabsTrigger value="recent">Recent Notes</TabsTrigger>
          <TabsTrigger value="types">By Type</TabsTrigger>
          <TabsTrigger value="customers">By Customer</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Customer Notes ({filteredNotes.length})</CardTitle>
              <CardDescription>
                All customer notes and communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotes.map(note => {
                    const customer = getCustomer(note.customerId);
                    const author = getUser(note.createdBy);
                    
                    return (
                      <TableRow key={note.id}>
                        <TableCell>
                          {customer ? (
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{getCustomerInitials(customer)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {customer.customerNumber}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unknown Customer</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{note.title}</div>
                            <div className="text-sm text-muted-foreground max-w-xs truncate">
                              {note.content}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getNoteTypeColor(note.type)}>
                            <div className="flex items-center gap-1">
                              {getNoteTypeIcon(note.type)}
                              {note.type}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={note.isPrivate ? "destructive" : "default"}>
                            <div className="flex items-center gap-1">
                              {note.isPrivate ? <Lock className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              {note.isPrivate ? 'Private' : 'Public'}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {author ? (
                            <div>
                              <div className="font-medium">{author.firstName} {author.lastName}</div>
                              <div className="text-sm text-muted-foreground">{author.department}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unknown User</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{new Date(note.createdAt).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(note.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedNote(note);
                                setIsEditDialogOpen(true);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Note
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Reply
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Note
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notes</CardTitle>
              <CardDescription>
                Latest customer notes and communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRecentNotes().map(note => {
                  const customer = getCustomer(note.customerId);
                  const author = getUser(note.createdBy);
                  
                  return (
                    <div key={note.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {customer ? getCustomerInitials(customer) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">
                              {customer ? (customer.companyName || `${customer.firstName} ${customer.lastName}`) : 'Unknown Customer'}
                            </h3>
                            <Badge className={getNoteTypeColor(note.type)}>
                              {getNoteTypeIcon(note.type)}
                              {note.type}
                            </Badge>
                            {note.isPrivate && (
                              <Badge variant="destructive">
                                <Lock className="h-3 w-3 mr-1" />
                                Private
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold mb-1">{note.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{note.content}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>By {author ? `${author.firstName} ${author.lastName}` : 'Unknown User'}</span>
                            <span>•</span>
                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{new Date(note.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(notesByType).map(([type, count]) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getNoteTypeIcon(type)}
                    {type.charAt(0).toUpperCase() + type.slice(1)} Notes
                  </CardTitle>
                  <CardDescription>
                    {count} notes of this type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customerNotes
                      .filter(note => note.type === type)
                      .slice(0, 5)
                      .map(note => {
                        const customer = getCustomer(note.customerId);
                        return (
                          <div key={note.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium text-sm">{note.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {customer ? (customer.companyName || `${customer.firstName} ${customer.lastName}`) : 'Unknown Customer'}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Notes by Customer</CardTitle>
              <CardDescription>
                Customer notes organized by customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {customers.map(customer => {
                  const customerNotesList = customerNotes.filter(note => note.customerId === customer.id);
                  if (customerNotesList.length === 0) return null;
                  
                  return (
                    <div key={customer.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getCustomerInitials(customer)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {customer.customerNumber} • {customerNotesList.length} notes
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {customerNotesList.map(note => (
                          <div key={note.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="flex-shrink-0">
                              {getNoteTypeIcon(note.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm">{note.title}</h4>
                                <Badge className={getNoteTypeColor(note.type)}>
                                  {note.type}
                                </Badge>
                                {note.isPrivate && (
                                  <Badge variant="destructive" className="text-xs">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Private
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{note.content}</p>
                              <div className="text-xs text-muted-foreground">
                                {new Date(note.createdAt).toLocaleDateString()} • {getUser(note.createdBy)?.firstName} {getUser(note.createdBy)?.lastName}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Note Form Component
function NoteForm({ note, onClose }: { note: CustomerNote | null; onClose: () => void }) {
  const [formData, setFormData] = useState({
    customerId: note?.customerId || '',
    type: note?.type || 'general',
    title: note?.title || '',
    content: note?.content || '',
    isPrivate: note?.isPrivate ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving note:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Customer</Label>
        <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map(customer => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.companyName || `${customer.firstName} ${customer.lastName}`} - {customer.customerNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Note Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
            <SelectItem value="order">Order</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Note title"
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Note content"
          rows={6}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPrivate"
          checked={formData.isPrivate}
          onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
          className="rounded border-gray-300"
        />
        <Label htmlFor="isPrivate">Private Note (restricted access)</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {note ? 'Update Note' : 'Create Note'}
        </Button>
      </div>
    </form>
  );
}
