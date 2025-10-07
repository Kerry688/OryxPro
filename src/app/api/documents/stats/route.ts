import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const documentsCollection = db.collection('documents');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Get total documents count
    const totalDocuments = await documentsCollection.countDocuments({ isActive: true });

    // Get total size of all documents
    const totalSizeResult = await documentsCollection.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalSize: { $sum: '$metadata.size' } } }
    ]).toArray();
    const totalSize = totalSizeResult[0]?.totalSize || 0;

    // Get documents by type (based on mime type)
    const documentsByType = await documentsCollection.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$metadata.mimeType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    // Get recent uploads (last 10)
    const recentUploads = await documentsCollection
      .find({ isActive: true })
      .sort({ 'metadata.uploadedAt': -1 })
      .limit(10)
      .toArray();

    // Get most downloaded documents
    const mostDownloaded = await documentsCollection
      .find({ isActive: true })
      .sort({ downloadCount: -1 })
      .limit(10)
      .toArray();

    // Get documents shared with specific user (if userId provided)
    let sharedWithMe = [];
    if (userId) {
      sharedWithMe = await documentsCollection
        .find({
          isActive: true,
          $or: [
            { 'permissions.type': 'public' },
            { 'permissions.assignedUsers.userId': userId }
          ]
        })
        .sort({ 'metadata.uploadedAt': -1 })
        .limit(10)
        .toArray();
    }

    // Get documents uploaded by specific user
    let myDocuments = [];
    if (userId) {
      myDocuments = await documentsCollection
        .find({ 
          isActive: true,
          'metadata.uploadedBy': new ObjectId(userId)
        })
        .sort({ 'metadata.uploadedAt': -1 })
        .limit(10)
        .toArray();
    }

    // Get storage usage by user
    let storageByUser = [];
    if (userId) {
      const userStorageResult = await documentsCollection.aggregate([
        { 
          $match: { 
            isActive: true,
            'metadata.uploadedBy': new ObjectId(userId)
          } 
        },
        { $group: { _id: '$metadata.uploadedBy', totalSize: { $sum: '$metadata.size' } } }
      ]).toArray();
      
      storageByUser = userStorageResult;
    }

    // Get documents by permission type
    const documentsByPermission = await documentsCollection.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$permissions.type', count: { $sum: 1 } } }
    ]).toArray();

    // Get monthly upload statistics (last 12 months)
    const monthlyStats = await documentsCollection.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: '$metadata.uploadedAt' } } },
            month: { $month: { $dateFromString: { dateString: '$metadata.uploadedAt' } } }
          },
          count: { $sum: 1 },
          totalSize: { $sum: '$metadata.size' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]).toArray();

    return NextResponse.json({
      success: true,
      stats: {
        totalDocuments,
        totalSize,
        documentsByType: documentsByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        documentsByPermission: documentsByPermission.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        recentUploads,
        mostDownloaded,
        sharedWithMe,
        myDocuments,
        storageByUser,
        monthlyStats
      }
    });

  } catch (error) {
    console.error('Error fetching document stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch document statistics' },
      { status: 500 }
    );
  }
}


