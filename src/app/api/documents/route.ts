import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Document, CreateDocumentData, DocumentFilter } from '@/lib/models/document';
import { ObjectId } from 'mongodb';
import { uploadFile } from '@/lib/google-storage';

// GET /api/documents - Fetch documents with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const documentsCollection = db.collection('documents');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags')?.split(',').filter(tag => tag.trim() !== '');
    const uploadedBy = searchParams.get('uploadedBy');
    const permissionType = searchParams.get('permissionType');
    const folderId = searchParams.get('folderId');
    const sortBy = searchParams.get('sortBy') || 'uploadedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const userId = searchParams.get('userId'); // Current user ID for permission filtering
    const showMyDocuments = searchParams.get('showMyDocuments') === 'true';
    const showSharedWithMe = searchParams.get('showSharedWithMe') === 'true';

    // Build filter query with permission-based access control
    const filter: any = { 
      isActive: true,
      isFolder: false // Only get documents, not folders
    };
    
    // Permission-based filtering: users can only see documents they have access to
    if (userId) {
      const userObjectId = new ObjectId(userId);
      
      // Handle specific filter requests
      if (showMyDocuments && !showSharedWithMe) {
        // Only show documents uploaded by the user
        filter['metadata.uploadedBy'] = userObjectId;
      } else if (showSharedWithMe && !showMyDocuments) {
        // Only show documents shared with the user (public or assigned)
        filter.$or = [
          { 'permissions.type': 'public' },
          { 'permissions.type': 'assigned', 'permissions.assignedUsers.userId': userId }
        ];
      } else if (showMyDocuments && showSharedWithMe) {
        // Show both my documents and shared documents
        filter.$or = [
          { 'metadata.uploadedBy': userObjectId },
          { 'permissions.type': 'public' },
          { 'permissions.type': 'assigned', 'permissions.assignedUsers.userId': userId }
        ];
      } else {
        // Default: show all documents user has access to
        filter.$or = [
          { 'permissions.type': 'public' }, // Public documents
          { 'metadata.uploadedBy': userObjectId }, // Documents uploaded by the user
          { 'permissions.type': 'assigned', 'permissions.assignedUsers.userId': userId } // Documents assigned to the user
        ];
      }
    }
    
    if (search) {
      const searchFilter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { 'metadata.originalName': { $regex: search, $options: 'i' } },
          { 'metadata.description': { $regex: search, $options: 'i' } },
          { 'metadata.tags': { $in: [new RegExp(search, 'i')] } }
        ]
      };
      
      // Combine with existing filter
      if (filter.$or) {
        filter.$and = [
          { $or: filter.$or },
          searchFilter
        ];
        delete filter.$or;
      } else {
        Object.assign(filter, searchFilter);
      }
    }
    
    if (tags && tags.length > 0) {
      filter['metadata.tags'] = { $in: tags };
    }
    
    if (uploadedBy) {
      filter['metadata.uploadedBy'] = new ObjectId(uploadedBy);
    }
    
    if (permissionType) {
      filter['permissions.type'] = permissionType;
    }

    if (folderId) {
      filter.folderId = new ObjectId(folderId);
    } else {
      // If no folderId specified, get documents in root (folderId is null)
      filter.folderId = null;
    }

    // Build sort query
    const sort: any = {};
    if (sortBy === 'uploadedAt') {
      sort['metadata.uploadedAt'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'name') {
      sort.name = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'size') {
      sort['metadata.size'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'downloadCount') {
      sort.downloadCount = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'viewCount') {
      sort.viewCount = sortOrder === 'asc' ? 1 : -1;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const documents = await documentsCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await documentsCollection.countDocuments(filter);

    return NextResponse.json({
      success: true,
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST /api/documents - Upload new document
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const documentsCollection = db.collection('documents');
    const usersCollection = db.collection('users');

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const permissionType = formData.get('permissionType') as string;
    const assignedUsers = JSON.parse(formData.get('assignedUsers') as string || '[]');
    const allowDownload = formData.get('allowDownload') === 'true';
    const allowEdit = formData.get('allowEdit') === 'true';
    const allowDelete = formData.get('allowDelete') === 'true';
    const uploadedBy = formData.get('uploadedBy') as string;
    const folderId = formData.get('folderId') as string;

    if (!file || !name || !uploadedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload file to Google Cloud Storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadResult = await uploadFile(buffer, file.name, 'documents');

    // Get user information for assigned users
    const assignedUserObjects = await usersCollection
      .find({ _id: { $in: assignedUsers.map((id: string) => new ObjectId(id)) } })
      .toArray();

    const documentUserObjects = assignedUserObjects.map(user => ({
      userId: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      permission: 'view' as const
    }));

    // Create document record
    const documentData = {
      name,
      isFolder: false,
      folderId: folderId ? new ObjectId(folderId) : null,
      metadata: {
        filename: uploadResult.filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: new ObjectId(uploadedBy),
        lastModified: new Date().toISOString(),
        version: 1,
        tags,
        description
      },
      permissions: {
        type: permissionType,
        assignedUsers: documentUserObjects,
        allowDownload,
        allowEdit,
        allowDelete
      },
      filePath: uploadResult.gcsPath,
      publicUrl: uploadResult.publicUrl,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloadCount: 0,
      viewCount: 0
    };

    const result = await documentsCollection.insertOne(documentData);

    return NextResponse.json({
      success: true,
      document: {
        _id: result.insertedId,
        ...documentData
      }
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    // Return more specific error information
    let errorMessage = 'Failed to upload document';
    let statusCode = 500;
    
    if (error.message.includes('MONGODB_URI')) {
      errorMessage = 'Database connection not configured';
      statusCode = 500;
    } else if (error.message.includes('Google Cloud')) {
      errorMessage = 'Cloud storage configuration error';
      statusCode = 500;
    } else if (error.message.includes('Missing required fields')) {
      errorMessage = 'Missing required fields';
      statusCode = 400;
    } else {
      errorMessage = `Upload error: ${error.message}`;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}
