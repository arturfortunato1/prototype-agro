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

function App() {
  const reducedMotion = usePrefersReducedMotion();

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

          // Placeholder hook for future analytics integration.
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

  useEffect(() => {
    if (reducedMotion) return;

    const context = gsap.context(() => {
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
