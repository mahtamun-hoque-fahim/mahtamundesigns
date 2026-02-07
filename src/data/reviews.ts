export interface Review {
  id: string;
  clientName: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
  shortText: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    clientName: "Arif Rahman",
    role: "CEO",
    company: "Nexus Studio",
    avatar: "/images/reviews/client-1.jpg",
    text: "Working with this designer was transformative for our brand. The attention to detail and creative vision exceeded all expectations. Every deliverable was polished, on time, and perfectly aligned with our vision. I've never experienced such a seamless creative process.",
    shortText: "Transformative work that exceeded all expectations.",
  },
  {
    id: "2",
    clientName: "Nadia Sultana",
    role: "Marketing Director",
    company: "Prism Creative",
    avatar: "/images/reviews/client-2.jpg",
    text: "The packaging designs completely transformed our product line. Sales increased dramatically and we received countless compliments from customers. The designer understood our brand essence and translated it into visual perfection.",
    shortText: "Our product line was completely transformed.",
  },
  {
    id: "3",
    clientName: "Kamal Hassan",
    role: "Founder",
    company: "Lunar Agency",
    avatar: "/images/reviews/client-3.jpg",
    text: "Incredible creative vision combined with flawless execution. The campaign designs were bold, memorable, and drove real business results. This is someone who truly understands the intersection of aesthetics and strategy.",
    shortText: "Bold designs that drove real business results.",
  },
  {
    id: "4",
    clientName: "Fatima Begum",
    role: "Brand Manager",
    company: "Vertex Labs",
    avatar: "/images/reviews/client-1.jpg",
    text: "Our social media presence went from forgettable to iconic. The design system was so well-structured that our team could create on-brand content independently. A true strategic thinker with impeccable taste.",
    shortText: "From forgettable to iconic social presence.",
  },
  {
    id: "5",
    clientName: "Rafiq Ahmed",
    role: "Creative Director",
    company: "Aurora Brand",
    avatar: "/images/reviews/client-2.jpg",
    text: "The editorial designs brought a new level of sophistication to our magazine. Every page was a masterclass in typography and layout. Working together felt like a true creative partnership.",
    shortText: "A masterclass in typography and layout.",
  },
  {
    id: "6",
    clientName: "Samira Islam",
    role: "Product Lead",
    company: "Nexus Studio",
    avatar: "/images/reviews/client-3.jpg",
    text: "Delivered beyond what we imagined possible. The brand identity work was cohesive, modern, and instantly recognizable. Our stakeholders were unanimously impressed, and the brand guidelines have become our creative bible.",
    shortText: "Cohesive and instantly recognizable branding.",
  },
];
