'use client';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';

import {PageHeader} from '@/components/app-headers';
import CommunityGuidelines from '@/components/post/community-guidelines';
import PostCard from '@/components/post/post-card';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {usePostStore} from '@/hooks/stores/use-post-store';
import {useIsMobile} from '@/hooks/use-mobile';
import {queryClient} from '@/lib/client/query-client';
import {
  CommentFeedProps,
  ImageProps,
  PostFeedProps,
} from '@/types/post-item.type';
import {ImagePlus, Reply, Send, Trash2} from 'lucide-react';
import {useParams, useRouter} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';
import {toast} from 'sonner';
import {CommentDto, QUOTE_END} from '../dto/post-dto';
import {usePostActions} from '../post-hooks';

export const CreateCommentPage = () => {
  const {postId} = useParams<{postId: string}>();

  const {currentUser} = useAuthStore(state => state);
  const navigate = useRouter();

  const isMobile = useIsMobile();
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [comments, setComments] = useState<CommentFeedProps[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]); // Track removed public_ids
  const [originalImages, setOriginalImages] = useState<ImageProps[]>([]);
  const [editComment, setEditComment] = useState<CommentFeedProps>();
  const [comment, setComment] = useState('');
  const [quoteContent, setQuoteContent] = useState('');
  const [quotedUser, setQuotedUser] = useState('');
  const {postComment, QuotedComment, thePost, resetCommentSection} =
    usePostStore(state => state);
  const {createComment} = usePostActions();
  // Get quote from location state if available

  // const quotedUser = location.state?.quotedUser || '';
  useEffect(() => {
    // setup logic here

    return () => {
      // cleanup logic here
      // resetCommentSection(); // ✅ runs on unmount
    };
  }, []);

  // const handleSubmitReply2 = () => {
  //   if (!reply.trim() && !imagePreview) {
  //     toast.error('Empty comment', {
  //       description: 'Please write something or add an image before posting.',
  //     });
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     // Ensure the comment format is consistent
  //     const commentContent = reply.trim();

  //     addComment({
  //       postId: post.id,
  //       userId: user.id,
  //       username: user.username,
  //       displayName: user.displayName,
  //       avatar: user.avatar,
  //       content: commentContent,
  //       verified: user.verified || false,
  //       image: imagePreview || undefined,
  //     });

  //     toast.success('Comment posted', {
  //       description: 'Your comment has been added to the discussion.',
  //     });

  //     navigate(`/post/${post.id}`);
  //   } catch (error) {
  //     toast.error('Error', {
  //       description: 'Failed to post your comment. Please try again.',
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmitComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!comment.trim() && !imagePreview) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      // Format the comment content to include the quote if present
      // const finalComment = quoteContent
      //   ? `${quoteContent}\n\n${comment.trim()}`
      //   : comment.trim();

      const finalComment = quoteContent
        ? `${quoteContent}${QUOTE_END}${comment.trim()}`
        : comment.trim();

      console.log(finalComment, 'finalCom');
      console.log(quoteContent, 'finalCom33');

      // Add comment to app context
      addComment({
        postId: postId,
        content: finalComment,
        images: images,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const addComment = (data: CommentDto) => {
    console.log(data, 'dataa');
    setIsSubmitting(true);
    createComment.mutate(data, {
      onSuccess(data, variables, context) {
        console.log(data, 'post data');
        queryClient.invalidateQueries({
          queryKey: ['comment-feed-posts', postId],
        });
        // Clear input and close comment section if open on mobile
        setComment('');
        setQuoteContent('');
        setQuotedUser('');
        setImagePreview(null);

        setImageUrls([]);
        setImages([]);

        toast.success('Comment added successfully');
      },
      onError(error, variables, context) {
        console.log(error, 'post err');

        toast.error(
          error.message ?? 'Failed to add comment. Please try again.',
        );
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const handleImageUpload2 = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Function to format the quoted text with styling that matches CommentCard.tsx
  const formatReplyTextarea = () => {
    if (!QuotedComment?.quotedUser) return null;

    // Extract only the quoted content without the username prefix
    // This regex matches '---QUOTE_START---username: ' pattern at the beginning of the string
    const quoteContent = QuotedComment.quotedContent.replace(
      /^---QUOTE_START---[\w]+:\s/gm,
      '',
    );

    return (
      <div className="mb-4">
        <div className="p-3 rounded-md bg-gray-100 border-l-4 border-app">
          {QuotedComment.quotedUser && (
            <p className="font-medium text-sm mb-1 text-app">@{quotedUser}</p>
          )}
          <p className="text-[#333] whitespace-pre-wrap">{quoteContent}</p>
        </div>
      </div>
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (imageUrls.length + files.length > 2) {
      toast.error('You can only upload a maximum of 2 images');
      return;
    }

    Array.from(files).forEach(file => {
      // Create a blob URL for the image
      const imageUrl = URL.createObjectURL(file);
      console.log(imageUrl, 'imagerrrr');
      setImages(prev => [...prev, file]);
      setImageUrls(prev => [...prev, imageUrl]);
    });
  };

  const removeImage2 = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const urlToRemove = imageUrls[index];

    // If the removed image is from the original post
    const original = originalImages.find(img => img.secure_url === urlToRemove);
    if (original) {
      setRemovedImageIds(prev => [...prev, original.public_id]);
      setOriginalImages(prev =>
        prev.filter(img => img.secure_url !== urlToRemove),
      );
    } else {
      // Removing a newly uploaded image
      setImages(prev =>
        prev.filter((_, i) => i !== index - originalImages.length),
      );
    }

    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-col h-full">
        {/* Header */}

        <PageHeader title="Add comment" />

        {/* Original post */}
        <PostCard post={thePost as PostFeedProps} showActions={false} />

        {/* Community Guidelines */}
        <div className="px-4 pt-4">
          <CommunityGuidelines />
        </div>

        {/* Reply compose area */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={currentUser?.avatar ?? undefined} />
              <AvatarFallback>{currentUser?.username.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              {formatReplyTextarea()}

              <Textarea
                placeholder="Add your comment..."
                className="border-0 text-lg p-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px]"
                value={
                  QuotedComment?.quotedContent
                    ? reply.replace(
                        QuotedComment.quotedContent + '---QUOTE_END---',
                        '',
                      )
                    : reply
                }
                onChange={e =>
                  setReply(
                    QuotedComment?.quotedContent
                      ? QuotedComment.quotedContent +
                          '---QUOTE_END---' +
                          e.target.value.replace(
                            QuotedComment.quotedContent + '---QUOTE_END---',
                            '',
                          )
                      : e.target.value,
                  )
                }
              />

              {imageUrls.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden w-24 h-24 sm:w-32 sm:h-32">
                      <img
                        src={url}
                        alt={`Post attachment ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-600 w-6 h-6"
                        onClick={() => removeImage(index)}>
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="sticky bottom-0 bg-white border-t border-app-border p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
                id="image-upload"
                max="2"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-app"
                onClick={() => {
                  if (imageUrls.length < 2) {
                    fileInputRef.current?.click();
                  } else {
                    toast.error('Maximum of 2 images allowed');
                  }
                }}
                disabled={imageUrls.length >= 2}>
                <ImagePlus size={18} />
              </Button>
              {/* <Button variant="ghost" size="icon" className="text-app">
                <Video size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-app">
                <SmileIcon size={20} />
              </Button> */}
            </div>

            <Button
              onClick={handleSubmitComment}
              className="rounded-full bg-app hover:bg-app/90"
              disabled={isSubmitting || (!comment.trim() && !imagePreview)}>
              {isMobile ? (
                <>
                  <Reply size={16} className="mr-2" />
                  Reply
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
