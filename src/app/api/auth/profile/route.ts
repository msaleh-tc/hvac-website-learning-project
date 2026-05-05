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

    const body = await request.json();
    const { name, phone, address } = body;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
      },
      select: { id: true, name: true, email: true, phone: true, address: true },
    });

    await logEvent({
      userId: session.user.id,
      action: "profile_updated",
      category: "auth",
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
