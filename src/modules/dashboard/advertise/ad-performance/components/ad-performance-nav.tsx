'use client';

import {Button} from '@/components/ui/button';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {cn} from '@/lib/utils';
import {Activity, AlertCircle, CheckCircle, Clock} from 'lucide-react';

export const AdPerformanceNav = ({
  filteredStatus,
  setFilteredStatus,
}: {
  filteredStatus: string;
  setFilteredStatus: (status: any) => void;
}) => {
  const {theme} = useGlobalStore(state => state);
  return (
    <div className="mb-6 flex flex-wrap gap-2 p-4 px-3">
      <Button
        variant={filteredStatus === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilteredStatus('all')}
        className={cn(
          'flex items-center text-black gap-1',
          filteredStatus === 'all' &&
            theme.type === 'default' &&
            'bg-app text-white hover:bg-app/90',
          filteredStatus === 'all' &&
            theme.type === 'dark' &&
            'bg-app/90 text-white hover:bg-app',
          theme.type === 'dark' &&
            filteredStatus !== 'all' &&
            'bg-app-dark-bg/10 border-app-dark-border text-app-dark-text',
        )}>
        All
      </Button>
      <Button
        variant={filteredStatus === 'pending' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilteredStatus('pending')}
        className={cn(
          'flex items-center text-black gap-1',
          filteredStatus === 'pending' &&
            theme.type === 'default' &&
            'bg-app text-white hover:bg-app/90',
          filteredStatus === 'pending' &&
            theme.type === 'dark' &&
            'bg-app/90 text-white hover:bg-app',
          theme.type === 'dark' &&
            filteredStatus !== 'pending' &&
            'bg-app-dark-bg/10 border-app-dark-border text-app-dark-text',
        )}>
        <Clock size={16} /> Pending
      </Button>
      <Button
        variant={filteredStatus === 'approved' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilteredStatus('approved')}
        className={cn(
          'flex items-center text-black gap-1',
          filteredStatus === 'approved' &&
            theme.type === 'default' &&
            'bg-app text-white hover:bg-app/90',
          filteredStatus === 'approved' &&
            theme.type === 'dark' &&
            'bg-app/90 text-white hover:bg-app',
          theme.type === 'dark' &&
            filteredStatus !== 'approved' &&
            'bg-app-dark-bg/10 border-app-dark-border text-app-dark-text',
        )}>
        <CheckCircle size={16} /> Approved
      </Button>
      <Button
        variant={filteredStatus === 'active' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilteredStatus('active')}
        className={cn(
          'flex items-center text-black gap-1',
          filteredStatus === 'active' &&
            theme.type === 'default' &&
            'bg-app text-white hover:bg-app/90',
          filteredStatus === 'active' &&
            theme.type === 'dark' &&
            'bg-app/90 text-white hover:bg-app',
          theme.type === 'dark' &&
            filteredStatus !== 'active' &&
            'bg-app-dark-bg/10 border-app-dark-border text-app-dark-text',
        )}>
        <Activity size={16} /> Active
      </Button>
      <Button
        variant={filteredStatus === 'rejected' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilteredStatus('rejected')}
        className={cn(
          'flex items-center text-black gap-1',
          filteredStatus === 'rejected' &&
            theme.type === 'default' &&
            'bg-app text-white hover:bg-app/90',
          filteredStatus === 'rejected' &&
            theme.type === 'dark' &&
            'bg-app/90 text-white hover:bg-app',
          theme.type === 'dark' &&
            filteredStatus !== 'rejected' &&
            'bg-app-dark-bg/10 border-app-dark-border text-app-dark-text',
        )}>
        <AlertCircle size={16} /> Rejected
      </Button>
    </div>
  );
};
