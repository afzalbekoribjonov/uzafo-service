import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CosmicBackground from '@/components/CosmicBackground';
import NavigationBar from '@/components/landing/NavigationBar';
import HeroSection from '@/sections/HeroSection';
import StatsBar from '@/sections/StatsBar';
import ServicesShowcase from '@/sections/ServicesShowcase';
import AboutSection from '@/sections/AboutSection';
import SecuritySection from '@/sections/SecuritySection';
import ContactSection from '@/sections/ContactSection';
import FooterSection from '@/sections/FooterSection';

export default function HomePage() {
  const location = useLocation();

  // Support navigating in from another page with a target section to scroll to.
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!target) return;
    // Wait for layout so the section exists, then smooth-scroll with navbar offset.
    const t = setTimeout(() => {
      const el = document.getElementById(target);
      if (el) {
        const offset = 88;
        const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // Clear state so a later refresh/back doesn't re-trigger the scroll.
      window.history.replaceState({}, '');
    }, 250);
    return () => clearTimeout(t);
  }, [location.state]);

  return (
    <div className="min-h-screen">
      <CosmicBackground />
      <NavigationBar />
      <div className="pt-[88px]">
        <HeroSection />
        <StatsBar />
        <ServicesShowcase />
        <AboutSection />
        <SecuritySection />
        <ContactSection />
        <FooterSection />
      </div>
    </div>
  );
}
