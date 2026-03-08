import { Hero } from "@/components/home/Hero";
import { LogoStrip } from "@/components/home/LogoStrip";
import { ServicesSection } from "@/components/home/ServicesSection";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ReviewsPreview } from "@/components/home/ReviewsPreview";
import { StatsSection } from "@/components/home/StatsSection";
import { MidPageCta } from "@/components/home/MidPageCta";
import { CtaSection } from "@/components/home/CtaSection";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <LogoStrip />
        <ServicesSection />
        <SelectedWorks />
        <MidPageCta />
        <ProcessSection />
        <ReviewsPreview />
        <StatsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
