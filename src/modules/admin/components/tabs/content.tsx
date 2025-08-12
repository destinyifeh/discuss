'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {ArrowUp, Edit} from 'lucide-react';

import {toast} from '@/components/ui/toast';
import {FC, Fragment, useMemo, useRef, useState} from 'react';

import {MobileBottomTab} from '@/components/layouts/dashboard/mobile-bottom-tab';
import PostSkeleton from '@/components/skeleton/post-skeleton';
import {Textarea} from '@/components/ui/textarea';
import {queryClient} from '@/lib/client/query-client';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {useDebounce} from 'use-debounce';
import {adminPostService} from '../../actions/post-service/post';
import {useAdminPostActions} from '../../actions/post-service/post-hooks';

type ContentProps = {
  searchTerm: string;
  filterSection: string;
  filterStatus: string;
};

export const ContentTab: FC<ContentProps> = ({
  searchTerm,

  filterSection,
  filterStatus,
}) => {
  const navigate = useRouter();
  const lastScrollTop = useRef(0);
  const [showBottomTab, setShowBottomTab] = useState(true);
  const [showGoUp, setShowGoUp] = useState(false);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [contentActionDialog, setContentActionDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [commentStatus, setCommentStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentAction, setContentAction] = useState<
    'delete' | 'edit' | 'close'
  >('close');
  const [contentActionReason, setContentActionReason] = useState('');

  const [viewContentDialog, setViewContentDialog] = useState(false);

  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const {closePostCommentRequest, deletePostRequest} = useAdminPostActions();
  const {
    data, // This 'data' contains { pages: [], pageParams: [] }
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['admin-posts-content-with-comment-count', debouncedSearch],
    queryFn: ({pageParam = 1}) =>
      adminPostService.getPostsContent(pageParam, 10, debouncedSearch),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
  });

  const postsData = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('should query', error);

  console.log(postsData, 'admin content dataa', totalCount);

  const handleOpenContentActionDialog = (
    contentId: string,
    action: 'delete' | 'edit' | 'close',
    commentsClosed?: boolean,
  ) => {
    setSelectedContent(contentId);
    setContentAction(action);
    setContentActionReason('');
    setContentActionDialog(true);
    setCommentStatus(commentsClosed as boolean);
  };

  const handleContentAction = () => {
    if (!contentActionReason) {
      toast.error('Please provide a reason');
      return;
    }
    setIsLoading(true);
    if (contentAction === 'delete') {
      deletePostRequest.mutate(selectedContent, {
        onSuccess(data, variables, context) {
          console.log(data, 'delete post data');
          setIsLoading(false);
          toast.success(`Content #${selectedContent} has been deleted`);
          //toast.success(data.message);
          queryClient.invalidateQueries({
            queryKey: [
              'admin-posts-content-with-comment-count',
              debouncedSearch,
            ],
          });
          setContentActionDialog(false);
        },
        onError(error: any, variables, context) {
          console.log(error, 'comment close err');
          toast.error('Post delete failed', {
            description:
              error?.response?.data?.message ?? 'Oops! Something went wrong.',
          });
          setIsLoading(false);
          setContentActionDialog(false);
        },
      });
    } else if (contentAction === 'edit') {
      setContentActionDialog(false);
      navigate.push(`/create-post?postId=${selectedContent}`);
    } else {
      closePostCommentRequest.mutate(selectedContent, {
        onSuccess(data, variables, context) {
          console.log(data, 'comment close data');
          setIsLoading(false);
          toast.success(data.message);
          queryClient.invalidateQueries({
            queryKey: [
              'admin-posts-content-with-comment-count',
              debouncedSearch,
            ],
          });
          setContentActionDialog(false);
        },
        onError(error: any, variables, context) {
          console.log(error, 'comment close err');
          toast.error('Failed', {
            description:
              error?.response?.data?.message ?? 'Oops! Something went wrong.',
          });
          setIsLoading(false);
          setContentActionDialog(false);
        },
      });
    }
  };

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  return (
    <Fragment>
      <div className="space-y-4">
        <Virtuoso
          className="custom-scrollbar min-h-screen"
          totalCount={totalCount}
          data={postsData}
          onScroll={handleScroll}
          ref={virtuosoRef}
          components={{
            Header: () => <h2 className="text-lg font-bold">All Content</h2>,
            EmptyPlaceholder: () => (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-app-gray">
                    No posts found matching your search
                  </p>
                </CardContent>
              </Card>
            ),

            Footer: () =>
              isFetchingNextPage ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  Loading more...
                </div>
              ) : null,
          }}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          itemContent={(index, post) => {
            if (status === 'pending') {
              return <PostSkeleton />;
            } else {
              if (!post) {
                return null;
              }

              return (
                <div
                  key={post._id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4">
                  <div className="font-medium truncate">{post.title}</div>
                  <div>By {post?.user.username}</div>
                  <div>{post.commentCount || 0} comments</div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate.push(`/post/${post._id}`)}>
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500"
                      onClick={() =>
                        handleOpenContentActionDialog(post._id, 'edit')
                      }>
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-500"
                      onClick={() =>
                        handleOpenContentActionDialog(
                          post._id,
                          'close',
                          post.commentsClosed,
                        )
                      }>
                      {post.commentsClosed === false
                        ? 'Lock Comments '
                        : 'Unlock Comments'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() =>
                        handleOpenContentActionDialog(post._id, 'delete')
                      }>
                      Delete
                    </Button>
                  </div>
                </div>
              );
            }
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

        {showBottomTab && <MobileBottomTab />}
      </div>

      {/* Content Action Dialog */}
      <Dialog open={contentActionDialog} onOpenChange={setContentActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {contentAction === 'delete'
                ? 'Delete Content'
                : contentAction === 'edit'
                ? 'Edit Content'
                : commentStatus === false
                ? 'Lock Comments'
                : 'Unlock Comments'}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason"
                value={contentActionReason}
                onChange={e => setContentActionReason(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={isLoading}
              variant="outline"
              onClick={() => setContentActionDialog(false)}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant={contentAction === 'delete' ? 'destructive' : 'default'}
              onClick={handleContentAction}>
              {isLoading ? 'Confirming...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};
