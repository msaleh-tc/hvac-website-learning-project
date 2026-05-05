import { prisma } from "./prisma";
import crypto from "crypto";

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip + process.env.NEXTAUTH_SECRET).digest("hex").slice(0, 16);
}

export async function logEvent({
  userId,
  sessionId,
  action,
  category,
  metadata,
  ip,
  userAgent,
  page,
}: {
  userId?: string | null;
  sessionId?: string | null;
  action: string;
  category: string;
  metadata?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
  page?: string | null;
}) {
  try {
    await prisma.eventLog.create({
      data: {
        userId: userId ?? undefined,
        sessionId,
        action,
        category,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
        ipHash: ip ? hashIp(ip) : undefined,
        userAgent: userAgent?.slice(0, 256),
        page,
      },
    });
  } catch (error) {
    console.error("Failed to log event:", error);
  }
}
