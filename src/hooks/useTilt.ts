import { useEffect, useRef } from 'react';

/**
 * 3D perspective tilt effect on hover.
 * Applies a subtle CSS transform based on mouse position within the element.
 */
export function useTilt<T extends HTMLElement>(intensity = 8) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const onLeave = () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    };

    const onEnter = () => {
      el.style.transition = 'transform 0.15s ease-out';
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [intensity]);

  return ref;
}
