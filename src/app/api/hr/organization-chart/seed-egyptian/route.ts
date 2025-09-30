import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { egyptianOrganizationChart } from '@/lib/data/egyptian-organization-chart';
import { ObjectId } from 'mongodb';

// POST /api/hr/organization-chart/seed-egyptian - Seed Egyptian organization chart
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const organizationChartsCollection = db.collection('organizationCharts');

    // Clear existing organization charts first
    await organizationChartsCollection.deleteMany({});

    // Prepare the organization chart data
    const chartData = {
      ...egyptianOrganizationChart,
      systemInfo: {
        createdBy: 'system',
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
        isActive: true
      }
    };

    // Insert organization chart
    const result = await organizationChartsCollection.insertOne(chartData);

    return NextResponse.json({
      success: true,
      message: 'Successfully seeded Egyptian organization chart',
      data: {
        insertedId: result.insertedId,
        chartName: egyptianOrganizationChart.name,
        totalEmployees: egyptianOrganizationChart.metadata.totalEmployees,
        totalDepartments: egyptianOrganizationChart.metadata.totalDepartments
      }
    });
  } catch (error) {
    console.error('Error seeding Egyptian organization chart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed Egyptian organization chart' },
      { status: 500 }
    );
  }
}

// GET /api/hr/organization-chart/seed-egyptian - Get seeded organization chart
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const organizationChartsCollection = db.collection('organizationCharts');

    const chart = await organizationChartsCollection.findOne({
      'systemInfo.isActive': true
    });

    if (!chart) {
      return NextResponse.json({
        success: false,
        error: 'No organization chart found'
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        chartId: chart._id,
        name: chart.name,
        description: chart.description,
        totalEmployees: chart.metadata.totalEmployees,
        totalDepartments: chart.metadata.totalDepartments,
        maxDepth: chart.metadata.maxDepth,
        lastUpdated: chart.metadata.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error fetching organization chart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization chart' },
      { status: 500 }
    );
  }
}

// DELETE /api/hr/organization-chart/seed-egyptian - Clear organization chart
export async function DELETE(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const organizationChartsCollection = db.collection('organizationCharts');

    const result = await organizationChartsCollection.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} organization charts`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Error clearing organization chart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear organization chart' },
      { status: 500 }
    );
  }
}
