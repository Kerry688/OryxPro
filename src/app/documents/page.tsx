'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Share2,
  FileText,
  Image,
  File,
  Archive,
  Star,
  Clock,
  Users,
  Lock,
  Globe,
  User,
  MoreHorizontal,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { DocumentUploadDialog } from '@/components/documents/DocumentUploadDialog';
import { DocumentViewDialog } from '@/components/documents/DocumentViewDialog';
import { DocumentPermissionsDialog } from '@/components/documents/DocumentPermissionsDialog';
import { FolderCreateDialog } from '@/components/documents/FolderCreateDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Document, DocumentFilter, DocumentStats, FolderStructure } from '@/lib/models/document';

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [permissionFilter, setPermissionFilter] = useState<string>('all');
  const [showMyDocuments, setShowMyDocuments] = useState<boolean>(false);
  const [showSharedWithMe, setShowSharedWithMe] = useState<boolean>(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isBulkOperationsOpen, setIsBulkOperationsOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [folders, setFolders] = useState<FolderStructure[]>([]);
  const [currentFolder, setCurrentFolder] = useState<FolderStructure | null>(null);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
    fetchStats();
    fetchFolders();
  }, [searchQuery, selectedTags, permissionFilter, sortBy, sortOrder, currentFolder, showMyDocuments, showSharedWithMe, user]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchQuery,
        tags: selectedTags.join(','),
        permissionType: permissionFilter === 'all' ? '' : permissionFilter,
        folderId: currentFolder?._id || '',
        sortBy,
        sortOrder,
        userId: user?._id || '', // Include user ID for permission filtering
        showMyDocuments: showMyDocuments.toString(),
        showSharedWithMe: showSharedWithMe.toString()
      });
      
      const response = await fetch(`/api/documents?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/documents/stats?userId=${user?._id}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchFolders = async () => {
    try {
      const params = new URLSearchParams({
        parentFolderId: currentFolder?._id || ''
      });
      
      const response = await fetch(`/api/documents/folders?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setFolders(data.folders);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const handleDownload = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = documents.find(d => d._id === documentId)?.metadata.originalName || 'document';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchDocuments();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleFolderClick = (folder: FolderStructure) => {
    setCurrentFolder(folder);
  };

  const handleBackToParent = () => {
    setCurrentFolder(null);
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('Are you sure you want to delete this folder? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/documents/folders/${folderId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchFolders();
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.includes('pdf')) return FileText;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return Archive;
    return File;
  };

  const getPermissionIcon = (type: string) => {
    switch (type) {
      case 'public': return Globe;
      case 'private': return Lock;
      case 'assigned': return Users;
      default: return User;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const canUserAccessDocument = (document: Document) => {
    if (!user) return false;
    
    // Check if user is the uploader
    if (document.metadata.uploadedBy === user._id) return true;
    
    // Check if document is public
    if (document.permissions.type === 'public') return true;
    
    // Check if user is assigned to the document
    if (document.permissions.type === 'assigned') {
      return document.permissions.assignedUsers.some(assignedUser => assignedUser.userId === user._id);
    }
    
    return false;
  };

  const getUserAccessLevel = (document: Document) => {
    if (!user) return 'none';
    
    // Check if user is the uploader (owner)
    if (document.metadata.uploadedBy === user._id) return 'owner';
    
    // Check if user is assigned to the document
    if (document.permissions.type === 'assigned') {
      const assignedUser = document.permissions.assignedUsers.find(au => au.userId === user._id);
      if (assignedUser) return assignedUser.permission;
    }
    
    // Check if document is public
    if (document.permissions.type === 'public') return 'view';
    
    return 'none';
  };

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map(doc => doc._id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedDocuments.length} documents?`)) return;
    
    try {
      const deletePromises = selectedDocuments.map(id => 
        fetch(`/api/documents/${id}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      setSelectedDocuments([]);
      fetchDocuments();
      fetchStats();
    } catch (error) {
      console.error('Error deleting documents:', error);
    }
  };

  const handleBulkPermissionChange = async (newPermissionType: DocumentPermission) => {
    try {
      const updatePromises = selectedDocuments.map(id => 
        fetch(`/api/documents/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ permissionType: newPermissionType })
        })
      );
      
      await Promise.all(updatePromises);
      setSelectedDocuments([]);
      fetchDocuments();
    } catch (error) {
      console.error('Error updating document permissions:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-3xl">Document Center</h1>
            {currentFolder && (
              <Button variant="ghost" size="sm" onClick={handleBackToParent}>
                <Archive className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {currentFolder ? (
              <>
                <span>📁 {currentFolder.name}</span>
              </>
            ) : (
              <span>Upload, share, and manage your documents</span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          {/* Bulk Operations */}
          {selectedDocuments.length > 0 && (
            <div className="flex items-center space-x-2 mr-4">
              <Badge variant="secondary" className="px-3 py-1">
                {selectedDocuments.length} selected
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleBulkPermissionChange('public')}>
                    <Globe className="h-4 w-4 mr-2" />
                    Make Public
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkPermissionChange('private')}>
                    <Lock className="h-4 w-4 mr-2" />
                    Make Private
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleBulkDelete}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Folder
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Folder</DialogTitle>
                <DialogDescription>
                  Create a new folder to organize your documents.
                </DialogDescription>
              </DialogHeader>
              <FolderCreateDialog
                onSuccess={() => {
                  setIsCreateFolderDialogOpen(false);
                  fetchFolders();
                }}
                onCancel={() => setIsCreateFolderDialogOpen(false)}
                parentFolder={currentFolder}
                folders={folders}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload and configure your document with permissions and metadata.
                </DialogDescription>
              </DialogHeader>
              <DocumentUploadDialog
                onSuccess={() => {
                  setIsUploadDialogOpen(false);
                  fetchDocuments();
                  fetchStats();
                }}
                onCancel={() => setIsUploadDialogOpen(false)}
                parentFolder={currentFolder}
                folders={folders}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(stats.totalSize)} total size
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Documents</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myDocuments?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Documents I uploaded
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shared With Me</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sharedWithMe?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Documents shared with me
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentUploads?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Last 10 uploads
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={permissionFilter} onValueChange={setPermissionFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Permissions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Permissions</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="assigned">Assigned Users</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uploadedAt">Upload Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="downloadCount">Downloads</SelectItem>
                <SelectItem value="viewCount">Views</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showMyDocuments" 
                checked={showMyDocuments}
                onCheckedChange={(checked) => setShowMyDocuments(checked as boolean)}
              />
              <Label htmlFor="showMyDocuments" className="text-sm font-medium">
                My Documents Only
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showSharedWithMe" 
                checked={showSharedWithMe}
                onCheckedChange={(checked) => setShowSharedWithMe(checked as boolean)}
              />
              <Label htmlFor="showSharedWithMe" className="text-sm font-medium">
                Shared With Me
              </Label>
            </div>

            {(showMyDocuments || showSharedWithMe || searchQuery || permissionFilter !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowMyDocuments(false);
                  setShowSharedWithMe(false);
                  setSearchQuery('');
                  setPermissionFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : folders.length === 0 && documents.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents or folders found</h3>
            <p className="text-muted-foreground mb-4">Upload your first document or create a folder to get started</p>
            <div className="flex justify-center space-x-2">
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Button variant="outline" onClick={() => setIsCreateFolderDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Folder
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Select All Header */}
            {documents.length > 0 && (
              <div className="col-span-full flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedDocuments.length === documents.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="text-sm font-medium">
                    Select All Documents ({documents.length})
                  </Label>
                </div>
                {selectedDocuments.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDocuments([])}
                  >
                    Clear Selection
                  </Button>
                )}
              </div>
            )}
            {/* Folders */}
            {folders.map((folder) => {
              const PermissionIcon = getPermissionIcon(folder.permissions.type);
              
              return viewMode === 'grid' ? (
                <Card key={folder._id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleFolderClick(folder)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Archive className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-medium truncate">
                            {folder.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            Folder
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleFolderClick(folder)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteFolder(folder._id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <PermissionIcon className="h-3 w-3" />
                          <span>{folder.permissions.type}</span>
                        </div>
                        <span>{formatDate(folder.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card key={folder._id} className="cursor-pointer" onClick={() => handleFolderClick(folder)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Archive className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{folder.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Folder • {formatDate(folder.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <PermissionIcon className="h-3 w-3" />
                          <span>{folder.permissions.type}</span>
                        </Badge>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleFolderClick(folder)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteFolder(folder._id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {/* Documents */}
            {documents.map((document) => {
            const FileIcon = getFileIcon(document.metadata.mimeType);
            const PermissionIcon = getPermissionIcon(document.permissions.type);
            const userAccessLevel = getUserAccessLevel(document);
            const isOwner = userAccessLevel === 'owner';
            const canEdit = isOwner || (document.permissions.allowEdit && ['edit', 'admin'].includes(userAccessLevel));
            const canDelete = isOwner || (document.permissions.allowDelete && userAccessLevel === 'admin');
            
            return viewMode === 'grid' ? (
              <Card key={document._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedDocuments.includes(document._id)}
                        onCheckedChange={() => handleDocumentSelect(document._id)}
                      />
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-medium truncate">
                          {document.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(document.metadata.size)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedDocument(document);
                          setIsViewDialogOpen(true);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        {document.permissions.allowDownload && (
                          <DropdownMenuItem onClick={() => handleDownload(document._id)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        )}
                        {canEdit && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedDocument(document);
                            setIsPermissionsDialogOpen(true);
                          }}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(document._id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <PermissionIcon className="h-3 w-3" />
                        <span>{document.permissions.type}</span>
                        {isOwner && (
                          <Badge variant="outline" className="text-xs ml-1">
                            Owner
                          </Badge>
                        )}
                      </div>
                      <span>{formatDate(document.metadata.uploadedAt)}</span>
                    </div>
                    
                    {/* Access Level Indicator */}
                    {!isOwner && userAccessLevel !== 'none' && (
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground capitalize">
                          Access: {userAccessLevel}
                        </span>
                      </div>
                    )}
                    
                    {document.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {document.metadata.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {document.metadata.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{document.metadata.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{document.downloadCount} downloads</span>
                      <span>{document.viewCount} views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card key={document._id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={selectedDocuments.includes(document._id)}
                        onCheckedChange={() => handleDocumentSelect(document._id)}
                      />
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium truncate">{document.name}</h3>
                          {isOwner && (
                            <Badge variant="outline" className="text-xs">
                              Owner
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(document.metadata.size)} • {formatDate(document.metadata.uploadedAt)}
                          {!isOwner && userAccessLevel !== 'none' && (
                            <span className="ml-2 capitalize">• Access: {userAccessLevel}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <PermissionIcon className="h-3 w-3" />
                        <span>{document.permissions.type}</span>
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedDocument(document);
                            setIsViewDialogOpen(true);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          {document.permissions.allowDownload && (
                            <DropdownMenuItem onClick={() => handleDownload(document._id)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                          )}
                          {canEdit && (
                            <DropdownMenuItem onClick={() => {
                              setSelectedDocument(document);
                              setIsPermissionsDialogOpen(true);
                            }}>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                          )}
                          {canDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(document._id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </>
        )}
      </div>

      {/* Document View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              View document information, download, and manage permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <DocumentViewDialog
              document={selectedDocument}
              onClose={() => setIsViewDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Document Permissions Dialog */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Document Permissions</DialogTitle>
            <DialogDescription>
              Configure who can access this document and what actions they can perform.
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <DocumentPermissionsDialog
              document={selectedDocument}
              onSuccess={() => {
                setIsPermissionsDialogOpen(false);
                fetchDocuments();
              }}
              onCancel={() => setIsPermissionsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
