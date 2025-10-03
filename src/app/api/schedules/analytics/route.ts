import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { ScheduleAnalytics } from '@/lib/models/schedule';

// GET /api/schedules/analytics - Get schedule analytics
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const { searchParams } = new URL(request.url);
    
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const technicianId = searchParams.get('technicianId');

    // Build query
    const query: any = {};
    
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) {
        query.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.date.$lte = new Date(dateTo);
      }
    }
    
    if (technicianId) {
      query.technicianId = technicianId;
    }

    // Get total schedules
    const totalSchedules = await db.collection('technicianSchedules').countDocuments(query);
    
    // Get completed schedules
    const completedSchedules = await db.collection('technicianSchedules').countDocuments({
      ...query,
      status: 'completed'
    });
    
    // Get pending schedules
    const pendingSchedules = await db.collection('technicianSchedules').countDocuments({
      ...query,
      status: { $in: ['available', 'busy'] }
    });
    
    // Get cancelled schedules
    const cancelledSchedules = await db.collection('technicianSchedules').countDocuments({
      ...query,
      status: 'cancelled'
    });

    // Get recurring schedules
    const recurringSchedules = await db.collection('technicianSchedules').countDocuments({
      ...query,
      isRecurring: true
    });

    // Calculate average completion time
    const schedulesWithDuration = await db.collection('technicianSchedules').find({
      ...query,
      actualDuration: { $exists: true, $ne: null }
    }).toArray();

    const averageCompletionTime = schedulesWithDuration.length > 0 
      ? schedulesWithDuration.reduce((sum, schedule) => sum + (schedule.actualDuration || 0), 0) / schedulesWithDuration.length
      : 0;

    // Get technician utilization
    const technicianUtilization = await db.collection('technicianSchedules').aggregate([
      { $match: query },
      {
        $group: {
          _id: '$technicianId',
          technicianName: { $first: '$technicianName' },
          totalHours: { $sum: { $divide: ['$estimatedDuration', 60] } },
          workingHours: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                { $divide: ['$actualDuration', 60] },
                0
              ]
            }
          }
        }
      },
      {
        $addFields: {
          utilizationRate: {
            $cond: [
              { $gt: ['$totalHours', 0] },
              { $multiply: [{ $divide: ['$workingHours', '$totalHours'] }, 100] },
              0
            ]
          }
        }
      }
    ]).toArray();

    // Get monthly trends
    const monthlyTrends = await db.collection('technicianSchedules').aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          schedules: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalHours: { $sum: { $divide: ['$estimatedDuration', 60] } }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]).toArray();

    // Get top technicians
    const topTechnicians = await db.collection('technicianSchedules').aggregate([
      { $match: { ...query, status: 'completed' } },
      {
        $group: {
          _id: '$technicianId',
          technicianName: { $first: '$technicianName' },
          completedJobs: { $sum: 1 },
          totalHours: { $sum: { $divide: ['$actualDuration', 60] } }
        }
      },
      {
        $sort: { completedJobs: -1 }
      },
      { $limit: 10 }
    ]).toArray();

    // Get schedule conflicts (overlapping schedules)
    const scheduleConflicts = await db.collection('technicianSchedules').aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'technicianSchedules',
          let: { 
            techId: '$technicianId',
            startTime: '$startTime',
            endTime: '$endTime',
            scheduleId: '$_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$technicianId', '$$techId'] },
                    { $ne: ['$_id', '$$scheduleId'] },
                    {
                      $or: [
                        {
                          $and: [
                            { $lt: ['$startTime', '$$endTime'] },
                            { $gt: ['$endTime', '$$startTime'] }
                          ]
                        }
                      ]
                    }
                  ]
                }
              }
            }
          ],
          as: 'conflicts'
        }
      },
      {
        $match: {
          conflicts: { $ne: [] }
        }
      }
    ]).toArray();

    const analytics: ScheduleAnalytics = {
      totalSchedules,
      completedSchedules,
      pendingSchedules,
      warrantyCoveredRequests: 0, // Not applicable for schedules
      billableRequests: 0, // Not applicable for schedules
      mixedRequests: 0, // Not applicable for schedules
      averageResolutionTime: averageCompletionTime,
      totalRevenue: 0, // Not applicable for schedules
      warrantyCosts: 0, // Not applicable for schedules
      topIssues: [], // Not applicable for schedules
      technicianPerformance: technicianUtilization.map(tech => ({
        technician: tech.technicianName,
        completedJobs: tech.workingHours,
        averageTime: tech.totalHours > 0 ? tech.totalHours / tech.workingHours : 0,
        customerRating: 0 // Would need customer feedback system
      })),
      monthlyTrends: monthlyTrends.map(trend => ({
        month: `${trend._id.year}-${trend._id.month.toString().padStart(2, '0')}`,
        requests: trend.schedules,
        revenue: 0, // Not applicable for schedules
        warrantyCosts: 0 // Not applicable for schedules
      })),
      topTechnicians: topTechnicians.map(tech => ({
        technicianId: tech._id,
        technicianName: tech.technicianName,
        completedJobs: tech.completedJobs,
        averageRating: 0, // Would need rating system
        totalHours: tech.totalHours
      }))
    };

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Error fetching schedule analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schedule analytics' },
      { status: 500 }
    );
  }
}
