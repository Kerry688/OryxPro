import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT /api/documents/folders/[id] - Update folder
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const documentsCollection = db.collection('documents');

    const body = await request.json();
    const { name, permissions } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Folder name is required' },
        { status: 400 }
      );
    }

    // Get current folder
    const currentFolder = await documentsCollection.findOne({
      _id: new ObjectId(params.id),
      isFolder: true,
      isActive: true
    });

    if (!currentFolder) {
      return NextResponse.json(
        { success: false, error: 'Folder not found' },
        { status: 404 }
      );
    }

    // Check if new name conflicts with existing folder in same parent
    const existingFolder = await documentsCollection.findOne({
      name: name.trim(),
      folderId: currentFolder.folderId,
      isFolder: true,
      isActive: true,
      _id: { $ne: new ObjectId(params.id) }
    });

    if (existingFolder) {
      return NextResponse.json(
        { success: false, error: 'A folder with this name already exists in the current location' },
        { status: 409 }
      );
    }

    // Update folder
    const updateData: any = {
      name: name.trim(),
      updatedAt: new Date().toISOString()
    };

    if (permissions) {
      updateData.permissions = {
        ...currentFolder.permissions,
        ...permissions
      };
    }

    const result = await documentsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Folder not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Folder updated successfully'
    });

  } catch (error) {
    console.error('Error updating folder:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update folder' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/folders/[id] - Delete folder
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const documentsCollection = db.collection('documents');

    const folderId = new ObjectId(params.id);

    // Check if folder exists
    const folder = await documentsCollection.findOne({
      _id: folderId,
      isFolder: true,
      isActive: true
    });

    if (!folder) {
      return NextResponse.json(
        { success: false, error: 'Folder not found' },
        { status: 404 }
      );
    }

    // Check if folder has children (documents or subfolders)
    const childrenCount = await documentsCollection.countDocuments({
      folderId: folderId,
      isActive: true
    });

    if (childrenCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete folder that contains files or subfolders' },
        { status: 400 }
      );
    }

    // Delete folder (soft delete)
    await documentsCollection.updateOne(
      { _id: folderId },
      { $set: { isActive: false, updatedAt: new Date().toISOString() } }
    );

    // Remove from parent folder's children array
    if (folder.folderId) {
      await documentsCollection.updateOne(
        { _id: folder.folderId },
        { $pull: { children: folderId } }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Folder deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete folder' },
      { status: 500 }
    );
  }
}

// GET /api/documents/folders/[id] - Get folder details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const documentsCollection = db.collection('documents');

    const folder = await documentsCollection.findOne({
      _id: new ObjectId(params.id),
      isFolder: true,
      isActive: true
    });

    if (!folder) {
      return NextResponse.json(
        { success: false, error: 'Folder not found' },
        { status: 404 }
      );
    }

    // Get folder contents (documents and subfolders)
    const contents = await documentsCollection
      .find({
        folderId: new ObjectId(params.id),
        isActive: true
      })
      .sort({ isFolder: -1, name: 1 }) // Folders first, then files
      .toArray();

    return NextResponse.json({
      success: true,
      folder: {
        _id: folder._id,
        name: folder.name,
        folderId: folder.folderId,
        isFolder: folder.isFolder,
        children: folder.children || [],
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
        permissions: folder.permissions,
        contents: contents.map(item => ({
          _id: item._id,
          name: item.name,
          isFolder: item.isFolder,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          permissions: item.permissions,
          metadata: item.metadata
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching folder:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch folder' },
      { status: 500 }
    );
  }
}
