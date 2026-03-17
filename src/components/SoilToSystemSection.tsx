import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import { ecosystemLayers } from '../data/content';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { assetUrl } from '../utils';

const supportPoints = ['Mais contexto para decidir', 'Mais precisão para atuar', 'Mais consistência para produzir'];
const integrationHighlights = [
  {
    title: 'Leitura multivariável',
    description: 'Solo, planta e clima interpretados em conjunto para reduzir ruído na decisão.',
  },
  {
    title: 'Resposta operacional',
    description: 'Priorização técnica com visão de sistema para ganhar consistência ao longo do ciclo.',
  },
];
const featuredLayerNames = new Set(['solo', 'planta', 'clima', 'decisao']);

const openPositions = [
  { left: '4%', top: '10%', rotate: -1.6 },
  { left: '58%', top: '30%', rotate: 1.1 },
  { left: '8%', top: '52%', rotate: -1.1 },
  { left: '56%', top: '74%', rotate: 0.95 },
];

export function SoilToSystemSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const featuredLayers = ecosystemLayers.filter((layer) => featuredLayerNames.has(layer.name));

  useEffect(() => {
    if (!sectionRef.current || reducedMotion || isMobile) return;

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-ecosystem-layer]');

      gsap.set(cards, {
        left: '50%',
        top: '74px',
        xPercent: -50,
        scale: 0.94,
        opacity: 0.86,
        rotate: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 62%',
          end: 'top 16%',
          scrub: 0.85,
        },
      });

      cards.forEach((card, index) => {
        const position = openPositions[index];

        tl.to(
          card,
          {
            left: position.left,
            top: position.top,
            xPercent: 0,
            rotate: position.rotate,
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
          },
          0,
        );
      });

      gsap.from('[data-ecosystem-point]', {
        x: 18,
        opacity: 0,
        duration: 0.75,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 66%',
        },
      });

      gsap.to('[data-soil-bg]', {
        yPercent: -7,
        scale: 1.05,
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
  }, [reducedMotion, isMobile]);

  return (
    <section
      id="solo-sistema"
      ref={sectionRef}
      data-section-blend="white-to-dark"
      data-section-blend-bottom="dark-to-eef"
      className="relative overflow-hidden bg-[#031a35] py-24 text-white md:py-32"
    >
      <img
        data-soil-bg
        src={assetUrl('images/agro-system/agro-system.png')}
        alt="Contexto visual do ecossistema agrícola"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.24]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(3,26,53,0.9)_0%,rgba(4,40,84,0.88)_52%,rgba(4,53,96,0.86)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(120,190,32,0.2),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(0,87,184,0.32),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-noise-soft bg-[size:5px_5px] opacity-[0.08]" />

      <div className="relative mx-auto grid w-full max-w-[1400px] gap-12 px-6 md:px-10 lg:grid-cols-[1.16fr_1fr] lg:items-start">
        <div className="relative min-h-[760px] overflow-visible rounded-[36px] border border-white/20 bg-white/[0.04] p-3">
          <div className="absolute left-1/2 top-14 h-[640px] w-[min(62%,720px)] -translate-x-1/2 overflow-hidden rounded-[32px] border border-white/22 bg-white/[0.08]">
            <img
              src={assetUrl('images/agro-system/agro-system.png')}
              alt="Mapa visual do sistema no campo"
              loading="lazy"
              className="h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,25,51,0.28)_0%,rgba(4,25,51,0.6)_100%)]" />
          </div>

          {!isMobile ? (
            <div className="hidden lg:block">
              {featuredLayers.map((layer, index) => (
                <article
                  key={layer.name}
                  data-ecosystem-layer
                  className={`absolute min-w-[230px] rounded-2xl px-5 py-4 backdrop-blur-md ${
                    index % 3 === 0
                      ? 'w-[42%] max-w-[320px] border border-white/34 bg-white/[0.17] shadow-[0_18px_48px_rgba(2,12,25,0.24)]'
                      : index % 3 === 1
                        ? 'w-[40%] max-w-[300px] border border-white/22 bg-[#1f4c78]/55 shadow-[0_14px_38px_rgba(2,14,30,0.26)]'
                      : 'w-[43%] max-w-[330px] border border-white/26 bg-white/[0.11] shadow-[0_12px_28px_rgba(2,14,30,0.2)]'
                  }`}
                >
                  <h3 className="font-heading text-2xl font-semibold leading-tight text-white">{layer.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/84">{layer.description}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="relative z-10 space-y-3 pt-[360px]">
              {featuredLayers.map((layer) => (
                <article
                  key={layer.name}
                  className="rounded-2xl border border-white/22 bg-white/[0.1] p-4 backdrop-blur"
                >
                  <h3 className="font-heading text-xl font-semibold text-white">{layer.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/82">{layer.description}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="relative z-10 lg:pt-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-syngenta-yellow">Integração</p>
          <h2 className="font-heading text-4xl font-semibold leading-tight md:text-5xl">Do solo ao sistema.</h2>
          <p className="mt-6 text-base leading-relaxed text-white/82 md:text-lg">
            Agricultura de alta performance exige visão integrada. Cada decisão no campo impacta o resultado final e a
            tecnologia certa conecta solo, planta, clima, dados e manejo com mais clareza.
          </p>

          <div className="mt-10 space-y-4 border-l border-white/25 pl-4">
            {supportPoints.map((point) => (
              <p key={point} data-ecosystem-point className="text-base font-medium text-white/90">
                {point}
              </p>
            ))}
          </div>

          <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/80">
            Recomendação mais acionável quando os sinais do campo são lidos em conjunto, e não de forma isolada.
          </p>

          <div className="mt-8 grid max-w-xl gap-6 md:grid-cols-2">
            {integrationHighlights.map((item) => (
              <article key={item.title} className="border-t border-white/25 pt-4">
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/76">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
