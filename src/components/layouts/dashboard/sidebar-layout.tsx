'use client';

import {Categories} from '@/constants/data';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {cn} from '@/lib/utils';
import {
  BarChart2,
  Bell,
  Bookmark,
  BookmarkIcon,
  Home,
  LogOut,
  MessageSquare,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useState} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from '../../ui/avatar';
import {Button} from '../../ui/button';

type NavItemProps = {
  icon: any;
  label: string;
  path: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
};

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start py-6 px-4 text-base rounded-xl transition-colors',
        active
          ? 'bg-app-hover text-app font-semibold'
          : 'text-app-gray font-normal',
      )}
      onClick={onClick}>
      <div className="flex items-center w-full">
        <Icon className="mr-4" size={1} />
        <span className="text-lg">{label}</span>
        {badge !== undefined && badge > 0 && (
          <span className="ml-auto bg-app text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
    </Button>
  );
};

export const SidebarLayoutLeft = () => {
  const navigate = useRouter();
  const location = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isActive = (path: string) => location === path;

  const {logout} = useAuthStore(state => state);
  const mainNavItems = [
    {
      label: 'Home',
      icon: Home,
      path: '/home',
    },
    {
      label: 'Explore',
      icon: Search,
      path: '/explore',
    },
    {
      label: 'Notifications',
      icon: Bell,
      path: '/notifications',
      badge: 3,
    },
    {
      label: 'Messages',
      icon: MessageSquare,
      path: '/messages',
      badge: 2,
    },
    {
      label: 'Bookmarks',
      icon: Bookmark,
      path: '/bookmarks',
    },
  ];

  const secondaryNavItems = [
    // {
    //   label: 'Profile',
    //   icon: <User size={24} className="mr-4" />,
    //   path: `/profile/${'des'}`,
    // },
    {
      label: 'Ad View',
      icon: <BarChart2 size={24} className="mr-4" />,
      path: '/ad-performance',
    },

    {
      label: 'Admin',
      icon: <User size={24} className="mr-4" />,
      path: '/admin',
    },
    {
      label: 'Settings',
      icon: <Settings size={24} className="mr-4" />,
      path: '/settings',
    },
  ];

  const navItems = [
    {icon: <Home size={24} className="mr-4" />, label: 'Home', path: '/home'},
    {
      icon: <Search size={24} className="mr-4" />,
      label: 'Explore',
      path: '/explore',
    },
    {
      icon: <Bell size={24} className="mr-4" />,
      label: 'Notifications',
      path: '/notifications',
      badge: 2,
    },
    // {
    //   icon: <Mail size={24} className="mr-4" />,
    //   label: 'Messages',
    //   path: '/messages',
    // },
    {
      icon: <BookmarkIcon size={24} className="mr-4" />,
      label: 'Bookmarks',
      path: '/bookmarks',
    },
    {
      icon: <User size={24} className="mr-4" />,
      label: 'Profile',
      path: `/profile/${'johndoe'}`,
    },
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // toast({
    //   description: `Theme changed to ${!isDarkMode ? 'dark' : 'light'} mode.`,
    // });
  };

  const handleLogout = () => {
    logout();
    navigate.push('/login');
  };
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-app-border p-4">
      <div className="flex-1 space-y-4">
        {/* <div className="mb-6">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        </div> */}
        <div className="p-2 flex items-center justify-between">
          <h1 className="text-xl font-bold">Discuss</h1>
          <Button variant="ghost" size="icon" onClick={() => {}}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        <nav className="space-y-2">
          {/* {mainNavItems.map(item => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location === item.path}
              onClick={() => navigate.push(item.path)}
              badge={item.badge}
            />
          ))} */}

          {navItems.map((item, index) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-4 p-3 rounded-full hover:bg-app-hover transition',
                isActive(item.path) ? 'font-bold' : 'font-normal',
              )}>
              <div className="flex items-center w-full">
                {item.icon}
                <span className="text-lg">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-app text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-app-border space-y-2">
          {secondaryNavItems.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-4 p-3 rounded-full hover:bg-app-hover transition',
                isActive(item.path) ? 'font-bold' : 'font-normal',
              )}>
              {item.icon}
              <span className="text-lg">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* <div className="mt-auto">
          <Button
            className="w-full rounded-full py-6 bg-app hover:bg-app/90"
            onClick={() => navigate.push('/create-post')}>
            <PlusCircle className="mr-2" size={18} />
            New Post
          </Button>
        </div> */}
        <Button
          className="bg-app hover:bg-app/90 text-white rounded-full py-6 w-full mt-4"
          onClick={() => navigate.push('/create-post')}>
          Post
        </Button>

        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-2 p-4 rounded-full hover:bg-app-hover cursor-pointer">
            <Avatar>
              <AvatarImage
                src={'https://api.dicebear.com/7.x/avataaars/svg?seed=mercy'}
              />
              <AvatarFallback>{'D'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="font-bold truncate">{'Desz Boss'}</p>
              <p className="text-app-gray truncate">{'Logout'}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={e => {
                e.stopPropagation();
                handleLogout();
              }}>
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export const SidebarLayoutRight = () => {
  return (
    <aside className="hidden lg:flex flex-col w-80 h-screen border-l border-app-border p-4">
      <div className="sticky top-4 space-y-4">
        `{' '}
        <div className="bg-app-hover rounded-lg p-4">
          <h2 className="font-bold text-xl mb-4">Discuss</h2>
          <div className="flex flex-row flex-wrap items-center">
            {Categories.map(category => (
              <Link
                key={category.id}
                href={`/discuss/${category.name.toLowerCase()}`}
                className="flex items-center justify-between p-2 hover:bg-white rounded-md">
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
        `{/* Who to follow  */}
        <div className="bg-app-hover rounded-lg p-4">
          <h2 className="font-bold text-xl mb-4">Who to follow</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">Alex Johnson</p>
                  <p className="text-app-gray">God is goood</p>
                </div>
              </div>
              <Button size="sm" className="rounded-full bg-black text-white">
                Follow
              </Button>
            </div>

            <div className="flex items-center justify-between mt-5">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">Alex Johnson</p>
                  <p className="text-app-gray">God is goood</p>
                </div>
              </div>
              <Button size="sm" className="rounded-full bg-black text-white">
                Follow
              </Button>
            </div>
          </div>
        </div>
        {/* Other resources  */}
        <div className="bg-app-hover rounded-lg p-4">
          <h2 className="font-bold text-xl mb-4">Resources</h2>
          <div className="flex flex-row flex-wrap items-center">
            {Categories.map(category => (
              <Link
                key={category.id}
                href={`/${category.name}`}
                className="flex items-center justify-between p-2 hover:bg-white rounded-md">
                <span className="text-app font-semibold">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
