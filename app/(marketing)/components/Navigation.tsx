"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getLenisInstance } from "../lib/lenis";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Process", href: "#launch" },
  { label: "Interactive Experience", href: "#showcase" },
  { label: "Contact", href: "#contact" },
];

const MagneticLink = motion.a;

function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Optimized scroll handler - deferred to reduce initial load
  useEffect(() => {
    // Defer scroll tracking to reduce initial load lag
    const initTimer = setTimeout(() => {
      const lenis = getLenisInstance();
      if (!lenis) {
        // Fallback to native scroll
        const handleNativeScroll = () => {
          setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleNativeScroll, { passive: true });
        handleNativeScroll();
        return () => window.removeEventListener('scroll', handleNativeScroll);
      }

      let rafId: number;
      let lastScrollY = 0;
      let throttleTimer: NodeJS.Timeout | null = null;
      
      const handleScroll = (e: any) => {
        const scrollY = e.scroll || window.scrollY;
        
        // Throttle scroll updates more aggressively
        if (Math.abs(scrollY - lastScrollY) < 10) return;
        lastScrollY = scrollY;
        
        if (throttleTimer) return;
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
          rafId = requestAnimationFrame(() => {
            setIsScrolled(scrollY > 20);
            
            // Update active section - only check when scroll changes significantly
            const sections = navLinks.map(link => link.href.replace('#', ''));
            const currentSection = sections.find(section => {
              const element = document.getElementById(section);
              if (!element) return false;
              const rect = element.getBoundingClientRect();
              return rect.top <= 100 && rect.bottom >= 100;
            });
            setActiveSection(currentSection ? `#${currentSection}` : '');
          });
        }, 100); // Throttle to 100ms
      };
      
      lenis.on('scroll', handleScroll);
      
      // Initial check - deferred
      setTimeout(() => {
        handleScroll({ scroll: lenis.scroll || window.scrollY });
      }, 100);
      
      return () => {
        lenis.off('scroll', handleScroll);
        if (rafId) cancelAnimationFrame(rafId);
        if (throttleTimer) clearTimeout(throttleTimer);
      };
    }, 800); // Defer scroll tracking by 800ms
    
    return () => {
      clearTimeout(initTimer);
    };
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleLogoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeMobileMenu();
    
    if (isHomePage) {
      // On home page, just scroll to top
      const lenis = getLenisInstance();
      if (lenis) {
        lenis.scrollTo(0, { immediate: false });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // On other pages, navigate to home
      router.push("/");
    }
  }, [closeMobileMenu, isHomePage, router]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!href || href === "#" || href.length < 2) return;
    
    closeMobileMenu();
    
    // If not on home page, navigate to home page with hash
    if (!isHomePage) {
      // Use full page navigation to preserve hash - Lenis will handle it on page load
      window.location.href = "/" + href;
      return;
    }
    
    // On home page, use existing scroll behavior
    const lenis = getLenisInstance();
    const targetId = decodeURIComponent(href.replace("#", ""));
    const SCROLL_OFFSET = -96;
    
    // Function to scroll to target - matches lenis.ts scrollToHash behavior
    const scrollToTarget = (target: HTMLElement) => {
      if (lenis) {
        // Match the exact options from lenis.ts scrollToHash
        lenis.scrollTo(target, {
          offset: SCROLL_OFFSET,
          duration: 0.9,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });
        window.history.pushState(null, "", href);
        requestAnimationFrame(() => {
          // Focus target with preventScroll to avoid double scroll
          const previousTabIndex = target.getAttribute("tabindex");
          if (previousTabIndex === null) {
            target.setAttribute("tabindex", "-1");
          }
          target.focus({ preventScroll: true });
          if (previousTabIndex === null) {
            target.removeAttribute("tabindex");
          }
        });
      } else {
        // Fallback to native scroll
        const elementTop = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementTop + SCROLL_OFFSET,
          behavior: "smooth",
        });
        window.history.pushState(null, "", href);
      }
    };

    // Try to find target immediately
    let target = document.getElementById(targetId);
    
    if (target) {
      // Use requestAnimationFrame to ensure Lenis is ready and DOM is stable
      requestAnimationFrame(() => {
        scrollToTarget(target!);
      });
      return;
    }

    // If target not found (might be lazy-loaded), wait for it with retries
    // LazyLoadSection will render when it detects navigation to a missing element
    let retryCount = 0;
    const maxRetries = 30; // 3 seconds max wait (30 * 100ms)
    
    const findAndScroll = () => {
      target = document.getElementById(targetId);
      
      if (target) {
        // Use requestAnimationFrame to ensure Lenis is ready
        requestAnimationFrame(() => {
          scrollToTarget(target!);
        });
        return;
      }
      
      retryCount++;
      if (retryCount < maxRetries) {
        // Check again after a short delay
        // LazyLoadSection should have rendered by now
        setTimeout(findAndScroll, 100);
      }
    };
    
    // Start looking for the element after a brief delay to allow lazy load to trigger
    setTimeout(findAndScroll, 150);
  }, [closeMobileMenu, isHomePage]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/10 bg-slate-950/95 shadow-lg shadow-sky-500/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4 lg:px-8 relative">
        {/* Logo/Brand */}
        <MagneticLink
          href="/"
          className="text-lg font-semibold text-white relative group"
          onClick={handleLogoClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="relative z-10"
            whileHover={{ 
              textShadow: "0 0 20px rgba(14, 165, 233, 0.5)",
            }}
          >
            Arvado
          </motion.span>
          <motion.div
            className="absolute inset-0 bg-sky-500/10 rounded-lg opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
        </MagneticLink>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <MagneticLink
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-white/70 transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                <motion.span
                  className="relative z-10"
                  animate={{
                    color: isActive ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.7)",
                  }}
                  whileHover={{ color: "rgb(255, 255, 255)" }}
                >
                  {link.label}
                </motion.span>
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sky-500 rounded-full"
                    layoutId="activeIndicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <motion.div
                  className="absolute -inset-2 bg-sky-500/10 rounded-lg opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </MagneticLink>
            );
          })}
        </div>

        {/* Desktop CTA Button */}
        <motion.a
          href="#contact"
          className="hidden rounded-xl bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all md:inline-block relative overflow-hidden group"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => handleNavClick(e, "#contact")}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-sky-400 to-cyan-400 opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10">
            Book a call
          </span>
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        </motion.a>

        {/* Mobile Menu Button - touch-friendly */}
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 active:bg-white/15 md:hidden relative overflow-hidden group touch-manipulation"
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className="absolute inset-0 bg-sky-500/20 opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
          <motion.svg
            className="h-6 w-6 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </motion.svg>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-white/10 bg-slate-950/98 md:hidden overflow-hidden"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 py-4 space-y-2 sm:space-y-3"
            >
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleNavClick(e, link.href);
                  }}
                  className="block py-3 sm:py-2 text-sm font-medium text-white/70 transition-colors hover:text-white active:text-white relative group touch-manipulation min-h-[44px] flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-sky-500 rounded-full opacity-0 group-hover:opacity-100"
                    whileHover={{ scale: 1.5 }}
                  />
                  <span className="pl-4">{link.label}</span>
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={(e) => {
                  handleNavClick(e, "#contact");
                }}
                className="block rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white text-center shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-400 mt-4 relative overflow-hidden group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: navLinks.length * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Book a call</span>
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navigation;

