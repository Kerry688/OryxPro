'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  X, 
  File, 
  Image, 
  FileText, 
  Archive,
  Plus,
  Trash2,
  Users,
  Globe,
  Lock,
  Search,
  User,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentPermission, FolderStructure } from '@/lib/models/document';
import { User as UserType } from '@/lib/models/user';

interface DocumentUploadDialogProps {
  onSuccess: () => void;
  onCancel: () => void;
  parentFolder?: FolderStructure | null;
  folders?: FolderStructure[];
}

export function DocumentUploadDialog({ onSuccess, onCancel, parentFolder, folders = [] }: DocumentUploadDialogProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [permissionType, setPermissionType] = useState<DocumentPermission>('private');
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [allowDownload, setAllowDownload] = useState(true);
  const [allowEdit, setAllowEdit] = useState(false);
  const [allowDelete, setAllowDelete] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(parentFolder?._id || null);
  
  // User management
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(user => 
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addUser = (userId: string) => {
    if (!assignedUsers.includes(userId)) {
      setAssignedUsers([...assignedUsers, userId]);
    }
    setSearchQuery('');
    setFilteredUsers([]);
  };

  const removeUser = (userId: string) => {
    setAssignedUsers(assignedUsers.filter(id => id !== userId));
  };

  const getSelectedUserDetails = () => {
    return users.filter(user => assignedUsers.includes(user._id?.toString() || ''));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert('File size must be less than 100MB');
      return;
    }

    setSelectedFile(file);
    if (!name) {
      setName(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.includes('pdf')) return FileText;
    if (file.type.includes('zip') || file.type.includes('rar')) return Archive;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    if (!selectedFile || !name || !user) {
      alert('Please fill in all required fields');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('tags', JSON.stringify(tags));
      formData.append('permissionType', permissionType);
      formData.append('assignedUsers', JSON.stringify(assignedUsers));
      formData.append('allowDownload', allowDownload.toString());
      formData.append('allowEdit', allowEdit.toString());
      formData.append('allowDelete', allowDelete.toString());
      formData.append('uploadedBy', user._id);
      formData.append('folderId', selectedFolderId || '');

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        // Provide more specific error messages
        let errorMessage = 'Failed to upload document';
        
        if (data.error) {
          if (data.error.includes('Missing required fields')) {
            errorMessage = 'Please fill in all required fields';
          } else if (data.error.includes('Failed to upload file')) {
            errorMessage = 'Failed to upload file. Please check your storage configuration.';
          } else if (data.error.includes('database')) {
            errorMessage = 'Database error. Please try again later.';
          } else {
            errorMessage = data.error;
          }
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      
      // Provide more specific error messages based on the error type
      let errorMessage = 'Failed to upload document';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error instanceof Error) {
        errorMessage = `Upload error: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="metadata">Metadata</TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="space-y-4">
        {/* File Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Document File</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : selectedFile 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-muted-foreground/25'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    {React.createElement(getFileIcon(selectedFile), { className: 'h-8 w-8 text-green-600' })}
                    <div className="text-left">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg font-medium">Drop your file here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
              accept="*/*"
            />
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Document Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter document name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="folder">Upload to Folder</Label>
                <Select value={selectedFolderId || 'root'} onValueChange={(value) => setSelectedFolderId(value === 'root' ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="root">
                      <div className="flex items-center space-x-2">
                        <File className="h-4 w-4" />
                        <span>Root Directory</span>
                      </div>
                    </SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder._id} value={folder._id}>
                        <div className="flex items-center space-x-2">
                          <Archive className="h-4 w-4" />
                          <span>{folder.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {parentFolder && (
                  <p className="text-sm text-muted-foreground">
                    Current folder: {parentFolder.name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter document description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="permissions" className="space-y-4">
        {/* Permission Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Access Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="permission">Permission Type</Label>
              <Select value={permissionType} onValueChange={(value: DocumentPermission) => setPermissionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>Public - Anyone can access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Private - Only you can access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="assigned">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Assigned Users - Specific users only</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assigned Users Section */}
            {permissionType === 'assigned' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Search Results */}
                {searchQuery && filteredUsers.length > 0 && (
                  <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                    <p className="text-sm font-medium text-muted-foreground">Search Results:</p>
                    {filteredUsers.map(user => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                        onClick={() => addUser(user._id?.toString() || '')}
                      >
                        <div className="flex items-center space-x-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Users */}
                {assignedUsers.length > 0 && (
                  <div className="space-y-2">
                    <Label>Assigned Users</Label>
                    <div className="space-y-2">
                      {getSelectedUserDetails().map(user => (
                        <div key={user._id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUser(user._id?.toString() || '')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Permission Settings */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Permission Settings</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowDownload">Allow Download</Label>
                    <p className="text-sm text-muted-foreground">Users can download this document</p>
                  </div>
                  <Switch
                    id="allowDownload"
                    checked={allowDownload}
                    onCheckedChange={setAllowDownload}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowEdit">Allow Edit</Label>
                    <p className="text-sm text-muted-foreground">Users can edit document details</p>
                  </div>
                  <Switch
                    id="allowEdit"
                    checked={allowEdit}
                    onCheckedChange={setAllowEdit}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowDelete">Allow Delete</Label>
                    <p className="text-sm text-muted-foreground">Users can delete this document</p>
                  </div>
                  <Switch
                    id="allowDelete"
                    checked={allowDelete}
                    onCheckedChange={setAllowDelete}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="metadata" className="space-y-4">
        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tags & Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={uploading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={uploading || !selectedFile || !name}>
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </>
          )}
        </Button>
      </div>
    </Tabs>
  );
}
