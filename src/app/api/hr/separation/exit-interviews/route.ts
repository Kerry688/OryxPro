import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CreateExitInterviewDTO, SubmitExitInterviewDTO } from '@/lib/models/separation';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const separationId = searchParams.get('separationId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Build query
    let query: any = {};
    
    if (separationId) {
      query.separationId = separationId;
    }
    
    if (status) {
      query.status = status;
    }
    
    const exitInterviews = await db.collection('exitInterviews')
      .find(query)
      .sort({ interviewDate: -1 })
      .limit(limit)
      .skip(offset)
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: exitInterviews,
      count: exitInterviews.length
    });
  } catch (error) {
    console.error('Error fetching exit interviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exit interviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body: CreateExitInterviewDTO = await request.json();
    
    const { separationId, interviewerId, interviewDate, interviewType, interviewLocation } = body;
    
    if (!separationId || !interviewerId || !interviewDate || !interviewType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get separation request details
    const separationRequest = await db.collection('separationRequests').findOne({ separationId });
    if (!separationRequest) {
      return NextResponse.json(
        { success: false, error: 'Separation request not found' },
        { status: 404 }
      );
    }
    
    // Get interviewer details
    const interviewer = await db.collection('employees').findOne({ employeeId: interviewerId });
    if (!interviewer) {
      return NextResponse.json(
        { success: false, error: 'Interviewer not found' },
        { status: 404 }
      );
    }
    
    // Default interview questions
    const defaultQuestions = [
      // Job Satisfaction
      {
        questionId: 'Q001',
        category: 'job_satisfaction',
        question: 'How would you rate your overall job satisfaction?',
        isRequired: true
      },
      {
        questionId: 'Q002',
        category: 'job_satisfaction',
        question: 'What did you enjoy most about your role?',
        isRequired: true
      },
      {
        questionId: 'Q003',
        category: 'job_satisfaction',
        question: 'What did you find most challenging about your role?',
        isRequired: false
      },
      
      // Management
      {
        questionId: 'Q004',
        category: 'management',
        question: 'How would you rate your relationship with your direct manager?',
        isRequired: true
      },
      {
        questionId: 'Q005',
        category: 'management',
        question: 'Did you receive adequate feedback and support from management?',
        isRequired: true
      },
      
      // Work Environment
      {
        questionId: 'Q006',
        category: 'work_environment',
        question: 'How would you describe the work environment and culture?',
        isRequired: true
      },
      {
        questionId: 'Q007',
        category: 'work_environment',
        question: 'Did you feel valued and recognized for your contributions?',
        isRequired: true
      },
      
      // Compensation
      {
        questionId: 'Q008',
        category: 'compensation',
        question: 'How would you rate your compensation and benefits?',
        isRequired: true
      },
      
      // Career Development
      {
        questionId: 'Q009',
        category: 'career_development',
        question: 'Did you have opportunities for career growth and development?',
        isRequired: true
      },
      {
        questionId: 'Q010',
        category: 'career_development',
        question: 'Were training and development opportunities adequate?',
        isRequired: false
      },
      
      // Reasons for Leaving
      {
        questionId: 'Q011',
        category: 'other',
        question: 'What are the main reasons for leaving the company?',
        isRequired: true
      },
      {
        questionId: 'Q012',
        category: 'other',
        question: 'Is there anything that could have been done to retain you?',
        isRequired: false
      },
      
      // Suggestions
      {
        questionId: 'Q013',
        category: 'suggestions',
        question: 'What suggestions do you have for improving the company?',
        isRequired: false
      },
      {
        questionId: 'Q014',
        category: 'suggestions',
        question: 'Would you recommend this company to others?',
        isRequired: true
      }
    ];
    
    // Create exit interview
    const exitInterview = {
      interviewId: `EINT${Date.now()}`,
      separationId,
      employeeId: separationRequest.employeeId,
      employeeName: separationRequest.employeeName,
      interviewerId,
      interviewerName: interviewer.name,
      interviewerRole: interviewer.position,
      
      interviewDate: new Date(interviewDate),
      interviewDuration: 0,
      interviewType,
      interviewLocation,
      
      status: 'scheduled',
      
      questions: defaultQuestions,
      
      overallSatisfaction: 0,
      wouldRecommend: false,
      mainReasonsForLeaving: [],
      suggestionsForImprovement: '',
      additionalComments: '',
      
      followUpActions: [],
      
      attachments: [],
      
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: interviewerId,
      updatedBy: interviewerId
    };
    
    await db.collection('exitInterviews').insertOne(exitInterview);
    
    return NextResponse.json({
      success: true,
      data: exitInterview,
      message: 'Exit interview scheduled successfully'
    });
  } catch (error) {
    console.error('Error creating exit interview:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create exit interview' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body: SubmitExitInterviewDTO & { interviewId: string } = await request.json();
    
    const { interviewId, ...interviewData } = body;
    
    if (!interviewId) {
      return NextResponse.json(
        { success: false, error: 'Interview ID is required' },
        { status: 400 }
      );
    }
    
    // Update interview with responses
    const updateObject = {
      ...interviewData,
      status: 'completed',
      updatedAt: new Date()
    };
    
    // Update questions with responses
    if (interviewData.questions) {
      const interview = await db.collection('exitInterviews').findOne({ interviewId });
      if (interview) {
        const updatedQuestions = interview.questions.map((q: any) => {
          const response = interviewData.questions.find(r => r.questionId === q.questionId);
          return {
            ...q,
            response: response?.response || q.response,
            rating: response?.rating || q.rating
          };
        });
        
        updateObject.questions = updatedQuestions;
      }
    }
    
    await db.collection('exitInterviews').updateOne(
      { interviewId },
      { $set: updateObject }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Exit interview completed successfully'
    });
  } catch (error) {
    console.error('Error updating exit interview:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update exit interview' },
      { status: 500 }
    );
  }
}
