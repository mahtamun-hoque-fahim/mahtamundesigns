"use client";

import { useState } from "react";
import { Star, UserRound } from "lucide-react";

type Review = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string | null;
};

// TODO(dashboard): This is a separate list from the homepage Reviews section.
// All content (names, roles, quotes, ratings, avatars) will be controlled
// from the admin dashboard. Bulk import via CSV + form input for mass data entry.
// Currently placeholder — structure only.
const ALL_REVIEWS: Review[] = [
  {
    id: "1",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
  },
  {
    id: "2",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
  },
  {
    id: "3",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
  },
  {
    id: "4",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
  },
  {
    id: "5",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
  },
  {
    id: "6",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
  },
  {
    id: "7",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
  },
  {
    id: "8",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
  },
];

const REVIEWS_PER_PAGE = 5;

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col rounded-lg border border-white/10 bg-[#1a1a1a] p-6 md:p-8">
      {/* Star rating badge */}
      <div className="mb-4 inline-flex w-fit rounded-full bg-yellow-500/20 px-3 py-2">
        <div className="flex gap-1 text-yellow-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4"
              strokeWidth={1.5}
              fill={i < review.rating ? "currentColor" : "none"}
            />
          ))}
        </div>
      </div>

      {/* Quote */}
      <p className="mb-6 flex-1 font-mono text-sm leading-relaxed text-white/70">
        {review.quote}
      </p>

      {/* Client info */}
      <div className="flex items-center gap-3 border-t border-white/10 pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/30">
          <UserRound className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-display text-sm font-bold text-white">
            {review.name}
          </p>
          <p className="font-mono text-xs text-white/50">{review.role}</p>
        </div>
      </div>
    </div>
  );
}

export function ReviewsGrid() {
  const [displayedCount, setDisplayedCount] = useState(REVIEWS_PER_PAGE);

  const visibleReviews = ALL_REVIEWS.slice(0, displayedCount);
  const hasMore = displayedCount < ALL_REVIEWS.length;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + REVIEWS_PER_PAGE);
  };

  return (
    <section id="reviews-grid" className="relative bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Grid layout — 2-1-2 on desktop, single column on mobile */}
        <div className="grid gap-6 md:gap-8">
          {/* First row — 2 cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {visibleReviews.slice(0, 2).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Second row — 1 centered card */}
          {visibleReviews.length > 2 && (
            <div className="flex justify-center">
              <div className="w-full md:max-w-[calc(50%-16px)]">
                <ReviewCard review={visibleReviews[2]} />
              </div>
            </div>
          )}

          {/* Third row — 2 cards */}
          {visibleReviews.length > 3 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {visibleReviews.slice(3, 5).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          {/* Subsequent rows — 2-1-2 pattern repeats */}
          {visibleReviews.length > 5 && (
            <>
              {Array.from({
                length: Math.ceil((visibleReviews.length - 5) / 5),
              }).map((_, groupIndex) => {
                const startIdx = 5 + groupIndex * 5;
                const groupReviews = visibleReviews.slice(startIdx, startIdx + 5);

                return (
                  <div key={`group-${groupIndex}`} className="grid gap-6 md:gap-8">
                    {/* 2 cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                      {groupReviews.slice(0, 2).map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>

                    {/* 1 centered card */}
                    {groupReviews.length > 2 && (
                      <div className="flex justify-center">
                        <div className="w-full md:max-w-[calc(50%-16px)]">
                          <ReviewCard review={groupReviews[2]} />
                        </div>
                      </div>
                    )}

                    {/* 2 cards (if remaining) */}
                    {groupReviews.length > 3 && (
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                        {groupReviews.slice(3, 5).map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Load More button */}
        {hasMore && (
          <div className="mt-12 flex justify-center md:mt-16">
            <button
              onClick={handleLoadMore}
              className="relative inline-flex items-center rounded-none bg-transparent px-8 py-3 font-mono text-sm font-medium text-white transition-all duration-200 after:absolute after:bottom-0 after:left-1/2 after:h-[1px] after:w-0 after:-translate-x-1/2 after:bg-white after:transition-all after:duration-200 hover:after:w-full"
            >
              Load More
              <span className="ml-2">▼</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
