'use client';

import {SectionHeader} from '@/components/app-headers';
import {SectionNotFound} from '@/components/app-not-founds';
import {SectionPostList} from '@/components/post/post-list';
import CategorySkeleton from '@/components/skeleton/category-skeleton';

import {Sections} from '@/constants/data';
import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';

type SectionPageProps = {
  params: {
    section: string;
  };
};
export const SectionPage = ({params}: SectionPageProps) => {
  //  const {section} = params;
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
      <SectionHeader title={section.name} description={section.description} />

      <SectionPostList
        section={section.name}
        adSection="home"
        bannerAd={section.name.toLowerCase()}
      />
    </div>
  );
};
