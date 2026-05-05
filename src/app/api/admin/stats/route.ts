import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json({
      totalUsers,
      totalRequests,
      pendingRequests,
      completedRequests,
      recentRequests,
      contactMessages,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
