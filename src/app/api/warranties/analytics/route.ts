import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { WarrantyAnalytics } from '@/lib/models/warranty';

// GET /api/warranties/analytics - Get warranty analytics
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const { searchParams } = new URL(request.url);
    
    const period = searchParams.get('period') || 'monthly';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Set date range based on period
    let dateRange: { start: Date; end: Date };
    const now = new Date();
    
    if (startDate && endDate) {
      dateRange = {
        start: new Date(startDate),
        end: new Date(endDate)
      };
    } else {
      // Default to last 30 days
      const start = new Date();
      start.setDate(start.getDate() - 30);
      dateRange = { start, end: now };
    }

    // Get warranty metrics
    const totalWarranties = await db.collection('warranties').countDocuments({
      createdAt: { $gte: dateRange.start, $lte: dateRange.end }
    });

    const activeWarranties = await db.collection('warranties').countDocuments({
      status: 'active',
      endDate: { $gte: now }
    });

    const expiredWarranties = await db.collection('warranties').countDocuments({
      status: 'expired',
      endDate: { $lt: now }
    });

    // Get claim metrics
    const totalClaims = await db.collection('warranty_claims').countDocuments({
      createdAt: { $gte: dateRange.start, $lte: dateRange.end }
    });

    const approvedClaims = await db.collection('warranty_claims').countDocuments({
      status: 'completed',
      createdAt: { $gte: dateRange.start, $lte: dateRange.end }
    });

    const rejectedClaims = await db.collection('warranty_claims').countDocuments({
      status: 'rejected',
      createdAt: { $gte: dateRange.start, $lte: dateRange.end }
    });

    // Calculate average claim time
    const completedClaims = await db.collection('warranty_claims').find({
      status: 'completed',
      actualResolutionDate: { $exists: true },
      createdAt: { $gte: dateRange.start, $lte: dateRange.end }
    }).toArray();

    const averageClaimTime = completedClaims.length > 0 
      ? completedClaims.reduce((sum, claim) => {
          const resolutionTime = new Date(claim.actualResolutionDate).getTime() - new Date(claim.createdAt).getTime();
          return sum + (resolutionTime / (1000 * 60 * 60 * 24)); // Convert to days
        }, 0) / completedClaims.length
      : 0;

    // Calculate claim approval rate
    const claimApprovalRate = totalClaims > 0 ? (approvedClaims / totalClaims) * 100 : 0;

    // Get total claim cost
    const claimCosts = await db.collection('warranty_claims').aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: dateRange.start, $lte: dateRange.end }
        }
      },
      {
        $group: {
          _id: null,
          totalCost: { $sum: '$resolution.cost' }
        }
      }
    ]).toArray();

    const totalClaimCost = claimCosts.length > 0 ? claimCosts[0].totalCost : 0;
    const averageClaimCost = approvedClaims > 0 ? totalClaimCost / approvedClaims : 0;

    // Get trends (comparing with previous period)
    const previousStart = new Date(dateRange.start);
    const previousEnd = new Date(dateRange.end);
    const periodLength = dateRange.end.getTime() - dateRange.start.getTime();
    previousStart.setTime(previousStart.getTime() - periodLength);
    previousEnd.setTime(previousEnd.getTime() - periodLength);

    const previousWarranties = await db.collection('warranties').countDocuments({
      createdAt: { $gte: previousStart, $lte: previousEnd }
    });

    const previousClaims = await db.collection('warranty_claims').countDocuments({
      createdAt: { $gte: previousStart, $lte: previousEnd }
    });

    const warrantyIssuance = previousWarranties > 0 
      ? ((totalWarranties - previousWarranties) / previousWarranties) * 100 
      : 0;

    const claimVolume = previousClaims > 0 
      ? ((totalClaims - previousClaims) / previousClaims) * 100 
      : 0;

    // Get top issues
    const topIssues = await db.collection('warranty_claims').aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.start, $lte: dateRange.end }
        }
      },
      {
        $group: {
          _id: '$claimType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]).toArray();

    const totalIssueCount = topIssues.reduce((sum, issue) => sum + issue.count, 0);
    const topIssuesWithPercentage = topIssues.map(issue => ({
      issue: issue._id,
      count: issue.count,
      percentage: totalIssueCount > 0 ? (issue.count / totalIssueCount) * 100 : 0
    }));

    // Get product breakdown
    const productBreakdown = await db.collection('warranties').aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.start, $lte: dateRange.end }
        }
      },
      {
        $lookup: {
          from: 'warranty_claims',
          localField: '_id',
          foreignField: 'warrantyCardId',
          as: 'claims'
        }
      },
      {
        $group: {
          _id: '$productId',
          productName: { $first: '$productName' },
          warrantyCount: { $sum: 1 },
          claimCount: { $sum: { $size: '$claims' } }
        }
      },
      {
        $addFields: {
          claimRate: {
            $cond: [
              { $gt: ['$warrantyCount', 0] },
              { $multiply: [{ $divide: ['$claimCount', '$warrantyCount'] }, 100] },
              0
            ]
          }
        }
      },
      {
        $sort: { warrantyCount: -1 }
      },
      {
        $limit: 10
      }
    ]).toArray();

    const analytics: WarrantyAnalytics = {
      period: period as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
      startDate: dateRange.start,
      endDate: dateRange.end,
      metrics: {
        totalWarranties,
        activeWarranties,
        expiredWarranties,
        totalClaims,
        approvedClaims,
        rejectedClaims,
        averageClaimTime,
        claimApprovalRate,
        totalClaimCost,
        averageClaimCost
      },
      trends: {
        warrantyIssuance,
        claimVolume,
        claimApprovalRate,
        averageResolutionTime: averageClaimTime
      },
      topIssues: topIssuesWithPercentage,
      productBreakdown
    };

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching warranty analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch warranty analytics' },
      { status: 500 }
    );
  }
}
