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

      // Parallax depth on image — creates a sense of 3D depth as user scrolls
      gsap.to('[data-manifest-image] img', {
        yPercent: -12,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Floating decorative elements — parallax at different speeds for depth
      gsap.utils.toArray<HTMLElement>('[data-manifest-float]').forEach((el) => {
        const speed = parseFloat(el.dataset.manifestFloat || '1');
        gsap.to(el, {
          yPercent: -60 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section id="manifesto" ref={sectionRef} className="relative bg-syngenta-offwhite py-24 md:py-28 overflow-hidden">
      {/* ── Floating decorative elements ── */}
      {/* Top-left — large green ring */}
      <div
        data-manifest-float="0.6"
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 top-16 h-[80px] w-[80px] rounded-full border-2 border-[#78be20] opacity-[0.1]"
      />
      {/* Right mid — small blue filled dot */}
      <div
        data-manifest-float="1.2"
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-[38%] h-[28px] w-[28px] rounded-full bg-[#0057b8] opacity-[0.08]"
      />
      {/* Bottom-left — medium blue ring */}
      <div
        data-manifest-float="0.9"
        aria-hidden="true"
        className="pointer-events-none absolute left-[12%] bottom-20 h-[52px] w-[52px] rounded-full border-[1.5px] border-[#0057b8] opacity-[0.12]"
      />
      {/* Top-right — small green filled dot */}
      <div
        data-manifest-float="1.5"
        aria-hidden="true"
        className="pointer-events-none absolute right-[18%] top-10 h-[24px] w-[24px] rounded-full bg-[#78be20] opacity-[0.1]"
      />

      <div className="relative mx-auto grid w-full max-w-[1320px] gap-14 px-6 md:px-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Visão integrada"
            title="Uma visão integrada para um agro mais resiliente."
            description="A agricultura exige respostas cada vez mais precisas. Por isso, conectamos ciência, inovação e conhecimento prático para apoiar decisões melhores em cada etapa da jornada produtiva."
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

        {/* ── Subtle gradient divider (desktop only) ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[15%] hidden h-[70%] w-px -translate-x-1/2 lg:block"
          style={{
            background: 'linear-gradient(to bottom, transparent, #0057b8 30%, #78be20 70%, transparent)',
            opacity: 0.18,
          }}
        />

        <figure
          data-manifest-image
          className="relative overflow-hidden rounded-[30px] border border-syngenta-deep/10 bg-white shadow-soft"
        >
          <img
            src={assetUrl('images/agro-integrado/agro-integrado.jpg')}
            alt="Detalhe de lavoura em alta definição"
            loading="lazy"
            className="h-[440px] w-full object-cover"
          />
        </figure>
      </div>
    </section>
  );
}
