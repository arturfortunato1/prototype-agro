import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Initialises Lenis smooth-scroll and wires it into GSAP's ticker
 * so every ScrollTrigger-powered animation stays perfectly in sync.
 *
 * Returns the Lenis instance so callers can do `lenis.scrollTo(...)`.
 */
export function useSmoothScroll(enabled = true) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Expose globally so any component can do window.__lenis.scrollTo(...)
    (window as unknown as Record<string, unknown>).__lenis = lenis;

    // Sync Lenis → ScrollTrigger on every scroll event
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's high-priority ticker (stays in sync with animations)
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as Record<string, unknown>).__lenis;
    };
  }, [enabled]);

  return lenisRef;
}

/** Utility: smooth-scroll to a target (element id or pixel offset). */
export function lenisScrollTo(target: string | number | HTMLElement) {
  const lenis = (window as unknown as Record<string, Lenis | undefined>).__lenis;

  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  } else if (typeof target === 'string') {
    document.getElementById(target.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
  }
}
