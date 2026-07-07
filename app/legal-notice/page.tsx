import { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { LegalNoticeHero } from "@/components/sections/legal-notice-hero";
import { LegalNoticeContent } from "@/components/sections/legal-notice-content";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Legal Notice | Mahtamun",
  description:
    "All original designs and creative works by Mahtamun Hoque Fahim are protected under the Bangladesh Copyright Act, 2000. Unauthorized use is strictly prohibited.",
};

export default function LegalNoticePage() {
  return (
    <>
      <Navbar />
      <LegalNoticeHero />
      <LegalNoticeContent />
      <Footer />
    </>
  );
}
