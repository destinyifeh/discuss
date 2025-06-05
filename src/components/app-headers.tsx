'use client';

import {useGlobalStore} from '@/hooks/stores/use-global-store';
import clsx from 'clsx';
import {ChevronLeft} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {Button} from './ui/button';

export const PageHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const navigate = useRouter();
  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-app-border md:mt-15 lg:mt-0">
      <div className="px-4 py-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate.back()}>
          <ChevronLeft />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-sm text-app-gray">{description}</p>
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
  description: string | undefined;
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
