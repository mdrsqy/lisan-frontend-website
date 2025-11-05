import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalLessons = await prisma.lesson.count({
        where: { status: 'PUBLISHED' } // Hanya hitung yang Published
    });
    
    // Asumsi: Menghitung pengguna yang aktif dalam 30 hari terakhir
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyActiveUsers = await prisma.user.count({
        where: { lastActive: { gte: thirtyDaysAgo } }
    });

    // Ambil aktivitas terbaru untuk feed
    const recentActivity = await prisma.userActivity.findMany({
        take: 7, // Ambil 7 aktivitas terbaru
        orderBy: { timestamp: 'desc' },
        select: {
            id: true,
            action: true,
            timestamp: true,
            user: { select: { name: true } },
            lesson: { select: { title: true } },
        }
    });

    // Ambil 5 pelajaran terpopuler (berdasarkan views)
    const topLessons = await prisma.lesson.findMany({
        take: 5,
        orderBy: { views: 'desc' },
        select: { title: true, views: true }
    });


    return NextResponse.json({
      kpis: {
        totalUsers,
        monthlyActiveUsers,
        totalLessons,
        // Contoh nilai dummy untuk rata-rata dan tren
        avgCompletionRate: 68, 
        userGrowthTrend: 23, 
      },
      recentActivity: recentActivity.map(activity => ({
          name: activity.user.name,
          action: activity.action,
          lesson: activity.lesson?.title || 'N/A',
          time: activity.timestamp,
      })),
      topLessons,
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' }, 
      { status: 500 }
    );
  }
}