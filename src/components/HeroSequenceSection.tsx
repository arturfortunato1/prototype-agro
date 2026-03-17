import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CTAButton } from './CTAButton';
import { heroStages } from '../data/content';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { assetUrl } from '../utils';

const TOTAL_FRAMES = 192;
const PIN_MULTIPLIER = 5.3;

type WindowWithIdle = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

function framePath(frame: number) {
  return assetUrl(`images/hero-sequence/frame_${String(frame).padStart(3, '0')}_delay-0.041s.webp`);
}

function drawImageCover(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = canvas.getContext('2d');

  if (!context) return;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth = canvasWidth;
  let drawHeight = canvasHeight;

  if (imageRatio > canvasRatio) {
    drawHeight = canvasHeight;
    drawWidth = drawHeight * imageRatio;
  } else {
    drawWidth = canvasWidth;
    drawHeight = drawWidth / imageRatio;
  }

  const x = (canvasWidth - drawWidth) / 2;
  const y = (canvasHeight - drawHeight) / 2;

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(image, x, y, drawWidth, drawHeight);
}

function goToSection(sectionId: string) {
  const target = document.getElementById(sectionId);

  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function HeroSequenceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentFrameRef = useRef(0);
  const frameImagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const stageRef = useRef(0);

  const [activeStage, setActiveStage] = useState(0);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1100px)');
  const prefersReducedMotion = usePrefersReducedMotion();

  const frameStep = isMobile ? 3 : isTablet ? 2 : 1;

  const frameSources = useMemo(() => {
    const sources: string[] = [];

    for (let frame = 0; frame < TOTAL_FRAMES; frame += frameStep) {
      sources.push(framePath(frame));
    }

    if (!sources.at(-1)?.includes('191')) {
      sources.push(framePath(TOTAL_FRAMES - 1));
    }

    return sources;
  }, [frameStep]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || prefersReducedMotion) return;

    const context = canvas.getContext('2d');

    if (!context) return;

    frameImagesRef.current = Array.from({ length: frameSources.length }, () => null);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const image = frameImagesRef.current[currentFrameRef.current];

      if (image) {
        drawImageCover(canvas, image);
      }
    };

    const loadFrame = (index: number) =>
      new Promise<void>((resolve) => {
        if (frameImagesRef.current[index]) {
          resolve();
          return;
        }

        const image = new Image();
        image.src = frameSources[index];

        image.onload = () => {
          frameImagesRef.current[index] = image;

          if (index === 0 || index === currentFrameRef.current) {
            drawImageCover(canvas, image);
          }

          resolve();
        };

        image.onerror = () => resolve();
      });

    const findClosestLoadedFrame = (index: number) => {
      for (let offset = 0; offset < frameSources.length; offset += 1) {
        const previous = index - offset;
        const next = index + offset;

        if (previous >= 0 && frameImagesRef.current[previous]) return previous;
        if (next < frameSources.length && frameImagesRef.current[next]) return next;
      }

      return 0;
    };

    const renderFrame = (index: number) => {
      const targetIndex = Math.max(0, Math.min(index, frameSources.length - 1));
      const loadedIndex = frameImagesRef.current[targetIndex] ? targetIndex : findClosestLoadedFrame(targetIndex);
      const image = frameImagesRef.current[loadedIndex];

      if (image) {
        currentFrameRef.current = loadedIndex;
        drawImageCover(canvas, image);
      }
    };

    const initialBatch = Math.min(20, frameSources.length);

    Promise.all(Array.from({ length: initialBatch }, (_, index) => loadFrame(index))).then(() => {
      renderFrame(0);
    });

    let cancelled = false;
    let idleCallbackId: number | null = null;
    let timeoutId: number | null = null;
    const idleWindow = window as WindowWithIdle;

    const loadRemainingFrames = (index: number) => {
      if (cancelled || index >= frameSources.length) return;

      const scheduleNext = () => {
        if (cancelled) return;
        loadFrame(index).finally(() => loadRemainingFrames(index + 1));
      };

      if (typeof idleWindow.requestIdleCallback === 'function') {
        idleCallbackId = idleWindow.requestIdleCallback(scheduleNext, { timeout: 150 });
      } else {
        timeoutId = window.setTimeout(scheduleNext, 32);
      }
    };

    loadRemainingFrames(initialBatch);

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const frameController = { frame: 0 };

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${window.innerHeight * PIN_MULTIPLIER}`,
      scrub: 0.4,
      pin: true,
      onUpdate: (self) => {
        frameController.frame = self.progress * (frameSources.length - 1);

        const nextFrame = Math.round(frameController.frame);
        renderFrame(nextFrame);

        const nextStage = self.progress < 0.36 ? 0 : self.progress < 0.74 ? 1 : 2;

        if (nextStage !== stageRef.current) {
          stageRef.current = nextStage;
          setActiveStage(nextStage);
        }
      },
    });

    return () => {
      cancelled = true;

      if (idleCallbackId !== null && typeof idleWindow.cancelIdleCallback === 'function') {
        idleWindow.cancelIdleCallback(idleCallbackId);
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      window.removeEventListener('resize', setCanvasSize);
      trigger.kill();
    };
  }, [frameSources, prefersReducedMotion]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-syngenta-deep text-white"
      aria-label="Transformação do campo por ciência e tecnologia"
    >
      {prefersReducedMotion ? (
        <img
          src={assetUrl('images/hero-sequence/frame_191_delay-0.041s.webp')}
          alt="Lavoura verde com pulverizador em ação"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(242,201,76,0.18),transparent_35%),linear-gradient(180deg,rgba(8,20,40,0.72)_0%,rgba(8,20,40,0.36)_45%,rgba(8,20,40,0.76)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-noise-soft bg-[size:6px_6px] opacity-[0.15]" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] items-center px-6 md:px-10">
        <div className="max-w-3xl">
          {heroStages.map((stage, index) => {
            const isVisible = activeStage === index;
            const HeadingTag = index === 0 ? 'h1' : 'h2';

            return (
              <article
                key={stage.title}
                className={`absolute max-w-3xl transition-all duration-700 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
                }`}
                style={{ transformOrigin: 'left center' }}
                aria-hidden={!isVisible}
              >
                {stage.eyebrow ? (
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-syngenta-yellow">
                    {stage.eyebrow}
                  </p>
                ) : null}

                <HeadingTag className="font-heading text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-7xl">
                  {stage.title}
                </HeadingTag>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/86 md:text-xl">
                  {stage.description}
                </p>

                {stage.ctaPrimary || stage.ctaSecondary ? (
                  <div className="pointer-events-auto mt-10 flex flex-wrap gap-3">
                    {stage.ctaPrimary ? (
                      <CTAButton
                        variant="primary"
                        data-analytics-id={`hero_cta_primary_${index}`}
                        onClick={() => goToSection(index === 2 ? 'solucoes' : 'manifesto')}
                        className="bg-syngenta-green text-syngenta-deep hover:bg-[#90d134]"
                      >
                        {stage.ctaPrimary}
                      </CTAButton>
                    ) : null}

                    {stage.ctaSecondary ? (
                      <CTAButton
                        variant="secondary"
                        data-analytics-id={`hero_cta_secondary_${index}`}
                        onClick={() => goToSection('manifesto')}
                      >
                        {stage.ctaSecondary}
                      </CTAButton>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center md:flex">
        <span className="mb-3 text-[11px] uppercase tracking-[0.32em] text-white/60">Explore</span>
        <span className="h-10 w-px bg-gradient-to-b from-white/90 to-transparent" />
      </div>
    </section>
  );
}
