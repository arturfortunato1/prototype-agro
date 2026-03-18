import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  // Initialise synchronously so the value is correct on the very first render.
  // Starting with false would cause one frame where isTouchDevice=false, which
  // is enough for GSAP to run gsap.set(...opacity:0) before the hook corrects.
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);

    // Keep in sync if the query result changes (e.g. window resize)
    mediaQuery.addEventListener('change', update);

    return () => mediaQuery.removeEventListener('change', update);
  }, [query]);

  return matches;
}
