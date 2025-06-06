import {clsx, type ClassValue} from 'clsx';
import {useMediaQuery} from 'react-responsive';
import {twMerge} from 'tailwind-merge';

type DeviceProps = {
  children: React.ReactNode;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Desktop = ({children}: DeviceProps) => {
  const isDesktop = useMediaQuery({minWidth: 992});
  return isDesktop ? children : null;
};
export const Tablet = ({children}: DeviceProps) => {
  const isTablet = useMediaQuery({minWidth: 768, maxWidth: 991});
  return isTablet ? children : null;
};
export const Mobile = ({children}: DeviceProps) => {
  const isMobile = useMediaQuery({maxWidth: 767});
  return isMobile ? children : null;
};
export const Default = ({children}: DeviceProps) => {
  const isNotMobile = useMediaQuery({minWidth: 768});
  return isNotMobile ? children : null;
};

export const formatTimeAgo = (timestamp: string) => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(timestamp).getTime()) / 1000,
  );

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return Math.floor(seconds) + ' seconds ago';
};
