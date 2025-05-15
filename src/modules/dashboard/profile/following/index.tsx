'use client';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';

export const UserFollowingPage = () => {
  const {user} = useParams<{user: string}>();

  const navigate = useRouter();

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
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">User not found</h2>
        <Button variant="outline" onClick={() => navigate.push('/home')}>
          Back to Home
        </Button>
      </div>
    );
  }

  // Get all the mock users to find who this user follows
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

  const followingUsers = allUsers.filter(u =>
    profileUser.following.includes(u.id),
  );
  const isOwnProfile = user === profileUser.username;

  return (
    <div>
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-app-border">
        <div className="px-4 py-3 flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => navigate.back()}>
            <ChevronLeft />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Following</h1>
            <p className="text-sm text-app-gray">{profileUser.displayName}</p>
          </div>
        </div>
      </div>

      {followingUsers.length > 0 ? (
        <div className="divide-y divide-app-border">
          {followingUsers.map(followedUser => {
            const isFollowing = profileUser.following.includes(followedUser.id);
            const isCurrentUser = user === followedUser.username;

            return (
              <div
                key={followedUser.id}
                className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Link href={`/profile/${followedUser.username}`}>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={followedUser.avatar} />
                      <AvatarFallback>
                        {followedUser.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold cursor-pointer">
                        {followedUser.displayName}
                      </h3>
                      <p className="text-app-gray">@{followedUser.username}</p>
                    </div>
                  </Link>
                </div>
                {!isCurrentUser && (
                  <Button
                    className={`rounded-full ${
                      isFollowing
                        ? 'bg-transparent text-black border border-gray-300 hover:bg-gray-100 hover:text-black'
                        : 'bg-app text-white hover:bg-app/90'
                    }`}
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
          <h2 className="text-xl font-bold mb-2">
            {isOwnProfile ? "You aren't" : "This user isn't"} following anyone
            yet
          </h2>
          {isOwnProfile && (
            <Button
              className="mt-4 bg-app hover:bg-app/90"
              onClick={() => navigate.push('/explore')}>
              Find people to follow
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
