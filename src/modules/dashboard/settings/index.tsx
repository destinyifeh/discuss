'use client';
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
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';
import {
  AlertTriangle,
  ChevronLeft,
  HelpCircle,
  Lock,
  Moon,
  Sun,
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {toast} from 'sonner';

export const SettingsPage = () => {
  const [user] = useState('dez');
  const navigate = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!user) return null;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(`${!darkMode ? 'Dark' : 'Light'} mode activated`);
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
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-app-border">
        <div className="px-4 py-3 flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => navigate.back()}>
            <ChevronLeft />
          </Button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="divide-y divide-app-border">
        {/* Theme Settings */}
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-4">Appearance</h2>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              <span>Dark Mode</span>
            </div>
            <Switch
              checked={darkMode}
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
                className="form-input"
                id="new-password"
                type="password"
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
                className="form-input"
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="bg-app hover:bg-app/90">
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
              className="flex items-center gap-2 w-full justify-start"
              onClick={() => navigate.push('/help')}>
              <HelpCircle size={18} />
              Help Center
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
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
                    className="bg-red-600 hover:bg-red-700 text-white">
                    Submit Report
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-4 text-center text-app-gray text-sm">
          <p>Forum App v1.0.0</p>
          <p className="mt-1">© 2025 Forum App. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
