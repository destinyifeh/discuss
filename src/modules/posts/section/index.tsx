'use client';

import {SectionHeader} from '@/components/app-headers';
import {SectionNotFound} from '@/components/app-not-founds';
import {SectionPostList} from '@/components/post/post-list';

import {Sections} from '@/constants/data';
import {useParams} from 'next/navigation';

export const SectionPage = () => {
  const {section: theSection} = useParams<{section: string}>();

  const section = Sections.find(cat => cat.name.toLowerCase() === theSection);

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
