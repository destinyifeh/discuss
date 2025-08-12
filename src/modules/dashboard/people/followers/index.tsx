'use client';

import {PageHeader} from '@/components/app-headers';
import {FallbackMessage} from '@/components/fallbacks';
import FollowersSkeleton from '@/components/skeleton/followers-skeleton';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {cn} from '@/lib/utils';
import {UserProps} from '@/types/user.types';
import {useMutation, useQuery} from '@tanstack/react-query';
import {ArrowUp} from 'lucide-react';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';
import {useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {userService} from '../../actions/user.actions';

export const UserFollowersPage = () => {
  const {user} = useParams<{user: string}>();
  const {currentUser, setUser} = useAuthStore(state => state);
  const [showGoUp, setShowGoUp] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const navigate = useRouter();

  const {mutate} = useMutation({
    mutationFn: userService.followUserRequestAction,
  });

  const shouldQuery = !!user;
  const {
    isLoading,
    error,
    data: userData,
  } = useQuery({
    queryKey: ['followers', user],
    queryFn: () => userService.getFollowersRequestAction(user),
    retry: false,
    enabled: shouldQuery,
  });
  console.log(shouldQuery, 'should query', error);

  console.log(userData, 'should query dataa');

  if (error?.message === 'User not found' || !user) {
    return (
      <FallbackMessage
        message="User not found"
        buttonText="Back to Home"
        page="/home"
      />
    );
  }

  if (isLoading) {
    return <FollowersSkeleton />;
  }

  if (userData?.code !== '200') {
    return (
      <FallbackMessage
        message="Oops! Something went wrong"
        buttonText="Back to Home"
        page="/home"
      />
    );
  }

  const isOwnProfile = user === currentUser?.username;
  const userId = userData?.userId;

  console.log(isOwnProfile, userId, 'isF-isOwn');

  const handleFollowUser = (id: string) => {
    setIsPending(true);
    mutate(id, {
      onSuccess(response, variables, context) {
        console.log(response, 'datameee');

        const {message, currentUserFollowings} = response.data;

        setUser({
          ...(currentUser as UserProps),
          following: currentUserFollowings,
        });
        toast.success(message);
      },

      onError(error: any, variables, context) {
        console.log(error, 'err');
        const {message} = error?.response?.data ?? {};
        toast.error(message);
      },
      onSettled(data, error, variables, context) {
        setIsPending(false);
      },
    });
  };

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
  };

  return (
    <div>
      <PageHeader
        title="Followers"
        description={user.charAt(0).toUpperCase() + user.slice(1)}
      />

      <Virtuoso
        className="custom-scrollbar min-h-screen  divide-y divide-app-border"
        // style={{height: '100vh'}}
        data={userData.followers}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          EmptyPlaceholder: () => (
            <div className="p-8 text-center">
              <h2 className="text-xl font-bold mb-2">No followers yet</h2>
              {isOwnProfile && (
                <p className="text-app-gray">
                  When people follow you, they'll show up here.
                </p>
              )}
            </div>
          ),
        }}
        //endReached={fetchMore}
        itemContent={(index, follower) => {
          const isCurrentUser = currentUser?.username === follower.username;
          console.log({
            isCurrentUser,
            user,
            fol: follower,
            id: follower._id,
          });

          const isFollowing = currentUser?.following?.includes(
            follower._id?.toString(),
          );

          return (
            <div
              key={follower._id}
              className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Link href={`/user/${follower.username}`}>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={follower.avatar} />
                    <AvatarFallback>
                      {follower.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold cursor-pointer capitalize">
                      {follower.username}
                    </h3>
                  </div>
                </Link>
              </div>
              {!isCurrentUser && (
                <Button
                  onClick={() => handleFollowUser(follower._id)}
                  disabled={isPending}
                  className={cn(
                    'rounded-full',
                    isFollowing
                      ? 'bg-transparent text-black border border-gray-300 hover:bg-gray-100 hover:text-black dark:text-white'
                      : 'bg-app text-white hover:bg-app/90',
                  )}
                  size="sm">
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}

              {isCurrentUser && (
                <Button
                  disabled={true}
                  className={cn(
                    'rounded-full',
                    'bg-transparent text-black border border-gray-300 hover:bg-gray-100 hover:text-black dark:text-white',
                  )}
                  size="sm">
                  You
                </Button>
              )}
            </div>
          );
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
  );
};
