import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import { SectionHeading } from './SectionHeading';
import { solutionCards } from '../data/content';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { assetUrl } from '../utils';

export function SolutionsHorizontalSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const isMobile = useMediaQuery('(max-width: 1024px)');
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isMobile || reducedMotion || !sectionRef.current || !trackRef.current) return;

    const context = gsap.context(() => {
      const distance = Math.max(trackRef.current!.scrollWidth - window.innerWidth, 0);

      gsap.to(trackRef.current, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance + window.innerHeight * 0.75}`,
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
        },
      });

      gsap.fromTo(
        '[data-solution-card]',
        { opacity: 0.45, scale: 0.96, filter: 'blur(6px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 62%',
            end: 'bottom bottom',
            scrub: 0.7,
          },
        },
      );
    }, sectionRef);

    const section = sectionRef.current;
    const cursor = cursorRef.current;

    if (section && cursor) {
      const moveX = gsap.quickTo(cursor, 'x', { duration: 0.2, ease: 'power3.out' });
      const moveY = gsap.quickTo(cursor, 'y', { duration: 0.2, ease: 'power3.out' });

      const onMove = (event: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        moveX(event.clientX - rect.left);
        moveY(event.clientY - rect.top);
        cursor.style.opacity = '1';
      };

      const onLeave = () => {
        cursor.style.opacity = '0';
      };

      section.addEventListener('mousemove', onMove);
      section.addEventListener('mouseleave', onLeave);

      return () => {
        section.removeEventListener('mousemove', onMove);
        section.removeEventListener('mouseleave', onLeave);
        context.revert();
      };
    }

    return () => context.revert();
  }, [isMobile, reducedMotion]);

  return (
    <section id="solucoes" ref={sectionRef} className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          eyebrow="Soluções conectadas"
          title="Da proteção ao digital, uma arquitetura de valor para cada decisão no campo."
          description="Enquanto a produção ganha complexidade, a estratégia precisa integrar tecnologia, agronomia e visão operacional."
        />
      </div>

      {isMobile ? (
        <div className="mt-12 space-y-5 px-6 md:px-10">
          {solutionCards.map((card) => (
            <article
              key={card.title}
              className="overflow-hidden rounded-3xl border border-syngenta-deep/10 bg-syngenta-offwhite/70 shadow-soft"
              data-animate="reveal"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={assetUrl(card.image)}
                  alt={card.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-syngenta-deep/45 to-transparent" />
              </div>
              <div className="space-y-3 p-6">
                <h3 className="font-heading text-2xl font-semibold text-syngenta-deep">{card.title}</h3>
                <p className="text-sm leading-relaxed text-syngenta-deep/80">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="relative mt-16">
          <div
            ref={cursorRef}
            className="pointer-events-none absolute left-0 top-0 z-30 hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-syngenta-blue/25 bg-syngenta-blue/5 opacity-0 backdrop-blur-md transition-opacity lg:block"
          >
            <span className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.22em] text-syngenta-blue/70">
              explorar
            </span>
          </div>

          <div ref={trackRef} className="flex items-stretch gap-8 pl-6 pr-[18vw] md:pl-10 md:pr-[16vw]">
            {solutionCards.map((card, index) => (
              <article
                key={card.title}
                data-solution-card
                className="relative h-[70vh] min-h-[520px] w-[min(74vw,860px)] flex-shrink-0 overflow-hidden rounded-[38px] border border-syngenta-deep/10 bg-syngenta-offwhite shadow-panel"
              >
                <img
                  src={assetUrl(card.image)}
                  alt={card.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,34,64,0.05)_0%,rgba(10,34,64,0.75)_80%)]" />
                <div className="absolute bottom-0 p-10 md:p-12">
                  <p className="mb-4 text-xs uppercase tracking-[0.22em] text-syngenta-yellow">Painel {index + 1}</p>
                  <h3 className="font-heading text-3xl font-semibold leading-tight text-white md:text-4xl">
                    {card.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-white/88">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
