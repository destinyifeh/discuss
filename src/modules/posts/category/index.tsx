'use client';

import {SectionHeader} from '@/components/app-headers';
import {SectionNotFound} from '@/components/app-not-founds';
import {CategoryPostList} from '@/components/post/post-list';
import {Categories, Posts} from '@/constants/data';
import {useParams, useRouter} from 'next/navigation';

export const CategoryPage = () => {
  const {category: theCategory} = useParams<{category: string}>();

  const navigate = useRouter();

  const category = Categories.find(
    cat => cat.name.toLowerCase() === theCategory,
  );
  const categoryPosts = Posts.filter(p => p.category === theCategory);

  // Sort posts by timestamp (newest first)
  const sortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  if (!category) {
    return <SectionNotFound section={theCategory} />;
  }

  return (
    <div>
      <SectionHeader title={category.name} description={category.description} />

      <CategoryPostList
        adCategory="home"
        bannerAd={category.name.toLowerCase()}
      />
    </div>
  );
};
