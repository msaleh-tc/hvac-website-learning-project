import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
