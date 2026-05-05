"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Snowflake, Flame } from "lucide-react";

export default function SignOutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Snowflake className="h-7 w-7 text-blue-600" />
          <Flame className="h-7 w-7 text-orange-500" />
          <span className="text-2xl font-bold text-gray-900">ComfortAir Pro</span>
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Sign Out
        </h1>

        <p className="text-gray-600 mb-8">
          Are you sure you want to sign out?
        </p>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
