import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatStatus, formatCategory } from "@/lib/utils";
import {
  ClipboardList,
  Clock,
  Loader2,
  CheckCircle2,
  Plus,
  ArrowRight,
} from "lucide-react";

const statusBadgeVariant: Record<string, "warning" | "info" | "success" | "danger" | "default"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const userId = (session.user as { id: string }).id;

  const [totalRequests, pendingCount, inProgressCount, completedCount, recentRequests] =
    await Promise.all([
      prisma.serviceRequest.count({ where: { userId } }),
      prisma.serviceRequest.count({ where: { userId, status: "PENDING" } }),
      prisma.serviceRequest.count({ where: { userId, status: "IN_PROGRESS" } }),
      prisma.serviceRequest.count({ where: { userId, status: "COMPLETED" } }),
      prisma.serviceRequest.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const stats = [
    {
      label: "Total Requests",
      value: totalRequests,
      icon: ClipboardList,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "In Progress",
      value: inProgressCount,
      icon: Loader2,
      color: "text-sky-600 bg-sky-50",
    },
    {
      label: "Completed",
      value: completedCount,
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {session.user?.name || "Customer"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here is an overview of your service requests.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/book">
          <Button>
            <Plus className="h-4 w-4" />
            Book New Service
          </Button>
        </Link>
        <Link href="/dashboard/requests">
          <Button variant="outline">
            <ArrowRight className="h-4 w-4" />
            View All Requests
          </Button>
        </Link>
      </div>

      {/* Recent Requests */}
      <Card title="Recent Service Requests" description="Your last 5 requests">
        {recentRequests.length === 0 ? (
          <div className="py-8 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm text-slate-500">
              No service requests yet.
            </p>
            <Link href="/book" className="mt-3 inline-block">
              <Button size="sm">Book Your First Service</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-3 font-medium text-slate-500">Title</th>
                  <th className="pb-3 font-medium text-slate-500">Category</th>
                  <th className="pb-3 font-medium text-slate-500">Status</th>
                  <th className="pb-3 font-medium text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-900">
                      {request.title}
                    </td>
                    <td className="py-3 text-slate-600">
                      {formatCategory(request.category)}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={statusBadgeVariant[request.status] || "default"}
                      >
                        {formatStatus(request.status)}
                      </Badge>
                    </td>
                    <td className="py-3 text-slate-500">
                      {formatDate(request.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
