import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status");

    let whereClause: any = {};
    if (searchTerm) {
      whereClause = {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
          { id: { contains: searchTerm } },
        ],
      };
    }
    if (
      statusFilter &&
      statusFilter !== "all" &&
      (statusFilter === "ACTIVE" || statusFilter === "BLOCKED")
    ) {
      whereClause = { ...whereClause, status: statusFilter };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        joinDate: true,
        lessonsCompleted: true,
        lastActive: true,
        learningLevel: true,
      },
      orderBy: { joinDate: "desc" },
    });

    // Convert to CSV
    const header = [
      "ID",
      "Name",
      "Email",
      "Status",
      "Join Date",
      "Lessons Completed",
      "Last Active",
      "Learning Level",
    ];
    const rows = users.map((u) => [
      u.id,
      u.name ?? "",
      u.email,
      u.status,
      u.joinDate instanceof Date ? u.joinDate.toISOString() : u.joinDate,
      u.lessonsCompleted,
      u.lastActive instanceof Date ? u.lastActive.toISOString() : u.lastActive,
      u.learningLevel,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=users.csv",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export users" },
      { status: 500 }
    );
  }
}
