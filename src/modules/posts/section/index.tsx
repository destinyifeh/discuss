'use client';

import {SectionNotFound} from '@/components/app-not-founds';
import {SectionPostList} from '@/components/post/post-list';
import CategorySkeleton from '@/components/skeleton/category-skeleton';

import {Sections} from '@/constants/data';
import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';

export const SectionPage = () => {
  const {section: theSection} = useParams<{section: string}>();
  const [mounted, setMounted] = useState(false);
  const section = Sections.find(cat => cat.name.toLowerCase() === theSection);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <CategorySkeleton />;
  }

  if (!section) {
    return <SectionNotFound section={theSection} />;
  }

  return (
    <div>
      <SectionPostList
        section={section.name}
        bannerAd={section.name.toLowerCase()}
        description={section.description as string}
        title={section.name as string}
      />
    </div>
  );
};
