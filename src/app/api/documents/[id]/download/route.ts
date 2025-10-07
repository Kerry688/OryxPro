import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { downloadFile } from '@/lib/google-storage';

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

    // Check if download is allowed
    if (!document.permissions.allowDownload) {
      return NextResponse.json(
        { success: false, error: 'Download not allowed for this document' },
        { status: 403 }
      );
    }

    try {
      // Download the file from Google Cloud Storage
      const downloadResult = await downloadFile(document.metadata.filename);
      
      // Increment download count
      await documentsCollection.updateOne(
        { _id: new ObjectId(params.id) },
        { $inc: { downloadCount: 1 } }
      );

      // Return the file
      return new NextResponse(downloadResult.buffer, {
        status: 200,
        headers: {
          'Content-Type': downloadResult.metadata.contentType,
          'Content-Disposition': `attachment; filename="${document.metadata.originalName}"`,
          'Content-Length': downloadResult.metadata.size.toString(),
        },
      });

    } catch (fileError) {
      console.error('Error downloading file from cloud storage:', fileError);
      return NextResponse.json(
        { success: false, error: 'File not found in cloud storage' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download document' },
      { status: 500 }
    );
  }
}
