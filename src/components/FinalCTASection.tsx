import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import { CTAButton } from './CTAButton';
import { TextReveal } from './TextReveal';
import { assetUrl } from '../utils';
import { lenisScrollTo } from '../utils';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

function goToSection(sectionId: string) {
  lenisScrollTo(`#${sectionId}`);
}

export function FinalCTASection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || navigator.maxTouchPoints > 0 || !sectionRef.current) return;

    const context = gsap.context(() => {
      // Parallax background image
      gsap.to('[data-final-bg]', {
        yPercent: -18,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Stagger the CTA buttons in
      gsap.from('[data-final-cta] button', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
      });

      // Fade in the description
      gsap.from('[data-final-desc]', {
        y: 16,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section id="contato" ref={sectionRef} className="relative overflow-hidden py-28 md:py-36">
      <img
        data-final-bg
        src={assetUrl('images/hero-sequence/frame_191_delay-0.041s.webp')}
        alt="Campo ao entardecer com tecnologia aplicada"
        className="absolute inset-0 h-[130%] w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,34,64,0.90),rgba(0,87,184,0.58)_45%,rgba(120,190,32,0.38))]" />
      {/* Noise overlay removed */}

      <div className="relative mx-auto w-full max-w-[1200px] px-6 text-center text-white md:px-10">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-syngenta-yellow">Próximo passo</p>
        <TextReveal
          as="h2"
          className="font-heading text-4xl font-semibold leading-tight text-white md:text-6xl"
          splitBy="words"
          stagger={0.05}
          duration={0.9}
          start="top 75%"
        >
          Vamos construir uma agricultura mais preparada para o amanhã.
        </TextReveal>
        <p data-final-desc className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
          Conheça nossas soluções e descubra como integrar tecnologia, manejo e visão de futuro à sua
          operação.
        </p>

        <div data-final-cta className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <CTAButton
            variant="primary"
            data-analytics-id="final_cta_fale_com_especialista"
            onClick={() => goToSection('footer')}
            className="bg-syngenta-green text-syngenta-deep hover:bg-[#8dd531]"
          >
            Fale com um especialista
          </CTAButton>
          <CTAButton
            variant="secondary"
            data-analytics-id="final_cta_explorar_solucoes"
            onClick={() => goToSection('solucoes')}
          >
            Explorar soluções
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
