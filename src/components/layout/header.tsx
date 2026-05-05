"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Snowflake, Flame, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/book", label: "Book Service" },
];

export function Header() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Snowflake className="h-6 w-6 text-blue-600" />
            <Flame className="absolute -bottom-0.5 -right-1 h-4 w-4 text-orange-500" />
          </div>
          <span className="text-xl font-bold text-slate-900">
            ComfortAir <span className="text-blue-600">Pro</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden items-center gap-3 md:flex">
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-slate-200" />
          ) : session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/book">
                <Button size="sm">Book Service</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "border-t border-slate-200 md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <nav className="space-y-1 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-200 px-4 py-3">
          {session ? (
            <div className="flex flex-col gap-2">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/auth/signin" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/book" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full">
                  Book Service
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
