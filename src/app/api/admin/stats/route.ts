import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cacheGet, cacheSet } from "@/lib/redis";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const role = (session.user as { role: string }).role;

    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: admin access required" },
        { status: 403 }
      );
    }

    const cached = await cacheGet<Record<string, unknown>>("admin:stats");
    if (cached) {
      return NextResponse.json(cached);
    }

    const [
      totalUsers,
      totalRequests,
      pendingRequests,
      completedRequests,
      recentRequests,
      contactMessages,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.serviceRequest.count(),
      prisma.serviceRequest.count({ where: { status: "PENDING" } }),
      prisma.serviceRequest.count({ where: { status: "COMPLETED" } }),
      prisma.serviceRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.contactMessage.count(),
    ]);

    const stats = {
      totalUsers,
      totalRequests,
      pendingRequests,
      completedRequests,
      recentRequests,
      contactMessages,
    };

    await cacheSet("admin:stats", stats, 60);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
