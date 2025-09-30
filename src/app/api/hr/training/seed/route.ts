import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { demoTrainingPrograms, demoTrainingSchedules, demoCertifications } from '@/lib/data/training-demo';
import { TrainingProgram, TrainingSchedule, Certification } from '@/lib/models/training';

// POST /api/hr/training/seed - Seed training demo data
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Clear existing data
    await db.collection('trainingPrograms').deleteMany({});
    await db.collection('trainingSchedules').deleteMany({});
    await db.collection('certifications').deleteMany({});
    await db.collection('skillGapAnalyses').deleteMany({});

    let seededCount = 0;

    // Seed Training Programs
    for (const programData of demoTrainingPrograms) {
      const count = await db.collection('trainingPrograms').countDocuments();
      const programId = `TRN${String(count + 1).padStart(3, '0')}`;

      const program: TrainingProgram = {
        ...programData,
        programId,
        status: 'active',
        systemInfo: {
          createdBy: 'system',
          createdAt: new Date(),
          updatedBy: 'system',
          updatedAt: new Date(),
          isActive: true
        }
      };

      await db.collection('trainingPrograms').insertOne(program);
      seededCount++;
    }

    // Seed Training Schedules
    for (let i = 0; i < demoTrainingSchedules.length; i++) {
      const scheduleData = demoTrainingSchedules[i];
      const program = await db.collection('trainingPrograms').findOne({}, { skip: i });
      
      if (program) {
        const count = await db.collection('trainingSchedules').countDocuments();
        const scheduleId = `SCH${String(count + 1).padStart(3, '0')}`;

        const schedule: TrainingSchedule = {
          ...scheduleData,
          programId: program.programId,
          scheduleId,
          programTitle: program.title,
          currentEnrollments: Math.floor(Math.random() * (scheduleData.capacity.maxParticipants - scheduleData.capacity.minParticipants + 1)) + scheduleData.capacity.minParticipants,
          enrolledEmployees: [], // Will be populated when employees enroll
          status: i === 0 ? 'scheduled' : 'completed',
          systemInfo: {
            createdBy: 'system',
            createdAt: new Date(),
            updatedBy: 'system',
            updatedAt: new Date(),
            isActive: true
          }
        };

        await db.collection('trainingSchedules').insertOne(schedule);
        seededCount++;
      }
    }

    // Seed Certifications
    for (const certificationData of demoCertifications) {
      const count = await db.collection('certifications').countDocuments();
      const certificationId = `CERT${String(count + 1).padStart(3, '0')}`;

      const certification: Certification = {
        ...certificationData,
        certificationId,
        status: 'active',
        systemInfo: {
          createdBy: 'system',
          createdAt: new Date(),
          updatedBy: 'system',
          updatedAt: new Date(),
          isActive: true
        }
      };

      await db.collection('certifications').insertOne(certification);
      seededCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${seededCount} training records`,
      data: {
        programs: demoTrainingPrograms.length,
        schedules: demoTrainingSchedules.length,
        certifications: demoCertifications.length
      }
    });
  } catch (error) {
    console.error('Error seeding training data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed training data' },
      { status: 500 }
    );
  }
}
