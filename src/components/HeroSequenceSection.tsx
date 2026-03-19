import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CTAButton } from './CTAButton';
import { heroStages } from '../data/content';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { lenisScrollTo } from '../hooks/useSmoothScroll';
import { assetUrl } from '../utils';

const PIN_MULTIPLIER = 5.3;

function goToSection(sectionId: string) {
  lenisScrollTo(`#${sectionId}`);
}

export function HeroSequenceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stageRef = useRef(0);

  const [activeStage, setActiveStage] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  // On touch devices ScrollTrigger pin + Lenis + video scrubbing all break on
  // iOS Safari. Fall back to a clean static hero (stage 0, no pin, no video).
  const useStaticFallback = prefersReducedMotion || navigator.maxTouchPoints > 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || useStaticFallback) return;

    // Once enough data is buffered, mark as ready and pause so GSAP
    // has full control via currentTime scrubbing.
    const onCanPlay = () => {
      setVideoReady(true);
      video.pause();
    };
    video.addEventListener('canplaythrough', onCanPlay);

    // On iOS Safari, autoplay (allowed for muted videos) forces the browser
    // to actually buffer the video — without it, currentTime scrubbing silently fails.
    video.load();
    video.play().catch(() => {
      // Autoplay blocked — fall back to load-only (desktop browsers without gesture)
    });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${window.innerHeight * PIN_MULTIPLIER}`,
      scrub: 0.5,
      pin: true,
      onUpdate: (self) => {
        // Scrub video currentTime based on scroll progress
        if (video.duration && isFinite(video.duration)) {
          video.currentTime = self.progress * video.duration;
        }

        const nextStage = self.progress < 0.36 ? 0 : self.progress < 0.74 ? 1 : 2;
        if (nextStage !== stageRef.current) {
          stageRef.current = nextStage;
          setActiveStage(nextStage);
        }
      },
    });

    // Fade in the video once ready
    if (!prefersReducedMotion) {
      gsap.fromTo(
        video,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: 0.1 },
      );
    }

    return () => {
      video.removeEventListener('canplaythrough', onCanPlay);
      trigger.kill();
    };
  }, [prefersReducedMotion]);

  /* ── Touch-only: pin + stage transitions WITHOUT video ──
     The desktop useEffect above is skipped on touch (useStaticFallback=true).
     This effect adds back just the pin and text-stage cycling so the hero
     still scrolls through 3 stages on iOS — only video scrubbing is removed. */
  useEffect(() => {
    const isTouchDevice = navigator.maxTouchPoints > 0;
    if (!isTouchDevice || prefersReducedMotion || !sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${window.innerHeight * PIN_MULTIPLIER}`,
      scrub: 0.5,
      pin: true,
      onUpdate: (self) => {
        const nextStage = self.progress < 0.36 ? 0 : self.progress < 0.74 ? 1 : 2;
        if (nextStage !== stageRef.current) {
          stageRef.current = nextStage;
          setActiveStage(nextStage);
        }
      },
    });

    return () => trigger.kill();
  }, [prefersReducedMotion]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-svh overflow-hidden bg-syngenta-deep text-white"
      aria-label="Transformação do campo por ciência e tecnologia"
    >
      {useStaticFallback ? (
        <img
          src={assetUrl('images/hero-sequence/frame_191_delay-0.041s.webp')}
          alt="Lavoura verde com pulverizador em ação"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
      ) : (
        <>
          {/* Static poster — shows instantly while video loads */}
          <img
            src={assetUrl('images/hero-sequence/frame_000_delay-0.041s.webp')}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            loading="eager"
            fetchPriority="high"
          />
          {/* Scroll-scrubbed video.
              autoPlay + muted is required on iOS Safari to trigger buffering —
              without it currentTime scrubbing silently fails. We pause it as
              soon as canplaythrough fires so GSAP controls the position. */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={assetUrl('images/hero-sequence.mp4')}
            muted
            autoPlay
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </>
      )}

      {/* Warm radial accent + dark gradient for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(242,201,76,0.18),transparent_35%),linear-gradient(180deg,rgba(8,20,40,0.58)_0%,rgba(8,20,40,0.22)_45%,rgba(8,20,40,0.62)_100%)]" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] items-center px-6 md:px-10">
        <div className="max-w-3xl">
          {heroStages.map((stage, index) => {
            const isVisible = activeStage === index;
            const HeadingTag = index === 0 ? 'h1' : 'h2';

            return (
              <article
                key={stage.title}
                className={`absolute w-[calc(100vw-3rem)] max-w-3xl md:w-auto transition-all duration-700 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
                }`}
                style={{ transformOrigin: 'left center' }}
                aria-hidden={!isVisible}
              >
                {stage.eyebrow ? (
                  <p className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-syngenta-yellow backdrop-blur-md" style={{ WebkitBackdropFilter: 'blur(12px)' }}>
                    {stage.eyebrow}
                  </p>
                ) : null}

                <HeadingTag
                  className="font-heading text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-7xl"
                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.3)' }}
                >
                  {stage.title}
                </HeadingTag>

                <p
                  className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-xl"
                  style={{ textShadow: '0 1px 12px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.25)' }}
                >
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
