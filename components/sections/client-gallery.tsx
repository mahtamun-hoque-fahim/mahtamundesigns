"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff, ChevronDown } from "lucide-react";
import { ClientData, GalleryItem, DesignLabel } from "@/lib/clients";

type Props = { client: ClientData };

const PAGE_SIZE = 9;

// Label → grid span mapping.
// 3-column grid, grid-auto-rows = 200px base unit.
// Upload image + pick label → size is automatic, no manual positioning needed.
type SpanConfig = { colSpan: string; rowSpan: string };

const LABEL_SPANS: Record<string, SpanConfig> = {
  story:     { colSpan: "md:col-span-1", rowSpan: "md:row-span-3" }, // tall portrait  (600px)
  poster:    { colSpan: "md:col-span-1", rowSpan: "md:row-span-2" }, // medium portrait (400px)
  cover:     { colSpan: "md:col-span-1", rowSpan: "md:row-span-1" }, // landscape base  (200px) — 3 per row
  thumbnail: { colSpan: "md:col-span-1", rowSpan: "md:row-span-1" }, // square base     (200px)
  logo:      { colSpan: "md:col-span-1", rowSpan: "md:row-span-1" }, // square base     (200px)
  banner:    { colSpan: "md:col-span-3", rowSpan: "md:row-span-1" }, // full-width strip (200px)
};

// Fallback for dashboard-added custom labels — treat as standard base unit
function getSpan(label: DesignLabel): SpanConfig {
  return LABEL_SPANS[label] ?? { colSpan: "md:col-span-1", rowSpan: "md:row-span-1" };
}

function GalleryCard({
  item,
  accentColor,
}: {
  item: GalleryItem;
  accentColor: string;
}) {
  const { colSpan, rowSpan } = getSpan(item.label);

  return (
    <div
      className={`group relative overflow-hidden rounded-none border border-line bg-surface
        transition-all duration-300 hover:border-white/20
        ${colSpan} ${rowSpan}
        min-h-[200px]`}
    >
      {/* Thumbnail */}
      {item.image ? (
        <div className="absolute inset-0">
          <Image
            src={item.image}
            alt={item.label}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.025)_0px,rgba(255,255,255,0.025)_1px,transparent_1px,transparent_12px)]">
          <div className="flex flex-col items-center gap-2 text-white/15">
            <ImageOff className="h-7 w-7" strokeWidth={1.5} />
          </div>
        </div>
      )}

      {/* Label badge — bottom-right */}
      <div className="absolute bottom-3 right-3 z-10">
        <span
          className="rounded-none px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-black"
          style={{ backgroundColor: accentColor }}
        >
          {item.label}
        </span>
      </div>
    </div>
  );
}

export function ClientGallery({ client }: Props) {
  const { accentColor, gallery } = client;
  const [visible, setVisible] = useState(PAGE_SIZE);
  const showing = gallery.slice(0, visible);
  const hasMore = visible < gallery.length;

  return (
    <section className="bg-bg px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1200px]">

        {/* Heading */}
        <div className="mb-12">
          <p className="font-mono text-sm text-white/50">LET THE DESIGN</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            SPEAK
          </h2>
        </div>

        {/* Grid — 3 columns, fixed row height, label drives col+row span automatically */}
        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          style={{ gridAutoRows: "200px" }}
        >
          {showing.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              accentColor={accentColor}
            />
          ))}
        </div>

        {/* Load More — TODO(dashboard): full behavior spec pending */}
        {hasMore && (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="inline-flex items-center gap-2 rounded-none border border-white/25 bg-transparent px-10 py-3.5 font-mono text-sm font-medium text-white transition-all duration-200 hover:border-white/50 hover:bg-white/5"
            >
              Load More
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
