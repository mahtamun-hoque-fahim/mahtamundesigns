"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, UserRound, X } from "lucide-react";

type Review = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string | null;
  image: string | null; // Product/brand asset shown in modal
};

// TODO(dashboard): This is a separate list from the homepage Reviews section.
// All content (names, roles, quotes, ratings, avatars, images) will be controlled
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
    image: null,
  },
  {
    id: "2",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
    image: null,
  },
  {
    id: "3",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
    image: null,
  },
  {
    id: "4",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
    image: null,
  },
  {
    id: "5",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
    image: null,
  },
  {
    id: "6",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
    image: null,
  },
  {
    id: "7",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
    image: null,
  },
  {
    id: "8",
    name: "Ahsan F. Nahan",
    role: "Client, Company",
    quote:
      "Lorem ipsum is simply some text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since, when designers of letterpress and composed it to make some text that's not just random.",
    rating: 5,
    avatar: null,
    image: null,
  },
];

const REVIEWS_PER_PAGE = 5;

function ReviewModal({
  review,
  isOpen,
  onClose,
}: {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen || !review) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={handleBackdropClick}
      style={{
        animation: "fadeIn 300ms ease-out forwards",
      }}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg border border-white/10 bg-[#1a1a1a] overflow-hidden"
        style={{
          animation: "modalSlideIn 300ms ease-out forwards",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-white" strokeWidth={2} />
        </button>

        {/* Desktop: flex row, Mobile: flex col */}
        <div className="flex flex-col md:flex-row">
          {/* Image — 50% on desktop, full width on mobile */}
          <div className="flex h-[300px] items-center justify-center overflow-hidden bg-black md:h-auto md:w-1/2">
            {review.image ? (
              <Image
                src={review.image}
                alt={review.name}
                width={400}
                height={500}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/5">
                <p className="font-mono text-xs text-white/40">No image</p>
              </div>
            )}
          </div>

          {/* Content — 50% on desktop, full width on mobile */}
          <div className="flex flex-col justify-between p-8 md:w-1/2 md:p-10">
            {/* Star rating */}
            <div className="mb-4 flex gap-1 text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5"
                  strokeWidth={1.5}
                  fill={i < review.rating ? "currentColor" : "none"}
                />
              ))}
            </div>

            {/* Full quote */}
            <p className="mb-8 flex-1 font-mono text-sm italic leading-relaxed text-white/80">
              "{review.quote}"
            </p>

            {/* Client info */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/30">
                <UserRound className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-display text-base font-bold text-white">
                  {review.name}
                </p>
                <p className="font-mono text-xs text-white/50">{review.role}</p>
              </div>
            </div>

            {/* Book Meeting button */}
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-none bg-accent px-6 py-3 font-mono text-sm font-medium text-white transition-opacity duration-200 hover:opacity-90"
            >
              Book Meeting
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  onClick,
}: {
  review: Review;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col rounded-lg border border-white/10 bg-[#1a1a1a] p-6 transition-all duration-200 hover:border-accent/30 hover:bg-[#222222] md:p-8"
    >
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
    </button>
  );
}

export function ReviewsGrid() {
  const [displayedCount, setDisplayedCount] = useState(REVIEWS_PER_PAGE);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const visibleReviews = ALL_REVIEWS.slice(0, displayedCount);
  const hasMore = displayedCount < ALL_REVIEWS.length;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + REVIEWS_PER_PAGE);
  };

  const handleOpenModal = (review: Review) => {
    setSelectedReview(review);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
  };

  return (
    <>
      <ReviewModal
        review={selectedReview}
        isOpen={selectedReview !== null}
        onClose={handleCloseModal}
      />
      <section id="reviews-grid" className="relative bg-bg py-16 md:py-24 overflow-hidden">
        {/* Violet glow at left edge, middle height */}
        <div
          className="pointer-events-none absolute z-0 h-[600px] w-[600px]"
          style={{
            top: "50%",
            left: "-200px",
            transform: "translateY(-50%) rotate(180deg)",
            background: `radial-gradient(50% 100% at 50% 0%, rgba(187, 124, 255, 0.8) 0%, rgba(187, 124, 255, 0.3) 35%, transparent 80%)`,
          }}
        />
        
        {/* Grid texture background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 1,
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 relative z-10">
        {/* Grid layout — 2-1-2 on desktop, single column on mobile */}
        <div className="grid gap-6 md:gap-8">
          {/* First row — 2 cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {visibleReviews.slice(0, 2).map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onClick={() => handleOpenModal(review)}
              />
            ))}
          </div>

          {/* Second row — 1 centered card */}
          {visibleReviews.length > 2 && (
            <div className="flex justify-center">
              <div className="w-full md:max-w-[calc(50%-16px)]">
                <ReviewCard
                  review={visibleReviews[2]}
                  onClick={() => handleOpenModal(visibleReviews[2])}
                />
              </div>
            </div>
          )}

          {/* Third row — 2 cards */}
          {visibleReviews.length > 3 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {visibleReviews.slice(3, 5).map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onClick={() => handleOpenModal(review)}
                />
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
                        <ReviewCard
                          key={review.id}
                          review={review}
                          onClick={() => handleOpenModal(review)}
                        />
                      ))}
                    </div>

                    {/* 1 centered card */}
                    {groupReviews.length > 2 && (
                      <div className="flex justify-center">
                        <div className="w-full md:max-w-[calc(50%-16px)]">
                          <ReviewCard
                            review={groupReviews[2]}
                            onClick={() => handleOpenModal(groupReviews[2])}
                          />
                        </div>
                      </div>
                    )}

                    {/* 2 cards (if remaining) */}
                    {groupReviews.length > 3 && (
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                        {groupReviews.slice(3, 5).map((review) => (
                          <ReviewCard
                            key={review.id}
                            review={review}
                            onClick={() => handleOpenModal(review)}
                          />
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
    </>
  );
}
