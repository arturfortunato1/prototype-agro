import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import { ecosystemLayers } from '../data/content';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { assetUrl } from '../utils';

export function SoilToSystemSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const context = gsap.context(() => {
      gsap.from('[data-ecosystem-layer]', {
        y: 40,
        opacity: 0,
        scale: 0.97,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          end: 'bottom 80%',
          scrub: 0.4,
        },
      });

      gsap.from('[data-ecosystem-dot]', {
        opacity: 0,
        scale: 0.4,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 68%',
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section
      id="solo-sistema"
      ref={sectionRef}
      className="relative overflow-hidden bg-syngenta-deep py-24 text-white md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(120,190,32,0.22),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(0,87,184,0.35),transparent_45%)]" />
      <div className="mx-auto grid w-full max-w-[1400px] gap-14 px-6 md:px-10 lg:grid-cols-[1.08fr_1fr]">
        <div className="relative min-h-[560px]">
          <img
            src={assetUrl('images/hero-sequence/frame_108_delay-0.041s.webp')}
            alt="Composição conceitual do solo ao sistema"
            loading="lazy"
            className="absolute inset-0 h-full w-full rounded-[32px] object-cover opacity-35"
          />
          <div className="absolute inset-0 rounded-[32px] border border-white/15 bg-gradient-to-b from-syngenta-deep/5 via-syngenta-deep/45 to-syngenta-deep/90" />
          <div className="absolute left-7 top-12 h-[74%] w-px bg-gradient-to-b from-white/65 to-white/0" />

          <div className="relative z-10 flex h-full flex-col justify-center gap-3 px-8 py-10">
            {ecosystemLayers.map((layer, index) => (
              <div
                key={layer.name}
                data-ecosystem-layer
                className="relative rounded-2xl border border-white/20 bg-white/[0.08] p-4 backdrop-blur-sm"
                style={{ marginLeft: `${index * 14}px` }}
              >
                <span
                  data-ecosystem-dot
                  className="absolute -left-[30px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-syngenta-yellow shadow-[0_0_18px_rgba(242,201,76,0.7)]"
                />
                <p className="text-[11px] uppercase tracking-[0.24em] text-syngenta-yellow/85">{layer.name}</p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-white">{layer.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/78">{layer.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 lg:pl-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-syngenta-yellow">Integração</p>
          <h2 className="font-heading text-4xl font-semibold leading-tight md:text-5xl">Do solo ao sistema.</h2>
          <p className="mt-6 text-base leading-relaxed text-white/80 md:text-lg">
            Agricultura de alta performance exige visão integrada. Cada decisão no campo impacta o resultado final
            e a tecnologia certa conecta essas variáveis com mais clareza.
          </p>

          <div className="mt-10 space-y-4">
            <p className="rounded-2xl border border-white/18 bg-white/[0.05] px-5 py-4 text-sm text-white/88">
              Mais contexto para decidir
            </p>
            <p className="rounded-2xl border border-white/18 bg-white/[0.05] px-5 py-4 text-sm text-white/88">
              Mais precisão para atuar
            </p>
            <p className="rounded-2xl border border-white/18 bg-white/[0.05] px-5 py-4 text-sm text-white/88">
              Mais consistência para produzir
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
