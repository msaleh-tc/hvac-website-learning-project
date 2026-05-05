import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { logEvent } from "@/lib/events";
import { headers } from "next/headers";
import { cacheDel } from "@/lib/redis";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = parsed.data;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    const headersList = await headers();

    await logEvent({
      action: "contact_message_sent",
      category: "contact",
      metadata: { contactMessageId: contactMessage.id, subject },
      ip: headersList.get("x-forwarded-for"),
      userAgent: headersList.get("user-agent"),
    });

    await cacheDel("admin:stats");

    return NextResponse.json(
      { message: "Message sent successfully", id: contactMessage.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
