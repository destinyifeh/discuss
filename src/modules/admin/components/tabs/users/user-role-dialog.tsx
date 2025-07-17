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
import {AdminUserRole} from '@/modules/admin/admin-types';
import {Crown, Shield, User} from 'lucide-react';

type RoleManagementDialogProps = {
  roleManagementDialog: boolean;

  setRoleManagementDialog: (action: boolean) => void;
  newRole: AdminUserRole;
  setNewRole: (role: AdminUserRole) => void;
  handleRoleChange: () => void;
  actionLoader: boolean;
};

export const AdminRoleManagementDialog = ({
  setRoleManagementDialog,
  roleManagementDialog,
  newRole,
  setNewRole,
  handleRoleChange,
  actionLoader,
}: RoleManagementDialogProps) => {
  return (
    <Dialog open={roleManagementDialog} onOpenChange={setRoleManagementDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage User Role</DialogTitle>
          <DialogDescription>
            Change the role for this user. Only super admins can manage user
            roles.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role-select">Select New Role</Label>
            <Select
              value={newRole}
              onValueChange={value => setNewRole(value as AdminUserRole)}>
              <SelectTrigger id="role-select">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    User
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield size={16} />
                    Admin
                  </div>
                </SelectItem>
                <SelectItem value="super_admin">
                  <div className="flex items-center gap-2">
                    <Crown size={16} />
                    Super Admin
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-4 bg-forum-hover rounded-md">
            <p className="text-sm text-forum-gray">
              <strong>Role Permissions:</strong>
              <br />
              <strong>User:</strong> Can create posts and comments
              <br />
              <strong>Admin:</strong> Can moderate content and manage users
              <br />
              <strong>Super Admin:</strong> Full access including role
              management
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setRoleManagementDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleRoleChange}>
            {actionLoader ? 'Updating Role...' : 'Update Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
