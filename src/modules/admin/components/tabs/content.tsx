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
import {TabsContent} from '@/components/ui/tabs';
import {Edit} from 'lucide-react';

import {FC, Fragment, useState} from 'react';
import {toast} from 'sonner';

import {Textarea} from '@/components/ui/textarea';
import {Comments, Posts} from '@/constants/data';
import {useRouter} from 'next/navigation';

type ContentProps = {
  searchTerm: string;
  filterSection: string;
  filterStatus: string;
  tabValue: string;
};

export const ContentTab: FC<ContentProps> = ({
  searchTerm,

  filterSection,
  filterStatus,
  tabValue,
}) => {
  const navigate = useRouter();

  const [contentActionDialog, setContentActionDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [contentAction, setContentAction] = useState<
    'delete' | 'edit' | 'close'
  >('close');
  const [contentActionReason, setContentActionReason] = useState('');

  const [viewContentDialog, setViewContentDialog] = useState(false);

  const filteredComments = Comments.filter(comment => {
    if (searchTerm === '') return true;
    return (
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredPosts = Posts.filter(post => {
    if (searchTerm === '') return true;
    return (
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenContentActionDialog = (
    contentId: string,
    action: 'delete' | 'edit' | 'close',
  ) => {
    setSelectedContent(contentId);
    setContentAction(action);
    setContentActionReason('');
    setContentActionDialog(true);
  };

  const handleContentAction = () => {
    if (!contentActionReason) {
      toast.error('Please provide a reason');
      return;
    }

    if (contentAction === 'delete') {
      toast.success(`Content #${selectedContent} has been deleted`);
    } else if (contentAction === 'edit') {
      toast.success(`Content #${selectedContent} has been edited`);
    } else {
      toast.success(
        `Comments for content #${selectedContent} have been closed`,
      );
    }

    setContentActionDialog(false);
  };

  return (
    <Fragment>
      <TabsContent value={tabValue} className="space-y-4">
        <h2 className="text-lg font-bold">All Content</h2>

        {filteredPosts.length > 0 ? (
          <div className="rounded-md border mb-8 border-app-border">
            <div className="p-4 bg-app-hover dark:bg-background">
              <h3 className="font-bold">Posts</h3>
            </div>
            <div className="divide-y divide-app-border">
              {filteredPosts.slice(0, 5).map(post => (
                <div
                  key={post.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4">
                  <div className="font-medium truncate">{post.title}</div>
                  <div>By {post.displayName}</div>
                  <div>{post.comments || 0} comments</div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate.push(`/post/${post.id}`)}>
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500"
                      onClick={() =>
                        handleOpenContentActionDialog(post.id, 'edit')
                      }>
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-500"
                      onClick={() =>
                        handleOpenContentActionDialog(post.id, 'close')
                      }>
                      Close Comments
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() =>
                        handleOpenContentActionDialog(post.id, 'delete')
                      }>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-app-gray">
                No posts found matching your search
              </p>
            </CardContent>
          </Card>
        )}

        {filteredComments.length > 0 ? (
          <div className="rounded-md border border-app-border">
            <div className="p-4 bg-app-hover dark:bg-background">
              <h3 className="font-bold">Comments</h3>
            </div>
            <div className="divide-y divide-app-border">
              {filteredComments.slice(0, 5).map(comment => (
                <div
                  key={comment.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4">
                  <div className="truncate">
                    {comment.content.substring(0, 50)}...
                  </div>
                  <div>By {comment.displayName}</div>
                  <div>On post #{comment.postId}</div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate.push(`/post/${comment.postId}`)}>
                      View Post
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500"
                      onClick={() =>
                        handleOpenContentActionDialog(comment.id, 'edit')
                      }>
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() =>
                        handleOpenContentActionDialog(comment.id, 'delete')
                      }>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-app-gray">
                No comments found matching your search
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Content Action Dialog */}
      <Dialog open={contentActionDialog} onOpenChange={setContentActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {contentAction === 'delete'
                ? 'Delete Content'
                : contentAction === 'edit'
                ? 'Edit Content'
                : 'Close Comments'}
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
              variant="outline"
              onClick={() => setContentActionDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={contentAction === 'delete' ? 'destructive' : 'default'}
              onClick={handleContentAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};
