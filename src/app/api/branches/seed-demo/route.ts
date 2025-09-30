import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Branch } from '@/lib/models/branch';
import { demoBranches } from '@/lib/data/demo-branches';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const branchesCollection = db.collection<Branch>('branches');

    // Check if branches already exist
    const existingCount = await branchesCollection.countDocuments({});
    if (existingCount > 0) {
      return NextResponse.json({
        success: false,
        message: `Cannot seed demo branches. ${existingCount} branches already exist in the database.`,
        existingCount,
      }, { status: 400 });
    }

    // Prepare branch data with required fields
    const branchData = demoBranches.map(branch => ({
      ...branch,
      createdBy: new ObjectId('507f1f77bcf86cd799439011'), // Demo user ID
      updatedBy: new ObjectId('507f1f77bcf86cd799439011'), // Demo user ID
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await branchesCollection.insertMany(branchData);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} demo branches.`,
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds,
    });
  } catch (error) {
    console.error('Error seeding demo branches:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to seed demo branches',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const branchesCollection = db.collection<Branch>('branches');

    const count = await branchesCollection.countDocuments({});

    return NextResponse.json({
      success: true,
      count: count,
      branches: await branchesCollection.find({}).toArray(),
    });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch branches',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { db } = await connectToDatabase();
    const branchesCollection = db.collection<Branch>('branches');

    const result = await branchesCollection.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} branches.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error clearing branches:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to clear branches',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
