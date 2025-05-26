'use client';
import CommunityGuidelines from '@/components/post/community-guidelines';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {Categories, Posts} from '@/constants/data';
import {PostProps} from '@/types/post-item.type';
import {FileImage, SmileIcon, Trash2, Video} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {toast} from 'sonner';

export const CreatePostPage = () => {
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [postToEdit, setPostToEdit] = useState<any>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [posts, setPosts] = useState<PostProps[]>([]);
  const navigate = useRouter();
  const location = useSearchParams();

  // Check if we're editing an existing post
  useEffect(() => {
    // const postId = location.state?.postId;
    const postId = location.get('postId');
    if (postId) {
      const post = Posts.find(p => p.id === postId);
      if (post) {
        setIsEditing(true);
        setPostToEdit(post);
        setContent(post.content);
        setSelectedCategory(post.categoryId);
        setImageUrls(post.images || []);
        setVideoUrls(post.links || []);
      }
    }
  }, [location, Posts]);

  const addPost = (
    post: Omit<
      PostProps,
      'id' | 'timestamp' | 'likes' | 'reposts' | 'bookmarks'
    >,
  ) => {
    const newPost: PostProps = {
      id: '2',
      timestamp: new Date(),
      likes: 0,
      reposts: 0,
      bookmarks: 0,
      ...post,
    };
    setPosts([...posts, newPost]);
  };

  const user = {
    id: '1',
    username: 'johndoe',
    displayName: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    verified: true,
    bio: 'Tech enthusiast and coffee lover',
    followers: ['4', '3', '5'],
    following: ['1', '2', '3'],
    joined: new Date('2022-03-15'),
    email: 'john@example.com',
  };

  const updatePost = (updatedPost: PostProps) => {
    setPosts(prevPosts =>
      prevPosts.map(post => (post.id === updatedPost.id ? updatedPost : post)),
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (imageUrls.length + files.length > 4) {
      toast.error('You can only upload a maximum of 4 images');
      return;
    }

    // For demo, we'll just use file names as URLs
    // In a real app, you would upload to a server/storage
    Array.from(files).forEach(file => {
      // Create a blob URL for the image
      const imageUrl = URL.createObjectURL(file);
      console.log(imageUrl, 'imagerrrr');
      setImageUrls(prev => [...prev, imageUrl]);
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = [...imageUrls];
    updatedImages.splice(index, 1);
    setImageUrls(updatedImages);
    toast.success('Image removed successfully');
  };

  const removeVideo = (index: number) => {
    const updatedVideos = [...videoUrls];
    updatedVideos.splice(index, 1);
    setVideoUrls(updatedVideos);
    toast.success('Video link removed successfully');
  };

  const handleSubmitPost = () => {
    if (!content.trim() || !selectedCategory) {
      toast.error('Please enter content and select a category.');
      return;
    }

    if (isEditing && postToEdit) {
      // Update existing post
      updatePost({
        ...postToEdit,
        content: content,
        categoryId: selectedCategory,
        images: imageUrls,
        links: videoUrls,
      });

      toast.success('Your post has been updated successfully.');
    } else {
      // Create new post
      addPost({
        userId: user!.id,
        username: user!.username,
        displayName: user!.displayName,
        avatar: user!.avatar,
        verified: user!.verified,
        content: content,
        title: content.split(' ').slice(0, 5).join(' ') + '...', // Generate title from content
        categoryId: selectedCategory,
        images: imageUrls,
        links: videoUrls,
      });

      toast.success('Your post has been published successfully.');
    }

    navigate.push('/home');
  };

  if (!user) return null;

  return (
    <div className="">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-app-border z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            {isEditing ? 'Edit Post' : 'Create Post'}
          </h1>

          <Button
            className="rounded-full bg-app hover:bg-app/90 md:hidden"
            onClick={handleSubmitPost}
            disabled={!content.trim() || !selectedCategory}>
            {isEditing ? 'Update' : 'Post'}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row md:gap-4">
          <Avatar className="h-10 w-10 md:h-12 md:w-12 mb-4 md:mb-0">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              placeholder="What's on your mind?"
              className="border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 min-h-20 px-3"
              value={content}
              onChange={e => setContent(e.target.value)}
            />

            {/* Hidden file input for image uploads */}
            <input
              type="file"
              accept="image/*"
              multiple
              ref={imageInputRef}
              onChange={handleImageUpload}
              className="hidden"
              max="4"
            />

            {/* Display image previews */}
            {imageUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden">
                    <img
                      src={url}
                      alt={`Post attachment ${index + 1}`}
                      className="w-full h-36 object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={() => removeImage(index)}>
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Video URL previews */}
            {videoUrls.length > 0 && (
              <div className="mt-3 space-y-2">
                {videoUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Video size={16} className="text-app shrink-0" />
                        <span className="truncate text-sm">{url}</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeVideo(index)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-app-border mt-4 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-app h-8 w-8 p-0"
                  onClick={() => {
                    if (imageUrls.length < 4) {
                      imageInputRef.current?.click();
                    } else {
                      toast.error('Maximum of 4 images allowed');
                    }
                  }}
                  disabled={imageUrls.length >= 4}>
                  <FileImage size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-app h-8 w-8 p-0">
                  <SmileIcon size={18} />
                </Button>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGuidelines(!showGuidelines)}
                  className="text-xs sm:text-sm">
                  Community Guidelines
                </Button>

                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[140px] sm:w-[180px] text-xs sm:text-sm">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {Categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  className="hidden md:block rounded-full bg-app hover:bg-app/90"
                  onClick={handleSubmitPost}
                  disabled={!content.trim() || !selectedCategory}>
                  {isEditing ? 'Update' : 'Post'}
                </Button>
              </div>
            </div>

            {showGuidelines && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <CommunityGuidelines />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
