import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CreateFolderData } from '@/lib/models/document';
import { ObjectId } from 'mongodb';

// POST /api/documents/folders - Create new folder
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const documentsCollection = db.collection('documents');

    const body: CreateFolderData & { createdBy: string } = await request.json();
    const {
      name,
      parentFolderId,
      permissions,
      createdBy
    } = body;

    if (!name || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if folder name already exists in the same parent folder
    const existingFolder = await documentsCollection.findOne({
      name: name.trim(),
      folderId: parentFolderId ? new ObjectId(parentFolderId) : null,
      isFolder: true,
      isActive: true
    });

    if (existingFolder) {
      return NextResponse.json(
        { success: false, error: 'A folder with this name already exists in the current location' },
        { status: 409 }
      );
    }

    // Validate parent folder exists (if specified)
    if (parentFolderId) {
      const parentFolder = await documentsCollection.findOne({
        _id: new ObjectId(parentFolderId),
        isFolder: true,
        isActive: true
      });

      if (!parentFolder) {
        return NextResponse.json(
          { success: false, error: 'Parent folder not found' },
          { status: 404 }
        );
      }
    }

    // Create folder record
    const folderData = {
      name: name.trim(),
      isFolder: true,
      folderId: parentFolderId ? new ObjectId(parentFolderId) : null,
      children: [],
      permissions: {
        type: permissions.type,
        assignedUsers: [], // Will be populated later if needed
        allowDownload: permissions.allowDownload,
        allowEdit: permissions.allowEdit,
        allowDelete: permissions.allowDelete
      },
      metadata: {
        createdBy: new ObjectId(createdBy),
        createdAt: new Date().toISOString(),
        description: `Folder: ${name.trim()}`
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await documentsCollection.insertOne(folderData);

    // Update parent folder's children array if parent exists
    if (parentFolderId) {
      await documentsCollection.updateOne(
        { _id: new ObjectId(parentFolderId) },
        { $push: { children: result.insertedId } }
      );
    }

    return NextResponse.json({
      success: true,
      folder: {
        _id: result.insertedId,
        ...folderData
      }
    });

  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create folder' },
      { status: 500 }
    );
  }
}

// GET /api/documents/folders - Get folder structure
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const documentsCollection = db.collection('documents');

    const { searchParams } = new URL(request.url);
    const parentFolderId = searchParams.get('parentFolderId');

    // Build query for folders
    const filter: any = {
      isFolder: true,
      isActive: true
    };

    if (parentFolderId) {
      filter.folderId = new ObjectId(parentFolderId);
    } else {
      filter.folderId = null; // Root level folders
    }

    const folders = await documentsCollection
      .find(filter)
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      folders: folders.map(folder => ({
        _id: folder._id,
        name: folder.name,
        folderId: folder.folderId,
        isFolder: folder.isFolder,
        children: folder.children || [],
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
        permissions: folder.permissions
      }))
    });

  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch folders' },
      { status: 500 }
    );
  }
}
