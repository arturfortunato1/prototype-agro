import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SectionHeading } from './SectionHeading';
import { TextReveal } from './TextReveal';
import { credibilityBlocks } from '../data/content';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useTilt } from '../hooks/useTilt';

/* ── Individual card with 3D tilt ───────────────────────────────── */
function CredibilityCard({
  block,
  index,
}: {
  block: (typeof credibilityBlocks)[number];
  index: number;
}) {
  const tiltRef = useTilt<HTMLDivElement>(6);

  const accentColors = [
    'from-syngenta-blue/20 to-syngenta-green/10',
    'from-syngenta-green/20 to-syngenta-yellow/10',
    'from-syngenta-yellow/20 to-syngenta-blue/10',
  ];

  const borderAccents = [
    'group-hover:border-syngenta-blue/40',
    'group-hover:border-syngenta-green/40',
    'group-hover:border-syngenta-yellow/40',
  ];

  const numberColors = [
    'text-syngenta-blue',
    'text-syngenta-green',
    'text-syngenta-yellow',
  ];

  const dotColors = [
    'bg-syngenta-blue',
    'bg-syngenta-green',
    'bg-syngenta-yellow',
  ];

  return (
    <div className="credibility-card group" style={{ willChange: 'transform, opacity' }}>
      <div
        ref={tiltRef}
        className={`relative overflow-hidden rounded-3xl border border-syngenta-deep/8 bg-white/80 backdrop-blur-sm p-6 md:p-10 transition-colors duration-500 ${borderAccents[index % 3]} hover:bg-white`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Gradient accent top-bar */}
        <div
          className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${accentColors[index % 3]} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        />

        {/* Background gradient blob */}
        <div
          className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${accentColors[index % 3]} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-60`}
        />

        {/* Number indicator */}
        <div className="mb-6 flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-syngenta-deep/5 font-heading text-lg font-bold ${numberColors[index % 3]} transition-colors duration-300`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className={`h-[1px] flex-1 bg-gradient-to-r ${accentColors[index % 3]} opacity-30`} />
        </div>

        {/* Axis label */}
        <div className="mb-4 flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${dotColors[index % 3]}`} />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-syngenta-deep/50">
            {block.axis}
          </p>
        </div>

        {/* Quote */}
        <p className="relative z-10 font-heading text-2xl font-semibold leading-snug text-syngenta-deep md:text-3xl">
          &ldquo;{block.quote}&rdquo;
        </p>

        {/* Bottom decorative line */}
        <div
          className={`mt-8 h-[1px] w-16 bg-gradient-to-r ${accentColors[index % 3]} opacity-40 transition-all duration-500 group-hover:w-full group-hover:opacity-70`}
        />
      </div>
    </div>
  );
}

/* ── Main Section ───────────────────────────────────────────────── */
export function CredibilitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || navigator.maxTouchPoints > 0 || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* ── Staggered card reveals ────────────────────────────── */
      const cards = gsap.utils.toArray<HTMLElement>('.credibility-card');

      gsap.set(cards, {
        opacity: 0,
        y: 80,
        scale: 0.92,
      });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          end: 'center center',
          toggleActions: 'play none none reverse',
        },
      });

      /* ── Animated connecting line ──────────────────────────── */
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.6,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: lineRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }

      /* ── Floating background orbs ──────────────────────────── */
      const orbs = gsap.utils.toArray<HTMLElement>('.credibility-orb');
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          y: i % 2 === 0 ? -30 : 30,
          x: i % 2 === 0 ? 15 : -15,
          duration: 4 + i * 0.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const heroQuote = credibilityBlocks[0];

  return (
    <section
      ref={sectionRef}
      id="credibilidade"
      className="relative overflow-hidden bg-syngenta-offwhite py-16 md:py-40"
    >
      {/* ── Background visual interest ──────────────────────── */}
      {/* Noise overlay removed */}

      {/* Radial gradient top-left */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-syngenta-blue/[0.04] blur-[100px]" />

      {/* Radial gradient bottom-right */}
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-syngenta-green/[0.05] blur-[100px]" />

      {/* Floating orbs — hidden on mobile */}
      <div className="credibility-orb pointer-events-none absolute left-[15%] top-[20%] hidden h-3 w-3 rounded-full bg-syngenta-blue/20 md:block" />
      <div className="credibility-orb pointer-events-none absolute right-[20%] top-[30%] hidden h-2 w-2 rounded-full bg-syngenta-green/25 md:block" />
      <div className="credibility-orb pointer-events-none absolute left-[60%] bottom-[25%] hidden h-4 w-4 rounded-full bg-syngenta-yellow/15 md:block" />
      <div className="credibility-orb pointer-events-none absolute right-[35%] bottom-[15%] hidden h-2.5 w-2.5 rounded-full bg-syngenta-blue/15 md:block" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
        {/* ── Section heading ───────────────────────────────── */}
        <SectionHeading
          eyebrow="Confianca"
          title="Tecnologia relevante e a que gera confianca no campo."
          description="Pesquisa, experiencia agronomica e inteligencia digital atuam em conjunto para entregar valor real na operacao."
          className="max-w-3xl"
        />

        {/* ── Hero quote ────────────────────────────────────── */}
        <div className="mt-10 md:mt-20">
          <div className="relative max-w-4xl">
            {/* Large decorative quotation mark */}
            <span
              className="pointer-events-none absolute -left-4 -top-6 font-heading text-[80px] font-bold leading-none text-syngenta-blue/[0.07] md:-left-8 md:-top-10 md:text-[180px]"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <TextReveal
              as="p"
              className="relative z-10 font-heading text-3xl font-semibold leading-tight text-syngenta-deep md:text-4xl lg:text-5xl"
              splitBy="words"
              stagger={0.06}
              duration={1}
              start="top 80%"
            >
              {heroQuote.quote}
            </TextReveal>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-syngenta-blue/40" />
              <span className="text-sm font-medium uppercase tracking-[0.18em] text-syngenta-blue/60">
                {heroQuote.axis}
              </span>
            </div>
          </div>
        </div>

        {/* ── Connecting line ───────────────────────────────── */}
        <div className="my-10 flex items-center justify-center md:my-20">
          <div
            ref={lineRef}
            className="h-[1px] w-full max-w-5xl origin-left bg-gradient-to-r from-transparent via-syngenta-blue/20 to-transparent"
          />
        </div>

        {/* ── Cards grid ────────────────────────────────────── */}
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {credibilityBlocks.map((block, i) => (
            <CredibilityCard key={block.axis} block={block} index={i} />
          ))}
        </div>

        {/* ── Bottom decorative accent ──────────────────────── */}
        <div className="mt-10 flex items-center justify-center gap-3 md:mt-24">
          <span className="h-1.5 w-1.5 rounded-full bg-syngenta-blue/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-syngenta-green/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-syngenta-yellow/30" />
        </div>
      </div>
    </section>
  );
}
