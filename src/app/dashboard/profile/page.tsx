"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, MapPin, CheckCircle2, XCircle } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [form, setForm] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (session?.user) {
      const user = session.user as {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
      };
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [session]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update profile");
      }

      await updateSession();
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account information.
        </p>
      </div>

      <Card title="Personal Information" description="Update your contact details">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Status message */}
          {message && (
            <div
              className={`flex items-center gap-2 rounded-md px-4 py-3 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0" />
              )}
              {message.text}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-medium text-slate-700"
            >
              <User className="h-4 w-4 text-slate-400" />
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
          </div>

          {/* Email (readonly) */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium text-slate-700"
            >
              <Mail className="h-4 w-4 text-slate-400" />
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              readOnly
              className="cursor-not-allowed bg-slate-50 text-slate-500"
            />
            <p className="text-xs text-slate-400">
              Email cannot be changed.
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label
              htmlFor="phone"
              className="flex items-center gap-2 text-sm font-medium text-slate-700"
            >
              <Phone className="h-4 w-4 text-slate-400" />
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="address"
              className="flex items-center gap-2 text-sm font-medium text-slate-700"
            >
              <MapPin className="h-4 w-4 text-slate-400" />
              Address
            </label>
            <Input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Main St, City, State 12345"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
