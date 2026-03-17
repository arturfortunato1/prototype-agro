import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import { SectionHeading } from './SectionHeading';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { assetUrl } from '../utils';

const highlights = [
  {
    title: 'Proteção de cultivos',
    description: 'Manejo técnico com resposta rápida à pressão biótica e climática.',
  },
  {
    title: 'Sementes e genética',
    description: 'Base genética orientada para estabilidade e potencial produtivo.',
  },
  {
    title: 'Soluções digitais',
    description: 'Dados e recomendação para leitura de cenário e ação no tempo certo.',
  },
  {
    title: 'Sustentabilidade em escala',
    description: 'Performance com visão de longo prazo sobre solo e recursos.',
  },
];

export function ManifestSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const context = gsap.context(() => {
      gsap.from('[data-manifest-chip]', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
        },
      });

      gsap.from('[data-manifest-card]', {
        y: 24,
        opacity: 0,
        duration: 0.95,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
        },
      });

      gsap.to('[data-manifest-media]', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('[data-manifest-overlay]', {
        yPercent: -16,
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
    <section id="manifesto" ref={sectionRef} className="relative overflow-hidden bg-syngenta-offwhite py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(0,87,184,0.08),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(120,190,32,0.12),transparent_36%)]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="mb-12 flex flex-wrap gap-3 border-b border-syngenta-deep/10 pb-8 md:mb-16">
          <span
            data-manifest-chip
            className="rounded-full border border-syngenta-blue/20 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-syngenta-blue/75"
          >
            Ciência
          </span>
          <span
            data-manifest-chip
            className="rounded-full border border-syngenta-blue/20 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-syngenta-blue/75"
          >
            Tecnologia
          </span>
          <span
            data-manifest-chip
            className="rounded-full border border-syngenta-blue/20 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-syngenta-blue/75"
          >
            Manejo integrado
          </span>
          <span
            data-manifest-chip
            className="rounded-full border border-syngenta-blue/20 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-syngenta-blue/75"
          >
            Resultado no campo
          </span>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1.06fr_1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Visão integrada"
              title="Uma visão integrada para um agro mais resiliente."
              description="A agricultura exige respostas cada vez mais precisas. Por isso, a Syngenta conecta ciência, inovação e conhecimento prático para apoiar decisões melhores em cada etapa da jornada produtiva."
            />

            <div className="mt-10 grid gap-4">
              {highlights.map((item, index) => (
                <article
                  key={item.title}
                  data-manifest-card
                  className="rounded-2xl border border-syngenta-deep/10 bg-white/88 p-5 shadow-[0_12px_26px_rgba(7,24,44,0.08)] backdrop-blur"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-syngenta-blue/10 text-xs font-semibold text-syngenta-blue">
                      {index + 1}
                    </span>
                    <h3 className="font-heading text-xl font-semibold text-syngenta-deep">{item.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-syngenta-deep/78">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative lg:sticky lg:top-24">
            <div className="relative h-[560px] overflow-hidden rounded-[34px] border border-syngenta-deep/10 bg-white shadow-panel">
              <img
                data-manifest-media
                src={assetUrl('images/hero-sequence/frame_166_delay-0.041s.webp')}
                alt="Detalhe de lavoura em alta definição"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(10,34,64,0.2)_0%,rgba(10,34,64,0.72)_86%)]" />

              <div
                data-manifest-overlay
                className="absolute right-6 top-6 w-[46%] rounded-2xl border border-white/30 bg-white/15 p-4 backdrop-blur-lg"
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/78">Sinal agronômico</p>
                <p className="mt-2 text-sm leading-relaxed text-white/88">
                  Decisão sustentada por contexto técnico, histórico e leitura de risco.
                </p>
              </div>

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-md">
                <p className="text-[11px] uppercase tracking-[0.22em] text-syngenta-yellow">Ciência em campo</p>
                <p className="mt-3 text-sm leading-relaxed text-white/84">
                  Estratégias conectadas para reduzir variabilidade, ampliar precisão e proteger produtividade ao longo
                  do ciclo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
