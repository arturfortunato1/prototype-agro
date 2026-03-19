export type AndroidPerfTier = 'high' | 'mid' | 'low';

export type NavigatorWithPerf = Navigator & {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
  };
};

export function getAndroidPerfTier(): AndroidPerfTier {
  if (typeof navigator === 'undefined') return 'mid';

  const nav = navigator as NavigatorWithPerf;
  const saveData = Boolean(nav.connection?.saveData);
  const memory = nav.deviceMemory;
  const cores = nav.hardwareConcurrency ?? 4;

  if (saveData) return 'low';

  if (typeof memory === 'number') {
    if (memory >= 6 && cores >= 8) return 'high';
    if (memory <= 3 || cores <= 4) return 'low';
    return 'mid';
  }

  if (cores >= 8) return 'high';
  if (cores <= 4) return 'low';
  return 'mid';
}
