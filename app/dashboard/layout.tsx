export const dynamic = "force-dynamic";

import Link from "next/link";
import { LayoutGrid, Plus } from "lucide-react";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Session protection is handled by proxy.ts at the edge.
  // Layout is UI-only — no auth check here to avoid redirect loops.

  return (
    <div className="flex min-h-screen bg-[#080808]">
      {/* Sidebar */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-[#0f0f0f]">
        {/* Logo */}
        <div className="border-b border-white/10 px-5 py-5">
          <span className="font-display text-lg font-bold tracking-tight text-white">
            MAHTAMUN
          </span>
          <p className="mt-0.5 font-mono text-[10px] text-white/40">DASHBOARD</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <Link
            href="/dashboard/clients"
            className="flex items-center gap-3 rounded-none px-3 py-2.5 font-mono text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LayoutGrid className="h-4 w-4" />
            Clients
          </Link>
          <Link
            href="/dashboard/clients/new"
            className="flex items-center gap-3 rounded-none px-3 py-2.5 font-mono text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Plus className="h-4 w-4" />
            New Client
          </Link>
        </nav>

        {/* Sign out */}
        <div className="border-t border-white/10 p-3">
          <SignOutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
