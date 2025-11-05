import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Import Prisma Singleton

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
        createdAt: "asc",
      },
    });

    // Format completionRate ke persentase untuk kemudahan di frontend
    const formattedLessons = lessons.map((lesson) => ({
      ...lesson,
      completionRate: lesson.completionRate * 100, // Ubah 0.87 menjadi 87
      id: lesson.id,
    }));

    return NextResponse.json(formattedLessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons data" },
      { status: 500 }
    );
  }
}

// POST : untuk cread pelajaran
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.module || !body.videoUrl) {
      return NextResponse.json(
        { error: "Title, module and video URL are required" },
        { status: 400 }
      );
    }

    const newLesson = await prisma.lesson.create({
      data: {
        title: body.title,
        module: body.module,
        videoUrl: body.videoUrl,
        status: body.status || "DRAFT",
        views: 0,
        completionRate: 0.0,
      },
    });
    return NextResponse.json(newLesson, { status: 201 });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}
