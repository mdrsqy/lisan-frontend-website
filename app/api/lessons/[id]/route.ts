import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET : read 1 lesson
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const lessonId = params.id;
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }
    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error fetch lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson details" },
      { status: 500 }
    );
  }
}


// PUT : for update

export async function PUT()