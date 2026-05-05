"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const statuses = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export function StatusForm({
  requestId,
  currentStatus,
}: {
  requestId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === currentStatus) return;

    const res = await fetch("/api/admin/requests/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status }),
    });

    if (res.ok) {
      startTransition(() => {
        router.refresh();
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="block appearance-none rounded-md border border-slate-300 bg-white px-2 py-1 text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <Button
        type="submit"
        size="sm"
        variant="primary"
        loading={isPending}
        disabled={status === currentStatus}
        className="text-xs"
      >
        Save
      </Button>
    </form>
  );
}
