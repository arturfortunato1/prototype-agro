import { useEffect, useState } from 'react';

import { CTAButton } from './CTAButton';
import { navLinks } from '../data/content';
import { assetUrl } from '../utils';

const LOGO_SRC = assetUrl('images/logo/Logo-novo.png');

function goToSection(sectionId: string) {
  const section = document.getElementById(sectionId);

  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function LinkItem({
  id,
  label,
  light,
  onClick,
}: {
  id: string;
  label: string;
  light?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={`#${id}`}
      onClick={onClick}
      className={`group relative text-sm font-medium transition-colors duration-300 ${
        light ? 'text-white/92 hover:text-white' : 'text-syngenta-deep hover:text-syngenta-blue'
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
          light ? 'bg-white/75' : 'bg-syngenta-blue'
        }`}
      />
    </a>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/86 py-3 shadow-[0_10px_40px_rgba(7,24,44,0.09)] backdrop-blur-xl'
            : 'bg-gradient-to-b from-[#061b35]/62 via-[#061b35]/25 to-transparent py-5'
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 md:px-10">
          <a href="#top" className="flex items-center" aria-label="AgroTech Brasil - Início">
            <img
              src={LOGO_SRC}
              alt="AgroTech"
              className={`w-auto transition-all duration-500 ${isScrolled ? 'h-[3.6rem] md:h-[3.9rem]' : 'h-[4.7rem] md:h-[5.2rem]'} ${
                isScrolled ? '' : 'drop-shadow-[0_6px_18px_rgba(0,0,0,0.28)]'
              }`}
            />
          </a>

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Navegação principal">
            <div className="flex items-center gap-7 px-2 py-1">
              {navLinks.slice(0, 5).map((link) => (
                <LinkItem key={link.id} id={link.id} label={link.label} light={!isScrolled} />
              ))}
            </div>
            <CTAButton
              variant="ghost"
              data-analytics-id="header_cta_fale_com_especialista"
              onClick={() => goToSection('contato')}
              className={
                isScrolled
                  ? 'border-syngenta-blue/30 text-syngenta-blue hover:border-syngenta-blue'
                  : 'border-white/50 bg-white text-syngenta-deep hover:border-white hover:bg-white/95'
              }
            >
              Fale com um especialista
            </CTAButton>
          </nav>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-syngenta-deep/20 bg-white/70 text-syngenta-deep backdrop-blur-md transition hover:border-syngenta-blue hover:text-syngenta-blue xl:hidden"
            onClick={() => setMenuOpen((state) => !state)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-5 bg-current transition-all duration-300 ${
                  menuOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-px w-5 bg-current transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-px w-5 bg-current transition-all duration-300 ${
                  menuOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-syngenta-deep/95 px-6 pb-12 pt-28 text-white backdrop-blur-2xl transition-all duration-500 xl:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="mx-auto flex h-full w-full max-w-5xl flex-col justify-between" aria-label="Menu mobile">
          <div className="space-y-7">
            {navLinks.map((link, index) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-white/10 pb-4 text-2xl font-medium tracking-tight text-white/92"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <CTAButton
            variant="primary"
            data-analytics-id="mobile_menu_cta_fale_com_especialista"
            onClick={() => {
              setMenuOpen(false);
              goToSection('contato');
            }}
            className="w-full bg-syngenta-green text-syngenta-deep hover:bg-[#8aca2c]"
          >
            Fale com um especialista
          </CTAButton>
        </nav>
      </div>
    </>
  );
}
