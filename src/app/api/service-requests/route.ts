import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serviceRequestSchema } from "@/lib/validations";
import { logEvent } from "@/lib/events";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = (session.user as { id: string }).id;

    const serviceRequests = await prisma.serviceRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(serviceRequests);
  } catch (error) {
    console.error("Fetch service requests error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = serviceRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user
      ? (session.user as { id: string }).id
      : null;

    const {
      type,
      category,
      priority,
      title,
      description,
      address,
      preferredDate,
      guestName,
      guestEmail,
      guestPhone,
    } = parsed.data;

    if (!userId && (!guestName || !guestEmail)) {
      return NextResponse.json(
        { error: "Guest name and email are required for unauthenticated requests" },
        { status: 400 }
      );
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        type,
        category,
        priority,
        title,
        description,
        address,
        preferredDate: preferredDate ? new Date(preferredDate) : undefined,
        userId: userId ?? undefined,
        guestName: userId ? undefined : guestName,
        guestEmail: userId ? undefined : guestEmail,
        guestPhone: userId ? undefined : guestPhone,
      },
    });

    const headersList = await headers();

    await logEvent({
      userId,
      action: "service_request_created",
      category: "service_request",
      metadata: {
        serviceRequestId: serviceRequest.id,
        type,
        category,
        priority,
      },
      ip: headersList.get("x-forwarded-for"),
      userAgent: headersList.get("user-agent"),
    });

    return NextResponse.json(serviceRequest, { status: 201 });
  } catch (error) {
    console.error("Create service request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
