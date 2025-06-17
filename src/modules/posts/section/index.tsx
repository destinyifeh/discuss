'use client';

import {SectionHeader} from '@/components/app-headers';
import {SectionNotFound} from '@/components/app-not-founds';
import {SectionPostList} from '@/components/post/post-list';
import CategorySkeleton from '@/components/skeleton/category-skeleton';

import {Sections} from '@/constants/data';
import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';

export const SectionPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {section: theSection} = useParams<{section: string}>();

  const section = Sections.find(cat => cat.name.toLowerCase() === theSection);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 800);
  }, [section]);

  if (isLoading) {
    return <CategorySkeleton />;
  }

  if (!section) {
    return <SectionNotFound section={theSection} />;
  }

  return (
    <div>
      <SectionHeader title={section.name} description={section.description} />

      <SectionPostList adSection="home" bannerAd={section.name.toLowerCase()} />
    </div>
  );
};
