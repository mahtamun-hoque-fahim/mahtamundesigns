import { Hero } from "@/components/home/Hero";
import { LogoStrip } from "@/components/home/LogoStrip";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { ReviewsPreview } from "@/components/home/ReviewsPreview";
import { StatsSection } from "@/components/home/StatsSection";
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
        <SelectedWorks />
        <ReviewsPreview />
        <StatsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
