import { useEffect, useRef } from 'react';

type AndroidProfile = {
  fps: number;
  frameStep: number;
  smoothing: number;
  scrub: number;
};

type VideoWithFastSeek = HTMLVideoElement & {
  fastSeek?: (time: number) => void;
};

export function useAndroidVideoScrubber({
  videoRef,
  androidProfile,
  androidTargetTimeRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  androidProfile: AndroidProfile | null;
  androidTargetTimeRef: React.MutableRefObject<number>;
}) {
  const lastScrubbedTimeRef = useRef(0);
  const androidSmoothTimeRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !androidProfile) return;
    const androidVideo = video as VideoWithFastSeek;

    let rafId = 0;
    let lastSeekTimestamp = 0;

    const seekAndroidFrame = (now: number) => {
      // Throttle based on device FPS tier
      const minDeltaMs = 1000 / androidProfile.fps;
      if (now - lastSeekTimestamp < minDeltaMs) {
        rafId = window.requestAnimationFrame(seekAndroidFrame);
        return;
      }
      lastSeekTimestamp = now;

      if (!video.duration || !isFinite(video.duration)) {
        rafId = window.requestAnimationFrame(seekAndroidFrame);
        return;
      }

      const target = androidTargetTimeRef.current;
      const current = androidSmoothTimeRef.current;
      
      // Interpolate smoothly toward the target
      const next = current + (target - current) * androidProfile.smoothing;
      
      // Snap strictly to calculated frame steps, to limit hardware decoder overload
      const snappedTime = Math.max(
        0,
        Math.min(video.duration, Math.round(next / androidProfile.frameStep) * androidProfile.frameStep),
      );

      androidSmoothTimeRef.current = next;

      // Only aggressively seek if the Delta crosses the minimum frame step threshold to prevent stall dropping
      if (Math.abs(snappedTime - lastScrubbedTimeRef.current) >= androidProfile.frameStep * 0.95) {
        lastScrubbedTimeRef.current = snappedTime;
        try {
          if (typeof androidVideo.fastSeek === 'function') {
            androidVideo.fastSeek(snappedTime);
          } else {
            video.currentTime = snappedTime;
          }
        } catch {
          video.currentTime = snappedTime;
        }
      }

      // Loop permanently independent of the Video playback state!
      rafId = window.requestAnimationFrame(seekAndroidFrame);
    };

    // Kickstart the perpetual loop
    rafId = window.requestAnimationFrame(seekAndroidFrame);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [androidProfile, videoRef, androidTargetTimeRef]);
}
