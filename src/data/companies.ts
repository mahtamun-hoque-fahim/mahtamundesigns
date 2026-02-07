export interface Company {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  role: string;
  contributions: string[];
  impact: string;
  logo: string;
  cover: string;
  designs: string[];
  featured: boolean;
  featuredImage: string;
  category: string;
}

export const companies: Company[] = [
  {
    id: "1",
    slug: "nexus-studio",
    name: "Nexus Studio",
    tagline: "Creative Agency",
    shortDescription: "Complete brand identity and visual system for a forward-thinking creative agency.",
    fullDescription: "Nexus Studio needed a complete brand overhaul to match their ambitious vision. I crafted a comprehensive visual identity system that included everything from logo design to full marketing collateral, establishing a cohesive brand presence across all touchpoints.",
    role: "Lead Brand Designer",
    contributions: ["Brand Identity", "Logo Design", "Marketing Collateral", "Brand Guidelines"],
    impact: "Increased brand recognition by 300% within the first quarter of launch.",
    logo: "/images/companies/nexus-studio/logo.png",
    cover: "/images/companies/nexus-studio/cover.jpg",
    designs: [
      "/images/home/selected-works-1.jpg",
      "/images/home/selected-works-2.jpg",
      "/images/companies/nexus-studio/design-1.jpg",
    ],
    featured: true,
    featuredImage: "/images/home/selected-works-1.jpg",
    category: "Brand Identity",
  },
  {
    id: "2",
    slug: "prism-creative",
    name: "Prism Creative",
    tagline: "Design Studio",
    shortDescription: "Premium packaging design for an artisan cosmetics brand.",
    fullDescription: "Prism Creative's artisan cosmetics line required packaging that communicated luxury and authenticity. I designed a packaging system that was both visually stunning and functional, using premium materials and sophisticated typography.",
    role: "Packaging Designer",
    contributions: ["Packaging Design", "Product Photography Direction", "Print Production"],
    impact: "Product line saw a 45% increase in retail sales after the redesign.",
    logo: "/images/companies/prism-creative/logo.png",
    cover: "/images/companies/prism-creative/cover.jpg",
    designs: [
      "/images/home/selected-works-2.jpg",
      "/images/home/selected-works-4.jpg",
      "/images/companies/prism-creative/design-1.jpg",
    ],
    featured: true,
    featuredImage: "/images/home/selected-works-2.jpg",
    category: "Packaging Design",
  },
  {
    id: "3",
    slug: "lunar-agency",
    name: "Lunar Agency",
    tagline: "Digital Agency",
    shortDescription: "Bold typographic campaign for a cutting-edge digital agency.",
    fullDescription: "Lunar Agency wanted to make a bold statement in the digital space. I created a series of typographic posters and digital campaigns that pushed creative boundaries while maintaining brand consistency across all platforms.",
    role: "Creative Director",
    contributions: ["Campaign Design", "Typography", "Art Direction", "Digital Assets"],
    impact: "Campaign reached 2M+ impressions and won a regional design award.",
    logo: "/images/companies/lunar-agency/logo.png",
    cover: "/images/companies/lunar-agency/cover.jpg",
    designs: [
      "/images/home/selected-works-3.jpg",
      "/images/home/selected-works-5.jpg",
      "/images/companies/lunar-agency/design-1.jpg",
    ],
    featured: true,
    featuredImage: "/images/home/selected-works-3.jpg",
    category: "Campaign Design",
  },
  {
    id: "4",
    slug: "vertex-labs",
    name: "Vertex Labs",
    tagline: "Tech Company",
    shortDescription: "Social media design system for a growing tech startup.",
    fullDescription: "Vertex Labs needed a cohesive social media presence that would set them apart in the competitive tech landscape. I developed a comprehensive social media design system with templates, guidelines, and a vibrant visual language.",
    role: "Social Media Designer",
    contributions: ["Social Media Design", "Content Strategy", "Template System"],
    impact: "Social engagement increased by 200% within three months.",
    logo: "/images/logos/company-4.png",
    cover: "/images/home/selected-works-4.jpg",
    designs: [
      "/images/home/selected-works-4.jpg",
      "/images/home/selected-works-2.jpg",
    ],
    featured: true,
    featuredImage: "/images/home/selected-works-4.jpg",
    category: "Social Media",
  },
  {
    id: "5",
    slug: "aurora-brand",
    name: "Aurora Brand",
    tagline: "Fashion Label",
    shortDescription: "Editorial design for a premium fashion magazine.",
    fullDescription: "Aurora Brand's fashion magazine required a sophisticated editorial design that would complement their high-end content. I crafted elegant layouts with careful attention to typography, whitespace, and image treatment.",
    role: "Editorial Designer",
    contributions: ["Magazine Layout", "Editorial Design", "Typography", "Photo Editing"],
    impact: "Magazine became the most-read fashion publication in the region.",
    logo: "/images/logos/company-5.png",
    cover: "/images/home/selected-works-5.jpg",
    designs: [
      "/images/home/selected-works-5.jpg",
      "/images/home/selected-works-3.jpg",
    ],
    featured: true,
    featuredImage: "/images/home/selected-works-5.jpg",
    category: "Editorial Design",
  },
];

export const logoStripItems = Array.from({ length: 15 }, (_, i) => ({
  id: `logo-${i + 1}`,
  name: `Brand ${i + 1}`,
  logo: `/images/logos/company-${(i % 5) + 1}.png`,
}));
