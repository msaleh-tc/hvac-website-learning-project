import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatStatus, formatCategory } from "@/lib/utils";
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  Mail,
  Eye,
} from "lucide-react";

const statusBadgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalCustomers,
    totalRequests,
    pendingRequests,
    completedThisMonth,
    unreadMessages,
    recentRequests,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: "PENDING" } }),
    prisma.serviceRequest.count({
      where: {
        status: "COMPLETED",
        completedDate: { gte: startOfMonth },
      },
    }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.serviceRequest.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const stats = [
    { label: "Total Customers", value: totalCustomers, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Service Requests", value: totalRequests, icon: FileText, color: "text-slate-600 bg-slate-100" },
    { label: "Pending Requests", value: pendingRequests, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
    { label: "Completed This Month", value: completedThisMonth, icon: CheckCircle, color: "text-green-600 bg-green-50" },
    { label: "Unread Messages", value: unreadMessages, icon: Mail, color: "text-red-600 bg-red-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Overview</h2>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back. Here is a summary of your HVAC business.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Requests Table */}
      <Card title="Recent Service Requests" description="Last 10 service requests">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 font-medium text-slate-500">Customer</th>
                <th className="pb-3 font-medium text-slate-500">Type</th>
                <th className="pb-3 font-medium text-slate-500">Category</th>
                <th className="pb-3 font-medium text-slate-500">Status</th>
                <th className="pb-3 font-medium text-slate-500">Date</th>
                <th className="pb-3 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50">
                  <td className="py-3">
                    <p className="font-medium text-slate-900">
                      {request.user?.name || request.guestName || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {request.user?.email || request.guestEmail}
                    </p>
                  </td>
                  <td className="py-3 text-slate-700">
                    {formatStatus(request.type)}
                  </td>
                  <td className="py-3 text-slate-700">
                    {formatCategory(request.category)}
                  </td>
                  <td className="py-3">
                    <Badge variant={statusBadgeVariant[request.status] || "default"}>
                      {formatStatus(request.status)}
                    </Badge>
                  </td>
                  <td className="py-3 text-slate-500">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="py-3">
                    <Link
                      href={`/admin/requests?highlight=${request.id}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {recentRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No service requests yet.
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
