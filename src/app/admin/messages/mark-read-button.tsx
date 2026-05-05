"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function MarkReadButton({
  messageId,
  isRead,
}: {
  messageId: string;
  isRead: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleClick() {
    const res = await fetch("/api/admin/messages/read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, read: !isRead }),
    });

    if (res.ok) {
      startTransition(() => {
        router.refresh();
      });
    }
  }

  return (
    <Button
      onClick={handleClick}
      size="sm"
      variant={isRead ? "ghost" : "primary"}
      loading={isPending}
      className="text-xs"
    >
      {isRead ? "Mark Unread" : "Mark Read"}
    </Button>
  );
}
