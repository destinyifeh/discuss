'use client';

import {mockAds} from '@/constants/data';
import {useAdStore} from '@/hooks/stores/use-ad-store';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {useAdManger} from '@/hooks/use-ad-manager';
import {shuffleArray} from '@/lib/helpers';
import {cn} from '@/lib/utils';
import {adService} from '@/modules/dashboard/actions/ad.actions';
import {AdProps} from '@/types/ad-types';
import {useQuery} from '@tanstack/react-query';
import {ExternalLink} from 'lucide-react';
import Image from 'next/image';
import {useEffect, useState} from 'react';

export interface BannerAdProps {
  ad: AdProps;
  size?: 'small' | 'medium' | 'large';
  position?: 'top' | 'middle' | 'bottom';
  className?: string;
  animation?: any;
}

export function BannerAd({
  ad,
  size = 'medium',
  position,
  className,
  animation,
}: BannerAdProps) {
  const {theme} = useGlobalStore(state => state);
  const [imgSrc, setImgSrc] = useState(ad.imageUrl || '/public/vercel.svg');
  const sizeClasses = {
    small: 'h-[90px]',
    medium: 'h-[120px]',
    large: 'h-[250px]',
  };

  return (
    <div
      className={cn(
        'relative mx-auto w-full overflow-hidden rounded-lg border bg-white dark:bg-background border-app-border ',
        sizeClasses[size],
        className,
      )}>
      <div className="absolute right-2 top-2 z-10 rounded bg-black/70 px-2 py-1 text-xs text-white">
        Sponsored
      </div>
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full w-full">
        {imgSrc.startsWith('data:') ? (
          <div className="relative h-full w-full">
            <Image
              src={imgSrc}
              alt={ad.title}
              priority
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              onError={() => setImgSrc('/placeholder.svg')}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/10 group-hover:opacity-100">
              <ExternalLink className="h-6 w-6 text-white drop-shadow-lg" />
            </div>
          </div>
        ) : (
          <div
            className="relative h-full w-full"
            style={{
              opacity: animation ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
            }}>
            <Image
              src={imgSrc}
              alt={ad.title}
              priority
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              onError={() => setImgSrc('/placeholder.svg')}
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/10 group-hover:opacity-100">
              <ExternalLink className="h-6 w-6 text-white drop-shadow-lg" />
            </div>
          </div>
        )}
      </a>
    </div>
  );
}

export function AppBannerAd3({section}: {section: string}) {
  const bannerAds = shuffleArray(
    mockAds.filter(ad => ad.type === 'banner' && ad.section === section),
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % bannerAds.length);
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [bannerAds.length]);

  if (bannerAds.length === 0) return null;

  const currentAd = bannerAds[currentIndex];

  return (
    <div className="p-4 border-b border-app-border">
      <BannerAd ad={currentAd} />
    </div>
  );
}

export function AppBannerAd({section}: {section: string}) {
  const bannerAds = mockAds.filter(
    ad => ad.type === 'banner' && ad.section === section,
  );

  const currentIndex = useAdStore(
    state => state.currentBannerIndex[section] || 0,
  );
  const startBannerRotation = useAdStore(state => state.startBannerRotation);

  useEffect(() => {
    if (bannerAds.length > 0) {
      startBannerRotation(section, bannerAds.length);
    }
  }, [bannerAds.length, section, startBannerRotation]);

  if (bannerAds.length === 0) return null;

  const currentAd = bannerAds[currentIndex];

  return (
    <div className="p-4 border-b border-app-border">
      <BannerAd ad={currentAd} />
    </div>
  );
}

export function AppBannerAd4({section}: {section: string}) {
  const ad = useAdManger(
    mockAds,
    ad => ad.type === 'banner' && ad.section === section,
    10000, // 10s interval
  );

  if (!ad) return null;

  return (
    <div className="p-4 border-b border-app-border">
      <BannerAd ad={ad} />
    </div>
  );
}

export function BannerAds2({section}: {section: string}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  console.log(section, 'settt');
  const shouldQuery = Boolean(section);

  const {data, isLoading} = useQuery({
    queryKey: ['bannerAds', section],
    queryFn: () => adService.getBannerAds(section),
    refetchInterval: 60000,
    enabled: shouldQuery,
  });

  console.log(data, 'banner ads');

  // Local rotation every 15s
  useEffect(() => {
    if (!data?.ads?.length) return;

    const interval = setInterval(() => {
      setFade(false); // start fade-out
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % data.ads.length);
        setFade(true); // fade-in new ad
      }, 500); // fade out time
    }, 15000);

    return () => clearInterval(interval);
  }, [data?.ads]);

  if (isLoading) return null;
  if (!data?.ads.length) return null;

  const currentAd = data.ads[currentIndex];

  console.log(currentAd, 'currentAdd');
  return (
    <div className="p-4 border-b border-app-border">
      <BannerAd ad={currentAd} key={currentAd._id} animation={fade} />
    </div>
  );
}

export function BannerAds({section}: {section: string}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  console.log(section, 'settt');
  const shouldQuery = Boolean(section);

  const {data, isLoading} = useQuery({
    queryKey: ['bannerAds', section],
    queryFn: () => adService.getBannerAds(section),
    // refetchInterval: 60000,
    refetchInterval: 15000,
    enabled: shouldQuery,
  });

  console.log(data, 'banner ads');

  // Local rotation every 15s

  if (isLoading) return null;
  if (!data?.ads.length) return null;

  const currentAd = data.ads[0]; // backend returns one ad at a time

  console.log(currentAd, 'currentAdd');
  return (
    <div className="p-4 border-b border-app-border">
      <BannerAd ad={currentAd} key={currentAd._id} animation={fade} />
    </div>
  );
}
