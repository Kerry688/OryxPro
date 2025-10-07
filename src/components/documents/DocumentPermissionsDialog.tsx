'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users,
  Globe,
  Lock,
  User,
  X,
  Plus,
  Search
} from 'lucide-react';
import { Document, DocumentPermission } from '@/lib/models/document';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface DocumentPermissionsDialogProps {
  document: Document;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DocumentPermissionsDialog({ document, onSuccess, onCancel }: DocumentPermissionsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  // Form state
  const [permissionType, setPermissionType] = useState<DocumentPermission>(document.permissions.type);
  const [assignedUsers, setAssignedUsers] = useState<string[]>(
    document.permissions.assignedUsers.map(user => user.userId)
  );
  const [allowDownload, setAllowDownload] = useState(document.permissions.allowDownload);
  const [allowEdit, setAllowEdit] = useState(document.permissions.allowEdit);
  const [allowDelete, setAllowDelete] = useState(document.permissions.allowDelete);

  useEffect(() => {
    fetchUsers();
  }, []);

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
        setUsers(data.users);
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

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/documents/${document._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permissionType,
          assignedUsers,
          allowDownload,
          allowEdit,
          allowDelete,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        alert(data.error || 'Failed to update permissions');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert('Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedUsers = () => {
    return users.filter(user => assignedUsers.includes(user._id));
  };

  return (
    <div className="space-y-6">

      {/* Permission Type */}
      <div className="space-y-2">
        <Label>Permission Type</Label>
        <Select value={permissionType} onValueChange={(value: DocumentPermission) => setPermissionType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <div>
                  <div className="font-medium">Public</div>
                  <div className="text-xs text-muted-foreground">Anyone can access</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="private">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <div>
                  <div className="font-medium">Private</div>
                  <div className="text-xs text-muted-foreground">Only you can access</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="assigned">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <div>
                  <div className="font-medium">Assigned Users</div>
                  <div className="text-xs text-muted-foreground">Only specific users</div>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assigned Users */}
      {permissionType === 'assigned' && (
        <Card>
          <CardHeader>
            <CardTitle>Assigned Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search for users */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Search results */}
            {searchQuery && filteredUsers.length > 0 && (
              <div className="border rounded-lg p-2 space-y-2 max-h-40 overflow-y-auto">
                {filteredUsers.map(user => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                    onClick={() => addUser(user._id)}
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

            {/* Selected users */}
            {assignedUsers.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Users</Label>
                <div className="space-y-2">
                  {getSelectedUsers().map(user => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUser(user._id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {assignedUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No users assigned</p>
                <p className="text-xs">Search and select users to assign access</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
              <p className="text-sm text-muted-foreground">Users can edit document details and permissions</p>
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
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Updating...
            </>
          ) : (
            'Update Permissions'
          )}
        </Button>
      </div>
    </div>
  );
}
