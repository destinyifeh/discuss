'use client';

import {HomePostList} from '@/components/post/post-list';
import {Posts} from '@/constants/data';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
export const HomePage = () => {
  const [activeTab, setActiveTab] = useState('for-you');

  const navigate = useRouter();
  const [user] = useState({following: ['2']});
  // Sort posts by timestamp (newest first)
  const sortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  // Filter posts for the "Following" tab - only show posts from users the current user is following
  const followingPosts = sortedPosts.filter(
    post => user.following && user.following.includes(post.userId),
  );

  return <HomePostList />;
};
