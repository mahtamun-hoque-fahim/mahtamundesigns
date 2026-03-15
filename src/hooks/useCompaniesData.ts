import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/data/companies";

export interface DbCompany {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  short_description: string;
  full_description: string;
  role: string;
  contributions: string[];
  impact: string;
  logo_url: string | null;
  cover_url: string | null;
  design_urls: string[];
  featured: boolean;
  featured_image_url: string | null;
  category: string;
  sort_order: number;
}

function mapToCompany(db: DbCompany): Company {
  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    tagline: db.tagline,
    shortDescription: db.short_description,
    fullDescription: db.full_description,
    role: db.role,
    contributions: db.contributions || [],
    impact: db.impact,
    logo: db.logo_url || "",
    cover: db.cover_url || "",
    designs: db.design_urls || [],
    featured: db.featured,
    featuredImage: db.featured_image_url || "",
    category: db.category,
    layoutMode: ((db as any).layout_mode as "grouped" | "simple") || "simple",
  };
}

let _cache: Company[] | null = null;
let _promise: Promise<Company[]> | null = null;

async function fetchCompanies(): Promise<Company[]> {
  const { data } = await (supabase as any).from("companies").select("*").order("sort_order");
  if (!data || data.length === 0) return [];
  return (data as DbCompany[]).map(mapToCompany);
}

export function useCompanies(): Company[] {
  // Start empty — no flash of static/hardcoded data
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!_cache) {
        if (!_promise) _promise = fetchCompanies();
        _cache = await _promise;
      }
      if (!cancelled) setCompanies(_cache);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return companies;
}

export function invalidateCompaniesCache() {
  _cache = null;
  _promise = null;
}
