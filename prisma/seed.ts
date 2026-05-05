import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const customerPassword = await bcrypt.hash("customer123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@comfortairpro.com" },
    update: {},
    create: {
      email: "admin@comfortairpro.com",
      name: "Admin User",
      passwordHash: adminPassword,
      role: "ADMIN",
      phone: "555-0100",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Jane Smith",
      passwordHash: customerPassword,
      role: "CUSTOMER",
      phone: "555-0200",
      address: "123 Oak Street, Springfield, IL 62701",
    },
  });

  await prisma.serviceRequest.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: customer.id,
        type: "RESIDENTIAL",
        category: "AC_REPAIR",
        priority: "HIGH",
        status: "IN_PROGRESS",
        title: "AC unit not cooling properly",
        description: "The central AC unit is running but not producing cold air. Started 2 days ago.",
        address: "123 Oak Street, Springfield, IL 62701",
        preferredDate: new Date("2025-06-15"),
        scheduledDate: new Date("2025-06-14"),
      },
      {
        userId: customer.id,
        type: "RESIDENTIAL",
        category: "HEATING_MAINTENANCE",
        priority: "NORMAL",
        status: "COMPLETED",
        title: "Annual furnace inspection",
        description: "Yearly maintenance checkup for the gas furnace before winter season.",
        address: "123 Oak Street, Springfield, IL 62701",
        completedDate: new Date("2025-03-10"),
      },
      {
        userId: customer.id,
        type: "RESIDENTIAL",
        category: "THERMOSTAT",
        priority: "LOW",
        status: "PENDING",
        title: "Smart thermostat installation",
        description: "Would like to upgrade to a Nest thermostat. Need professional installation.",
        address: "123 Oak Street, Springfield, IL 62701",
        preferredDate: new Date("2025-07-01"),
      },
    ],
  });

  await prisma.contactMessage.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Robert Johnson",
        email: "robert@example.com",
        phone: "555-0300",
        subject: "Commercial HVAC quote",
        message: "We have a 5000 sq ft office building and need a quote for a new HVAC system installation.",
      },
      {
        name: "Maria Garcia",
        email: "maria@example.com",
        subject: "Emergency service availability",
        message: "Do you offer emergency heating repair on weekends? Our furnace stopped working.",
      },
    ],
  });

  console.log("Seed complete:", { admin: admin.email, customer: customer.email });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
