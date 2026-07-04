"use client";

import { useEffect, useRef } from "react";
import { Star, UserRound } from "lucide-react";

type Review = {
  name: string | null;
  role: string | null;
  quote: string | null;
  rating: number | null;
  avatar: string | null;
};

// TODO(dashboard): all review content (name, role, quote, rating, avatar)
// and the number of featured reviews will be controlled from the admin
// dashboard. Placeholder/empty for now — structure only.
const REVIEWS: Review[] = [
  { name: null, role: null, quote: null, rating: null, avatar: null },
  { name: null, role: null, quote: null, rating: null, avatar: null },
  { name: null, role: null, quote: null, rating: null, avatar: null },
  { name: null, role: null, quote: null, rating: null, avatar: null },
];

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-[440px] w-[340px] shrink-0 flex-col rounded-2xl border border-black/10 bg-white p-7 shadow-sm md:w-[420px] md:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/5 text-black/30">
          <UserRound className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-display text-base font-bold text-ink">
            {review.name ?? "Client Name"}
          </p>
          <p className="font-mono text-xs text-black/50">
            {review.role ?? "Role, Company"}
          </p>
        </div>
      </div>

      <div className="mb-4 flex gap-1 text-accent-dim">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4"
            strokeWidth={1.5}
            fill={i < (review.rating ?? 0) ? "currentColor" : "none"}
          />
        ))}
      </div>

      <p className="flex-1 font-mono text-sm leading-relaxed text-black/60">
        {review.quote ??
          "This review is pending — content will be assigned from the dashboard."}
      </p>

      <button className="mt-5 text-left font-mono text-xs font-medium text-accent-dim hover:underline">
        Read More
      </button>
    </div>
  );
}

export function Reviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const scrollableDistance = section.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const rect = section.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1);

      const maxTranslate = Math.max(track.scrollWidth - window.innerWidth, 0);
      track.style.transform = `translateX(-${progress * maxTranslate}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="reviews"
        data-nav-hide="true"
        className="relative bg-surface-light"
        style={{ height: "350vh" }}
      >
        <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden bg-surface-light">
          <div className="mx-auto mb-8 w-full max-w-[1400px] px-6 text-center md:px-10">
            <p className="mb-2 font-mono text-xs tracking-[0.2em] text-accent-dim">
              Customer Reviews and
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ink md:text-6xl">
              IMPRESSIONS
            </h2>
          </div>

          <div
            ref={trackRef}
            className="flex w-max shrink-0 gap-6 pl-6 will-change-transform md:pl-10"
          >
            {REVIEWS.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center bg-surface-light py-6">
        <a
          href="#"
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-sm font-medium text-white shadow-[0_0_40px_rgba(187,124,255,0.55)] transition-all duration-300 hover:bg-accent-dim hover:shadow-[0_0_55px_rgba(187,124,255,0.75)]"
        >
          SEE ALL
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </>
  );
}
