import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectGroup {
  id: string;
  company_id: string;
  title: string;
  subtitle: string;
  sort_order: number;
  images: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  company_id: string;
  group_id: string | null;
  image_url: string;
  sort_order: number;
}

export function useProjectGroups(companyId: string | undefined) {
  const [groups, setGroups] = useState<ProjectGroup[]>([]);
  const [ungroupedImages, setUngroupedImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) { setLoading(false); return; }

    const load = async () => {
      setLoading(true);
      const [{ data: groupsData }, { data: imagesData }] = await Promise.all([
        supabase.from("project_groups").select("*").eq("company_id", companyId).order("sort_order"),
        supabase.from("project_images").select("*").eq("company_id", companyId).order("sort_order"),
      ]);

      const images = (imagesData || []) as ProjectImage[];
      const grps = (groupsData || []).map((g: any) => ({
        ...g,
        subtitle: g.subtitle || "",
        images: images.filter((img) => img.group_id === g.id),
      })) as ProjectGroup[];

      setGroups(grps);
      setUngroupedImages(images.filter((img) => !img.group_id));
      setLoading(false);
    };

    load();
  }, [companyId]);

  return { groups, ungroupedImages, loading };
}
