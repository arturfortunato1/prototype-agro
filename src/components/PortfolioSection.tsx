import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SectionHeading } from './SectionHeading';
import {
  portfolioCategories,
  portfolioItems,
  type PortfolioCategory,
  type PortfolioItem,
} from '../data/content';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

function cardAccent(category: PortfolioItem['category']) {
  const accents: Record<PortfolioItem['category'], string> = {
    'Proteção de cultivos': 'from-[#0f3a6d] to-[#1f6cb8]',
    Sementes: 'from-[#275e4a] to-[#5f9b4f]',
    'Tratamento de sementes': 'from-[#4a5e73] to-[#7f8fa1]',
    'Soluções integradas': 'from-[#264563] to-[#4f7f98]',
    Digital: 'from-[#1a5ca8] to-[#47a4c7]',
  };

  return accents[category];
}

export function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('Todos');
  const gridRef = useRef<HTMLDivElement>(null);
  const hasAnimatedEntrance = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const visibleItems = useMemo(
    () =>
      selectedCategory === 'Todos'
        ? portfolioItems
        : portfolioItems.filter((item) => item.category === selectedCategory),
    [selectedCategory],
  );

  /* ── Scroll-triggered stagger entrance ── */
  useEffect(() => {
    if (prefersReducedMotion || navigator.maxTouchPoints > 0 || !gridRef.current || hasAnimatedEntrance.current) return;

    const cards = gridRef.current.querySelectorAll('[data-portfolio-card]');
    if (!cards.length) return;

    // Set initial hidden state
    gsap.set(cards, { y: 60, opacity: 0, scale: 0.92 });

    const ctx = gsap.context(() => {
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: {
          each: 0.09,
          from: 'start',
        },
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 82%',
          once: true,
        },
        onComplete: () => {
          hasAnimatedEntrance.current = true;
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  /* ── Animated filter transitions ── */
  useLayoutEffect(() => {
    if (!gridRef.current || !hasAnimatedEntrance.current) return;
    if (prefersReducedMotion) return;

    const cards = gridRef.current.querySelectorAll('[data-portfolio-card]');
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          y: 28,
          opacity: 0,
          scale: 0.94,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: {
            each: 0.06,
            from: 'start',
          },
        },
      );
    }, gridRef);

    return () => ctx.revert();
  }, [selectedCategory, prefersReducedMotion]);

  return (
    <section id="portfolio" className="bg-syngenta-offwhite py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          eyebrow="Portfólio"
          title="Um portfólio pensado para desafios reais do campo."
          description="Soluções integradas para apoiar diferentes culturas, contextos de manejo e metas de produtividade."
        />

        <div className="mt-10 flex flex-wrap gap-2.5">
          {portfolioCategories.map((category) => {
            const isSelected = category === selectedCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-syngenta-yellow ${
                  isSelected
                    ? 'border-syngenta-blue bg-syngenta-blue text-white'
                    : 'border-syngenta-deep/15 bg-white text-syngenta-deep hover:border-syngenta-blue/35 hover:text-syngenta-blue'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div
          ref={gridRef}
          className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {visibleItems.map((item) => (
            <article
              key={item.title}
              data-portfolio-card
              className="group rounded-3xl border border-syngenta-deep/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-syngenta-blue/30 hover:shadow-panel"
            >
              <span
                className={`mb-6 block h-1 w-full rounded-full bg-gradient-to-r ${cardAccent(item.category)}`}
                aria-hidden="true"
              />
              <p className="text-xs uppercase tracking-[0.2em] text-syngenta-blue/70">{item.category}</p>
              <h3 className="mt-3 font-heading text-2xl font-semibold text-syngenta-deep">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-syngenta-deep/78">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
