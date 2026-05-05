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
  Calendar,
  MapPin,
  AlertTriangle,
  ClipboardList,
  Plus,
} from "lucide-react";

const statusBadgeVariant: Record<string, "warning" | "info" | "success" | "danger" | "default"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  LOW: { label: "Low", className: "text-slate-500" },
  NORMAL: { label: "Normal", className: "text-blue-600" },
  HIGH: { label: "High", className: "text-orange-600" },
  EMERGENCY: { label: "Emergency", className: "text-red-600" },
};

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const userId = (session.user as { id: string }).id;
  const { status: filterStatus } = await searchParams;

  const where: Record<string, unknown> = { userId };
  if (
    filterStatus &&
    ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(
      filterStatus
    )
  ) {
    where.status = filterStatus;
  }

  const requests = await prisma.serviceRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const statuses = [
    { value: "", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            My Service Requests
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and track all your HVAC service requests.
          </p>
        </div>
        <Link href="/book">
          <Button>
            <Plus className="h-4 w-4" />
            Book New Service
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => {
          const isActive =
            (!filterStatus && s.value === "") || filterStatus === s.value;
          return (
            <Link
              key={s.value}
              href={
                s.value
                  ? `/dashboard/requests?status=${s.value}`
                  : "/dashboard/requests"
              }
            >
              <Button
                variant={isActive ? "primary" : "outline"}
                size="sm"
              >
                {s.label}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Request List */}
      {requests.length === 0 ? (
        <Card>
          <div className="py-12 text-center">
            <ClipboardList className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-sm font-medium text-slate-900">
              No requests found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {filterStatus
                ? `No requests with status "${formatStatus(filterStatus)}".`
                : "You haven't submitted any service requests yet."}
            </p>
            <div className="mt-4">
              <Link href="/book">
                <Button size="sm">Book a Service</Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const priority = priorityConfig[request.priority] || priorityConfig.NORMAL;
            return (
              <Card key={request.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: Details */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900">
                        {request.title}
                      </h3>
                      <Badge
                        variant={
                          statusBadgeVariant[request.status] || "default"
                        }
                      >
                        {formatStatus(request.status)}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2">
                      {request.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <ClipboardList className="h-3.5 w-3.5" />
                        {formatCategory(request.category)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(request.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {request.address}
                      </span>
                      <span className={`inline-flex items-center gap-1 font-medium ${priority.className}`}>
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {priority.label}
                      </span>
                    </div>

                    {request.preferredDate && (
                      <p className="text-xs text-slate-500">
                        Preferred date:{" "}
                        <span className="font-medium text-slate-700">
                          {formatDate(request.preferredDate)}
                        </span>
                      </p>
                    )}

                    {request.scheduledDate && (
                      <p className="text-xs text-slate-500">
                        Scheduled:{" "}
                        <span className="font-medium text-blue-600">
                          {formatDate(request.scheduledDate)}
                        </span>
                      </p>
                    )}

                    {request.notes && (
                      <p className="text-xs italic text-slate-400">
                        Notes: {request.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: Type badge */}
                  <div className="shrink-0">
                    <Badge variant="default">
                      {request.type === "RESIDENTIAL"
                        ? "Residential"
                        : "Commercial"}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
