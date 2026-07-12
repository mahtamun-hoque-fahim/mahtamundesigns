export const dynamic = "force-dynamic";

import Link from "next/link";
import { LayoutGrid, Plus, Star, Clock, BarChart3, Heart } from "lucide-react";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

const NAV = [
  { href: "/dashboard/clients",    label: "Clients",    icon: LayoutGrid },
  { href: "/dashboard/clients/new",label: "New Client", icon: Plus },
  { href: "/dashboard/reviews",    label: "Reviews",    icon: Star },
  { href: "/dashboard/timeline",   label: "Timeline",   icon: Clock },
  { href: "/dashboard/stats",      label: "Stats",      icon: BarChart3 },
  { href: "/dashboard/motivation", label: "Motivation", icon: Heart },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#080808]">
      <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-[#0f0f0f]">
        <div className="border-b border-white/10 px-5 py-5">
          <span className="font-display text-lg font-bold tracking-tight text-white">MAHTAMUN</span>
          <p className="mt-0.5 font-mono text-[10px] text-white/40">DASHBOARD</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-none px-3 py-2.5 font-mono text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
