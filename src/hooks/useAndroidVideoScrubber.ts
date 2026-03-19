import { useEffect, useRef } from 'react';

type AndroidProfile = {
  fps: number;
  frameStep: number;
  smoothing: number;
  scrub: number;
};

type VideoWithRVFC = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callback: (now: number, metadata: VideoFrameCallbackMetadata) => void,
  ) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
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
    const androidVideo = video as VideoWithRVFC;

    let rafId = 0;
    let rvfcId = 0;
    let lastSeekTimestamp = 0;

    const seekAndroidFrame = (now: number) => {
      if (!androidProfile || !video.duration || !isFinite(video.duration)) return;

      const minDeltaMs = 1000 / androidProfile.fps;
      if (now - lastSeekTimestamp < minDeltaMs) return;
      lastSeekTimestamp = now;

      const target = androidTargetTimeRef.current;
      const current = androidSmoothTimeRef.current;
      const next = current + (target - current) * androidProfile.smoothing;
      const snappedTime = Math.max(
        0,
        Math.min(video.duration, Math.round(next / androidProfile.frameStep) * androidProfile.frameStep),
      );

      androidSmoothTimeRef.current = next;

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
    };

    const runRaf = (time: number) => {
      seekAndroidFrame(time);
      rafId = window.requestAnimationFrame(runRaf);
    };

    const runRvfc = (now: number) => {
      seekAndroidFrame(now);
      if (typeof androidVideo.requestVideoFrameCallback === 'function') {
        rvfcId = androidVideo.requestVideoFrameCallback(runRvfc);
      }
    };

    if (typeof androidVideo.requestVideoFrameCallback === 'function') {
      rvfcId = androidVideo.requestVideoFrameCallback(runRvfc);
    } else {
      rafId = window.requestAnimationFrame(runRaf);
    }

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      if (rvfcId && typeof androidVideo.cancelVideoFrameCallback === 'function') {
        androidVideo.cancelVideoFrameCallback(rvfcId);
      }
    };
  }, [androidProfile, videoRef, androidTargetTimeRef]);
}
