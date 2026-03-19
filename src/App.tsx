import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ReactLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';

import { Header } from './components/Header';
import { HeroSequenceSection } from './components/HeroSequenceSection';
import { ManifestSection } from './components/ManifestSection';
import { SolutionsHorizontalSection } from './components/SolutionsHorizontalSection';
import { SoilToSystemSection } from './components/SoilToSystemSection';
import { DigitalSection } from './components/DigitalSection';
import { RegenerativeSection } from './components/RegenerativeSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ImpactSection } from './components/ImpactSection';
import { CredibilitySection } from './components/CredibilitySection';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

function App() {
  const reducedMotion = usePrefersReducedMotion();
  const lenisRef = useRef<LenisRef>(null);

  // Sync Lenis with GSAP's Ticker for perfect scroll sync
  useEffect(() => {
    function update(time: number) {
      if (lenisRef.current?.lenis) {
        lenisRef.current.lenis.raf(time * 1000);
      }
    }
  
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
  
    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  // Make globally available strictly for old raw functions
  useEffect(() => {
    if (lenisRef.current?.lenis) {
      (window as any).__lenis = lenisRef.current.lenis;
      
      const updateScrollTrigger = () => ScrollTrigger.update();
      lenisRef.current.lenis.on('scroll', updateScrollTrigger);
      
      return () => {
        if (lenisRef.current?.lenis) {
          lenisRef.current.lenis.off('scroll', updateScrollTrigger);
        }
      };
    }
  }, []);

  // ── ScrollTrigger refresh after mount (accounts for pinned sections + iOS resize) ──
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 400);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      clearTimeout(id);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // ── Scroll depth analytics tracking ──
  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    const tracked = new Set<number>();

    const onScroll = () => {
      const viewport = window.innerHeight;
      const total = document.documentElement.scrollHeight - viewport;

      if (total <= 0) return;

      const progress = Math.min((window.scrollY / total) * 100, 100);

      thresholds.forEach((threshold) => {
        if (progress >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);

          window.dispatchEvent(
            new CustomEvent('prototype-agro:scroll-depth', {
              detail: { depth: threshold },
            }),
          );
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Global reveal animation system ──
  useGSAP(() => {
    const isTouchDevice = navigator.maxTouchPoints > 0;
    if (reducedMotion || isTouchDevice) return;

    // Standard reveal — fade up
    gsap.utils.toArray<HTMLElement>('[data-animate="reveal"]').forEach((element) => {
      if (element.dataset.animated === 'true') return;

      gsap.from(element, {
        y: 34,
        opacity: 0,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 82%',
        },
      });

      element.dataset.animated = 'true';
    });

    // Scale reveal — fade up with scale
    gsap.utils.toArray<HTMLElement>('[data-animate="scale"]').forEach((element) => {
      if (element.dataset.animated === 'true') return;

      gsap.from(element, {
        y: 40,
        opacity: 0,
        scale: 0.92,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 84%',
        },
      });

      element.dataset.animated = 'true';
    });

    // Slide-in from left
    gsap.utils.toArray<HTMLElement>('[data-animate="slide-left"]').forEach((element) => {
      if (element.dataset.animated === 'true') return;

      gsap.from(element, {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 82%',
        },
      });

      element.dataset.animated = 'true';
    });

    // Stagger children reveal
    gsap.utils.toArray<HTMLElement>('[data-animate="stagger"]').forEach((container) => {
      if (container.dataset.animated === 'true') return;

      const children = container.children;
      gsap.from(children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 82%',
        },
      });

      container.dataset.animated = 'true';
    });
  }, { dependencies: [reducedMotion] });

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false} options={{
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.8,
      touchMultiplier: (/Android/i.test(navigator.userAgent)) ? 1.2 : 2,
    }}>
      <Header />
      <main>
        <HeroSequenceSection />
        <ManifestSection />
        <SolutionsHorizontalSection />
        <SoilToSystemSection />
        <DigitalSection />
        <RegenerativeSection />
        <PortfolioSection />
        <ImpactSection />
        <CredibilitySection />
        <FinalCTASection />
      </main>
      <Footer />
    </ReactLenis>
  );
}

export default App;
