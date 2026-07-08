export const dynamic = "force-dynamic";

import Link from "next/link";
import { LayoutGrid, LogOut, Plus } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // TODO: Re-enable session check once Better Auth is stable
  // const session = await getAuth().api.getSession({ headers: await headers() });
  // if (!session) redirect("/dashboard/login");

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

        {/* Sign out — disabled until auth works */}
        <div className="border-t border-white/10 p-3">
          <form action="/api/auth/sign-out" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-none px-3 py-2.5 font-mono text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
