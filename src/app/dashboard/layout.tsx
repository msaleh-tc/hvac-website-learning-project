import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import {
  LayoutDashboard,
  FileText,
  User,
  Wrench,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/requests", label: "My Requests", icon: FileText },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/book", label: "Book Service", icon: Wrench },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const isAdmin = (session.user as { role?: string })?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-64">
            <nav className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-4 py-3">
                <p className="text-sm font-medium text-slate-500">Navigation</p>
              </div>
              <ul className="p-2">
                {navItems.map((item) => {
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
                {isAdmin && (
                  <li>
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
