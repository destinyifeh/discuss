'use client';

import {PageHeader} from '@/components/app-headers';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {cn} from '@/lib/utils';
import clsx from 'clsx';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';

export const UserFollowersPage = () => {
  const {user} = useParams<{user: string}>();
  const navigate = useRouter();
  const {theme} = useGlobalStore(state => state);

  if (!user) return null;

  // Find the user profile (using our mock data, in real app would fetch from backend)
  const profileUser = [
    {
      id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      following: ['2', '3'],
      followers: ['2'],
      verified: true,
    },
    {
      id: '2',
      username: 'janedoe',
      displayName: 'Jane Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      following: ['1'],
      followers: ['1', '3'],
      verified: false,
    },
    {
      id: '3',
      username: 'theresatekenah',
      displayName: 'Theresa Tekenah',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Theresa',
      following: ['2'],
      followers: ['1'],
      verified: true,
    },
  ].find(u => u.username === user);

  if (!profileUser) {
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

  // Get all the mock users to find who follows this user
  const allUsers = [
    {
      id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
    {
      id: '2',
      username: 'janedoe',
      displayName: 'Jane Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    },
    {
      id: '3',
      username: 'theresatekenah',
      displayName: 'Theresa Tekenah',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Theresa',
    },
  ];

  const followerUsers = allUsers.filter(u =>
    profileUser.followers.includes(u.id),
  );
  const isOwnProfile = user === profileUser.username;

  return (
    <div>
      <PageHeader title="Followers" description={profileUser.displayName} />

      {followerUsers.length > 0 ? (
        <div
          className={clsx('divide-y', {
            'divide-app-border': theme.type === 'default',
            'divide-app-dark-border': theme.type === 'dark',
          })}>
          {followerUsers.map(follower => {
            const isFollowing = profileUser.following.includes(follower.id);
            const isCurrentUser = user === follower.username;

            return (
              <div
                key={follower.id}
                className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Link href={`/profile/${follower.username}`}>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={follower.avatar} />
                      <AvatarFallback>
                        {follower.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold cursor-pointer">
                        {follower.displayName}
                      </h3>
                      <p className="text-app-gray">@{follower.username}</p>
                    </div>
                  </Link>
                </div>
                {!isCurrentUser && (
                  <Button
                    className={cn(
                      'rounded-full',
                      isFollowing
                        ? 'bg-transparent text-black border border-gray-300 hover:bg-gray-100 hover:text-black'
                        : 'bg-app text-white hover:bg-app/90',
                      theme.type === 'dark' &&
                        !isFollowing &&
                        'bg-app/90 text-white hover:bg-app',
                      theme.type === 'dark' &&
                        isFollowing &&
                        'border-app-dark-border bg-app-dark-bg/10 text-white',
                    )}
                    size="sm">
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No followers yet</h2>
          {isOwnProfile && (
            <p className="text-app-gray">
              When people follow you, they'll show up here.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
