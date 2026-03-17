import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import { footerColumns } from '../data/content';
import { assetUrl } from '../utils';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !footerRef.current) return;

    const context = gsap.context(() => {
      // Stagger reveal the footer columns
      gsap.from('[data-footer-col]', {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
        },
      });

      // Animate the divider line
      gsap.from('[data-footer-divider]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 75%',
        },
      });
    }, footerRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <footer id="footer" ref={footerRef} className="relative border-t border-syngenta-deep/10 bg-white py-14">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 md:px-10 lg:grid-cols-[1.2fr_2fr]">
        <div data-footer-col>
          <img src={assetUrl('images/logo/Logo-novo.png')} alt="AgroTech" className="h-11 w-auto" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-syngenta-deep/72">
            Tecnologia agrícola global com foco em ciência, produtividade e sustentabilidade para o campo brasileiro.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-syngenta-blue/70">AgroTech Brasil</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title} data-footer-col>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-syngenta-blue/70">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="group relative inline-block text-sm text-syngenta-deep/82 transition hover:text-syngenta-blue"
                    >
                      {link}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-syngenta-blue/40 transition-transform duration-300 group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div
        data-footer-divider
        className="mx-auto mt-12 h-px w-full max-w-[1400px] bg-gradient-to-r from-transparent via-syngenta-deep/10 to-transparent px-6 md:px-10"
      />

      <div className="mx-auto mt-6 flex w-full max-w-[1400px] flex-col gap-3 px-6 text-xs text-syngenta-deep/58 md:flex-row md:items-center md:justify-between md:px-10">
        <p>© {new Date().getFullYear()} AgroTech Brasil. Todos os direitos reservados.</p>
        <div className="flex gap-5">
          <a href="#" className="transition hover:text-syngenta-blue">
            Política de Privacidade
          </a>
          <a href="#" className="transition hover:text-syngenta-blue">
            Termos de Uso
          </a>
        </div>
      </div>
    </footer>
  );
}
