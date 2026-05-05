import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { requestId, status } = await req.json();

  const validStatuses = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
  if (!requestId || !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = { status };
  if (status === "COMPLETED") {
    updateData.completedDate = new Date();
  }

  const updated = await prisma.serviceRequest.update({
    where: { id: requestId },
    data: updateData,
  });

  return NextResponse.json({ success: true, request: updated });
}
