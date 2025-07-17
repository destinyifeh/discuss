'use client';

import {PageHeader} from '@/components/app-headers';
import PostCard from '@/components/post/post-card';
import ProfileSkeleton from '@/components/skeleton/profile-skeleton';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Textarea} from '@/components/ui/textarea';
import {Posts} from '@/constants/data';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {queryClient} from '@/lib/client/query-client';
import {normalizeDomain} from '@/lib/formatter';
import {cn} from '@/lib/utils';
import {PostProps} from '@/types/post-item.type';
import {UserProps} from '@/types/user.types';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowUp,
  Calendar,
  Link as LinkIcon,
  Mail,
} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';
import {Fragment, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {toast} from 'sonner';
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
    </div>
  );
};

export const PeoplePage = () => {
  const {user} = useParams<{user: string}>();

  const {currentUser, setUser} = useAuthStore(state => state);
  const [activeTab, setActiveTab] = useState('posts');
  const [showGoUp, setShowGoUp] = useState(false);
  const navigate = useRouter();
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [isPending, setIsPending] = useState(false);

  const {mutate} = useMutation({
    mutationFn: userService.followUserRequestAction,
  });
  // Find the user profile (using our mock data, in real app would fetch from backend)

  const shouldQuery = !!user;
  const {
    isLoading,
    error,
    data: userData,
  } = useQuery({
    queryKey: ['user', user],
    queryFn: () => userService.getUserByUsername(user),
    retry: false,
    enabled: shouldQuery,
  });
  console.log(shouldQuery, 'should query', error);

  console.log(userData, 'should query dataa');

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
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error?.message === 'User not found') {
    return (
      <div>
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">User not found</h2>
          <Button variant="outline" onClick={() => navigate.push('/home')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (userData?.code !== '200') {
    return (
      <div>
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
          <Button variant="outline" onClick={() => navigate.push('/home')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleReportUser = () => {
    toast.success('Report submitted. Our team will review it shortly.');
  };

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
  };

  const {
    username,
    avatar,
    cover_avatar,
    createdAt,
    followers,
    following,
    website,
    bio,
    email,
    _id,
  } = userData.user;

  const isOwnProfile = username === currentUser?.username;

  const isFollowing = currentUser?.following?.includes(_id?.toString());

  console.log(followers, 'datameeefollowers');
  console.log(following, 'datameeelowing');
  console.log(
    currentUser?.following,
    'cyurrrrreeellowers',
    isFollowing,
    currentUser?._id,
    _id,
  );
  const handleEmailNavigation = () => {
    navigate.push(`/email/${username}`);
  };

  const handleFollowUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPending(true);
    mutate(_id, {
      onSuccess(response, variables, context) {
        console.log(response, 'datameee');

        const {
          currentUserFollowers,
          currentUserFollowings,
          message,
          isFollowing,
          following,
          followers,
        } = response.data;

        setUser({
          ...(currentUser as UserProps),
          following: currentUserFollowings,
        });

        // Invalidate the cached user data
        //queryClient.invalidateQueries({queryKey: ['user', username]});
        queryClient.setQueryData(['user', username], (oldData: any) => ({
          ...oldData,
          user: {
            ...oldData.user,
            followers,
            following,
          },
        }));

        toast.success(message);
      },

      onError(error, variables, context) {
        console.log(error, 'err');
      },
      onSettled(data, error, variables, context) {
        setIsPending(false);
      },
    });
  };
  return (
    <div className="pb-10">
      <PageHeader title={username} description={`${userPosts.length} posts`} />

      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        data={data}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => (
            <Fragment>
              <div className="border-b overflow-y-auto border-app-border">
                <div className="h-40 bg-app/20 relative overflow-hidden">
                  {cover_avatar ? (
                    <img
                      src={cover_avatar}
                      alt="Cover avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="px-4 pb-4">
                  <div className="flex justify-between relative">
                    <div className="w-24 h-24 rounded-full absolute -top-12">
                      <Avatar className="h-24 w-24 border-4 border-white">
                        <AvatarImage src={avatar ?? undefined} />
                        <AvatarFallback className="capitalize text-app text-3xl">
                          {username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1"></div>
                    {!isOwnProfile && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={handleFollowUser}
                          disabled={isPending}
                          className={cn(
                            'rounded-full',
                            isFollowing
                              ? 'bg-transparent text-black border border-gray-300 hover:bg-gray-100 hover:text-black dark:text-white'
                              : 'bg-app text-white hover:bg-app/90',
                          )}>
                          {isFollowing ? 'Following' : 'Follow'}
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-full"
                          onClick={handleEmailNavigation}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full text-red-500 hover:bg-red-50 hover:text-red-600">
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="capitalize">
                                Report {username}
                              </DialogTitle>
                              <DialogDescription>
                                Please provide details about why you're
                                reporting this user. Our moderation team will
                                review your report.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <label
                                htmlFor="reason"
                                className="block text-sm font-medium mb-1">
                                Reason for reporting:
                              </label>
                              <select
                                id="reason"
                                className="w-full mb-4 p-2 border border-gray-300 rounded-md form-input">
                                <option value="spam">Spam</option>
                                <option value="harassment">Harassment</option>
                                <option value="misinformation">
                                  Misinformation
                                </option>
                                <option value="hate_speech">Hate speech</option>
                                <option value="other">Other</option>
                              </select>

                              <label
                                htmlFor="details"
                                className="block text-sm font-medium mb-1">
                                Details:
                              </label>
                              <Textarea
                                id="details"
                                placeholder="Please provide additional details..."
                                className="min-h-[100px] form-input"
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button
                                onClick={handleReportUser}
                                className="text-white bg-red-600 hover:bg-red-700  dark:bg-red-700 dark:hover:bg-red-600">
                                Submit Report
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>

                  <div className="mt-16">
                    <h2 className="font-bold text-xl capitalize">{username}</h2>

                    <div className="mt-3 text-app-gray">
                      <div className="space-y-1">
                        {bio && (
                          <div className="flex items-center gap-2">
                            {/* <MapPin size={16} /> */}
                            <p className="text-base text-foreground">{bio}</p>
                          </div>
                        )}
                        {website && (
                          <div className="flex items-center gap-2">
                            <LinkIcon size={16} />
                            <Link href={website} className="text-app">
                              {normalizeDomain(website)}
                            </Link>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>
                            Joined {moment(createdAt).format('MMMM YYYY')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-3">
                      <Link
                        className="flex items-center gap-1 cursor-pointer hover:underline"
                        href={`/user/${username}/following`}>
                        <span className="font-bold">
                          {following?.length ?? 0}
                        </span>
                        <span className="text-app-gray">Following</span>
                      </Link>
                      <Link
                        className="flex items-center gap-1 cursor-pointer hover:underline"
                        href={`/user/${username}/followers`}>
                        <span className="font-bold">
                          {followers?.length ?? 0}
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
  );
};
