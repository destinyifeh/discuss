'use client';

import {PageHeader} from '@/components/app-headers';
import {LoadingMore, LoadMoreError} from '@/components/feedbacks';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import {MobileBottomTab} from '@/components/layouts/dashboard/mobile-bottom-tab';
import UserCommentCard from '@/components/post/comments/user-comment-card';
import PostCard from '@/components/post/post-card';
import PostSkeleton from '@/components/skeleton/post-skeleton';
import ProfileSkeleton from '@/components/skeleton/profile-skeleton';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {usePostStore} from '@/hooks/stores/use-post-store';
import {normalizeDomain} from '@/lib/formatter';
import {useInfiniteQuery} from '@tanstack/react-query';
import {ArrowUp, Calendar, Link as LinkIcon, Settings} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import {useParams, useRouter, useSearchParams} from 'next/navigation';
import {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {userService} from '../actions/user.actions';

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

      {tab === 'mentions' && (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No mentions yet</h2>
          <p className="text-app-gray">
            When{' '}
            {isOwnProfile
              ? 'when someone mention you'
              : 'this user is mentioned'}
            , they'll show up here.
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
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const lastScrollTop = useRef(0);
  const {resetCommentSection} = usePostStore(state => state);

  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  useEffect(() => {
    if (ref === 'mentions') {
      setActiveTab('mentions');
    }
    if (ref === 'likes') {
      setActiveTab('likes');
    }
    setMounted(true);
    resetCommentSection();
  }, []);

  const {
    data, // This 'data' contains { pages: [], pageParams: [] }
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching, // Combines isFetching and isFetchingNextPage
    status,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['user-profile-posts', activeTab],
    queryFn: ({pageParam = 1}) =>
      userService.getUserPosts(pageParam, 10, activeTab),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    retry: 1,
  });

  const userData = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('user posts dataa', userData);

  const isNotCurrentUser = user !== currentUser?.username;

  if (!mounted) {
    return <ProfileSkeleton />;
  }

  if (mounted && isNotCurrentUser) {
    return <ErrorFeedback showGoBack message="Unauthorized access." />;
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

  const handleFetchNext = async () => {
    try {
      setFetchNextError(null);
      await fetchNextPage();
    } catch (err) {
      setFetchNextError('Failed to load more content.');
    }
  };

  return (
    <div>
      <div className="pb-15 lg:pb-0">
        <Virtuoso
          className="custom-scrollbar"
          style={{height: '100vh'}}
          totalCount={totalCount}
          data={userData}
          onScroll={handleScroll}
          ref={virtuosoRef}
          components={{
            Header: () => (
              <Fragment>
                <PageHeader
                  title={currentUser?.username}
                  description={`${totalCount} ${activeTab}`}
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
                  <TabsList className="w-full grid grid-cols-4 bg-transparent">
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
                    <TabsTrigger
                      value="mentions"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                      Mentions
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </Fragment>
            ),
            EmptyPlaceholder: () =>
              status === 'error' ? null : <PostPlaceholder tab={activeTab} />,
            Footer: () =>
              status === 'error' ? (
                <ErrorFeedback
                  showRetry
                  onRetry={refetch}
                  message="We encountered an unexpected error. Please try again"
                  variant="minimal"
                />
              ) : isFetchingNextPage ? (
                <LoadingMore />
              ) : fetchNextError ? (
                <LoadMoreError
                  fetchNextError={fetchNextError}
                  handleFetchNext={handleFetchNext}
                />
              ) : null,
          }}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              handleFetchNext();
            }
          }}
          itemContent={(index, post) => {
            if (status === 'pending') {
              return <PostSkeleton />;
            }

            if (!post) return null;

            const key = post._id || `${activeTab}-${index}`;

            if (activeTab === 'replies' && post.commentBy?.username) {
              return (
                <UserCommentCard key={key} comment={post} isFrom="replies" />
              );
            }

            if (activeTab === 'mentions' && post?.quotedComment?.quotedUser) {
              return (
                <UserCommentCard key={key} comment={post} isFrom="mentions" />
              );
            }

            if (post.user?._id) {
              return <PostCard key={key} post={post} />;
            }

            return <PostSkeleton />;
          }}
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
