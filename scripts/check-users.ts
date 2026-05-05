import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, passwordHash: true }
  });

  for (const u of users) {
    const testAdmin = await bcrypt.compare("admin123456", u.passwordHash || "");
    const testCustomer = await bcrypt.compare("customer123456", u.passwordHash || "");
    console.log(u.email, "|", u.role, "| admin123456:", testAdmin, "| customer123456:", testCustomer);
  }

  await prisma.$disconnect();
}

main();
