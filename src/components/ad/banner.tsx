'use client';

import {mockAds} from '@/constants/data';
import {useAdStore} from '@/hooks/stores/use-ad-store';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {useAdManger} from '@/hooks/use-ad-manager';
import {shuffleArray} from '@/lib/helpers';
import {cn} from '@/lib/utils';
import {AdProps} from '@/types/ad-types';
import {ExternalLink} from 'lucide-react';
import Image from 'next/image';
import {useEffect, useState} from 'react';

export interface BannerAdProps {
  ad: AdProps;
  size?: 'small' | 'medium' | 'large';
  position?: 'top' | 'middle' | 'bottom';
  className?: string;
}

// Mock data for demonstration purposes
const mockBannerAds = [
  {
    id: 'banner1',
    imageUrl:
      'https://media.istockphoto.com/id/1316524516/photo/modern-large-luxury-dark-gray-kitchen-closeup.jpg?s=612x612&w=0&k=20&c=FtLMlE9VzOx5o8Vq0H_5xMZ8dDj5MsG0q5NVWSPlVzU=',
    targetUrl: 'https://example.com/luxury-kitchens',
    altText: 'Luxury Kitchen Designs - 30% Off',
  },
  {
    id: 'banner2',
    imageUrl:
      'https://images.ctfassets.net/hrltx12pl8hq/4kzWG72Pi925q9Gtc6hBQh/6bdbb560251e188bab5d3ea1ad195d6b/1.jpg',
    targetUrl: 'https://example.com/gadgets',
    altText: 'New Tech Gadgets',
  },
  {
    id: 'banner3',
    imageUrl:
      'https://images.ctfassets.net/hrltx12pl8hq/4kzWG72Pi925q9Gtc6hBQh/6bdbb560251e188bab5d3ea1ad195d6b/1.jpg',
    targetUrl: 'https://example.com/travel',
    altText: 'Travel Deals',
  },
  {
    id: 'banner4',
    imageUrl:
      'https://images.ctfassets.net/hrltx12pl8hq/4kzWG72Pi925q9Gtc6hBQh/6bdbb560251e188bab5d3ea1ad195d6b/1.jpg',
    targetUrl: 'https://example.com/courses',
    altText: 'Online Courses - Learn New Skills',
  },
];

export function BannerAd({
  ad,
  size = 'medium',
  position,
  className,
}: BannerAdProps) {
  const {theme} = useGlobalStore(state => state);
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
        <div className="relative h-full w-full">
          <Image
            src={ad.imageUrl || '/placeholder.svg'}
            alt={ad.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/10 group-hover:opacity-100">
            <ExternalLink className="h-6 w-6 text-white drop-shadow-lg" />
          </div>
        </div>
      </a>
    </div>
  );
}

export function AppBannerAd3({section}: {section: string}) {
  const bannerAds = shuffleArray(
    mockAds.filter(ad => ad.type === 'Banner' && ad.section === section),
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
    ad => ad.type === 'Banner' && ad.section === section,
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
    ad => ad.type === 'Banner' && ad.section === section,
    10000, // 10s interval
  );

  if (!ad) return null;

  return (
    <div className="p-4 border-b border-app-border">
      <BannerAd ad={ad} />
    </div>
  );
}
