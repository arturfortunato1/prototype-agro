import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import { CTAButton } from './CTAButton';
import { heroStages } from '../data/content';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useAndroidVideoScrubber } from '../hooks/useAndroidVideoScrubber';
import { getAndroidPerfTier, type AndroidPerfTier } from '../utils/deviceInfo';
import { assetUrl } from '../utils';

// Lenis dynamic scrollTo function helper for CTA targeting
function goToSection(sectionId: string) {
  const lenis = (window as any).__lenis;
  if (lenis) {
    lenis.scrollTo(`#${sectionId}`, { offset: 0, duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  } else {
    document.getElementById(sectionId.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
  }
}

const PIN_MULTIPLIER = 5.3;

type AndroidProfile = {
  fps: number;
  frameStep: number;
  smoothing: number;
  scrub: number;
};

const ANDROID_PROFILES: Record<AndroidPerfTier, AndroidProfile> = {
  high: { fps: 30, frameStep: 1 / 24, smoothing: 0.26, scrub: 0.75 },
  mid: { fps: 24, frameStep: 1 / 20, smoothing: 0.22, scrub: 0.95 },
  low: { fps: 20, frameStep: 1 / 16, smoothing: 0.18, scrub: 1.1 },
};

export function HeroSequenceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stageRef = useRef(0);
  const androidTargetTimeRef = useRef(0);

  const [activeStage, setActiveStage] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
  const androidTier = isAndroid ? getAndroidPerfTier() : null;
  const androidProfile = androidTier ? ANDROID_PROFILES[androidTier] : null;
  const useStaticFallback = prefersReducedMotion;

  // Utilize the extracted hook!
  useAndroidVideoScrubber({ videoRef, androidProfile, androidTargetTimeRef });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    const onPlayable = () => {
      setVideoReady(true);
      androidTargetTimeRef.current = 0;
      video.pause();
    };
    video.addEventListener('loadeddata', onPlayable);
    video.addEventListener('canplay', onPlayable);

    video.load();
    video.play().catch(() => {});

    return () => {
      video.removeEventListener('loadeddata', onPlayable);
      video.removeEventListener('canplay', onPlayable);
    };
  }, [prefersReducedMotion]);

  // Modern GSAP + React integration automatically cleans up logic
  useGSAP(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${window.innerHeight * PIN_MULTIPLIER}`,
      scrub: androidProfile ? androidProfile.scrub : 0.5,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (video.duration && isFinite(video.duration)) {
          const targetTime = self.progress * video.duration;

          if (androidProfile) {
            androidTargetTimeRef.current = targetTime;
          } else {
            video.currentTime = targetTime;
          }
        }

        const nextStage = self.progress < 0.36 ? 0 : self.progress < 0.74 ? 1 : 2;
        if (nextStage !== stageRef.current) {
          stageRef.current = nextStage;
          setActiveStage(nextStage);
        }
      },
    });

    gsap.fromTo(
      video,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, delay: 0.1 },
    );
  }, { scope: sectionRef, dependencies: [prefersReducedMotion, androidProfile] });

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[100dvh] min-h-[100svh] overflow-hidden bg-syngenta-deep text-white"
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
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={assetUrl(androidTier === 'low' ? 'images/hero-sequence-mobile.mp4' : 'images/hero-sequence.mp4')}
            muted
            autoPlay
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </>
      )}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(242,201,76,0.18),transparent_35%),linear-gradient(180deg,rgba(8,20,40,0.58)_0%,rgba(8,20,40,0.22)_45%,rgba(8,20,40,0.62)_100%)]" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] items-center px-6 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] pt-[calc(env(safe-area-inset-top)+4.75rem)] md:px-10 md:pb-0 md:pt-0">
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
                  <div className="pointer-events-auto mt-8 flex flex-wrap gap-3 md:mt-10">
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
