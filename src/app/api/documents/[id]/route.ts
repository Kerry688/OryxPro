import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { deleteFile } from '@/lib/google-storage';

// GET /api/documents/[id] - Get document details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const documentsCollection = db.collection('documents');
    
    // Get user ID from query params for permission check
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const document = await documentsCollection.findOne({
      _id: new ObjectId(params.id),
      isActive: true
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this document
    if (userId) {
      const hasAccess = 
        document.permissions.type === 'public' ||
        document.metadata.uploadedBy.toString() === userId ||
        (document.permissions.type === 'assigned' && 
         document.permissions.assignedUsers.some((user: any) => user.userId === userId));

      if (!hasAccess) {
        return NextResponse.json(
          { success: false, error: 'Access denied' },
          { status: 403 }
        );
      }
    }

    // Increment view count
    await documentsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $inc: { viewCount: 1 } }
    );

    return NextResponse.json({
      success: true,
      document
    });

  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Update document
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const documentsCollection = db.collection('documents');
    const usersCollection = db.collection('users');
    
    // Get user ID from query params for permission check
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // First, get the document to check permissions
    const existingDocument = await documentsCollection.findOne({
      _id: new ObjectId(params.id),
      isActive: true
    });

    if (!existingDocument) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to edit this document
    if (userId) {
      const isOwner = existingDocument.metadata.uploadedBy.toString() === userId;
      const hasEditPermission = isOwner || 
        (existingDocument.permissions.allowEdit && 
         existingDocument.permissions.type === 'assigned' &&
         existingDocument.permissions.assignedUsers.some((user: any) => 
           user.userId === userId && ['edit', 'admin'].includes(user.permission)
         ));

      if (!hasEditPermission) {
        return NextResponse.json(
          { success: false, error: 'Access denied' },
          { status: 403 }
        );
      }
    }
    
    const body = await request.json();
    const {
      name,
      description,
      tags,
      permissionType,
      assignedUsers,
      allowDownload,
      allowEdit,
      allowDelete
    } = body;

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

    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (name) updateData.name = name;
    if (description !== undefined) updateData['metadata.description'] = description;
    if (tags) updateData['metadata.tags'] = tags;
    if (permissionType) updateData['permissions.type'] = permissionType;
    if (assignedUsers) updateData['permissions.assignedUsers'] = documentUserObjects;
    if (allowDownload !== undefined) updateData['permissions.allowDownload'] = allowDownload;
    if (allowEdit !== undefined) updateData['permissions.allowEdit'] = allowEdit;
    if (allowDelete !== undefined) updateData['permissions.allowDelete'] = allowDelete;

    const result = await documentsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    const updatedDocument = await documentsCollection.findOne({
      _id: new ObjectId(params.id)
    });

    return NextResponse.json({
      success: true,
      document: updatedDocument
    });

  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Delete document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const documentsCollection = db.collection('documents');
    
    // Get user ID from query params for permission check
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const document = await documentsCollection.findOne({
      _id: new ObjectId(params.id),
      isActive: true
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to delete this document
    if (userId) {
      const isOwner = document.metadata.uploadedBy.toString() === userId;
      const hasDeletePermission = isOwner || 
        (document.permissions.allowDelete && 
         document.permissions.type === 'assigned' &&
         document.permissions.assignedUsers.some((user: any) => 
           user.userId === userId && user.permission === 'admin'
         ));

      if (!hasDeletePermission) {
        return NextResponse.json(
          { success: false, error: 'Access denied' },
          { status: 403 }
        );
      }
    }

    // Delete the file from Google Cloud Storage
    try {
      await deleteFile(document.metadata.filename);
    } catch (fileError) {
      console.error('Error deleting file from cloud storage:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Soft delete from database
    await documentsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { isActive: false, deletedAt: new Date().toISOString() } }
    );

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
