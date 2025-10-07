'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  FolderPlus,
  Users,
  Globe,
  Lock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentPermission, FolderStructure } from '@/lib/models/document';

interface FolderCreateDialogProps {
  onSuccess: () => void;
  onCancel: () => void;
  parentFolder?: FolderStructure | null;
  folders: FolderStructure[];
}

export function FolderCreateDialog({ onSuccess, onCancel, parentFolder, folders }: FolderCreateDialogProps) {
  const { user } = useAuth();
  const [folderName, setFolderName] = useState('');
  const [permissionType, setPermissionType] = useState<DocumentPermission>('private');
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [allowDownload, setAllowDownload] = useState(true);
  const [allowEdit, setAllowEdit] = useState(false);
  const [allowDelete, setAllowDelete] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleSubmit = async () => {
    if (!folderName.trim() || !user) {
      alert('Please enter a folder name');
      return;
    }

    // Check if folder name already exists in the same parent folder
    const existingFolder = folders.find(f => 
      f.name.toLowerCase() === folderName.toLowerCase() && 
      f.folderId === parentFolder?._id
    );

    if (existingFolder) {
      alert('A folder with this name already exists in the current location');
      return;
    }

    setCreating(true);

    try {
      const folderData = {
        name: folderName.trim(),
        parentFolderId: parentFolder?._id || null,
        permissions: {
          type: permissionType,
          assignedUsers,
          allowDownload,
          allowEdit,
          allowDelete
        },
        createdBy: user._id
      };

      const response = await fetch('/api/documents/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(folderData),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        let errorMessage = 'Failed to create folder';
        
        if (data.error) {
          if (data.error.includes('already exists')) {
            errorMessage = 'A folder with this name already exists in the current location';
          } else if (data.error.includes('database')) {
            errorMessage = 'Database error. Please try again later.';
          } else {
            errorMessage = data.error;
          }
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      
      let errorMessage = 'Failed to create folder';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Folder Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="folderName">Folder Name *</Label>
          <Input
            id="folderName"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
          />
        </div>

        {parentFolder && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Creating folder inside: <span className="font-medium">{parentFolder.name}</span>
            </p>
          </div>
        )}

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
                  <span>Public</span>
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Private</span>
                </div>
              </SelectItem>
              <SelectItem value="assigned">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Assigned Users</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Permissions */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Folder Permissions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowDownload">Allow Download</Label>
                <p className="text-sm text-muted-foreground">Users can download files from this folder</p>
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
                <p className="text-sm text-muted-foreground">Users can edit folder contents</p>
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
                <p className="text-sm text-muted-foreground">Users can delete files from this folder</p>
              </div>
              <Switch
                id="allowDelete"
                checked={allowDelete}
                onCheckedChange={setAllowDelete}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel} disabled={creating}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={creating || !folderName.trim()}>
          {creating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </>
          ) : (
            <>
              <FolderPlus className="h-4 w-4 mr-2" />
              Create Folder
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
