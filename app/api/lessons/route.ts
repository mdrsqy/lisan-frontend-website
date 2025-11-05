import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Import Prisma Singleton

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        title: true,
        module: true,
        status: true,
        views: true,
        completionRate: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc', 
      },
    });

    // Format completionRate ke persentase untuk kemudahan di frontend
    const formattedLessons = lessons.map(lesson => ({
        ...lesson,
        completionRate: lesson.completionRate * 100, // Ubah 0.87 menjadi 87
        id: lesson.id,
    }));

    return NextResponse.json(formattedLessons);

  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons data' }, 
      { status: 500 }
    );
  }
}