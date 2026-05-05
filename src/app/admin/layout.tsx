import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/requests", label: "Service Requests", icon: FileText },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const role = (session.user as { role?: string })?.role;

  if (role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">Admin Panel</h1>
          </div>
          <p className="text-sm text-slate-500">
            Signed in as{" "}
            <span className="font-medium text-slate-700">
              {session.user?.name || session.user?.email}
            </span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-64">
            <nav className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-4 py-3">
                <p className="text-sm font-medium text-slate-500">
                  Administration
                </p>
              </div>
              <ul className="p-2">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-slate-200 p-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Site
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
