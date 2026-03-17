import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

import { SectionHeading } from './SectionHeading';
import { impactMetrics } from '../data/content';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { assetUrl } from '../utils';

function formatMetricValue(value: number, suffix: string) {
  const formatted = value >= 1000 ? value.toLocaleString('pt-BR') : String(value);

  if (suffix === '/7') {
    return `${formatted}/7`;
  }

  return `${formatted}${suffix}`;
}

export function ImpactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<number[]>(() => impactMetrics.map(() => 0));
  const reducedMotion = usePrefersReducedMotion();

  // Parallax background
  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const context = gsap.context(() => {
      gsap.to('[data-impact-bg]', {
        yPercent: -14,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Stagger cards in with scale
      gsap.fromTo(
        '[data-impact-card]',
        { y: 40, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }, sectionRef);

    return () => context.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    if (reducedMotion) {
      setAnimatedValues(impactMetrics.map((metric) => metric.value));
      return;
    }

    let frameId = 0;
    const duration = 1200;
    const start = performance.now();

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues(impactMetrics.map((metric) => Math.round(metric.value * eased)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [isVisible, reducedMotion]);

  const metrics = useMemo(
    () =>
      impactMetrics.map((metric, index) => ({
        ...metric,
        displayValue: formatMetricValue(animatedValues[index] ?? 0, metric.suffix),
      })),
    [animatedValues],
  );

  return (
    <section id="impacto" ref={sectionRef} data-section-blend="offwhite-to-dark" data-section-blend-bottom="dark-to-white" className="relative overflow-hidden bg-syngenta-deep py-24 text-white md:py-32">
      <img
        data-impact-bg
        src={assetUrl('images/hero-sequence/frame_188_delay-0.041s.webp')}
        alt="Textura desfocada de campo"
        className="absolute inset-0 h-[120%] w-full object-cover opacity-[0.18]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,40,0.92),rgba(8,20,40,0.86))]" />

      <div className="relative z-[2] mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          title="Escala, ciência e presença no campo."
          titleClassName="text-white"
          className="max-w-3xl"
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-3xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-500 hover:border-white/25 hover:bg-white/[0.08] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              data-impact-card
            >
              <p className="font-heading text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {metric.displayValue}
              </p>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-syngenta-yellow/90">
                {metric.label}
              </p>
              <p className="mt-4 border-t border-white/15 pt-4 text-xs leading-relaxed text-white/70">{metric.helper}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
