export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllClients } from "@/lib/clients";
import { Plus, ExternalLink } from "lucide-react";

export default async function DashboardClientsPage() {
  const allClients = await getAllClients();

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Clients</h1>
          <p className="mt-1 font-mono text-xs text-white/40">
            {allClients.length} {allClients.length === 1 ? "entry" : "entries"} — each creates a portfolio card + client page
          </p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex items-center gap-2 rounded-none bg-accent px-5 py-2.5 font-mono text-xs font-bold text-black transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          NEW CLIENT
        </Link>
      </div>

      {/* List */}
      {allClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-white/10 py-24 text-center">
          <p className="font-mono text-sm text-white/30">No clients yet.</p>
          <Link href="/dashboard/clients/new" className="mt-4 font-mono text-xs text-accent hover:underline">
            Create your first client
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {allClients.map((client) => (
            <div
              key={client.slug}
              className="flex items-center gap-4 border border-white/10 bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/20"
            >
              {/* Accent dot */}
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: client.accentColor }}
              />

              {/* Logo */}
              {client.logo ? (
                <img src={client.logo} alt={client.name} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <span className="font-mono text-[10px] text-white/30">{client.name[0]}</span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-bold text-white truncate">{client.name}</p>
                <p className="font-mono text-[11px] text-white/40">{client.label} · {client.tagline}</p>
              </div>

              {/* Gallery count */}
              <span className="font-mono text-[11px] text-white/30">
                {client.gallery.length} designs
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/clients/${client.slug}`}
                  target="_blank"
                  className="flex h-8 w-8 items-center justify-center text-white/30 transition-colors hover:text-white"
                  title="View live page"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href={`/dashboard/clients/${client.slug}`}
                  className="rounded-none border border-white/15 px-3 py-1.5 font-mono text-[11px] text-white/60 transition-colors hover:border-white/30 hover:text-white"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
