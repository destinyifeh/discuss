'use client';

import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {UserActionType} from '@/modules/admin/admin-types';
import {
  actionDescriptions,
  actionPlaceholders,
  actionTitles,
  suspensionPeriodsData,
} from '@/modules/admin/data';

type UserActionDialogProps = {
  userActionDialog: boolean;
  userActionType: UserActionType;
  setUserActionDialog: (action: boolean) => void;
  suspensionPeriod: string;
  setSuspensionPeriod: (period: string) => void;
  setUserActionReason: (reason: string) => void;
  userActionReason: string;
  handleUserAction: () => void;
  actionLoader: boolean;
};

export const AdminUserActionDialog = ({
  userActionType,
  setUserActionDialog,
  userActionDialog,
  setSuspensionPeriod,
  suspensionPeriod,
  userActionReason,
  setUserActionReason,
  handleUserAction,
  actionLoader,
}: UserActionDialogProps) => {
  const description =
    actionDescriptions[userActionType] ||
    'Permanently ban this user from the platform';

  const title = actionTitles[userActionType] || 'Ban User';
  return (
    <Dialog open={userActionDialog} onOpenChange={setUserActionDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {userActionType === 'suspend' && (
            <div className="space-y-2">
              <Label htmlFor="suspension-period">Suspension Period</Label>
              <Select
                value={suspensionPeriod}
                onValueChange={setSuspensionPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {suspensionPeriodsData.map(period => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {['suspend', 'ban', 'unban', 'unsuspend'].includes(
            userActionType,
          ) && (
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder={`Enter reason for ${
                  actionPlaceholders[userActionType] || 'action'
                }`}
                value={userActionReason}
                onChange={e => setUserActionReason(e.target.value)}
                className="form-input"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setUserActionDialog(false)}
            disabled={actionLoader}>
            Cancel
          </Button>
          <Button
            disabled={actionLoader}
            variant={userActionType === 'view' ? 'default' : 'destructive'}
            onClick={handleUserAction}>
            {actionLoader ? 'Processing...' : title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
