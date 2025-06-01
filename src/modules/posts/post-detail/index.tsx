'use client';

import {Fragment, useMemo, useRef, useState} from 'react';

import {AdCard} from '@/components/ad/ad-card';
import {AppBannerAd} from '@/components/ad/banner';
import {CommentCard} from '@/components/post/comment-card';
import CommunityGuidelines from '@/components/post/community-guidelines';
import {PostCard} from '@/components/post/post-card';
import {CommentPlaceholder} from '@/components/post/post-list';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Comments, mockAds, Posts} from '@/constants/data';
import {insertAdsAtRandomCommentsPositions} from '@/lib/helpers';
import {CommentProps} from '@/types/post-item.type';
import {
  ChevronLeft,
  ImagePlus,
  MessageSquare,
  Reply,
  Send,
  X,
} from 'lucide-react';
import {useParams, useRouter} from 'next/navigation';
import {useMediaQuery} from 'react-responsive';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {toast} from 'sonner';

export const PostDetailPage = () => {
  const {postId} = useParams<{postId: string}>();
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const navigate = useRouter();
  const isMobile = useMediaQuery({maxWidth: 767});
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteContent, setQuoteContent] = useState('');
  const [quotedUser, setQuotedUser] = useState('');
  const [showMobileComment, setShowMobileComment] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [comments, setComments] = useState<CommentProps[]>([...Comments]);

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

  const addComment = (comment: any) => {
    const newComment = {
      id: Math.floor(Math.random() * (10 - 1 + 1)) + 1,
      timestamp: new Date(),
      likes: 0,
      ...comment,
    };
    setComments([...comments, newComment]);
  };

  const getCommentsForPost = (postId: string): CommentProps[] => {
    return comments.filter(comment => comment.postId === postId);
  };
  const post = Posts.find(p => p.id === postId);
  const commentts = getCommentsForPost(postId || '');

  // Sort comments by timestamp (newest first)
  const sortedComments = [...commentts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  if (!post) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Post not found</h2>
        <Button variant="outline" onClick={() => navigate.push('/home')}>
          Back to Home
        </Button>
      </div>
    );
  }

  // Helper function to extract user's added content from a comment
  const extractUserAddedContent = (content: string): string => {
    // If content has a quote block (starts with >)
    if (content.startsWith('> ')) {
      const quoteEndIndex = content.indexOf('\n\n');
      if (quoteEndIndex !== -1) {
        // Return only the content after the quote (the user's added text)
        return content.substring(quoteEndIndex + 2);
      }
    }
    return content;
  };

  const handleQuoteComment = (commentId: string) => {
    const commentToQuote = comments.find(c => c.id === commentId);
    if (commentToQuote) {
      // Extract only the direct content, ignoring any nested quotes
      let contentToQuote = extractUserAddedContent(commentToQuote.content);
      // Format quote consistently for both mobile and desktop
      const formattedQuote = `> ${commentToQuote.username}: ${contentToQuote}`;
      setQuoteContent(formattedQuote);
      setQuotedUser(commentToQuote.username);
      setShowMobileComment(true);

      if (isMobile) {
        setShowMobileComment(true);
      }
    }
  };

  const handleSubmitComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!comment.trim() && !imagePreview) {
      toast.error('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the comment content to include the quote if present
      const finalComment = quoteContent
        ? `${quoteContent}\n\n${comment.trim()}`
        : comment.trim();

      // Add comment to app context
      addComment({
        postId: postId || '',
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        content: finalComment,
        verified: user.verified || false,
        image: imagePreview || undefined,
      });

      // Clear input and close comment section if open on mobile
      setComment('');
      setQuoteContent('');
      setQuotedUser('');
      setImagePreview(null);
      if (isMobile) {
        setShowMobileComment(false);
      }
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large', {
        description: 'Please select an image less than 5MB',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please select an image file',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const allowInlineCom = false;

  const sponsoredAd = mockAds.filter(
    ad => ad.type === 'Sponsored' && ad.section === 'home',
  );

  // const mergedItems2 = useMemo(() => {
  //   return mergeCommentsWithAds(sortedComments, shuffleArray(sponsoredAd));
  // }, [Comments, mockAds]);

  const mergedItems = useMemo(() => {
    return insertAdsAtRandomCommentsPositions(sortedComments, sponsoredAd);
  }, [Comments, mockAds]);
  return (
    <Fragment>
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-app-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => navigate.back()}>
              <ChevronLeft />
            </Button>
            <h1 className="text-xl font-bold">Post</h1>
          </div>
        </div>
      </div>
      <div>
        <Virtuoso
          className="custom-scrollbar hide-scrollbar overflow-y-auto"
          style={{height: '100vh'}}
          ref={virtuosoRef}
          // onScroll={handleScroll}
          // initialTopMostItemIndex={0}
          // data={sortedComments}
          data={mergedItems}
          // itemContent={(index, comment) => (
          //   <div>
          //     <CommentCard
          //       key={comment.id}
          //       comment={comment}
          //       onQuote={() => handleQuoteComment(comment.id)}
          //     />
          //   </div>
          // )}

          itemContent={(index, item) => {
            if (item.type === 'ad') {
              return <AdCard ad={item.data} />;
            }
            return (
              <CommentCard
                comment={item.data}
                key={item.data.id}
                onQuote={() => handleQuoteComment(item.data.id)}
              />
            );
          }}
          // computeItemKey={(index, item) => {
          //   // Ensure unique & stable keys
          //   if (item.type === 'ad') return `ad-${item.data.id}`;
          //   return `comment-${item.data.id}`;
          // }}
          components={{
            Header: () => (
              <div dir="ltr">
                <div>
                  <AppBannerAd section="home" />
                </div>
                <div className="pb-2 border-b border-app-border">
                  <PostCard
                    post={post}
                    showActions={true}
                    isInDetailView={true}
                  />
                </div>

                {/* All replies header with add comment button for web */}
                <div className="px-4 py-3 border-b border-app-border flex justify-between items-center">
                  <h2 className="font-bold text-lg">All replies</h2>
                </div>

                {/* Web view comment input area */}
                {allowInlineCom && (
                  <div className="hidden md:block px-4 py-4 border-b border-app-border">
                    <CommunityGuidelines />
                    <form
                      onSubmit={handleSubmitComment}
                      className="mt-4 space-y-4">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.displayName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          {quotedUser && (
                            <div className="bg-gray-100 p-3 rounded-md mb-3 border-l-4 border-app flex flex-row justify-between">
                              <div>
                                <div className="font-semibold mb-1 text-app">
                                  @{quotedUser}
                                </div>
                                <div className="text-gray-700">
                                  {quoteContent.replace(/^>\s[\w]+:\s/gm, '')}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setQuoteContent('');
                                  setQuotedUser('');
                                  setComment('');
                                  setImagePreview(null);
                                }}>
                                <X />
                              </Button>
                            </div>
                          )}

                          <Textarea
                            placeholder="Add your comment..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            className="min-h-[120px] resize-none form-input"
                            autoFocus
                          />

                          {imagePreview && (
                            <div className="relative mt-3 rounded-md overflow-hidden border border-gray-200">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full max-h-60 object-contain"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={removeImage}
                                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-800/70 hover:bg-gray-900/90">
                                <X size={16} />
                              </Button>
                            </div>
                          )}

                          <div className="mt-3 flex justify-end items-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              ref={fileInputRef}
                              id="image-upload"
                            />
                            <div className="flex gap-3">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-app"
                                onClick={() => fileInputRef.current?.click()}>
                                <ImagePlus size={18} />
                              </Button>
                              <Button
                                type="submit"
                                className="bg-app hover:bg-app/90"
                                disabled={
                                  isSubmitting ||
                                  (!comment.trim() && !imagePreview)
                                }>
                                <Send size={16} className="mr-2" />
                                Post Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ),

            EmptyPlaceholder: () => <CommentPlaceholder />,
          }}
        />
      </div>

      {/* {sortedComments.length > 0 ? (
        <div className="divide-y divide-app-border">
          {sortedComments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onQuote={() => handleQuoteComment(comment.id)}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No replies yet</h2>
          <p className="text-app-gray">Be the first to reply!</p>
        </div>
      )} */}

      {/* Mobile comment section - slides up from bottom */}

      <div className="lg:hidden">
        {/* Comment button for mobile */}
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-app hover:bg-app/90"
          size="icon"
          onClick={() => setShowMobileComment(true)}>
          <MessageSquare size={24} />
        </Button>

        {/* Mobile inline comment section that slides up from bottom */}
        <div
          className={`fixed left-0 right-0 bottom-0 bg-white border-t border-app-border transition-transform duration-300 ease-in-out transform ${
            showMobileComment ? 'translate-y-0' : 'translate-y-full'
          } z-50`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <p className="font-semibold">Add a comment</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMobileComment(false);
                  setQuoteContent('');
                  setQuotedUser('');
                  setComment('');
                  setImagePreview(null);
                }}>
                Cancel
              </Button>
            </div>

            <div className="mt-1">
              {/* User info with community guidelines */}
              <div className="flex items-center mb-3">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm text-app">
                  <span>Community Guidelines</span>
                  <span className="mx-1">•</span>
                  <span className="text-[#666]">
                    Be respectful and constructive in your comments.
                  </span>
                </div>
              </div>

              {quotedUser && (
                <div className="bg-gray-100 p-3 rounded-md mb-3 border-l-4 border-app">
                  <div className="font-semibold mb-1 text-app">
                    @{quotedUser}
                  </div>
                  <div className="text-sm text-gray-700">
                    {quoteContent.replace(/^>\s[\w]+:\s/gm, '')}
                  </div>
                </div>
              )}

              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="min-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />

              {imagePreview && (
                <div className="relative mt-3 rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-60 object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={removeImage}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-800/70 hover:bg-gray-900/90">
                    <X size={16} />
                  </Button>
                </div>
              )}

              <div className="flex justify-between items-center mt-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-app"
                  onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus size={18} />
                </Button>
                <Button
                  onClick={handleSubmitComment}
                  className="rounded-full bg-app hover:bg-app/90"
                  disabled={isSubmitting || (!comment.trim() && !imagePreview)}>
                  <Reply size={16} className="mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        {/* Comment button for mobile */}
        <Button
          className="fixedBottomBtn max-w-3xl mx-auto fixed bottom-6 right-[26%] h-14 w-14 rounded-full shadow-lg bg-app hover:bg-app/90 z-1"
          size="icon"
          onClick={() => {
            setShowMobileComment(true);
            virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
          }}>
          <MessageSquare size={24} />
        </Button>

        {/* Mobile inline comment section that slides up from bottom */}
        <div
          className={`max-w-3xl mx-auto fixed left-0 right-16 bottom-0 bg-app-hover border-t border-app-border transition-transform duration-300 ease-in-out transform ${
            showMobileComment ? 'translate-y-0' : 'translate-y-full'
          } z-50`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <p className="font-semibold">Add a comment</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMobileComment(false);
                  setQuoteContent('');
                  setQuotedUser('');
                  setComment('');
                  setImagePreview(null);
                  virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
                }}>
                Cancel
              </Button>
            </div>

            <div className="mt-1">
              {/* User info with community guidelines */}
              <div className="flex items-center mb-3">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                {/* <div className="text-sm text-app">
                  <span>Community Guidelines</span>
                  <span className="mx-1">•</span>
                  <span className="text-[#666]">
                    Be respectful and constructive in your comments.
                  </span>
                </div> */}
                <CommunityGuidelines />
              </div>

              {quotedUser && (
                <div className="bg-gray-100 p-3 rounded-md mb-3 border-l-4 border-app">
                  <div className="font-semibold mb-1 text-app">
                    @{quotedUser}
                  </div>
                  <div className="text-sm text-gray-700">
                    {quoteContent.replace(/^>\s[\w]+:\s/gm, '')}
                  </div>
                </div>
              )}

              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="min-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />

              {imagePreview && (
                <div className="relative mt-3 rounded-md overflow-hidden border border-gray-200 py-1">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-30 object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={removeImage}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-800/70 hover:bg-gray-900/90">
                    <X size={16} />
                  </Button>
                </div>
              )}

              <div className="flex justify-between items-center mt-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-app"
                  onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus size={18} />
                </Button>
                <Button
                  onClick={handleSubmitComment}
                  className="rounded-full bg-app hover:bg-app/90"
                  disabled={isSubmitting || (!comment.trim() && !imagePreview)}>
                  <Reply size={16} className="mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
