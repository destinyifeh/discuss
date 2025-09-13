'use client';
import {usePathname, useRouter} from 'next/navigation';
import React, {useState} from 'react';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '@/constants/api-resources';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {cn} from '@/lib/utils';
import {logoutRequestAction} from '@/modules/auth/actions';
import {getUnreadNotificationsCounntRequestAction} from '@/modules/dashboard/notifications/actions';
import {Role} from '@/types/user.types';
import {VisuallyHidden} from '@radix-ui/react-visually-hidden';
import {useQuery} from '@tanstack/react-query';
import {
  BarChart2,
  Bell,
  BookmarkIcon,
  Home,
  LogOut,
  Search,
  User,
} from 'lucide-react';
import Link from 'next/link';
import {toast} from 'sonner';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MobileNavigation: React.FC<MainLayoutProps> = ({children}) => {
  const router = useRouter();
  const location = usePathname();
  const {logout, currentUser} = useAuthStore(state => state);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const {error, data: unreadCount} = useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => getUnreadNotificationsCounntRequestAction(),
    retry: 1,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });

  const isActive = (path: string) => location === path;

  const handleLogout = async () => {
    try {
      const res = await logoutRequestAction();
      if (res?.data?.code === '200') {
        // removeCookieAccessToken();
        // removeCookieRefreshToken();
        logout();
        toast.success('Successfully logged out.');

        document.cookie = `${ACCESS_TOKEN}=; Path=/; Max-Age=0; SameSite=None; Secure`;

        // Remove the refresh token
        document.cookie = `${REFRESH_TOKEN}=; Path=/; Max-Age=0; SameSite=None; Secure`;
        router.push('/login');
      } else {
        toast.error(
          'Something went wrong while logging you out. Please try again.',
        );
      }
    } catch (err) {
      toast.error(
        'Something went wrong while logging you out. Please try again.',
      );
    }
  };

  const navItems = [
    {icon: <Home size={24} />, label: 'Home', path: '/home'},
    {icon: <Search size={24} />, label: 'Explore', path: '/explore'},
    {icon: <Bell size={24} />, label: 'Notifications', path: '/notifications'},
    // {icon: <Mail size={24} />, label: 'Messages', path: '/messages'},
    {icon: <BookmarkIcon size={24} />, label: 'Bookmarks', path: '/bookmarks'},
    {
      icon: <User size={24} />,
      label: 'Profile',
      path: `/profile/${currentUser?.username?.toLowerCase()}`,
    },
    {
      label: 'Ad View',
      icon: <BarChart2 size={24} />,
      path: '/advertise/ad-performance',
    },

    ...(currentUser?.role === Role.SUPER_ADMIN ||
    currentUser?.role === Role.ADMIN
      ? [
          {
            label: 'Admin',
            icon: <User size={24} />,
            path: '/admin',
          },
        ]
      : []),
  ];

  return (
    <div
      // className={clsx('min-h-screen flex lg:hidden', {
      className="lg:hidden">
      <div className="sticky top-0 left-0 right-0 border-b flex justify-between items-center py-3 px-2 z-30 border-app-border">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.avatar ?? undefined} />
                <AvatarFallback className="capitalize text-app text-2xl">
                  {currentUser?.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {/* <Menu size={24} /> */}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <VisuallyHidden>
              <SheetTitle>Mobile Sidebar</SheetTitle>
            </VisuallyHidden>
            <div className="flex flex-col h-full">
              <div className="p-4 flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={currentUser?.avatar ?? undefined} />
                  <AvatarFallback className="capitalize text-app text-3xl">
                    {currentUser?.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold capitalize">
                    {currentUser?.username}
                  </p>
                  {/* <p className="text-app-gray">@{currentUser?.username}</p> */}
                </div>
              </div>

              <nav className="flex-1 space-y-1 p-2">
                {navItems.map((item, index) => (
                  // <SheetClose asChild key={item.label}>
                  <Link
                    href={item.path}
                    className={cn(
                      'flex items-center gap-4 p-3 rounded-full hover:bg-app-hover transition active:scale-90 transition-transform duration-150',
                      isActive(item.path) ? 'font-bold' : 'font-normal',
                    )}
                    onClick={() => setOpen(false)}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                  // </SheetClose>
                ))}
              </nav>

              <div className="p-4">
                <Button
                  variant="outline"
                  className="w-full justify-start active:scale-90 transition-transform duration-150"
                  onClick={handleLogout}>
                  <LogOut size={18} className="mr-2" />
                  Log out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-xl font-bold">Discussday</h1>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/notifications')}
          className="relative active:scale-90 transition-transform duration-150">
          <Bell size={24} />

          {unreadCount && unreadCount > 0 && (
            <Badge
              variant="destructive"
              className={cn(
                'absolute -top-1 -right-1 h-5 flex items-center justify-center p-0 text-xs font-bold rounded-full',
                unreadCount > 99 ? 'w-7' : 'w-5',
              )}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MobileNavigation;
