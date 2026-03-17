import { useEffect } from 'react';
import { gsap } from 'gsap';

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
import { useSmoothScroll } from './hooks/useSmoothScroll';

function App() {
  const reducedMotion = usePrefersReducedMotion();

  // ── Lenis smooth scroll (disabled when user prefers reduced motion) ──
  useSmoothScroll(!reducedMotion);


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
  useEffect(() => {
    if (reducedMotion) return;

    const context = gsap.context(() => {
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
    });

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <>
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
    </>
  );
}

export default App;
