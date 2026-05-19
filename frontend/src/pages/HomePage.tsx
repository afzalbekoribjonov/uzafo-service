import CosmicBackground from '@/components/CosmicBackground';
import NavigationBar from '@/components/landing/NavigationBar';
import HeroSection from '@/sections/HeroSection';
import StatsBar from '@/sections/StatsBar';
import ServicesShowcase from '@/sections/ServicesShowcase';
import AboutSection from '@/sections/AboutSection';
import ContactSection from '@/sections/ContactSection';
import FooterSection from '@/sections/FooterSection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <CosmicBackground />
      <NavigationBar />
      <div className="pt-[88px]">
        <HeroSection />
        <StatsBar />
        <ServicesShowcase />
        <AboutSection />
        <ContactSection />
        <FooterSection />
      </div>
    </div>
  );
}
