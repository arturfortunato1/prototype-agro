import { useEffect, useMemo, useRef, useState } from 'react';

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
    <section id="impacto" ref={sectionRef} className="relative overflow-hidden bg-syngenta-deep py-24 text-white md:py-32">
      <img
        src={assetUrl('images/hero-sequence/frame_188_delay-0.041s.webp')}
        alt="Textura desfocada de campo"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.18]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,40,0.92),rgba(8,20,40,0.86))]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          eyebrow="Escala"
          title="Escala, ciência e presença no campo."
          description="Indicadores abaixo são placeholders de protótipo e devem ser conectados a dados oficiais via CMS/config."
          titleClassName="text-white"
          className="max-w-3xl"
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-3xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm"
              data-animate="reveal"
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
