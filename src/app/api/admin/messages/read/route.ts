import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messageId, read } = await req.json();

  if (!messageId || typeof read !== "boolean") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const updated = await prisma.contactMessage.update({
    where: { id: messageId },
    data: { read },
  });

  return NextResponse.json({ success: true, message: updated });
}
