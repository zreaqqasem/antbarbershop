import Header from "../components/Header";
import Footer from "../components/Footer";
import MarqueeBand from "../components/MarqueeBand";
import HeroSection from "../components/home/HeroSection";
import ServicesPreview from "../components/home/ServicesPreview";
import StatsStrip from "../components/home/StatsStrip";
import BarbersPreview from "../components/home/BarbersPreview";
import CutsGallery from "../components/home/CutsGallery";
import ClipperStory from "../components/home/ClipperStory";
import TeamReveal from "../components/home/TeamReveal";
import ReviewsSection from "../components/home/ReviewsSection";
import VisitSection from "../components/home/VisitSection";

export default function Home() {
  return (
    <div className="rtl-font min-h-screen bg-[#0B0B0C]">
      <Header />
      <main>
        <HeroSection />
        <MarqueeBand />
        <ClipperStory />
        <ServicesPreview />
        <StatsStrip />
        <TeamReveal />
        <BarbersPreview />
        <CutsGallery />
        <ReviewsSection />
        <VisitSection />
      </main>
      <Footer />
    </div>
  );
}