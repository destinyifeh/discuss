'use client';

import {PostCard} from '@/components/post/post-card';
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
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Textarea} from '@/components/ui/textarea';
import {Posts} from '@/constants/data';
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  Link as LinkIcon,
  Mail,
  MapPin,
  MessageSquare,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';
import {useState} from 'react';
import {toast} from 'sonner';

export const ProfilePage = () => {
  const {user} = useParams<{user: string}>();
  const [users] = useState({username: 'dez'});

  const navigate = useRouter();

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
      username: 'gamerpro',
      displayName: 'Theresa Tekenah',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Theresa',
      following: ['2'],
      followers: ['1'],
      verified: true,
    },
  ].find(u => u.username === user);

  // Get posts by this user
  const userPosts = Posts.filter(post => post.username === user);

  // Sort posts by timestamp (newest first)
  const sortedPosts = [...userPosts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

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

  const isOwnProfile = user === profileUser.username;
  const userFollowing = profileUser.following || [];
  const isFollowing = userFollowing.includes(profileUser.id);

  const handleReportUser = () => {
    toast.success('Report submitted. Our team will review it shortly.');
  };

  return (
    <div>
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-app-border">
        <div className="px-4 py-3 flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            // onClick={() => navigate(-1)}
          >
            <ChevronLeft />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{profileUser.displayName}</h1>
            <p className="text-sm text-app-gray">{userPosts.length} posts</p>
          </div>
        </div>
      </div>

      <div className="border-b border-app-border overflow-y-auto">
        <div className="h-40 bg-app/20"></div>
        <div className="px-4 pb-4">
          <div className="flex justify-between relative">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-white absolute -top-12">
              <img
                src={profileUser.avatar}
                alt={profileUser.displayName}
                className="w-full h-full rounded-full"
              />
            </div>

            <div className="flex-1"></div>

            {isOwnProfile ? (
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => navigate.push(`/profile/${user}/edit`)}>
                  Edit profile
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => navigate.push('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => navigate.push(`/messages/${profileUser.id}`)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button
                  className={`rounded-full ${
                    isFollowing
                      ? 'bg-transparent text-black border border-gray-300 hover:bg-gray-100 hover:text-black'
                      : 'bg-app text-white hover:bg-app/90'
                  }`}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() =>
                    navigate.push(`/email/${profileUser.username}`)
                  }>
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
                      <DialogTitle>
                        Report {profileUser.displayName}
                      </DialogTitle>
                      <DialogDescription>
                        Please provide details about why you're reporting this
                        user. Our moderation team will review your report.
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
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md">
                        <option value="spam">Spam</option>
                        <option value="harassment">Harassment</option>
                        <option value="misinformation">Misinformation</option>
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
                        className="bg-red-600 hover:bg-red-700 text-white">
                        Submit Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          <div className="mt-16">
            <h2 className="font-bold text-xl">{profileUser.displayName}</h2>
            <p className="text-app-gray">@{profileUser.username}</p>

            <div className="mt-3 text-app-gray">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>New York, USA</span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon size={16} />
                  <Link href="#" className="text-app">
                    example.com
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Joined April 2023</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-3">
              <div
                className="flex items-center gap-1 cursor-pointer hover:underline"
                onClick={() =>
                  navigate.push(`/profile/${profileUser.username}/following`)
                }>
                <span className="font-bold">
                  {profileUser.following?.length || 0}
                </span>
                <span className="text-app-gray">Following</span>
              </div>
              <div
                className="flex items-center gap-1 cursor-pointer hover:underline"
                onClick={() =>
                  navigate.push(`/profile/${profileUser.username}/followers`)
                }>
                <span className="font-bold">
                  {profileUser.followers?.length || 0}
                </span>
                <span className="text-app-gray">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-transparent">
          <TabsTrigger
            value="posts"
            className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:text-black data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="replies"
            className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:text-black data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
            Replies
          </TabsTrigger>
          <TabsTrigger
            value="likes"
            className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:text-black data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
            Likes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          {sortedPosts.length > 0 ? (
            <div className="divide-y divide-app-border">
              {sortedPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
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
        </TabsContent>

        <TabsContent value="replies" className="mt-0">
          <div className="p-8 text-center">
            <h2 className="text-xl font-bold mb-2">No replies yet</h2>
            <p className="text-app-gray">
              When {isOwnProfile ? 'you reply' : 'this user replies'} to posts,
              they'll show up here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="likes" className="mt-0">
          <div className="p-8 text-center">
            <h2 className="text-xl font-bold mb-2">No likes yet</h2>
            <p className="text-app-gray">
              When {isOwnProfile ? 'you like' : 'this user likes'} posts,
              they'll show up here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
