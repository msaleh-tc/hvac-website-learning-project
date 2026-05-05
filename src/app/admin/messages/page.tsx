import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Mail } from "lucide-react";
import { MarkReadButton } from "./mark-read-button";

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Contact Messages</h2>
        <p className="mt-1 text-sm text-slate-500">
          All messages from the contact form.{" "}
          {unreadCount > 0 && (
            <span className="font-medium text-red-600">
              {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
            </span>
          )}
        </p>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <Mail className="h-4 w-4" />
          <span>{messages.length} total message{messages.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 font-medium text-slate-500">Status</th>
                <th className="pb-3 font-medium text-slate-500">Name</th>
                <th className="pb-3 font-medium text-slate-500">Email</th>
                <th className="pb-3 font-medium text-slate-500">Subject</th>
                <th className="pb-3 font-medium text-slate-500">Message</th>
                <th className="pb-3 font-medium text-slate-500">Date</th>
                <th className="pb-3 font-medium text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {messages.map((message) => (
                <tr
                  key={message.id}
                  className={`hover:bg-slate-50 ${!message.read ? "bg-blue-50/50" : ""}`}
                >
                  <td className="py-3">
                    <Badge variant={message.read ? "default" : "danger"}>
                      {message.read ? "Read" : "Unread"}
                    </Badge>
                  </td>
                  <td className="py-3 font-medium text-slate-900">
                    {message.name}
                  </td>
                  <td className="py-3 text-slate-700">{message.email}</td>
                  <td className="py-3 text-slate-700">{message.subject}</td>
                  <td className="max-w-xs py-3 text-slate-500">
                    <p className="truncate">{message.message}</p>
                  </td>
                  <td className="py-3 whitespace-nowrap text-slate-500">
                    {formatDate(message.createdAt)}
                  </td>
                  <td className="py-3">
                    <MarkReadButton
                      messageId={message.id}
                      isRead={message.read}
                    />
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No contact messages yet.
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
