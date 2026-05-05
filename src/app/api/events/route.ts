import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logEvent } from "@/lib/events";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, category, metadata, page } = body;

    const session = await getServerSession(authOptions);
    const userId = session?.user
      ? (session.user as { id: string }).id
      : null;

    const headersList = await headers();

    await logEvent({
      userId,
      action: action ?? "unknown",
      category: category ?? "general",
      metadata,
      ip: headersList.get("x-forwarded-for"),
      userAgent: headersList.get("user-agent"),
      page,
    });
  } catch (error) {
    console.error("Event logging error:", error);
  }

  // Analytics should never fail the client
  return NextResponse.json({ success: true }, { status: 200 });
}
