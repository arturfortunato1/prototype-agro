import { useEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';

/**
 * Makes an element subtly "pull" toward the cursor when it enters the element's area.
 * Creates a premium, tactile feel on CTAs and interactive elements.
 *
 * @param strength  How strongly the element follows the cursor (0–1, default 0.35)
 * @param ease      GSAP ease for the return-to-center spring
 */
export function useMagnetic<T extends HTMLElement>(
  strength = 0.35,
  ease = 'elastic.out(1, 0.5)',
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Don't apply on touch devices
    if ('ontouchstart' in window) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const onMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease,
      });
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [strength, ease]);

  return ref;
}
