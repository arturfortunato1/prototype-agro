import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { useMagnetic } from '../hooks/useMagnetic';

type CTAButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Disable magnetic hover effect */
  noMagnetic?: boolean;
  children: ReactNode;
};

export function CTAButton({
  variant = 'primary',
  noMagnetic = false,
  children,
  className = '',
  ...props
}: CTAButtonProps) {
  const magneticRef = useMagnetic<HTMLButtonElement>(noMagnetic ? 0 : 0.3);

  const baseClassName =
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-syngenta-yellow';

  const variantClassName = {
    primary:
      'bg-syngenta-blue text-white shadow-lg shadow-syngenta-blue/20 hover:-translate-y-0.5 hover:bg-[#004b9f]',
    secondary:
      'border border-white/40 bg-white/10 text-white backdrop-blur-md hover:border-white/70 hover:bg-white/20',
    ghost:
      'border border-syngenta-deep/20 bg-white text-syngenta-deep hover:border-syngenta-blue/35 hover:text-syngenta-blue',
  };

  return (
    <button
      ref={magneticRef}
      className={`${baseClassName} ${variantClassName[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
