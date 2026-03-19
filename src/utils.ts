export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

export function lenisScrollTo(target: string | number | HTMLElement) {
  const lenis = (window as any).__lenis;

  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  } else if (typeof target === 'string') {
    document.getElementById(target.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
  }
}
