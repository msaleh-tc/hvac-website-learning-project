import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatStatus, formatCategory } from "@/lib/utils";
import { StatusForm } from "./status-form";

const statusBadgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
};

const priorityBadgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  LOW: "default",
  NORMAL: "info",
  HIGH: "warning",
  EMERGENCY: "danger",
};

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; highlight?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const filterStatus = params.status;
  const highlightId = params.highlight;

  const where = filterStatus ? { status: filterStatus as never } : {};

  const requests = await prisma.serviceRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  const statusOptions = [
    "PENDING",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Service Requests</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage all service requests. Filter by status and update request statuses.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Filter by status:</span>
          <Link
            href="/admin/requests"
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !filterStatus
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </Link>
          {statusOptions.map((s) => (
            <Link
              key={s}
              href={`/admin/requests?status=${s}`}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filterStatus === s
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {formatStatus(s)}
            </Link>
          ))}
        </div>
      </Card>

      {/* Requests Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 font-medium text-slate-500">ID</th>
                <th className="pb-3 font-medium text-slate-500">Customer</th>
                <th className="pb-3 font-medium text-slate-500">Type</th>
                <th className="pb-3 font-medium text-slate-500">Category</th>
                <th className="pb-3 font-medium text-slate-500">Priority</th>
                <th className="pb-3 font-medium text-slate-500">Status</th>
                <th className="pb-3 font-medium text-slate-500">Created</th>
                <th className="pb-3 font-medium text-slate-500">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className={`hover:bg-slate-50 ${
                    highlightId === request.id ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="py-3 font-mono text-xs text-slate-500">
                    {request.id.slice(0, 8)}...
                  </td>
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
                    <Badge variant={priorityBadgeVariant[request.priority] || "default"}>
                      {formatStatus(request.priority)}
                    </Badge>
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
                    <StatusForm
                      requestId={request.id}
                      currentStatus={request.status}
                    />
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No service requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-slate-500">
          Showing {requests.length} request{requests.length !== 1 ? "s" : ""}
        </div>
      </Card>
    </div>
  );
}
