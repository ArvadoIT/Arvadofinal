"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyLoadSectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

export default function LazyLoadSection({
  children,
  fallback = null,
  rootMargin = "200px",
  threshold = 0.1,
}: LazyLoadSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we're navigating to a section that doesn't exist yet
    // If so, render this lazy section to allow the target to appear
    const checkAndRenderForHash = () => {
      const hash = window.location.hash;
      if (!hash || hash === "#") return;
      
      const targetId = decodeURIComponent(hash.replace("#", ""));
      const target = document.getElementById(targetId);
      
      // If target doesn't exist, it might be in this lazy section
      // Render this section to allow it to appear
      if (!target && !isVisible) {
        setIsVisible(true);
      }
    };

    // Check on mount and hash changes
    checkAndRenderForHash();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve after loading to save resources
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Listen for hash changes to render immediately when navigating
    const handleHashChange = () => {
      checkAndRenderForHash();
    };

    // Listen for clicks on anchor links - render if target doesn't exist
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest<HTMLAnchorElement>("a[href^='#']");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href !== "#") {
          const targetId = decodeURIComponent(href.replace("#", ""));
          const element = document.getElementById(targetId);
          // If element doesn't exist, render this section immediately
          if (!element && !isVisible) {
            setIsVisible(true);
          }
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleClick, true);

    // Capture ref.current in a variable for cleanup
    const currentRef = ref.current;

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleClick, true);
    };
  }, [rootMargin, threshold, isVisible]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
}


