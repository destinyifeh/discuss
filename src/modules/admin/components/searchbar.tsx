'use client';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';
import {Filter, Search} from 'lucide-react';
import {FC} from 'react';

type SearchProps = {
  filterIsOpen: boolean;
  setSearchTerm: (search: string) => void;

  setFilterIsOpen: (filter: boolean) => void;
  searchTerm: string;
};

export const AdminSearch: FC<SearchProps> = ({
  filterIsOpen,
  setSearchTerm,
  setFilterIsOpen,
  searchTerm,
}) => {
  return (
    <div className="mb-4 flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-8 form-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setFilterIsOpen(!filterIsOpen)}
        className={cn(filterIsOpen && 'bg-app text-white')}>
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};
