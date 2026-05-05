import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Users } from "lucide-react";

export default async function AdminCustomersPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { serviceRequests: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
        <p className="mt-1 text-sm text-slate-500">
          All registered customers and their service request counts.
        </p>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <Users className="h-4 w-4" />
          <span>{customers.length} total customer{customers.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 font-medium text-slate-500">Name</th>
                <th className="pb-3 font-medium text-slate-500">Email</th>
                <th className="pb-3 font-medium text-slate-500">Phone</th>
                <th className="pb-3 font-medium text-slate-500">Joined</th>
                <th className="pb-3 font-medium text-slate-500">Requests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50">
                  <td className="py-3 font-medium text-slate-900">
                    {customer.name || "No name"}
                  </td>
                  <td className="py-3 text-slate-700">{customer.email}</td>
                  <td className="py-3 text-slate-700">
                    {customer.phone || "N/A"}
                  </td>
                  <td className="py-3 text-slate-500">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-medium text-blue-600">
                      {customer._count.serviceRequests}
                    </span>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No customers registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
