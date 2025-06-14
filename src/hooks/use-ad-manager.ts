'use client';

import {useEffect, useMemo, useState} from 'react';

export function useAdManger<T>(
  allAds: T[],
  filterFn: (ad: T) => boolean,
  intervalMs: number = 10000,
): T | null {
  const filteredAds = useMemo(
    () => allAds.filter(filterFn),
    [allAds, filterFn],
  );

  const shuffleArray = (array: T[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledAds] = useState<T[]>(() => shuffleArray(filteredAds));
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * shuffledAds.length),
  );

  useEffect(() => {
    if (shuffledAds.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % shuffledAds.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [shuffledAds, intervalMs]);

  return shuffledAds[currentIndex] || null;
}
