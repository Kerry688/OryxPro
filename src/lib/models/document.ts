export type DocumentPermission = 'public' | 'private' | 'assigned';

export interface DocumentUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  permission: 'view' | 'edit' | 'admin';
}

export interface DocumentMetadata {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  lastModified: string;
  version: number;
  tags: string[];
  description?: string;
}

export interface DocumentPermissions {
  type: DocumentPermission;
  assignedUsers: DocumentUser[];
  allowDownload: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  expiresAt?: string;
}

export interface Document {
  _id: string;
  name: string;
  metadata: DocumentMetadata;
  permissions: DocumentPermissions;
  filePath: string;
  thumbnailPath?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  downloadCount: number;
  viewCount: number;
  folderId?: string; // Reference to parent folder
  isFolder?: boolean; // True if this is a folder, false if it's a file
  children?: string[]; // Array of child document/folder IDs
}

export interface CreateDocumentData {
  name: string;
  description?: string;
  tags: string[];
  permissions: Omit<DocumentPermissions, 'assignedUsers'> & {
    assignedUsers: string[];
  };
  file: File;
}

export interface UpdateDocumentData {
  name?: string;
  description?: string;
  tags?: string[];
  permissions?: Partial<DocumentPermissions>;
}

export interface DocumentFilter {
  search?: string;
  tags?: string[];
  uploadedBy?: string;
  permissionType?: DocumentPermission;
  mimeType?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'name' | 'uploadedAt' | 'size' | 'downloadCount' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

export interface DocumentStats {
  totalDocuments: number;
  totalSize: number;
  documentsByType: Record<string, number>;
  recentUploads: Document[];
  mostDownloaded: Document[];
  sharedWithMe: Document[];
}

export interface DocumentActivity {
  _id: string;
  documentId: string;
  userId: string;
  userName: string;
  action: 'upload' | 'download' | 'view' | 'edit' | 'share' | 'delete' | 'create_folder' | 'rename_folder' | 'move';
  timestamp: string;
  details?: string;
}

export interface CreateFolderData {
  name: string;
  parentFolderId?: string;
  permissions: Omit<DocumentPermissions, 'assignedUsers'> & {
    assignedUsers: string[];
  };
}

export interface FolderStructure {
  _id: string;
  name: string;
  folderId?: string;
  isFolder: boolean;
  children: FolderStructure[];
  createdAt: string;
  updatedAt: string;
  permissions: DocumentPermissions;
}

