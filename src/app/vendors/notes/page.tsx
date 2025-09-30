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
  MessageSquare,
  Mail,
  Phone,
  FileText,
  Star,
  Clock,
  User,
  Lock,
  Globe,
  Filter,
  MoreHorizontal,
  Eye,
  Send,
  Archive,
  Tag,
  Calendar,
  Building2,
  Package,
  Wrench,
  Truck
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { vendors, vendorNotes, vendorContacts, users } from '@/lib/data';
import type { Vendor, VendorNote, VendorContact, VendorType } from '@/lib/data';

export default function VendorNotesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [selectedNoteType, setSelectedNoteType] = useState<string>('all');
  const [selectedNote, setSelectedNote] = useState<VendorNote | null>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  // Helper functions
  const getVendor = (vendorId: string) => vendors.find(v => v.id === vendorId);
  const getVendorInitials = (vendor: Vendor) => {
    return vendor.companyName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };
  const getUser = (userId: string) => users.find(u => u.id === userId);

  const getTypeIcon = (type: VendorType) => {
    switch (type) {
      case 'supplier':
        return <Package className="h-4 w-4" />;
      case 'service_provider':
        return <Wrench className="h-4 w-4" />;
      case 'contractor':
        return <Truck className="h-4 w-4" />;
      case 'distributor':
        return <Building2 className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: VendorType) => {
    switch (type) {
      case 'supplier':
        return 'bg-blue-100 text-blue-800';
      case 'service_provider':
        return 'bg-green-100 text-green-800';
      case 'contractor':
        return 'bg-purple-100 text-purple-800';
      case 'distributor':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'general':
        return 'bg-gray-100 text-gray-800';
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'order':
        return 'bg-blue-100 text-blue-800';
      case 'quality':
        return 'bg-purple-100 text-purple-800';
      case 'performance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter notes
  const filteredNotes = vendorNotes.filter(note => {
    const vendor = getVendor(note.vendorId);
    if (!vendor) return false;

    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVendor = selectedVendor === 'all' || note.vendorId === selectedVendor;
    const matchesType = selectedNoteType === 'all' || note.type === selectedNoteType;

    return matchesSearch && matchesVendor && matchesType;
  });

  // Filter contacts
  const filteredContacts = vendorContacts.filter(contact => {
    const vendor = getVendor(contact.vendorId);
    if (!vendor) return false;

    const matchesSearch = contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVendor = selectedVendor === 'all' || contact.vendorId === selectedVendor;

    return matchesSearch && matchesVendor;
  });

  // Calculate metrics
  const totalNotes = vendorNotes.length;
  const totalContacts = vendorContacts.length;
  const privateNotes = vendorNotes.filter(n => n.isPrivate).length;
  const recentNotes = vendorNotes.filter(n => {
    const noteDate = new Date(n.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return noteDate > weekAgo;
  }).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Vendor Communication</h1>
          <p className="text-muted-foreground">Manage vendor notes, contacts, and communication</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Vendor Note</DialogTitle>
                <DialogDescription>
                  Create a new note for vendor communication
                </DialogDescription>
              </DialogHeader>
              <NoteForm 
                note={selectedNote} 
                onClose={() => {
                  setIsNoteDialogOpen(false);
                  setSelectedNote(null);
                }} 
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Vendor Contact</DialogTitle>
                <DialogDescription>
                  Add a new contact person for a vendor
                </DialogDescription>
              </DialogHeader>
              <ContactForm 
                onClose={() => setIsContactDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
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
              {recentNotes} added this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              Vendor contacts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Private Notes</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{privateNotes}</div>
            <p className="text-xs text-muted-foreground">
              Confidential notes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.filter(v => v.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              With communication
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
                  placeholder="Search notes and contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Vendor</Label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger>
                  <SelectValue placeholder="All Vendors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  {vendors.map(vendor => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.companyName}
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
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="notes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="communication">Communication Log</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Notes ({filteredNotes.length})</CardTitle>
              <CardDescription>
                Notes and comments about vendor interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotes.map(note => {
                  const vendor = getVendor(note.vendorId);
                  const user = getUser(note.createdBy);
                  
                  return (
                    <div key={note.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {vendor ? getVendorInitials(vendor) : '??'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{note.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {vendor?.companyName} • {user?.firstName} {user?.lastName}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getNoteTypeColor(note.type)}>
                            {note.type}
                          </Badge>
                          {note.isPrivate && (
                            <Badge variant="outline" className="text-red-600">
                              <Lock className="mr-1 h-3 w-3" />
                              Private
                            </Badge>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedNote(note);
                                setIsNoteDialogOpen(true);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Note
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Note
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {note.content}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(note.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Mail className="mr-1 h-3 w-3" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="mr-1 h-3 w-3" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredNotes.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notes found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Contacts ({filteredContacts.length})</CardTitle>
              <CardDescription>
                Contact persons for each vendor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map(contact => {
                    const vendor = getVendor(contact.vendorId);
                    
                    return (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {contact.firstName[0]}{contact.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {contact.firstName} {contact.lastName}
                              </div>
                              {contact.isPrimary && (
                                <Badge variant="outline" className="text-xs">
                                  Primary
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {vendor ? (
                            <div className="flex items-center gap-2">
                              <Badge className={getTypeColor(vendor.type)}>
                                {getTypeIcon(vendor.type)}
                                {vendor.type.replace('_', ' ')}
                              </Badge>
                              <div>
                                <div className="font-medium">{vendor.companyName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {vendor.vendorNumber}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unknown Vendor</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{contact.position}</div>
                            <div className="text-sm text-muted-foreground">
                              {contact.department}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {contact.email && (
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                {contact.email}
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={contact.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {contact.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Mail className="mr-1 h-3 w-3" />
                              Email
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="mr-1 h-3 w-3" />
                              Call
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Contact
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Add Note
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Contact
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest notes and communication activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorNotes
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 10)
                  .map(note => {
                    const vendor = getVendor(note.vendorId);
                    const user = getUser(note.createdBy);
                    
                    return (
                      <div key={note.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{note.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {vendor?.companyName} • {user?.firstName} {user?.lastName}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(note.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                        <Badge className={getNoteTypeColor(note.type)}>
                          {note.type}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>Communication Log</CardTitle>
              <CardDescription>
                Track all vendor communication activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors.map(vendor => {
                  const vendorNotesList = vendorNotes.filter(n => n.vendorId === vendor.id);
                  const vendorContactsList = vendorContacts.filter(c => c.vendorId === vendor.id);
                  
                  return (
                    <div key={vendor.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getVendorInitials(vendor)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{vendor.companyName}</div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.vendorNumber} • {vendorNotesList.length} notes • {vendorContactsList.length} contacts
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Recent Notes</h4>
                          <div className="space-y-2">
                            {vendorNotesList.slice(0, 3).map(note => (
                              <div key={note.id} className="p-2 bg-gray-50 rounded text-sm">
                                <div className="font-medium">{note.title}</div>
                                <div className="text-muted-foreground">
                                  {new Date(note.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                            {vendorNotesList.length === 0 && (
                              <p className="text-sm text-muted-foreground">No notes</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Contacts</h4>
                          <div className="space-y-2">
                            {vendorContactsList.slice(0, 3).map(contact => (
                              <div key={contact.id} className="p-2 bg-gray-50 rounded text-sm">
                                <div className="font-medium">
                                  {contact.firstName} {contact.lastName}
                                </div>
                                <div className="text-muted-foreground">
                                  {contact.position} • {contact.email}
                                </div>
                              </div>
                            ))}
                            {vendorContactsList.length === 0 && (
                              <p className="text-sm text-muted-foreground">No contacts</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Add Note
                        </Button>
                        <Button size="sm" variant="outline">
                          <User className="mr-2 h-4 w-4" />
                          Add Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </Button>
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
function NoteForm({ note, onClose }: { note: VendorNote | null; onClose: () => void }) {
  const [formData, setFormData] = useState({
    vendorId: note?.vendorId || '',
    type: note?.type || 'general',
    title: note?.title || '',
    content: note?.content || '',
    isPrivate: note?.isPrivate || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving note:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Vendor</Label>
        <Select value={formData.vendorId} onValueChange={(value) => setFormData({ ...formData, vendorId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select vendor" />
          </SelectTrigger>
          <SelectContent>
            {vendors.map(vendor => (
              <SelectItem key={vendor.id} value={vendor.id}>
                {vendor.companyName} - {vendor.vendorNumber}
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
            <SelectItem value="quality">Quality</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
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
          rows={4}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPrivate"
          checked={formData.isPrivate}
          onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="isPrivate">Private note (only visible to authorized users)</Label>
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

// Contact Form Component
function ContactForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    vendorId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    isPrimary: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving contact:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Vendor</Label>
        <Select value={formData.vendorId} onValueChange={(value) => setFormData({ ...formData, vendorId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select vendor" />
          </SelectTrigger>
          <SelectContent>
            {vendors.map(vendor => (
              <SelectItem key={vendor.id} value={vendor.id}>
                {vendor.companyName} - {vendor.vendorNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPrimary"
          checked={formData.isPrimary}
          onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="isPrimary">Primary contact for this vendor</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Contact
        </Button>
      </div>
    </form>
  );
}
