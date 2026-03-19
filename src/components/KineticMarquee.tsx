import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type MarqueeProps = {
  text: string;
  outlineText?: string;
  speed?: number;
};

export function KineticMarquee({ text, outlineText, speed = 1 }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    if (reducedMotion || !trackRef.current || !containerRef.current) return;

    // Duplicate content perfectly
    const ticker = gsap.to(trackRef.current, {
      xPercent: -50,
      ease: 'none',
      repeat: -1,
      duration: 15 / speed,
    });

    // Skew and speed on scroll
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        // Speed up the marquee based on scroll velocity
        gsap.to(ticker, {
          timeScale: 1 + Math.abs(velocity / 150),
          duration: 0.6,
          ease: 'power2.out',
          overwrite: true,
          onComplete: () => {
            gsap.to(ticker, { timeScale: 1, duration: 1, ease: 'power2.out' });
          },
        });
        
        // Add physical skew
        gsap.to(containerRef.current, {
          skewY: gsap.utils.clamp(-3, 3, velocity / -300),
          duration: 0.4,
          ease: 'power3.out',
          overwrite: true,
          onComplete: () => {
            gsap.to(containerRef.current, { skewY: 0, duration: 0.6, ease: 'power2.out' });
          }
        });
      },
    });
  }, { scope: containerRef, dependencies: [speed, reducedMotion] });

  return (
    <div ref={containerRef} className="relative flex w-full overflow-hidden bg-syngenta-green py-6 md:py-10">
      <div
        ref={trackRef}
        className="flex min-w-max items-center whitespace-nowrap"
      >
        {/* Double sequence to allow infinite scroll wrapping */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center px-6">
            <span className="font-heading text-4xl font-black uppercase italic tracking-tighter text-syngenta-deep md:text-6xl lg:text-7xl">
              {text}
            </span>
            {outlineText && (
              <span className="ml-[1.5rem] font-heading text-4xl font-black uppercase italic tracking-tighter text-transparent md:text-6xl lg:text-7xl" style={{ WebkitTextStroke: '1.5px #0a2240' }}>
                {outlineText}
              </span>
            )}
            {/* Divider symbol */}
            <svg viewBox="0 0 24 24" className="mx-[1.5rem] h-10 w-10 text-syngenta-deep md:h-14 md:w-14" fill="currentColor">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
