"use client";

import { useEffect, Suspense, lazy, useState } from "react";
import { useLenis } from "./lib/lenis";
import { getLenisInstance } from "./lib/lenis";
import { MotionProvider } from "./components/MotionProvider";
import Navigation from "./components/Navigation";
import ScrollProgress from "./components/ScrollProgress";
import CinematicHero from "./components_new/CinematicHero";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import LazyLoadSection from "./components/LazyLoadSection";
import Footer from "./components/Footer";

// Lazy load heavy 3D components for better performance
const ServiceGlobe = lazy(() => import("./components_new/ServiceGlobe"));
const LaunchSequence = lazy(() => import("./components_new/LaunchSequence"));
const Perspective3DShowcase = lazy(() => import("./components_new/Perspective3DShowcase"));

export default function PageClient() {
  const [isReady, setIsReady] = useState(false);
  useLenis(true);

  // Optimized scroll to top - deferred to reduce initial load
  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Defer scroll initialization to reduce initial load lag
    const initTimer = setTimeout(() => {
      // First, ensure we're at the top with native scroll
      window.scrollTo(0, 0);
      
      const lenis = getLenisInstance();
      if (lenis) {
        // Use immediate scroll to prevent visual glitch
        lenis.scrollTo(0, { immediate: true });
      }
      
      // Mark as ready after initialization
      setIsReady(true);
    }, 300); // Defer by 300ms

    return () => clearTimeout(initTimer);
  }, []);

  return (
    <MotionProvider>
      <ScrollProgress />
      <Navigation />
      <div className="pt-16 w-full overflow-x-hidden min-h-screen">
        {/* Hero section - first visible content */}
        <CinematicHero />
        <LazyLoadSection>
          <Suspense fallback={null}>
            <ServiceGlobe />
          </Suspense>
        </LazyLoadSection>
        <LazyLoadSection>
          <Portfolio />
        </LazyLoadSection>
        <LazyLoadSection>
          <Suspense fallback={null}>
            <LaunchSequence />
          </Suspense>
        </LazyLoadSection>
        <LazyLoadSection>
          <Suspense fallback={null}>
            <Perspective3DShowcase />
          </Suspense>
        </LazyLoadSection>
        <LazyLoadSection>
          <Contact />
        </LazyLoadSection>
        <Footer />
      </div>
    </MotionProvider>
  );
}
 
