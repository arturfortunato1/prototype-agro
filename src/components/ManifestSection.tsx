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
      gsap.from('[data-highlight-item]', {
        y: 26,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      gsap.from('[data-manifest-line]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1,
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
    <section id="manifesto" ref={sectionRef} className="bg-syngenta-offwhite py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-[1400px] gap-14 px-6 md:px-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Visão integrada"
            title="Uma visão integrada para um agro mais resiliente."
            description="A agricultura exige respostas cada vez mais precisas. Por isso, a Syngenta conecta ciência, inovação e conhecimento prático para apoiar decisões melhores em cada etapa da jornada produtiva."
          />

          <span data-manifest-line className="mt-10 block h-px w-32 bg-syngenta-blue/45" />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {highlights.map((item) => (
              <p
                key={item}
                data-highlight-item
                className="rounded-2xl border border-syngenta-deep/10 bg-white/80 px-5 py-4 text-sm font-medium text-syngenta-deep shadow-[0_10px_30px_rgba(7,24,44,0.08)] backdrop-blur"
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        <div
          className="group relative min-h-[420px] overflow-hidden rounded-[36px] border border-syngenta-deep/10 bg-white shadow-soft"
          data-animate="reveal"
        >
          <img
            src={assetUrl('images/hero-sequence/frame_164_delay-0.041s.webp')}
            alt="Detalhe premium de lavoura verde"
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(10,34,64,0.18)_0%,transparent_48%,rgba(120,190,32,0.2)_100%)]" />
          <div className="pointer-events-none absolute bottom-6 left-6 rounded-2xl border border-white/35 bg-white/20 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white backdrop-blur-md">
            Ciência em campo
          </div>
        </div>
      </div>
    </section>
  );
}
