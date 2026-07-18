"use client";

import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import SkillsSection from "@/components/sections/SkillsSection";
import TimelineSection from "@/components/sections/TimelineSection";
import AIAssistant from "@/components/sections/AIAssistant";
import ContactSection from "@/components/sections/ContactSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturedProjects />
      <SkillsSection />
      <TimelineSection />
      <AIAssistant />
      <ContactSection />
      <Footer />
    </main>
  );
}
