import { useEffect } from 'react';
import { gsap } from 'gsap';

import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export function use3DTilt(ref: React.RefObject<HTMLElement | null>, intensity = 15) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion || navigator.maxTouchPoints > 0) return;

    // Use quickTo for high-performance updates
    const rotateX = gsap.quickTo(el, 'rotateX', { duration: 0.4, ease: 'power2.out' });
    const rotateY = gsap.quickTo(el, 'rotateY', { duration: 0.4, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation based on cursor distance from center
      const tiltX = ((y - centerY) / centerY) * -intensity;
      const tiltY = ((x - centerX) / centerX) * intensity;
      
      rotateX(tiltX);
      rotateY(tiltY);
    };

    const handleMouseLeave = () => {
      rotateX(0);
      rotateY(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    // Apply strict transform style for actual 3D rendering
    gsap.set(el, { transformPerspective: 800, transformStyle: 'preserve-3d' });

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      rotateX(0);
      rotateY(0);
    };
  }, [intensity, ref, prefersReducedMotion]);
}
