'use client';
import {usePathname, useRouter} from 'next/navigation';
import React, {useState} from 'react';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {Sections} from '@/constants/data';
import {cn} from '@/lib/utils';
import {VisuallyHidden} from '@radix-ui/react-visually-hidden';
import {Bell, BookmarkIcon, Home, LogOut, Search, User} from 'lucide-react';
import Link from 'next/link';
import {toast} from 'sonner';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MobileNavigation: React.FC<MainLayoutProps> = ({children}) => {
  const navigate = useRouter();
  const location = usePathname();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user] = useState({
    following: ['2'],
    Id: 2,
    displayName: 'Dez',
    username: 'johndoe',
  });
  // Check if we're on a post details page
  const isSection =
    location.includes('/discuss/') && !location.includes('/reply');

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    // logout();
    navigate.push('/login');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast(null, {
      description: `Theme changed to ${!isDarkMode ? 'dark' : 'light'} mode.`,
    });
  };

  if (!user) {
    navigate.push('/login');
    return null;
  }

  // Get Technology section for the resources section
  const techSection = Sections.find(cat => cat.name === 'Technology');

  // Add the "Advertise" section
  const advertiseSection = {
    id: 'advertise',
    name: 'How to Advertise',
    description: 'Learn about advertising opportunities on our platform',
  };

  // Resources categories with only tech and advertise
  const resourceCategories = [techSection, advertiseSection].filter(Boolean);

  const navItems = [
    {icon: <Home size={24} />, label: 'Home', path: '/home'},
    {icon: <Search size={24} />, label: 'Explore', path: '/explore'},
    {icon: <Bell size={24} />, label: 'Notifications', path: '/notifications'},
    // {icon: <Mail size={24} />, label: 'Messages', path: '/messages'},
    {icon: <BookmarkIcon size={24} />, label: 'Bookmarks', path: '/bookmarks'},
    {
      icon: <User size={24} />,
      label: 'Profile',
      path: `/profile/${user.username}`,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black flex lg:hidden">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-app-border flex justify-between items-center p-3 z-30">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={'https://api.dicebear.com/7.x/avataaars/svg?seed=mercy'}
                />
                <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
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
                  <AvatarImage
                    src={'https://api.dicebear.com/7.x/avataaars/svg?seed=paul'}
                  />
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{user.displayName}</p>
                  <p className="text-app-gray">@{user.username}</p>
                </div>
              </div>

              <nav className="flex-1 space-y-1 p-2">
                {navItems.map((item, index) => (
                  <SheetClose asChild key={index}>
                    <Link
                      href={item.path}
                      className={cn(
                        'flex items-center gap-4 p-3 rounded-full hover:bg-app-hover transition',
                        isActive(item.path) ? 'font-bold' : 'font-normal',
                      )}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="p-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
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
          onClick={() => navigate.push('/notifications')}>
          <Bell size={24} />
        </Button>
      </div>
    </div>
  );
};

export default MobileNavigation;
