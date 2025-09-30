import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SkillGapAnalysis, CreateSkillGapAnalysisDTO } from '@/lib/models/training';
import { ObjectId } from 'mongodb';

// GET /api/hr/training/skill-gaps - Get skill gap analyses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const employeeId = searchParams.get('employeeId') || '';
    const positionId = searchParams.get('positionId') || '';

    const { db } = await connectToDatabase();
    const skillGapsCollection = db.collection('skillGapAnalyses');

    // Build filter
    const filter: any = { 'systemInfo.isActive': true };
    
    if (employeeId) filter.employeeId = employeeId;
    if (positionId) filter.positionId = positionId;

    // Get total count
    const total = await skillGapsCollection.countDocuments(filter);
    
    // Get skill gap analyses with pagination
    const skillGaps = await skillGapsCollection
      .find(filter)
      .sort({ analysisDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: skillGaps,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching skill gap analyses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skill gap analyses' },
      { status: 500 }
    );
  }
}

// POST /api/hr/training/skill-gaps - Create skill gap analysis
export async function POST(request: NextRequest) {
  try {
    const analysisData: CreateSkillGapAnalysisDTO = await request.json();
    const { db } = await connectToDatabase();
    const skillGapsCollection = db.collection('skillGapAnalyses');

    // Generate analysis ID
    const count = await skillGapsCollection.countDocuments();
    const analysisId = `SGA${String(count + 1).padStart(3, '0')}`;

    // Calculate skill gaps
    const gapAnalysis = analysisData.requiredSkills.map(required => {
      const current = analysisData.currentSkills.find(c => c.skill === required.skill);
      const currentLevel = current ? getLevelValue(current.currentLevel) : 0;
      const requiredLevel = getLevelValue(required.requiredLevel);
      const gap = requiredLevel - currentLevel;
      
      return {
        skill: required.skill,
        category: required.category,
        gap: Math.max(0, gap),
        priority: gap > 2 ? 'high' : gap > 1 ? 'medium' : 'low',
        recommendedTraining: [], // TODO: Implement training recommendations
        estimatedTimeToClose: gap * 3 // months
      };
    });

    // Calculate overall scores
    const totalRequired = analysisData.requiredSkills.reduce((sum, skill) => 
      sum + (getLevelValue(skill.requiredLevel) * skill.weight), 0);
    const totalCurrent = analysisData.currentSkills.reduce((sum, skill) => 
      sum + (getLevelValue(skill.currentLevel) * 
        (analysisData.requiredSkills.find(r => r.skill === skill.skill)?.weight || 1)), 0);
    const totalWeight = analysisData.requiredSkills.reduce((sum, skill) => sum + skill.weight, 0);
    
    const overallScore = {
      current: totalWeight > 0 ? Math.round((totalCurrent / totalWeight) * 25) : 0, // Convert to 1-100 scale
      required: totalWeight > 0 ? Math.round((totalRequired / totalWeight) * 25) : 0,
      gap: Math.max(0, totalRequired - totalCurrent)
    };

    const newAnalysis: SkillGapAnalysis = {
      ...analysisData,
      analysisId,
      analysisDate: new Date(),
      gapAnalysis,
      overallScore,
      recommendations: {
        immediateActions: gapAnalysis.filter(g => g.priority === 'high').map(g => `Address ${g.skill} gap`),
        trainingPrograms: [],
        mentoring: [],
        onJobTraining: [],
        timeline: '3-6 months'
      },
      systemInfo: {
        createdBy: 'system', // TODO: Get from auth context
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
        isActive: true
      }
    };

    const result = await skillGapsCollection.insertOne(newAnalysis);

    return NextResponse.json({
      success: true,
      data: { ...newAnalysis, _id: result.insertedId },
      message: 'Skill gap analysis created successfully'
    });
  } catch (error) {
    console.error('Error creating skill gap analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create skill gap analysis' },
      { status: 500 }
    );
  }
}

// Helper function to convert skill levels to numeric values
function getLevelValue(level: string): number {
  const levelMap: { [key: string]: number } = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3,
    'expert': 4
  };
  return levelMap[level] || 0;
}
