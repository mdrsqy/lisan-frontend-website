// frontend/lisan-admin/app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Helper untuk menghitung Overall Progress (agar konsisten)
const calculateProgress = (lessonsCompleted: number) => {
  const MAX_LESSONS = 100;
  return Math.min(100, Math.round((lessonsCompleted / MAX_LESSONS) * 100));
};

// ----------------------------------------------------------------------
// HANDLER GET: Mengambil Detail Satu Pengguna (CRUD: Read Detail)
// ----------------------------------------------------------------------
export async function GET(
  request: Request,
  context: { params: { id: string } } | Promise<{ params: { id: string } }>
) {
  console.log("[API DEBUG] request.url:", request.url);
  console.log("[API DEBUG] context (raw):", context);
  const resolvedContext = await Promise.resolve(context);
  const params = await Promise.resolve(resolvedContext.params);
  const userId = params?.id;
  console.log("[API DEBUG] context (resolved):", resolvedContext);
  console.log("[API DEBUG] params (resolved):", params);
  console.log("[API DEBUG] userId:", userId);
  // 🛑 Validasi: Jika userId tidak ter-resolve (untuk menghindari error Prisma)
  if (!userId) {
    console.error("API Error: User ID is missing in params.");
    return NextResponse.json(
      { error: "User ID is missing or undefined (API)" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }, // Sekarang userId dijamin bukan undefined
      select: {
        // ... (select fields)
        id: true,
        name: true,
        email: true,
        status: true,
        joinDate: true,
        lastActive: true,
        lessonsCompleted: true,
        learningLevel: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const overallProgress = calculateProgress(user.lessonsCompleted);

    return NextResponse.json({ ...user, overallProgress });
  } catch (error) {
    console.error(`Error fetching user ${userId} details:`, error);
    // 🛑 Mengatasi error P2025 (Record not found) jika terjadi
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch user details due to server error" },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// HANDLER PUT: Mengubah Data Pengguna (CRUD: Update)
// ----------------------------------------------------------------------
export async function PUT(
  request: Request,
  context: { params: { id: string } } | Promise<{ params: { id: string } }>
) {
  const resolvedContext = await Promise.resolve(context);
  const params = await Promise.resolve(resolvedContext.params);
  const userId = params?.id;
  try {
    const body = await request.json();

    // Kita hanya izinkan properti yang relevan untuk diupdate
    const updateData: Prisma.UserUpdateInput = {
      name: body.name,
      status: body.status,
      learningLevel: body.learningLevel,
      // lessonsCompleted juga bisa diupdate melalui dashboard admin
      lessonsCompleted: body.lessonsCompleted,
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "User not found for update" },
        { status: 404 }
      );
    }
    console.error(`Error updating user ${userId}:`, error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// HANDLER DELETE: Menghapus Pengguna (CRUD: Delete)
// ----------------------------------------------------------------------
export async function DELETE(
  request: Request,
  context: { params: { id: string } } | Promise<{ params: { id: string } }>
) {
  const resolvedContext = await Promise.resolve(context);
  const params = await Promise.resolve(resolvedContext.params);
  const userId = params?.id;
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "User not found for deletion" },
        { status: 404 }
      );
    }
    console.error(`Error deleting user ${userId}:`, error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
