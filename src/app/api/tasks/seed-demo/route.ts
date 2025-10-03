import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Task, TaskStatus, TaskPriority, TaskType, TaskCategory } from '@/lib/models/task';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const tasksCollection = db.collection<Task>('tasks');

    const demoTasks: Omit<Task, '_id'>[] = [
      {
        taskNumber: 'TASK-2024-001',
        title: 'Implement user authentication system',
        description: 'Create a secure authentication system with JWT tokens, password hashing, and session management.',
        status: 'in_progress',
        priority: 'high',
        type: 'feature',
        category: 'development',
        assignees: [
          {
            userId: 'user1',
            userName: 'John Doe',
            userEmail: 'john.doe@example.com',
            assignedAt: new Date()
          }
        ],
        projectId: 'project1',
        projectName: 'Website Redesign',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        estimatedHours: 16,
        actualHours: 8,
        progress: 50,
        checklist: [
          {
            _id: new ObjectId(),
            title: 'Setup JWT authentication',
            completed: true,
            completedAt: new Date(),
            completedBy: 'user1',
            createdAt: new Date()
          },
          {
            _id: new ObjectId(),
            title: 'Implement password hashing',
            completed: true,
            completedAt: new Date(),
            completedBy: 'user1',
            createdAt: new Date()
          },
          {
            _id: new ObjectId(),
            title: 'Create login/logout endpoints',
            completed: false,
            createdAt: new Date()
          },
          {
            _id: new ObjectId(),
            title: 'Add session management',
            completed: false,
            createdAt: new Date()
          }
        ],
        dependencies: [],
        comments: [],
        attachments: [],
        tags: ['authentication', 'security', 'backend'],
        watchers: ['user1', 'user2'],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user1',
        createdByName: 'John Doe'
      },
      {
        taskNumber: 'TASK-2024-002',
        title: 'Fix responsive design issues on mobile',
        description: 'Address mobile responsiveness issues across the website, particularly on the dashboard and product pages.',
        status: 'todo',
        priority: 'medium',
        type: 'bug',
        category: 'design',
        assignees: [
          {
            userId: 'user2',
            userName: 'Jane Smith',
            userEmail: 'jane.smith@example.com',
            assignedAt: new Date()
          }
        ],
        projectId: 'project1',
        projectName: 'Website Redesign',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        estimatedHours: 12,
        progress: 0,
        checklist: [
          {
            _id: new ObjectId(),
            title: 'Test mobile layout on dashboard',
            completed: false,
            createdAt: new Date()
          },
          {
            _id: new ObjectId(),
            title: 'Fix product page mobile layout',
            completed: false,
            createdAt: new Date()
          },
          {
            _id: new ObjectId(),
            title: 'Test on various screen sizes',
            completed: false,
            createdAt: new Date()
          }
        ],
        dependencies: [],
        comments: [],
        attachments: [],
        tags: ['responsive', 'mobile', 'frontend'],
        watchers: ['user2'],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user2',
        createdByName: 'Jane Smith'
      },
      {
        taskNumber: 'TASK-2024-003',
        title: 'Create product documentation',
        description: 'Write comprehensive documentation for the new product features including API documentation and user guides.',
        status: 'review',
        priority: 'medium',
        type: 'documentation',
        category: 'general',
        assignees: [
          {
            userId: 'user3',
            userName: 'Mike Johnson',
            userEmail: 'mike.johnson@example.com',
            assignedAt: new Date()
          }
        ],
        projectId: 'project2',
        projectName: 'Product Documentation',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        estimatedHours: 8,
        actualHours: 6,
        progress: 75,
        checklist: [
          {
            _id: new ObjectId(),
            title: 'API documentation',
            completed: true,
            completedAt: new Date(),
            completedBy: 'user3',
            createdAt: new Date()
          },
          {
            _id: new ObjectId(),
            title: 'User guide creation',
            completed: true,
            completedAt: new Date(),
            completedBy: 'user3',
            createdAt: new Date()
          },
          {
            _id: new ObjectId(),
            title: 'Review and edit',
            completed: false,
            createdAt: new Date()
          }
        ],
        dependencies: [],
        comments: [],
        attachments: [],
        tags: ['documentation', 'api', 'user-guide'],
        watchers: ['user3', 'user1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user3',
        createdByName: 'Mike Johnson'
      },
      {
        taskNumber: 'TASK-2024-004',
        title: 'Optimize database queries',
        description: 'Analyze and optimize slow database queries to improve application performance.',
        status: 'completed',
        priority: 'high',
        type: 'improvement',
        category: 'development',
        assignees: [
          {
            userId: 'user1',
            userName: 'John Doe',
            userEmail: 'john.doe@example.com',
            assignedAt: new Date()
          }
        ],
        projectId: 'project3',
        projectName: 'Performance Optimization',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        estimatedHours: 6,
        actualHours: 8,
        progress: 100,
        checklist: [
          {
            _id: new ObjectId(),
            title: 'Identify slow queries',
            completed: true,
            completedAt: new Date(),
            completedBy: 'user1',
            createdAt: new Date()
          },
          {
            _id: new ObjectId(),
            title: 'Add database indexes',
            completed: true,
            completedAt: new Date(),
            completedBy: 'user1',
            createdAt: new Date()
          },
          {
            _id: new ObjectId(),
            title: 'Test performance improvements',
            completed: true,
            completedAt: new Date(),
            completedBy: 'user1',
            createdAt: new Date()
          }
        ],
        dependencies: [],
        comments: [],
        attachments: [],
        tags: ['database', 'performance', 'optimization'],
        watchers: ['user1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user1',
        createdByName: 'John Doe'
      },
      {
        taskNumber: 'TASK-2024-005',
        title: 'Research new UI framework',
        description: 'Research and evaluate new UI frameworks for potential migration to improve development efficiency.',
        status: 'todo',
        priority: 'low',
        type: 'research',
        category: 'development',
        assignees: [
          {
            userId: 'user2',
            userName: 'Jane Smith',
            userEmail: 'jane.smith@example.com',
            assignedAt: new Date()
          }
        ],
        projectId: 'project4',
        projectName: 'Technology Research',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        estimatedHours: 20,
        progress: 0,
        checklist: [
          {
            _id: new ObjectId(),
            title: 'Compare React vs Vue vs Angular',
            completed: false,
            createdAt: new Date()
          },
          {
            _id: new ObjectId(),
            title: 'Evaluate performance benchmarks',
            completed: false,
            createdAt: new Date()
          },
          {
            _id: new ObjectId(),
            title: 'Create migration plan',
            completed: false,
            createdAt: new Date()
          }
        ],
        dependencies: [],
        comments: [],
        attachments: [],
        tags: ['research', 'ui-framework', 'migration'],
        watchers: ['user2'],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user2',
        createdByName: 'Jane Smith'
      },
      {
        taskNumber: 'TASK-2024-006',
        title: 'Design new logo and branding',
        description: 'Create new logo design and update brand guidelines for the company rebranding initiative.',
        status: 'in_progress',
        priority: 'medium',
        type: 'task',
        category: 'design',
        assignees: [
          {
            userId: 'user4',
            userName: 'Sarah Wilson',
            userEmail: 'sarah.wilson@example.com',
            assignedAt: new Date()
          }
        ],
        projectId: 'project5',
        projectName: 'Company Rebranding',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        estimatedHours: 15,
        actualHours: 5,
        progress: 30,
        checklist: [
          {
            _id: new ObjectId(),
            title: 'Research competitor branding',
            completed: true,
            completedAt: new Date(),
            completedBy: 'user4',
            createdAt: new Date()
          },
          {
            _id: new ObjectId(),
            title: 'Create logo concepts',
            completed: false,
            createdAt: new Date()
          },
          {
            _id: new ObjectId(),
            title: 'Develop brand guidelines',
            completed: false,
            createdAt: new Date()
          }
        ],
        dependencies: [],
        comments: [],
        attachments: [],
        tags: ['design', 'logo', 'branding'],
        watchers: ['user4', 'user1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user4',
        createdByName: 'Sarah Wilson'
      }
    ];

    // Convert to full Task objects with ObjectIds
    const tasksWithIds = demoTasks.map(task => ({
      ...task,
      _id: new ObjectId(),
      checklist: task.checklist.map(item => ({
        ...item,
        _id: new ObjectId()
      }))
    }));

    const result = await tasksCollection.insertMany(tasksWithIds);

    return NextResponse.json({
      success: true,
      data: {
        insertedCount: result.insertedCount,
        insertedIds: Object.values(result.insertedIds)
      },
      message: `Successfully created ${result.insertedCount} demo tasks`
    }, { status: 201 });

  } catch (error) {
    console.error('Error seeding demo tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed demo tasks' },
      { status: 500 }
    );
  }
}
