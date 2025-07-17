'use client';

import {PageHeader} from '@/components/app-headers';
import {FallbackMessage} from '@/components/fallbacks';
import {MobileBottomTab} from '@/components/layouts/dashboard/mobile-bottom-tab';
import PostCard from '@/components/post/post-card';
import ProfileSkeleton from '@/components/skeleton/profile-skeleton';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Posts} from '@/constants/data';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {normalizeDomain} from '@/lib/formatter';
import {PostProps} from '@/types/post-item.type';
import {ArrowUp, Calendar, Link as LinkIcon, Settings} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';
import {Fragment, useEffect, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';

export const PostPlaceholder = ({
  tab,
  isOwnProfile = false,
}: {
  tab: string;
  isOwnProfile?: boolean;
}) => {
  const navigate = useRouter();

  return (
    <div className="p-8 text-center">
      {tab === 'posts' && (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No posts yet</h2>
          {isOwnProfile && (
            <Button
              className="mt-4 bg-app hover:bg-app/90"
              onClick={() => navigate.push('/create')}>
              Create your first post
            </Button>
          )}
        </div>
      )}

      {tab === 'replies' && (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No replies yet</h2>
          <p className="text-app-gray">
            When {isOwnProfile ? 'you reply' : 'this user replies'} to posts,
            they'll show up here.
          </p>
        </div>
      )}

      {tab === 'likes' && (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No likes yet</h2>
          <p className="text-app-gray">
            When {isOwnProfile ? 'you like' : 'this user likes'} posts, they'll
            show up here.
          </p>
        </div>
      )}
    </div>
  );
};

export const ProfilePage = () => {
  const {user} = useParams<{user: string}>();

  const {currentUser} = useAuthStore(state => state);
  const [activeTab, setActiveTab] = useState('posts');
  const [showGoUp, setShowGoUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [showBottomTab, setShowBottomTab] = useState(true);
  const [mounted, setMounted] = useState(false);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isNotCurrentUser = user !== currentUser?.username;

  if (!mounted) {
    return <ProfileSkeleton />;
  }

  if (mounted && isNotCurrentUser) {
    return (
      <FallbackMessage
        message="Unauthorized access."
        buttonText="Back to Home"
        page="/home"
      />
    );
  }

  // Get posts by this user
  const userPosts = Posts.filter(post => post.username === user);

  // Sort posts by timestamp (newest first)
  const sortedPosts = [...userPosts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  let data: PostProps[] | [];

  switch (activeTab) {
    case 'posts':
      data = sortedPosts;
      break;
    case 'replies':
    case 'likes':
      data = [];
      break;
    default:
      data = [];
  }

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;
    // Compare current scrollTop to previous value to determine direction
    if (scrollTop < lastScrollTop.current) {
      // Scrolling up
      setShowBottomTab(true);
    } else if (scrollTop > lastScrollTop.current) {
      // Scrolling down
      setShowBottomTab(false);
    }
    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  return (
    <div>
      <div className="pb-15 lg:pb-0">
        <Virtuoso
          className="custom-scrollbar"
          style={{height: '100vh'}}
          data={data}
          onScroll={handleScroll}
          ref={virtuosoRef}
          components={{
            Header: () => (
              <Fragment>
                <PageHeader
                  title={currentUser?.username}
                  description={`${userPosts.length} posts`}
                />

                <div className="border-b overflow-y-auto border-app-border">
                  <div className="h-40 bg-app/20 relative overflow-hidden">
                    {currentUser?.cover_avatar ? (
                      <img
                        src={currentUser.cover_avatar}
                        alt="Cover avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  {/* <div className="h-40 bg-app/20"></div> */}
                  <div className="px-4 pb-4">
                    <div className="flex justify-between relative">
                      <div className="w-24 h-24 rounded-full absolute -top-12">
                        <Avatar className="h-24 w-24 border-4 border-white">
                          <AvatarImage src={currentUser?.avatar ?? undefined} />
                          <AvatarFallback className="capitalize text-app text-3xl">
                            {currentUser?.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1"></div>

                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          className="rounded-full border-app-border"
                          onClick={() =>
                            navigate.push(`/profile/${user}/edit`)
                          }>
                          Edit profile
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-full border-app-border"
                          onClick={() => navigate.push('/settings')}>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      </div>
                    </div>

                    <div className="mt-16">
                      <h2 className="font-bold text-xl capitalize">
                        {currentUser?.username}
                      </h2>
                      {/* <p className="text-app-gray">@{profileUser.username}</p> */}

                      <div className="mt-3 text-app-gray">
                        <div className="space-y-1">
                          {currentUser?.bio && (
                            <div className="flex items-center gap-2">
                              {/* <MapPin size={16} /> */}
                              <p className="text-base text-foreground">
                                {currentUser.bio}
                              </p>
                            </div>
                          )}
                          {currentUser?.website && (
                            <div className="flex items-center gap-2">
                              <LinkIcon size={16} />
                              <Link
                                href={currentUser?.website}
                                className="text-app">
                                {normalizeDomain(currentUser?.website)}
                              </Link>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>
                              Joined{' '}
                              {moment(currentUser?.createdAt).format(
                                'MMMM YYYY',
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-3">
                        <Link
                          className="flex items-center gap-1 cursor-pointer hover:underline"
                          href={`/profile/${currentUser?.username}/following`}>
                          <span className="font-bold">
                            {currentUser?.following?.length}
                          </span>
                          <span className="text-app-gray">Following</span>
                        </Link>
                        <Link
                          className="flex items-center gap-1 cursor-pointer hover:underline"
                          href={`/profile/${currentUser?.username}/followers`}>
                          <span className="font-bold">
                            {currentUser?.followers?.length}
                          </span>
                          <span className="text-app-gray">Followers</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <Tabs
                  defaultValue="posts"
                  className="w-full"
                  value={activeTab}
                  onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-3 bg-transparent">
                    <TabsTrigger
                      value="posts"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                      Posts
                    </TabsTrigger>
                    <TabsTrigger
                      value="replies"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                      Replies
                    </TabsTrigger>
                    <TabsTrigger
                      value="likes"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                      Likes
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </Fragment>
            ),
            EmptyPlaceholder: () => <PostPlaceholder tab={activeTab} />,
          }}
          //endReached={fetchMore}
          itemContent={(index, post) => (
            <div>
              <PostCard post={post} />
            </div>
          )}
        />

        {showGoUp && (
          <button
            onClick={() => {
              virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
            }}
            className="fixedBottomBtn z-1 fixed bottom-6 right-5 lg:right-[calc(50%-24rem)] bg-app text-white p-2 rounded-full shadow-lg hover:bg-app/90 transition">
            <ArrowUp size={20} />
          </button>
        )}
      </div>
      {showBottomTab && <MobileBottomTab />}
    </div>
  );
};
