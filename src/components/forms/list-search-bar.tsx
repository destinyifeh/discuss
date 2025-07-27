'use client';

import {Search} from 'lucide-react';
import {forwardRef} from 'react';
import {Input} from '../ui/input';

type Props = {
  searchTerm: string;
  setSearchTerm: (search: string) => void;
};

// Forward the ref to the input element
const SearchBarList = forwardRef<HTMLInputElement, Props>(
  ({searchTerm, setSearchTerm}, ref) => {
    return (
      <div className="pt-4 px-4 bg-white sticky top-0 z-10">
        <div className="relative border-1 border-app-border rounded-full">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-gray"
            size={20}
          />
          <Input
            placeholder="Search..."
            className="border-0 rounded-full pl-10 form-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            ref={ref}
          />
        </div>
      </div>
    );
  },
);

SearchBarList.displayName = 'SearchBarList';

export default SearchBarList;
