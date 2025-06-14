'use client';

import {highlightLinks} from '@/lib/formatter';
import {Textarea} from '../ui/textarea';

export const AddCommentField = ({
  setContent,
  content,
}: {
  setContent: (text: string) => void;
  content: string;
}) => {
  return (
    <div className="relative w-full">
      <div
        style={{fontSize: '0.875rem', lineHeight: '1.25rem'}}
        className="absolute inset-0 p-3 pointer-events-none text-sm whitespace-pre-wrap break-words text-gray-90"
        dangerouslySetInnerHTML={{__html: highlightLinks(content)}}
      />
      <Textarea
        placeholder="Add a comment..."
        className=" min-h-[100px] border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-transparent caret-app"
        onChange={e => setContent(e.target.value)}
        value={content}
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
