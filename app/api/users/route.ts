import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// ----------------------------------------------------------------------
// HANDLER GET: Mengambil daftar pengguna dengan Search dan Filter Status
// ----------------------------------------------------------------------

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search") || "";
    // Memastikan statusFilter sesuai dengan enum UserStatus (string union)
    const statusFilter = searchParams.get("status");

    const whereClause: Prisma.UserWhereInput = {};
    const conditions: Prisma.UserWhereInput[] = [];

    // 1. Logic Search (Berdasarkan Name, Email, atau ID)
    if (searchTerm) {
      conditions.push({
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
          { id: { contains: searchTerm, mode: "insensitive" } }, // mode insensitive juga untuk ID jika ID adalah string
        ],
      });
    }

    // 2. Logic Filter Status
    if (
      statusFilter &&
      statusFilter !== "all" &&
      (statusFilter === "ACTIVE" || statusFilter === "BLOCKED")
    ) {
      conditions.push({
        status: statusFilter as "ACTIVE" | "BLOCKED",
      });
    }

    if (conditions.length > 0) whereClause.AND = conditions;

    const users = await prisma.user.findMany({
      where: whereClause, // Terapkan klausa gabungan (Search + Filter)
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        joinDate: true,
        lessonsCompleted: true,
        lastActive: true,
      },
      orderBy: {
        joinDate: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error:", error.message);
    }
    return NextResponse.json(
      { error: "Failed to fetch users data" },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// HANDLER POST: Membuat Pengguna Baru (CRUD: Create)
// ----------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validasi dasar (minimal email dan name)
    if (!body.email || !body.name) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Buat pengguna baru di database
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        // Properti opsional, gunakan default jika tidak disediakan
        status: body.status || "ACTIVE",
        learningLevel: body.learningLevel || "Beginner",
        lessonsCompleted: body.lessonsCompleted || 0,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // P2002: Unique constraint failed (email sudah ada)
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
