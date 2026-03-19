import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import { assetUrl } from '../utils';

/* ─────────────────────────────────────────────────────────
 *  Awwwards-grade preloader
 *
 *  Keywords slam in one-by-one across the screen quadrants,
 *  spaced out so the last word lands near the min display
 *  time. Positions are tighter to the center so nothing
 *  clips on mobile.
 * ───────────────────────────────────────────────────────── */

const RING_RADIUS = 44;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const MIN_DISPLAY_MS = 2400;

// Positions use viewport-safe offsets (max ~30% from center)
// so words stay on-screen even on narrow mobile viewports.
const KEYWORDS = [
  { text: 'AgroTech',         x: '-22vw', y: '-22vh', rotate: -12, from: { x: -200, y: -150 } },
  { text: 'Sustentabilidade', x: '14vw',  y: '-16vh', rotate: 5,   from: { x: 200,  y: -120 } },
  { text: 'Regeneração',      x: '-18vw', y: '14vh',  rotate: 8,   from: { x: -180, y: 140  } },
  { text: 'Clima',            x: '20vw',  y: '20vh',  rotate: -9,  from: { x: 180,  y: 160  } },
  { text: 'Produtividade',    x: '-6vw',  y: '-32vh', rotate: -3,  from: { x: -60,  y: -200 } },
  { text: 'Inovação',         x: '8vw',   y: '30vh',  rotate: 12,  from: { x: 60,   y: 200  } },
];

// Each word gets ~320ms of stagger so 6 words span ~1.6s total,
// meaning the last word lands right around the min display time.
const WORD_STAGGER = 0.32;

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const ring = ringRef.current;
    const counter = counterRef.current;
    const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[];
    const startTime = Date.now();

    // Ring initial state
    if (ring) {
      ring.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;
      ring.style.strokeDashoffset = `${RING_CIRCUMFERENCE}`;
    }

    // Words — hidden at origin positions off-screen
    words.forEach((el, i) => {
      const kw = KEYWORDS[i];
      gsap.set(el, {
        opacity: 0,
        scale: 0.6,
        x: kw.from.x,
        y: kw.from.y,
        rotation: kw.rotate * 2,
      });
    });

    const updateVisuals = (val: number) => {
      const v = Math.round(val);
      if (ring) {
        ring.style.strokeDashoffset = `${RING_CIRCUMFERENCE * (1 - v / 100)}`;
      }
      if (counter) {
        counter.textContent = `${v}`;
      }
    };

    // ── Keywords slam in one at a time ──
    const wordsTl = gsap.timeline();

    words.forEach((el, i) => {
      wordsTl.to(el, {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotation: KEYWORDS[i].rotate,
        duration: 0.7,
        ease: 'power4.out',
      }, i * WORD_STAGGER);
    });

    // Gentle breathing once all words are placed
    const breatheTl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      delay: KEYWORDS.length * WORD_STAGGER + 0.7,
    });
    breatheTl.to(words, {
      scale: 1.02,
      duration: 2,
      ease: 'sine.inOut',
      stagger: { each: 0.12, from: 'random' },
    });

    // ── Progress bar ──
    let isLoaded = document.readyState === 'complete';
    const onLoad = () => { isLoaded = true; };
    window.addEventListener('load', onLoad);

    const p = { val: 0 };

    const progressTl = gsap.timeline({
      onComplete: () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

        gsap.delayedCall(remaining / 1000, () => {
          breatheTl.kill();

          // ── Exit: words blast outward ──
          const exitTl = gsap.timeline({
            onComplete: () => onCompleteRef.current(),
          });

          words.forEach((el, i) => {
            const kw = KEYWORDS[i];
            exitTl.to(el, {
              x: kw.from.x * 2.5,
              y: kw.from.y * 2.5,
              rotation: kw.rotate * 4,
              opacity: 0,
              scale: 0.4,
              duration: 0.55,
              ease: 'power3.in',
            }, i * 0.03); // near-simultaneous but slightly staggered
          });

          exitTl.to(centerRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: 0.35,
            ease: 'power2.in',
          }, 0);

          exitTl.to(overlayRef.current, {
            yPercent: -100,
            duration: 0.7,
            ease: 'power4.inOut',
          }, 0.3);
        });
      },
    });

    // Progress syncs with word entrances — fills smoothly over the full duration
    progressTl.to(p, {
      val: 90,
      duration: KEYWORDS.length * WORD_STAGGER + 0.5,
      ease: 'power2.out',
      onUpdate: () => updateVisuals(p.val),
    });

    progressTl.to(p, {
      val: 100,
      duration: 0.3,
      ease: 'power2.inOut',
      onUpdate: () => updateVisuals(p.val),
      onStart: function () {
        if (!isLoaded) {
          this.pause();
          const check = setInterval(() => {
            if (isLoaded) {
              clearInterval(check);
              this.play();
            }
          }, 80);
        }
      },
    });

    return () => {
      window.removeEventListener('load', onLoad);
      progressTl.kill();
      wordsTl.kill();
      breatheTl.kill();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-syngenta-deep"
      style={{ willChange: 'transform' }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(120,190,32,0.06),transparent_55%)]" />

      {/* ── Scattered keywords ── */}
      {KEYWORDS.map((kw, i) => (
        <span
          key={kw.text}
          ref={(el) => { wordsRef.current[i] = el; }}
          className="pointer-events-none absolute font-heading text-[clamp(1.8rem,6vw,5rem)] font-extrabold uppercase leading-none tracking-tight"
          style={{
            left: `calc(50% + ${kw.x})`,
            top: `calc(50% + ${kw.y})`,
            translate: '-50% -50%',
            willChange: 'transform, opacity',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.12)',
          }}
          aria-hidden="true"
        >
          {kw.text}
        </span>
      ))}

      {/* ── Center cluster: logo + ring + counter ── */}
      <div ref={centerRef} className="relative z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <svg
            className="absolute"
            width="112"
            height="112"
            viewBox="0 0 112 112"
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="56" cy="56" r={RING_RADIUS}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"
            />
            <circle
              ref={ringRef}
              cx="56" cy="56" r={RING_RADIUS}
              fill="none" stroke="url(#pl-grad)" strokeWidth="1.5"
              strokeLinecap="round"
              style={{ willChange: 'stroke-dashoffset' }}
            />
            <defs>
              <linearGradient id="pl-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0057b8" />
                <stop offset="100%" stopColor="#78be20" />
              </linearGradient>
            </defs>
          </svg>

          <img
            src={assetUrl('images/logo/Logo-novo.png')}
            alt=""
            className="relative h-12 w-auto brightness-0 invert"
            aria-hidden="true"
          />
        </div>

        <div className="mt-6 flex items-baseline gap-0.5">
          <span
            ref={counterRef}
            className="font-heading text-xs font-medium tabular-nums text-white/35"
          >
            0
          </span>
          <span className="text-[9px] font-medium text-white/20">%</span>
        </div>
      </div>
    </div>
  );
}
