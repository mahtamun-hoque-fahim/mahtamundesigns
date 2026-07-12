"use client";

import { useState } from "react";
import { upsertStats } from "@/lib/actions/stats";
import type { StatsRow } from "@/lib/data/stats";
import { useRouter } from "next/navigation";

const FIELD = "rounded-none border border-white/15 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-accent w-full";
const LABEL = "font-mono text-[11px] tracking-wider text-white/50 block mb-1";

const STAT_FIELDS: { key: keyof StatsRow; label: string; suffix: string; hint: string }[] = [
  { key: "yearsExperience", label: "YEARS EXPERIENCE",  suffix: "+",  hint: "Displayed as 6+" },
  { key: "totalDesigns",    label: "TOTAL DESIGNS",     suffix: "+",  hint: "Displayed as 600+" },
  { key: "clientCount",     label: "CLIENT COUNT",      suffix: "",   hint: "Displayed as 11" },
  { key: "satisfaction",    label: "SATISFACTION %",    suffix: "%",  hint: "Displayed as 100%" },
];

export function StatsDashboard({ stats }: { stats: StatsRow }) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    try {
      const fd = new FormData(e.currentTarget);
      await upsertStats(fd);
      setSuccess("Stats saved.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Site Stats</h1>
        <p className="mt-1 font-mono text-xs text-white/40">
          Controls the animated counter section on the homepage.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {STAT_FIELDS.map(({ key, label, suffix, hint }) => (
          <div key={key}>
            <label className={LABEL}>{label}</label>
            <div className="flex items-center gap-3">
              <input
                name={key}
                type="number"
                min={0}
                defaultValue={stats[key]}
                className={FIELD}
              />
              <span className="font-mono text-sm text-white/40 shrink-0">{suffix}</span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-white/30">{hint}</p>
          </div>
        ))}

        {success && (
          <p className="font-mono text-xs text-green-400">{success}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-none bg-accent px-6 py-2.5 font-mono text-xs font-bold text-black disabled:opacity-50 self-start"
        >
          {saving ? "SAVING..." : "SAVE STATS"}
        </button>
      </form>
    </div>
  );
}
