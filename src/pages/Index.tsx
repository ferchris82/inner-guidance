import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { ResourcesSection } from "@/components/sections/ResourcesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Verificar si hay una sección guardada en sessionStorage para hacer scroll
    const scrollToSection = sessionStorage.getItem('scrollToSection');
    if (scrollToSection) {
      // Limpiar el sessionStorage
      sessionStorage.removeItem('scrollToSection');
      
      // Hacer scroll a la sección después de un pequeño delay
      setTimeout(() => {
        const element = document.getElementById(scrollToSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, []);

  useEffect(() => {
    // Si hay un hash en la URL, hacer scroll al elemento correspondiente
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        // Pequeño delay para asegurar que la página esté completamente cargada
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <BlogSection />
      <ResourcesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;