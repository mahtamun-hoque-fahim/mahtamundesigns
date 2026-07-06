// lib/clients.ts
// TODO(dashboard): all of this will be fetched from the admin dashboard/CMS.
// The shape here is the contract — every field maps to a dashboard control.

export type DesignLabel =
  | "logo"
  | "cover"
  | "thumbnail"
  | "poster"
  | "banner"
  | "story"
  | string; // allows dashboard-added custom labels without a code change

export type GalleryItem = {
  id: string;
  image: string | null; // null = placeholder until asset uploaded
  label: DesignLabel;
};

export type ClientData = {
  slug: string;
  name: string;
  label: string;     // shown on portfolio card e.g. "Brand Setup", "Rebranding"
  tagline: string;   // brand's own tagline e.g. "Frontier Edtech"
  logo: string | null;          // circular logo image
  accentColor: string;          // hex — drives ALL color on this page
  about: string;
  role: string[];               // can be multi-line ("Intern Designer\nJunior Designer")
  timeline: string;
  type: string;
  contributions: string[];
  rating: number;
  stats: {
    years: number;
    designs: number;
    projects: number;
  };
  gallery: GalleryItem[];
};

// Placeholder data — one company to develop the template against.
// TODO(dashboard): replace with real fetch by slug.
export const CLIENTS: Record<string, ClientData> = {
  "sulphuric-bench": {
    slug: "sulphuric-bench",
    name: "Sulphuric Bench",
    label: "Brand Setup",
    tagline: "Frontier Edtech",
    logo: null,
    accentColor: "#00c8a0",
    about:
      "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.",
    role: ["Intern Designer", "Junior Designer"],
    timeline: "March, 2021 – April, 2025",
    type: "Part-time",
    contributions: [
      "Logo Design",
      "Brand Identity",
      "Poster Design",
      "Social Media Design",
      "Article Thumbnail Design",
    ],
    rating: 3.5,
    stats: { years: 4, designs: 75, projects: 5 },
    gallery: [
      { id: "g1", image: null, label: "cover" },
      { id: "g2", image: null, label: "story" },
      { id: "g3", image: null, label: "cover" },
      { id: "g4", image: null, label: "cover" },
      { id: "g5", image: null, label: "poster" },
      { id: "g6", image: null, label: "cover" },
      { id: "g7", image: null, label: "banner" },
      { id: "g8", image: null, label: "thumbnail" },
      { id: "g9", image: null, label: "story" },
    ],
  },
};

export function getClient(slug: string): ClientData | null {
  return CLIENTS[slug] ?? null;
}
