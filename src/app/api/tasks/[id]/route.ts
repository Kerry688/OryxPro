import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Task, UpdateTaskData } from '@/lib/models/task';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const tasksCollection = db.collection<Task>('tasks');

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: 'Invalid Task ID' }, { status: 400 });
    }

    const task = await tasksCollection.findOne({ _id: new ObjectId(params.id) });

    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: task });

  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const tasksCollection = db.collection<Task>('tasks');

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: 'Invalid Task ID' }, { status: 400 });
    }

    const updateData: UpdateTaskData = await request.json();
    delete (updateData as any)._id; // Prevent _id from being updated

    // If status is being changed to completed, set completed date
    if (updateData.status === 'completed' && !updateData.completedDate) {
      updateData.completedDate = new Date();
    }

    // If status is being changed from completed to something else, clear completed date
    if (updateData.status && updateData.status !== 'completed') {
      updateData.completedDate = undefined;
    }

    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    // Fetch updated task
    const updatedTask = await tasksCollection.findOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully'
    });

  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const tasksCollection = db.collection<Task>('tasks');

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: 'Invalid Task ID' }, { status: 400 });
    }

    const result = await tasksCollection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
