'use client';

import {SectionHeader} from '@/components/app-headers';
import {SectionNotFound} from '@/components/app-not-founds';
import {SectionPostList} from '@/components/post/post-list';

import {Posts, Sections} from '@/constants/data';
import {useParams, useRouter} from 'next/navigation';

export const SectionPage = () => {
  const {section: theSection} = useParams<{section: string}>();

  const navigate = useRouter();

  const section = Sections.find(cat => cat.name.toLowerCase() === theSection);
  const sectionPosts = Posts.filter(p => p.section === theSection);

  // Sort posts by timestamp (newest first)
  const sortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

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
