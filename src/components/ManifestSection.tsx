import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import { SectionHeading } from './SectionHeading';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { assetUrl } from '../utils';

const highlights = [
  'Proteção de cultivos',
  'Sementes e genética',
  'Soluções digitais',
  'Sustentabilidade em escala',
];

export function ManifestSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const context = gsap.context(() => {
      gsap.from('[data-manifest-item]', {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 74%',
        },
      });

      gsap.from('[data-manifest-image]', {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section id="manifesto" ref={sectionRef} className="bg-syngenta-offwhite py-24 md:py-28">
      <div className="mx-auto grid w-full max-w-[1320px] gap-14 px-6 md:px-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Visão integrada"
            title="Uma visão integrada para um agro mais resiliente."
            description="A agricultura exige respostas cada vez mais precisas. Por isso, a Syngenta conecta ciência, inovação e conhecimento prático para apoiar decisões melhores em cada etapa da jornada produtiva."
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <article
                key={item}
                data-manifest-item
                className="rounded-xl border border-syngenta-deep/10 bg-white px-4 py-3 text-sm font-medium text-syngenta-deep"
              >
                {item}
              </article>
            ))}
          </div>
        </div>

        <figure
          data-manifest-image
          className="relative overflow-hidden rounded-[30px] border border-syngenta-deep/10 bg-white shadow-soft"
        >
          <img
            src={assetUrl('images/hero-sequence/frame_166_delay-0.041s.webp')}
            alt="Detalhe de lavoura em alta definição"
            loading="lazy"
            className="h-[440px] w-full object-cover"
          />
          <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-syngenta-deep/70 to-transparent p-6 text-sm text-white/88">
            Ciência aplicada para decisões mais consistentes do planejamento à operação.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
