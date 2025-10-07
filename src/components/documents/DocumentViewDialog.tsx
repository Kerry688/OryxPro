'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  Eye, 
  File, 
  Image, 
  FileText, 
  Archive,
  Users,
  Globe,
  Lock,
  Calendar,
  User,
  BarChart3,
  Tag,
  Clock,
  Share2
} from 'lucide-react';
import { Document } from '@/lib/models/document';

interface DocumentViewDialogProps {
  document: Document;
  onClose: () => void;
}

export function DocumentViewDialog({ document, onClose }: DocumentViewDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/documents/${document._id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = document.metadata.originalName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      setLoading(false);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const FileIcon = getFileIcon(document.metadata.mimeType);
  const PermissionIcon = getPermissionIcon(document.permissions.type);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileIcon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{document.name}</h3>
            <p className="text-muted-foreground">{document.metadata.originalName}</p>
          </div>
        </div>
        <Button variant="outline" onClick={onClose}>
          ×
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {document.metadata.mimeType.startsWith('image/') ? (
                <div className="text-center">
                  <img
                    src={`/api/documents/${document._id}/preview`}
                    alt={document.name}
                    className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.style.display = 'flex';
                    }}
                  />
                  <div className="hidden items-center justify-center h-48 bg-muted rounded-lg">
                    <div className="text-center">
                      <Image className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Image preview not available</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
                  <div className="text-center">
                    <FileIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Preview not available for this file type</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {document.metadata.mimeType}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Document Details */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={handleDownload}
                disabled={loading || !document.permissions.allowDownload}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </>
                )}
              </Button>
              
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </CardContent>
          </Card>

          {/* Document Information */}
          <Card>
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">File Size</span>
                <span className="text-sm font-medium">{formatFileSize(document.metadata.size)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">File Type</span>
                <span className="text-sm font-medium">{document.metadata.mimeType}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="text-sm font-medium">{document.metadata.version}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Uploaded</span>
                <span className="text-sm font-medium">{formatDate(document.metadata.uploadedAt)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Modified</span>
                <span className="text-sm font-medium">{formatDate(document.metadata.lastModified)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <PermissionIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium capitalize">{document.permissions.type}</span>
              </div>
              
              {document.permissions.assignedUsers.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Assigned Users:</p>
                  <div className="space-y-1">
                    {document.permissions.assignedUsers.slice(0, 3).map((user, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">
                          {user.firstName} {user.lastName}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {user.permission}
                        </Badge>
                      </div>
                    ))}
                    {document.permissions.assignedUsers.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{document.permissions.assignedUsers.length - 3} more users
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Download</span>
                  <Badge variant={document.permissions.allowDownload ? 'default' : 'secondary'}>
                    {document.permissions.allowDownload ? 'Allowed' : 'Not Allowed'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Edit</span>
                  <Badge variant={document.permissions.allowEdit ? 'default' : 'secondary'}>
                    {document.permissions.allowEdit ? 'Allowed' : 'Not Allowed'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Delete</span>
                  <Badge variant={document.permissions.allowDelete ? 'default' : 'secondary'}>
                    {document.permissions.allowDelete ? 'Allowed' : 'Not Allowed'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Downloads</span>
                </div>
                <span className="text-sm font-medium">{document.downloadCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Views</span>
                </div>
                <span className="text-sm font-medium">{document.viewCount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {document.metadata.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="h-4 w-4" />
                  <span>Tags</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {document.metadata.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {document.metadata.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {document.metadata.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
