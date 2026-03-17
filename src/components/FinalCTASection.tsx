import { CTAButton } from './CTAButton';
import { assetUrl } from '../utils';

function goToSection(sectionId: string) {
  const target = document.getElementById(sectionId);

  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function FinalCTASection() {
  return (
    <section id="contato" className="relative overflow-hidden py-24 md:py-32">
      <img
        src={assetUrl('images/hero-sequence/frame_191_delay-0.041s.webp')}
        alt="Campo ao entardecer com tecnologia aplicada"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,34,64,0.88),rgba(0,87,184,0.55)_45%,rgba(120,190,32,0.36))]" />

      <div className="relative mx-auto w-full max-w-[1200px] px-6 text-center text-white md:px-10">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-syngenta-yellow">Próximo passo</p>
        <h2 className="font-heading text-4xl font-semibold leading-tight md:text-6xl">
          Vamos construir uma agricultura mais preparada para o amanhã.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
          Conheça nossas soluções e descubra como integrar tecnologia, manejo e visão de futuro à sua
          operação.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
