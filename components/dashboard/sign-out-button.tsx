"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOut();
    } finally {
      router.push("/dashboard/login");
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="flex w-full items-center gap-3 rounded-none px-3 py-2.5 font-mono text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
