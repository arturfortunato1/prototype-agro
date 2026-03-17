import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SectionHeading } from './SectionHeading';
import { digitalSteps } from '../data/content';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const panelDetails = [
  {
    metricLabel: 'Risco climático',
    metricValue: 'Moderado',
    chips: ['Umidade', 'Temperatura', 'Janela operacional'],
  },
  {
    metricLabel: 'Ação priorizada',
    metricValue: 'Manejo preventivo',
    chips: ['Recomendação técnica', 'Timing', 'Custo operacional'],
  },
  {
    metricLabel: 'Status da lavoura',
    metricValue: 'Monitoramento por talhão',
    chips: ['Mapa de operação', 'Ocorrências', 'Produtividade esperada'],
  },
  {
    metricLabel: 'Eficiência',
    metricValue: 'Decisão orientada por dados',
    chips: ['Comparativo histórico', 'Indicadores', 'Consistência'],
  },
];

export function DigitalSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mockupRef = useRef<HTMLDivElement | null>(null);

  const [activeStep, setActiveStep] = useState(0);

  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const context = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>('[data-digital-chapter]');

      chapters.forEach((chapter, index) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
        });

        if (!reducedMotion) {
          gsap.from(chapter, {
            y: 22,
            opacity: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chapter,
              start: 'top 78%',
            },
          });
        }
      });

    }, sectionRef);

    return () => context.revert();
  }, [reducedMotion]);

  const activePanel = panelDetails[activeStep];
  const activeStory = digitalSteps[activeStep];

  return (
    <section id="agrotech" ref={sectionRef} className="relative overflow-hidden bg-[#eef4f9] py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(0,87,184,0.12),transparent_42%),radial-gradient(circle_at_85%_80%,rgba(120,190,32,0.12),transparent_36%)]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          eyebrow="AgroTech"
          title="Dados que ajudam o campo a decidir melhor."
          description="Quando informação e recomendação trabalham juntas, o manejo ganha velocidade, contexto e precisão."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.12fr_1fr] lg:items-start">
          <div ref={mockupRef} className="lg:sticky lg:top-1/2 lg:-translate-y-1/2">
            <div className="relative overflow-hidden rounded-[34px] border border-syngenta-deep/10 bg-white shadow-panel">
              <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(0,87,184,0.08),transparent_50%,rgba(120,190,32,0.08))]" />

              <div className="relative space-y-6 p-6 md:p-8">
                <header className="flex items-center justify-between border-b border-syngenta-deep/10 pb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-syngenta-blue/75">Plataforma</p>
                    <h3 className="font-heading text-2xl font-semibold text-syngenta-deep">AgroTech</h3>
                  </div>
                  <span className="rounded-full border border-syngenta-deep/10 bg-white px-4 py-1 text-xs font-medium text-syngenta-deep/70">
                    Etapa {activeStep + 1}/{digitalSteps.length}
                  </span>
                </header>

                <div className="rounded-2xl border border-syngenta-deep/10 bg-white/85 p-5 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-syngenta-blue/75">{activeStory.title}</p>
                  <h4 className="mt-3 font-heading text-3xl font-semibold leading-tight text-syngenta-deep">
                    {activeStory.label}
                  </h4>
                  <p className="mt-4 text-sm leading-relaxed text-syngenta-deep/78">{activeStory.description}</p>

                  <div className="mt-5 rounded-xl border border-syngenta-deep/10 bg-[#f8fbfe] p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-syngenta-deep/55">{activePanel.metricLabel}</p>
                    <p className="mt-2 text-xl font-semibold text-syngenta-deep">{activePanel.metricValue}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {activePanel.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-syngenta-blue/20 bg-white px-3 py-1.5 text-xs font-medium text-syngenta-blue/82"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <article className="rounded-xl border border-syngenta-deep/10 bg-white p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-syngenta-deep/55">Leitura</p>
                    <p className="mt-2 text-sm font-semibold text-syngenta-deep">Cenário atualizado</p>
                  </article>
                  <article className="rounded-xl border border-syngenta-deep/10 bg-white p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-syngenta-deep/55">Prioridade</p>
                    <p className="mt-2 text-sm font-semibold text-syngenta-deep">Ação orientada</p>
                  </article>
                  <article className="rounded-xl border border-syngenta-deep/10 bg-white p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-syngenta-deep/55">Resultado</p>
                    <p className="mt-2 text-sm font-semibold text-syngenta-deep">Eficiência operacional</p>
                  </article>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {digitalSteps.map((step, index) => {
              const isActive = activeStep === index;
              const number = String(index + 1).padStart(2, '0');

              return (
                <article
                  key={step.label}
                  data-digital-chapter
                  className={`rounded-3xl border p-6 md:p-8 lg:min-h-[42vh] ${
                    isActive
                      ? 'border-syngenta-blue/35 bg-white shadow-soft'
                      : 'border-syngenta-deep/10 bg-white/72'
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-syngenta-blue/74">Etapa {number}</p>
                  <h3 className="mt-3 font-heading text-3xl font-semibold leading-tight text-syngenta-deep">
                    {step.label}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-syngenta-deep/78">{step.description}</p>
                  <p className="mt-6 text-sm font-medium text-syngenta-deep/64">
                    {index === 0 && 'Antecipar risco para agir com mais preparo.'}
                    {index === 1 && 'Transformar contexto técnico em recomendação prática.'}
                    {index === 2 && 'Dar visibilidade da operação por área de manejo.'}
                    {index === 3 && 'Consolidar dados em decisão com foco em resultado.'}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
