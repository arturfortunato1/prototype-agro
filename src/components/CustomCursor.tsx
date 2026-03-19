import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import { useMediaQuery } from '../hooks/useMediaQuery';

type CursorState = 'default' | 'hover' | 'action' | 'text' | 'hidden';

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [state, setState] = useState<CursorState>('default');
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    if (isMobile) return;

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

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

    const onMouseEnterInteractive = () => {
      setState('hover');
      setCursorText('');
    };
    const onMouseLeaveInteractive = () => {
      setState('default');
      setCursorText('');
    };
    const onMouseEnterAction = () => {
      setState('action');
      setCursorText('');
    };
    const onMouseEnterText = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      if (target.dataset.cursorText) {
        setCursorText(target.dataset.cursorText);
        setState('text');
      }
    };

    const onMouseDown = () => {
      gsap.to(outer, { scale: 0.85, duration: 0.15 });
      gsap.to(inner, { scale: 0.7, duration: 0.1 });
    };
    const onMouseUp = () => {
      gsap.to(outer, { scale: state === 'hover' ? 2.2 : (state === 'text' ? 3.5 : 1), duration: 0.3, ease: 'elastic.out(1, 0.4)' });
      gsap.to(inner, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const addListeners = () => {
      document.querySelectorAll('a, button, [data-cursor="action"]').forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterInteractive);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
      document.querySelectorAll('[data-cursor="action"]').forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterAction);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
      document.querySelectorAll('[data-cursor-text]').forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterText as EventListener);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };

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
      case 'text':
        gsap.to(outer, {
          scale: 3.8,
          borderColor: 'rgba(10, 34, 64, 0.6)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          duration: 0.45,
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
      <div
        ref={outerRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-syngenta-blue/35 shadow-sm transition-[background-color,border-color] mix-blend-difference"
        style={{ willChange: 'transform' }}
      >
        <span
          ref={textRef}
          className={`text-center font-heading text-[3.8px] font-bold uppercase tracking-widest text-[#0a2240] transition-opacity duration-300 ${
            state === 'text' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: 'scale(1)', mixBlendMode: 'normal' }}
        >
          {cursorText}
        </span>
      </div>
      <div
        ref={innerRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] -ml-1 -mt-1 h-2 w-2 rounded-full bg-syngenta-blue/80 transition-opacity duration-200 mix-blend-difference ${
          state === 'text' ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
