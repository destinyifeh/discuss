'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {resourceItems, Sections} from '@/constants/data';
import {darkTheme, defaultTheme} from '@/constants/styles';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {cn} from '@/lib/utils';
import clsx from 'clsx';
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
  const {theme, setTheme} = useGlobalStore(state => state);
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
      path: '/advertise/ad-performance',
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

  const onToggleTheme = () => {
    if (theme.type === 'default') {
      setTheme(darkTheme);
    } else {
      setTheme(defaultTheme);
    }
  };
  return (
    <aside
      className={clsx('hidden lg:flex flex-col w-64 border-r p-4', {
        'border-app-border': theme.type === 'default',
        'border-app-dark-border': theme.type === 'dark',
      })}>
      <div className="flex-1 space-y-4">
        {/* <div className="mb-6">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        </div> */}
        <div className="p-2 flex items-center justify-between">
          <h1 className="text-xl font-bold">Discussday</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className={clsx({
              'hover:bg-app-dark-bg/10 hover:text-white': theme.type === 'dark',
            })}>
            {theme.type === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
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
                {
                  'hover:bg-app-hover': theme.type === 'default',
                  'hover:bg-app-dark-bg/10': theme.type === 'dark',
                },
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

        <div
          className={clsx('mt-6 pt-6 border-t space-y-2', {
            'border-app-border': theme.type === 'default',
            'border-app-dark-border': theme.type === 'dark',
          })}>
          {secondaryNavItems.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-4 p-3 rounded-full transition',
                isActive(item.path) ? 'font-bold' : 'font-normal',
                {
                  'hover:bg-app-hover': theme.type === 'default',
                  'hover:bg-app-dark-bg/10': theme.type === 'dark',
                },
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
        <div className="mb-10">
          <Button
            className={clsx('text-white rounded-full py-6 w-full mt-4', {
              'hover:bg-app/90 bg-app': theme.type === 'default',
              'hover:bg-app bg-app/90': theme.type === 'dark',
            })}
            onClick={() => navigate.push('/create-post')}>
            Post
          </Button>
        </div>

        <div className="mt-auto space-y-4">
          {/* <div className="flex items-center gap-2 p-4 rounded-full hover:bg-app-hover cursor-pointer">
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
          </div> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={clsx(
                  'flex items-center gap-3 cursor-pointer p-2 rounded-full ',
                  {
                    'hover:bg-app-hover': theme.type === 'default',
                    'hover:bg-app-dark-bg/10': theme.type === 'dark',
                  },
                )}>
                <Avatar>
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="@johndoe"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">John Doe</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={clsx('w-56', {
                'bg-app-dark-bg/10 border-app-dark-border':
                  theme.type === 'dark',
              })}>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span
                    className={cn(
                      theme.type === 'dark' && 'text-app-dark-text',
                    )}>
                    Profile
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="">
                <Link href="/profile/edit">
                  <span
                    className={cn(
                      theme.type === 'dark' && 'text-app-dark-text',
                    )}>
                    Edit Profile
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <span
                    className={cn(
                      theme.type === 'dark' && 'text-app-dark-text',
                    )}>
                    Settings
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator
                className={cn(theme.type === 'dark' && 'bg-app-dark-bg')}
              />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span
                  className={cn(theme.type === 'dark' && 'text-app-dark-text')}>
                  Log out
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
};

export const SidebarLayoutRight = () => {
  const {theme} = useGlobalStore(state => state);
  return (
    <aside
      className={clsx('hidden lg:flex flex-col w-80 h-screen border-l p-4', {
        'border-app-border': theme.type === 'default',
        'border-app-dark-border': theme.type === 'dark',
      })}>
      <div className="sticky top-4 space-y-4">
        `{' '}
        <div
          className={clsx('rounded-lg p-4', {
            'bg-app-hover': theme.type === 'default',
            'bg-app-dark-bg/10': theme.type === 'dark',
          })}>
          <h2 className="font-bold text-xl mb-4">Discuss</h2>
          <div className="flex flex-row flex-wrap items-center">
            {Sections.map(section => (
              <Link
                key={section.id}
                href={
                  section.name === 'Create Ad'
                    ? '/advertise'
                    : `/discuss/${section.name.toLowerCase()}`
                }
                className={clsx(
                  'flex items-center justify-between p-2 rounded-md',
                  {
                    'hover:bg-white': theme.type === 'default',
                    'hover:bg-app-dark-bg/10': theme.type === 'dark',
                  },
                )}>
                <span className="text-app font-semibold">{section.name}</span>
              </Link>
            ))}
          </div>
        </div>
        `{/* Who to follow  */}
        <div
          className={clsx('rounded-lg p-4', {
            'bg-app-hover ': theme.type === 'default',
            'bg-app-dark-bg/10': theme.type === 'dark',
          })}>
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
              <Button
                size="sm"
                className={clsx('rounded-full text-white', {
                  'bg-black ': theme.type === 'default',
                  'bg-app-dark-bg/10 hover:bg-app-dark-bg':
                    theme.type === 'dark',
                })}>
                Follow
              </Button>
            </div>
          </div>
        </div>
        {/* Other resources  */}
        <div
          className={clsx('rounded-lg p-4', {
            'bg-app-hover ': theme.type === 'default',
            'bg-app-dark-bg/10': theme.type === 'dark',
          })}>
          <h2 className="font-bold text-xl mb-4">Resources</h2>
          <div className="flex flex-row flex-wrap items-center">
            {resourceItems.map(resource => (
              <Link
                key={resource.label}
                href={`${resource.path}`}
                className={clsx(
                  'flex items-center justify-between p-2 rounded-md',
                  {
                    'hover:bg-white': theme.type === 'default',
                    'hover:bg-app-dark-bg/10': theme.type === 'dark',
                  },
                )}>
                <span className="text-app font-semibold">{resource.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
