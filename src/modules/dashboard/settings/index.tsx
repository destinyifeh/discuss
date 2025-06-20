'use client';
import {PageHeader} from '@/components/app-headers';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Separator} from '@/components/ui/separator';
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';
import {AlertTriangle, HelpCircle, Lock, Moon, Sun} from 'lucide-react';
import {useTheme} from 'next-themes';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {toast} from 'sonner';
export const SettingsPage = () => {
  const [user] = useState('dez');
  const navigate = useRouter();
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const {theme, setTheme} = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevent SSR mismatch

  if (!user) return null;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast.success(`${theme === 'dark' ? 'Light' : 'Dark'} mode activated`);
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    toast.success(`Notifications ${!notifications ? 'enabled' : 'disabled'}`);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    // Simulate password change
    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleReportAbuse = () => {
    toast.success('Report submitted. Our team will review it shortly.');
  };

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="divide-y divide-app-border">
        {/* Theme Settings */}
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-4">Appearance</h2>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span>Dark Mode</span>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleDarkMode}
              className="data-[state=checked]:bg-app"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <span>Notifications</span>
            <Switch
              className="data-[state=checked]:bg-app"
              checked={notifications}
              onCheckedChange={toggleNotifications}
            />
          </div>
        </div>

        {/* Password Change */}
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-4">Security</h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <Input
                className="form-input"
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium mb-1">
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                className="form-input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="bg-app hover:bg-app/90 text-white">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </form>
        </div>

        {/* Report Abuse */}
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-4">Support</h2>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full justify-start border-app-border"
              onClick={() => navigate.push('/help')}>
              <HelpCircle size={18} />
              Help Center
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 border-app-border dark:text-red-700 dark:hover:text-red-600 ">
                  <AlertTriangle size={18} />
                  Report Abuse
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Abuse</DialogTitle>
                  <DialogDescription>
                    Please provide details about why you're reporting. Our
                    moderation team will review your report.
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
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>

                  <Button
                    onClick={handleReportAbuse}
                    className="dark:hover:bg-red dark:bg-red-700 text-white bg-red-600 hover:bg-red-700 ">
                    Submit Report
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator />

        {/* Danger Zone */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-red-500">
            Danger Zone
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Deactivate Account</h3>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable your account
                </p>
              </div>
              <AlertDialog
                open={showDeactivateDialog}
                onOpenChange={setShowDeactivateDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-500 hover:bg-red-50">
                    Deactivate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deactivate Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to deactivate your account? This
                      will temporarily disable your account and hide your
                      profile from other users. You can reactivate it anytime by
                      logging back in.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600 dark:text-white">
                      Yes, Deactivate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to permanently delete your account?
                      This action cannot be undone. All your posts, comments,
                      followers, and personal data will be permanently removed
                      from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600 dark:text-white">
                      Yes, Delete Forever
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
