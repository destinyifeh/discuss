'use client';

import {useGlobalStore} from '@/hooks/stores/use-global-store';
import clsx from 'clsx';
import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Button} from './ui/button';

export const PageHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string | number;
}) => {
  const navigate = useRouter();
  const {theme} = useGlobalStore(state => state);
  return (
    <div
      className={clsx(
        'sticky top-0 backdrop-blur-sm z-10 border-b md:mt-15 lg:mt-0',
        {
          'bg-white/80 border-app-border': theme.type === 'default',
          'bg-app-dark-bg/10 border-app-dark-border': theme.type === 'dark',
        },
      )}>
      <div className="px-4 py-3 flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate.back()}
          className={clsx({
            'hover:bg-app-dark-bg/10 hover:text-app-dark-text':
              theme.type === 'dark',
          })}>
          <ChevronLeft />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {description && (
            <p className="text-sm text-app-gray">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  const navigate = useRouter();
  const {theme} = useGlobalStore(state => state);

  return (
    <div
      className={clsx('sticky top-0  backdrop-blur-sm z-10 border-b', {
        'bg-white/80 border-app-border': theme.type === 'default',
        'bg-app-dark-bg/10 border-app-dark-border': theme.type === 'dark',
      })}>
      <div className="px-4 py-3 flex flex-col">
        <div className="flex items-start gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate.back()}
            className="mt-1">
            <ChevronLeft />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">{title}</h1>
            {description && (
              <p className="text-app-gray text-sm">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppHeader = () => {
  const {theme} = useGlobalStore(state => state);
  return (
    <header
      className={clsx('border-b', {
        'bg-app-dark-bg/10 border-app-dark-border': theme.type === 'dark',
        'bg-white': theme.type === 'default',
      })}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-app">
            Discussday
          </Link>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button
                className={clsx({
                  'bg-app hover:bg-app/90': theme.type === 'default',
                  'bg-app/90 hover:bg-app': theme.type === 'dark',
                })}>
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
