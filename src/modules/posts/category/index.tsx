'use client';

import {AppSponsoredAd} from '@/components/ad/ad-card';
import {AppBannerAd} from '@/components/ad/banner';
import {PostCard} from '@/components/post/post-card';
import {Button} from '@/components/ui/button';
import {Categories, Posts} from '@/constants/data';
import {ChevronLeft, PlusCircle} from 'lucide-react';
import Link from 'next/link';
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
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">
          Category not found{theCategory}
        </h2>
        <Button variant="outline" onClick={() => navigate.push('/explore')}>
          Back to Explore
        </Button>
      </div>
    );
  }

  const isAdvertiseCategory = theCategory === 'advertise';

  return (
    <div>
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-app-border">
        <div className="px-4 py-3 flex flex-col">
          <div className="flex items-start gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate.back()}
              className="mt-1">
              <ChevronLeft />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">{category.name}</h1>
              <p className="text-app-gray text-sm">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <AppBannerAd category={category.name.toLowerCase()} />
      </div>

      {isAdvertiseCategory && (
        <div className="p-6 border-b border-app-border bg-app-hover">
          <h2 className="text-lg font-bold mb-2">Advertise on our platform</h2>
          <p className="text-app-gray mb-4">
            Reach our community with targeted advertising. Create your first ad
            today!
          </p>
          <Link
            href="/advertise"
            className="flex items-center gap-2 text-app hover:underline">
            <PlusCircle size={18} />
            Create ad here
          </Link>
        </div>
      )}

      <div>
        <AppSponsoredAd category="home" />
      </div>

      {sortedPosts.length > 0 ? (
        <div className="divide-y divide-app-border">
          {sortedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No posts yet</h2>
          <p className="text-app-gray">
            Be the first to post in this category!
          </p>
          <Button
            className="mt-4 bg-app hover:bg-app/90"
            onClick={() => navigate.push('/create')}>
            Create Post
          </Button>
        </div>
      )}
    </div>
  );
};
