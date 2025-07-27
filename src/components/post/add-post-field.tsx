'use client';

import {highlightLinks} from '@/lib/formatter';
import {Textarea} from '../ui/textarea';

export const AddPostField = ({
  setContent,
  content,
}: {
  setContent: (text: string) => void;
  content: string;
}) => {
  const allow = false;
  return (
    <div className="relative w-full">
      {allow && (
        <>
          <Textarea
            placeholder="What's on your mind?"
            className="border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-transparent caret-app relative z-10"
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
            value={content}
          />
          <div
            style={{fontSize: '0.875rem', lineHeight: '1.25rem'}}
            className="absolute inset-0 p-3 pointer-events-none text-sm whitespace-pre-wrap break-words text-gray-900 dark:text-white z-0"
            dangerouslySetInnerHTML={{__html: highlightLinks(content)}}
          />
        </>
      )}

      <Textarea
        autoFocus
        placeholder="What's on your mind?"
        className="border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 min-h-20"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
    </div>
  );
};
