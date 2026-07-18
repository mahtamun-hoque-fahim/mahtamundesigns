"use client";


export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/actions/clients";

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      await createClient(fd);
    } catch (err: unknown) {
      // createClient redirects on success — any error is a real error
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        return; // redirect is success
      }
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">New Client</h1>
        <p className="mt-1 font-mono text-xs text-white/40">
          Creates a portfolio card + client page instantly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field name="name" label="Company Name" required placeholder="e.g. Sulphuric Bench" />
        <Field name="label" label="Card Label" placeholder="e.g. Brand Setup, Rebranding, Thumbnail Design" />
        <Field name="tagline" label="Brand Tagline" placeholder="e.g. Frontier Edtech" />
        <Field name="accentColor" label="Accent Color (hex)" placeholder="#bb7cff" defaultValue="#bb7cff" />

        {/* Logo upload */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[11px] tracking-wider text-white/50">LOGO (optional)</label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            className="rounded-none border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-xs text-white/60 file:mr-3 file:rounded-none file:border-0 file:bg-accent file:px-3 file:py-1 file:font-mono file:text-[11px] file:font-bold file:text-black"
          />
        </div>

        {error && <p className="font-mono text-xs text-red-400">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-none bg-accent px-6 py-3 font-mono text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "CREATING..." : "CREATE CLIENT"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-none border border-white/15 px-6 py-3 font-mono text-sm text-white/50 transition-colors hover:border-white/30 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  name, label, placeholder, required, defaultValue,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[11px] tracking-wider text-white/50">
        {label.toUpperCase()}{required && <span className="text-accent"> *</span>}
      </label>
      <input
        type="text"
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="rounded-none border border-white/15 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}
