import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Review, reviews as staticReviews } from "@/data/reviews";

export interface DbReview {
  id: string;
  client_name: string;
  role: string;
  company: string;
  avatar_url: string | null;
  expanded_image_url: string | null;
  review_text: string;
  short_text: string;
  rating: number;
  sort_order: number;
}

function mapToReview(db: DbReview): Review {
  return {
    id: db.id,
    clientName: db.client_name,
    role: db.role,
    company: db.company,
    avatar: db.avatar_url || "/placeholder.svg",
    expandedImage: db.expanded_image_url || "/placeholder.svg",
    text: db.review_text,
    shortText: db.short_text,
    rating: db.rating,
  };
}

let _cache: Review[] | null = null;
let _promise: Promise<Review[]> | null = null;

async function fetchReviews(): Promise<Review[]> {
  const { data } = await (supabase as any).from("reviews").select("*").order("sort_order");
  if (!data || data.length === 0) return staticReviews;
  return (data as DbReview[]).map(mapToReview);
}

export function useReviews(): Review[] {
  const [reviews, setReviews] = useState<Review[]>(staticReviews);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!_cache) {
        if (!_promise) _promise = fetchReviews();
        _cache = await _promise;
      }
      if (!cancelled) setReviews(_cache);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return reviews;
}

export function invalidateReviewsCache() {
  _cache = null;
  _promise = null;
}
