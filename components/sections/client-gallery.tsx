"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff, ChevronDown } from "lucide-react";
import { ClientData, GalleryItem } from "@/lib/clients";

type Props = { client: ClientData };

const PAGE_SIZE = 6;

// Grid layout — 3-column base, alternating wide pattern:
//   Group of 2: [wide: col-span-2][narrow: col-span-1]
//   Next group:  [narrow: col-span-1][wide: col-span-2]
//   Repeats every 2 items.
// Within each group item index (0-based across all items):
//   groupIndex = Math.floor(index / 2)
//   posInGroup = index % 2
//   if groupIndex is even: pos 0 → col-span-2, pos 1 → col-span-1
//   if groupIndex is odd:  pos 0 → col-span-1, pos 1 → col-span-2
function getColSpan(index: number): string {
  const groupIndex = Math.floor(index / 2);
  const posInGroup = index % 2;
  const isWide =
    (groupIndex % 2 === 0 && posInGroup === 0) ||
    (groupIndex % 2 === 1 && posInGroup === 1);
  return isWide ? "md:col-span-2" : "md:col-span-1";
}

function GalleryCard({
  item,
  index,
  accentColor,
}: {
  item: GalleryItem;
  index: number;
  accentColor: string;
}) {
  const isWide = getColSpan(index).includes("col-span-2");

  return (
    <div
      className={`group relative overflow-hidden rounded-none border border-line bg-surface transition-all duration-300 hover:border-white/20 ${getColSpan(index)} ${isWide ? "min-h-[240px] md:min-h-[280px]" : "min-h-[240px]"}`}
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

      {/* Label — bottom-right */}
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
      {/* Heading */}
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12">
          <p className="font-mono text-sm text-white/50">LET THE DESIGN</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            SPEAK
          </h2>
        </div>

        {/* Grid — 3-col desktop, 1-col mobile, alternating wide pattern */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {showing.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={index}
              accentColor={accentColor}
            />
          ))}
        </div>

        {/* Load More — TODO(dashboard + functionality): Fahim to specify behavior */}
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
