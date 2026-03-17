import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import { ecosystemLayers } from '../data/content';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { assetUrl } from '../utils';

const supportPoints = ['Mais contexto para decidir', 'Mais precisão para atuar', 'Mais consistência para produzir'];

const nodePositions = [
  { top: '8%', left: '7%', width: '41%' },
  { top: '22%', left: '50%', width: '39%' },
  { top: '38%', left: '15%', width: '41%' },
  { top: '53%', left: '53%', width: '36%' },
  { top: '68%', left: '22%', width: '39%' },
  { top: '82%', left: '56%', width: '34%' },
];

export function SoilToSystemSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const context = gsap.context(() => {
      gsap.from('[data-ecosystem-layer]', {
        y: 32,
        opacity: 0,
        scale: 0.96,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      gsap.from('[data-ecosystem-point]', {
        x: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
        },
      });

      gsap.to('[data-soil-bg]', {
        yPercent: -8,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section
      id="solo-sistema"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#031a35] py-24 text-white md:py-32"
    >
      <img
        data-soil-bg
        src={assetUrl('images/hero-sequence/frame_174_delay-0.041s.webp')}
        alt="Contexto visual do ecossistema agrícola"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.26]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(3,26,53,0.9)_0%,rgba(4,40,84,0.88)_52%,rgba(4,53,96,0.86)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(120,190,32,0.2),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(0,87,184,0.32),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-noise-soft bg-[size:5px_5px] opacity-[0.08]" />

      <div className="relative mx-auto grid w-full max-w-[1400px] gap-12 px-6 md:px-10 lg:grid-cols-[1.14fr_1fr] lg:items-start">
        <div className="relative min-h-[620px] overflow-hidden rounded-[36px] border border-white/20 bg-white/[0.05]">
          <img
            src={assetUrl('images/hero-sequence/frame_158_delay-0.041s.webp')}
            alt="Mapa visual do sistema no campo"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,25,51,0.5)_0%,rgba(4,25,51,0.78)_100%)]" />

          <svg
            className="absolute inset-0 hidden h-full w-full opacity-45 lg:block"
            viewBox="0 0 1000 800"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M130 92 L540 192 L230 324 L560 432 L300 548 L620 665" fill="none" stroke="rgba(242,201,76,0.62)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 8" />
            <circle cx="130" cy="92" r="6" fill="rgba(242,201,76,0.9)" />
            <circle cx="540" cy="192" r="6" fill="rgba(242,201,76,0.9)" />
            <circle cx="230" cy="324" r="6" fill="rgba(242,201,76,0.9)" />
            <circle cx="560" cy="432" r="6" fill="rgba(242,201,76,0.9)" />
            <circle cx="300" cy="548" r="6" fill="rgba(242,201,76,0.9)" />
            <circle cx="620" cy="665" r="6" fill="rgba(242,201,76,0.9)" />
          </svg>

          <div className="hidden lg:block">
            {ecosystemLayers.map((layer, index) => {
              const position = nodePositions[index];

              return (
                <article
                  key={layer.name}
                  data-ecosystem-layer
                  className="absolute rounded-2xl border border-white/26 bg-white/[0.12] p-4 backdrop-blur-md"
                  style={{ top: position.top, left: position.left, width: position.width }}
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-syngenta-yellow/88">{layer.name}</p>
                  <h3 className="mt-2 font-heading text-2xl font-semibold leading-tight text-white">{layer.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/82">{layer.description}</p>
                </article>
              );
            })}
          </div>

          <div className="relative z-10 space-y-3 p-6 lg:hidden">
            {ecosystemLayers.map((layer) => (
              <article
                key={layer.name}
                data-ecosystem-layer
                className="rounded-2xl border border-white/22 bg-white/[0.1] p-4 backdrop-blur"
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-syngenta-yellow/88">{layer.name}</p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-white">{layer.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/82">{layer.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative z-10 lg:pt-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-syngenta-yellow">Integração</p>
          <h2 className="font-heading text-4xl font-semibold leading-tight md:text-5xl">Do solo ao sistema.</h2>
          <p className="mt-6 text-base leading-relaxed text-white/82 md:text-lg">
            Agricultura de alta performance exige visão integrada. Cada decisão no campo impacta o resultado final e a
            tecnologia certa conecta solo, planta, clima, dados e manejo com mais clareza.
          </p>

          <div className="mt-10 grid gap-3">
            {supportPoints.map((point) => (
              <article
                key={point}
                data-ecosystem-point
                className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/[0.08] px-5 py-4 backdrop-blur-sm"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-syngenta-yellow" aria-hidden="true" />
                <p className="text-sm font-medium text-white/92">{point}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-white/24 bg-white/[0.07] p-5 backdrop-blur-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-syngenta-yellow/90">Camada de decisão</p>
            <p className="mt-3 text-sm leading-relaxed text-white/82">
              Recomendação mais acionável quando os sinais do campo são lidos em conjunto, e não de forma isolada.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
