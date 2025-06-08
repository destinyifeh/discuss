'use client';

import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {highlightLinks} from '@/lib/formatter';
import clsx from 'clsx';
import {Textarea} from '../ui/textarea';

export const AddCommentField = ({
  setContent,
  content,
}: {
  setContent: (text: string) => void;
  content: string;
}) => {
  const {theme} = useGlobalStore(state => state);
  return (
    <div className="relative w-full">
      <div
        style={{fontSize: '0.875rem', lineHeight: '1.25rem'}}
        className={clsx(
          'absolute inset-0 p-3 pointer-events-none text-sm whitespace-pre-wrap break-words',
          {
            'text-white': theme.type === 'dark',
            'text-gray-900': theme.type === 'default',
          },
        )}
        dangerouslySetInnerHTML={{__html: highlightLinks(content)}}
      />
      <Textarea
        placeholder="Add a comment..."
        className=" min-h-[100px] border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-transparent caret-app"
        onChange={e => setContent(e.target.value)}
        style={{
          padding: '12px', // match overlay div padding
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          fontFamily: 'inherit',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflow: 'hidden', // to avoid scroll jumps
        }}
      />
    </div>
  );
};
