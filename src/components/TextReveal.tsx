import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type TextRevealProps = {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  /** 'words' splits by word, 'chars' splits by character */
  splitBy?: 'words' | 'chars';
  /** Stagger delay between each unit (seconds) */
  stagger?: number;
  /** Overall animation duration per unit */
  duration?: number;
  /** ScrollTrigger start position */
  start?: string;
  /** Extra delay before animation begins */
  delay?: number;
};

export function TextReveal({
  children,
  as: Tag = 'h2',
  className = '',
  splitBy = 'words',
  stagger = 0.04,
  duration = 0.8,
  start = 'top 82%',
  delay = 0,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const el = containerRef.current;
    const units = el.querySelectorAll<HTMLElement>('[data-reveal-unit]');

    if (units.length === 0) return;

    const context = gsap.context(() => {
      gsap.set(units, { y: '110%', opacity: 0 });

      gsap.to(units, {
        y: '0%',
        opacity: 1,
        duration,
        stagger,
        delay,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start,
        },
      });
    }, el);

    return () => context.revert();
  }, [reducedMotion, duration, stagger, start, delay]);

  // Split the text into units, preserving spaces
  const units = splitBy === 'chars'
    ? children.split('').map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span data-reveal-unit className="inline-block" style={{ willChange: 'transform' }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))
    : children.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
          <span data-reveal-unit className="inline-block" style={{ willChange: 'transform' }}>
            {word}
          </span>
        </span>
      ));

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLHeadingElement>}
      className={className}
    >
      {units}
    </Tag>
  );
}
