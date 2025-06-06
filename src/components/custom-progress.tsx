'use client';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import clsx from 'clsx';

export const AppProgressBar = ({item, max}: {item: number; max: number}) => {
  const {theme} = useGlobalStore(state => state);
  return (
    <div
      className={clsx('relative w-full h-2 rounded', {
        'bg-app-dark-bg/10': theme.type === 'dark',
        'bg-gray-200': theme.type === 'default',
      })}>
      <div
        className="absolute top-0 left-0 h-2 bg-[#0a66c2] rounded"
        style={{width: `${Math.min((item / max) * 100, 100)}%`}}
      />
    </div>
  );
};
