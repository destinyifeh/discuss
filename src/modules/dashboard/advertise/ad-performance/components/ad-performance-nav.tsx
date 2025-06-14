'use client';

import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {Activity, AlertCircle, CheckCircle, Clock} from 'lucide-react';

export const AdPerformanceNav = ({
  filteredStatus,
  setFilteredStatus,
}: {
  filteredStatus: string;
  setFilteredStatus: (status: any) => void;
}) => {
  return (
    <div className="mb-6 flex flex-wrap gap-2 p-4 px-3">
      <Button
        variant={filteredStatus === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilteredStatus('all')}
        className={cn(
          'flex items-center text-black gap-1 dark:text-foreground',
          filteredStatus === 'all' && 'bg-app text-white hover:bg-app/90',
        )}>
        All
      </Button>
      <Button
        variant={filteredStatus === 'pending' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilteredStatus('pending')}
        className={cn(
          'flex items-center text-black gap-1 dark:text-foreground',
          filteredStatus === 'pending' && 'bg-app text-white hover:bg-app/90',
        )}>
        <Clock size={16} /> Pending
      </Button>
      <Button
        variant={filteredStatus === 'approved' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilteredStatus('approved')}
        className={cn(
          'flex items-center text-black gap-1 dark:text-foreground',
          filteredStatus === 'approved' && 'bg-app text-white hover:bg-app/90',
        )}>
        <CheckCircle size={16} /> Approved
      </Button>
      <Button
        variant={filteredStatus === 'active' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilteredStatus('active')}
        className={cn(
          'flex items-center text-black gap-1 dark:text-foreground',
          filteredStatus === 'active' && 'bg-app text-white hover:bg-app/90',
        )}>
        <Activity size={16} /> Active
      </Button>
      <Button
        variant={filteredStatus === 'rejected' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilteredStatus('rejected')}
        className={cn(
          'flex items-center text-black gap-1 dark:text-foreground',
          filteredStatus === 'rejected' && 'bg-app text-white hover:bg-app/90',
        )}>
        <AlertCircle size={16} /> Rejected
      </Button>
    </div>
  );
};
