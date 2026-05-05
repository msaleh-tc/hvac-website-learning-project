import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatStatus, formatCategory } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Requests by status
  const requestsByStatus = await prisma.serviceRequest.groupBy({
    by: ["status"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  // Requests by category
  const requestsByCategory = await prisma.serviceRequest.groupBy({
    by: ["category"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  // Requests by month (last 6 months)
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const requestsLast6Months = await prisma.serviceRequest.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
  });

  // Group by month
  const monthlyData: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    const count = requestsLast6Months.filter((r) => {
      const d = new Date(r.createdAt);
      return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    }).length;
    monthlyData.push({ month: monthLabel, count });
  }

  // Recent event logs
  const recentEvents = await prisma.eventLog.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      action: true,
      category: true,
      page: true,
      createdAt: true,
    },
  });

  const statusBadgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
    PENDING: "warning",
    CONFIRMED: "info",
    IN_PROGRESS: "info",
    COMPLETED: "success",
    CANCELLED: "danger",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
        <p className="mt-1 text-sm text-slate-500">
          Overview of service request data and site activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Requests by Status */}
        <Card title="Requests by Status">
          <div className="space-y-3">
            {requestsByStatus.map((item) => {
              const total = requestsByStatus.reduce((sum, i) => sum + i._count.id, 0);
              const pct = total > 0 ? Math.round((item._count.id / total) * 100) : 0;
              return (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={statusBadgeVariant[item.status] || "default"}>
                      {formatStatus(item.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm font-medium text-slate-900">
                      {item._count.id}
                    </span>
                  </div>
                </div>
              );
            })}
            {requestsByStatus.length === 0 && (
              <p className="text-sm text-slate-500">No data available.</p>
            )}
          </div>
        </Card>

        {/* Requests by Category */}
        <Card title="Requests by Category">
          <div className="space-y-3">
            {requestsByCategory.map((item) => {
              const total = requestsByCategory.reduce((sum, i) => sum + i._count.id, 0);
              const pct = total > 0 ? Math.round((item._count.id / total) * 100) : 0;
              return (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">
                    {formatCategory(item.category)}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm font-medium text-slate-900">
                      {item._count.id}
                    </span>
                  </div>
                </div>
              );
            })}
            {requestsByCategory.length === 0 && (
              <p className="text-sm text-slate-500">No data available.</p>
            )}
          </div>
        </Card>

        {/* Requests by Month */}
        <Card title="Requests by Month" description="Last 6 months">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 font-medium text-slate-500">Month</th>
                  <th className="pb-3 text-right font-medium text-slate-500">Requests</th>
                  <th className="pb-3 font-medium text-slate-500">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthlyData.map((item) => {
                  const maxCount = Math.max(...monthlyData.map((m) => m.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <tr key={item.month} className="hover:bg-slate-50">
                      <td className="py-2.5 text-slate-700">{item.month}</td>
                      <td className="py-2.5 text-right font-medium text-slate-900">
                        {item.count}
                      </td>
                      <td className="py-2.5">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Event Logs */}
        <Card title="Recent Event Logs" description="Last 20 events">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 font-medium text-slate-500">Action</th>
                  <th className="pb-3 font-medium text-slate-500">Category</th>
                  <th className="pb-3 font-medium text-slate-500">Page</th>
                  <th className="pb-3 font-medium text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-medium text-slate-900">
                      {event.action}
                    </td>
                    <td className="py-2.5">
                      <Badge variant="info">{event.category}</Badge>
                    </td>
                    <td className="py-2.5 text-slate-500">
                      {event.page || "N/A"}
                    </td>
                    <td className="py-2.5 whitespace-nowrap text-slate-500">
                      {formatDate(event.createdAt)}
                    </td>
                  </tr>
                ))}
                {recentEvents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No event logs yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
