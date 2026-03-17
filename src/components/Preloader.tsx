import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const barFillRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Exit animation
        const exitTl = gsap.timeline({
          onComplete,
        });

        exitTl
          .to(barRef.current, { opacity: 0, y: 10, duration: 0.3 })
          .to(textRef.current, { opacity: 0, y: 10, duration: 0.3 }, '<')
          .to(logoRef.current, { scale: 1.1, opacity: 0, duration: 0.5, ease: 'power2.in' }, '-=0.1')
          .to(overlayRef.current, {
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.8,
            ease: 'power4.inOut',
          }, '-=0.2');
      },
    });

    // Entrance
    tl.set(overlayRef.current, { clipPath: 'inset(0 0 0% 0)' })
      .from(logoRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      })
      .from(textRef.current, {
        y: 14,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
      }, '-=0.3')
      .from(barRef.current, {
        scaleX: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.3');

    // Simulate loading progress
    const progressTl = gsap.to(
      { val: 0 },
      {
        val: 100,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: function () {
          const val = Math.round(this.targets()[0].val);
          setProgress(val);
          if (barFillRef.current) {
            barFillRef.current.style.width = `${val}%`;
          }
        },
      },
    );

    tl.add(progressTl, '-=0.6');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-syngenta-deep"
      style={{ willChange: 'clip-path' }}
    >
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,87,184,0.15),transparent_70%)]" />

      <div ref={logoRef} className="relative flex flex-col items-center">
        {/* Logo text */}
        <h1 className="font-heading text-3xl font-bold tracking-tight text-white md:text-4xl">
          JAF <span className="text-syngenta-green">AGRO</span>
        </h1>
        <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-white/40">
          Global Agriculture Solutions
        </p>
      </div>

      <p ref={textRef} className="mt-8 text-xs uppercase tracking-[0.25em] text-white/50">
        {progress}%
      </p>

      <div
        ref={barRef}
        className="mt-4 h-px w-48 overflow-hidden rounded-full bg-white/10"
      >
        <div
          ref={barFillRef}
          className="h-full rounded-full bg-gradient-to-r from-syngenta-blue to-syngenta-green"
          style={{ width: '0%', willChange: 'width' }}
        />
      </div>
    </div>
  );
}
