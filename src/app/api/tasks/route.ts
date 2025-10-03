import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Task, CreateTaskData } from '@/lib/models/task';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const tasksCollection = db.collection<Task>('tasks');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    const assignee = searchParams.get('assignee') || '';
    const projectId = searchParams.get('projectId') || '';
    const dueDate = searchParams.get('dueDate') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { taskNumber: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (type && type !== 'all') filter.type = type;
    if (category && category !== 'all') filter.category = category;
    if (assignee && assignee !== 'all') {
      filter['assignees.userId'] = assignee;
    }
    if (projectId && projectId !== 'all') filter.projectId = projectId;

    // Date filtering
    if (dueDate && dueDate !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (dueDate) {
        case 'overdue':
          filter.dueDate = { $lt: today };
          break;
        case 'today':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          filter.dueDate = { $gte: today, $lt: tomorrow };
          break;
        case 'this_week':
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          filter.dueDate = { $gte: today, $lte: weekEnd };
          break;
        case 'this_month':
          const monthEnd = new Date(today);
          monthEnd.setMonth(monthEnd.getMonth() + 1);
          filter.dueDate = { $gte: today, $lte: monthEnd };
          break;
      }
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await tasksCollection
      .find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await tasksCollection.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const tasksCollection = db.collection<Task>('tasks');

    const taskData: CreateTaskData = await request.json();

    // Generate task number
    const taskNumber = `TASK-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    const newTask: Task = {
      _id: new ObjectId(),
      taskNumber,
      status: 'todo',
      priority: 'medium',
      type: 'task',
      category: 'general',
      progress: 0,
      assignees: [],
      checklist: [],
      dependencies: [],
      comments: [],
      attachments: [],
      tags: [],
      watchers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system', // TODO: Get from auth
      createdByName: 'System User',
      ...taskData
    };

    const result = await tasksCollection.insertOne(newTask);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newTask },
      message: 'Task created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
