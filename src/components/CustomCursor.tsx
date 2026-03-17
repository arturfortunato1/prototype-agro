import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import { useMediaQuery } from '../hooks/useMediaQuery';

type CursorState = 'default' | 'hover' | 'action' | 'hidden';

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [state, setState] = useState<CursorState>('default');

  useEffect(() => {
    if (isMobile) return;

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // Use gsap.quickTo for ultra-smooth cursor tracking
    const outerX = gsap.quickTo(outer, 'x', { duration: 0.5, ease: 'power3.out' });
    const outerY = gsap.quickTo(outer, 'y', { duration: 0.5, ease: 'power3.out' });
    const innerX = gsap.quickTo(inner, 'x', { duration: 0.15, ease: 'power2.out' });
    const innerY = gsap.quickTo(inner, 'y', { duration: 0.15, ease: 'power2.out' });

    const onMouseMove = (e: MouseEvent) => {
      outerX(e.clientX);
      outerY(e.clientY);
      innerX(e.clientX);
      innerY(e.clientY);
    };

    const onMouseEnterInteractive = () => setState('hover');
    const onMouseLeaveInteractive = () => setState('default');
    const onMouseEnterAction = () => setState('action');
    const onMouseDown = () => {
      gsap.to(outer, { scale: 0.85, duration: 0.15 });
      gsap.to(inner, { scale: 0.7, duration: 0.1 });
    };
    const onMouseUp = () => {
      gsap.to(outer, { scale: state === 'hover' ? 2.2 : 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' });
      gsap.to(inner, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Observe interactive elements dynamically
    const addListeners = () => {
      document.querySelectorAll('a, button, [data-cursor="action"]').forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterInteractive);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
      document.querySelectorAll('[data-cursor="action"]').forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterAction);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };

    // Run once and set up a MutationObserver for dynamic elements
    addListeners();
    const observer = new MutationObserver(() => addListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      observer.disconnect();
    };
  }, [isMobile, state]);

  useEffect(() => {
    if (isMobile) return;
    const outer = outerRef.current;
    if (!outer) return;

    switch (state) {
      case 'hover':
        gsap.to(outer, {
          scale: 2.2,
          borderColor: 'rgba(0, 87, 184, 0.5)',
          backgroundColor: 'rgba(0, 87, 184, 0.06)',
          duration: 0.4,
          ease: 'power3.out',
        });
        break;
      case 'action':
        gsap.to(outer, {
          scale: 2.8,
          borderColor: 'rgba(120, 190, 32, 0.6)',
          backgroundColor: 'rgba(120, 190, 32, 0.08)',
          duration: 0.4,
          ease: 'power3.out',
        });
        break;
      default:
        gsap.to(outer, {
          scale: 1,
          borderColor: 'rgba(0, 87, 184, 0.35)',
          backgroundColor: 'transparent',
          duration: 0.4,
          ease: 'power3.out',
        });
    }
  }, [state, isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Outer ring — follows with a soft delay */}
      <div
        ref={outerRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-5 -mt-5 h-10 w-10 rounded-full border border-syngenta-blue/35 mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      {/* Inner dot — snappy tracking */}
      <div
        ref={innerRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-1 -mt-1 h-2 w-2 rounded-full bg-syngenta-blue/80 mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
