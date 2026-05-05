import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logEvent } from "@/lib/events";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if ((session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: {
        status,
        ...(notes !== undefined && { notes }),
        ...(status === "COMPLETED" && { completedDate: new Date() }),
      },
    });

    await logEvent({
      userId: session.user.id,
      action: "request_status_updated",
      category: "admin",
      metadata: { requestId: id, newStatus: status },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
  }
}
