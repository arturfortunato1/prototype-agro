import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import { SectionHeading } from './SectionHeading';
import { regenerativePillars } from '../data/content';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { assetUrl } from '../utils';

export function RegenerativeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const context = gsap.context(() => {
      if (!reducedMotion) {
        gsap.from('[data-regenerative-image]', {
          clipPath: 'inset(0 100% 0 0)',
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        });

        gsap.from('[data-regenerative-title]', {
          y: 24,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
          },
        });
      }

      gsap.to({}, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 90%',
          scrub: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section id="agricultura-regenerativa" ref={sectionRef} className="relative bg-white py-24 md:py-32">
      <span id="sustentabilidade" className="absolute -top-24" aria-hidden="true" />
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div
            data-regenerative-image
            className="relative overflow-hidden rounded-[34px] border border-syngenta-deep/10 shadow-soft"
          >
            <img
              src={assetUrl('images/agro-prod/agro-produtividade.webp')}
              alt="Campo com solo saudável em luz natural"
              loading="lazy"
              className="h-[480px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-syngenta-deep/45 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white backdrop-blur">
              Sustentabilidade com performance
            </p>
          </div>

          <div className="space-y-8">
            <div data-regenerative-title>
              <SectionHeading
                eyebrow="Sustentabilidade"
                title="A evolução da produtividade passa pela regeneração."
                description="Agricultura regenerativa é visão de futuro aplicada ao presente: mais cuidado com o solo, mais eficiência de recursos e mais resiliência para o sistema produtivo."
              />
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-3xl border border-syngenta-deep/10 bg-syngenta-offwhite/75 p-6 md:p-8">
          <div className="relative mb-8 h-px w-full bg-syngenta-deep/10">
            <span
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-syngenta-blue to-syngenta-green"
              style={{ width: `${Math.max(progress * 100, 6)}%` }}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {regenerativePillars.map((pillar, index) => {
              const threshold = index / (regenerativePillars.length - 1 || 1);
              const active = progress >= threshold;

              return (
                <article
                  key={pillar}
                  className={`rounded-2xl border px-4 py-5 transition-all duration-300 ${
                    active
                      ? 'border-syngenta-blue/30 bg-white text-syngenta-deep shadow-[0_10px_20px_rgba(7,24,44,0.1)]'
                      : 'border-syngenta-deep/10 bg-white/60 text-syngenta-deep/70'
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-syngenta-blue/65">Pilar {index + 1}</p>
                  <h3 className="mt-3 font-heading text-lg font-semibold leading-snug">{pillar}</h3>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
