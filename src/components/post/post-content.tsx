import {extractLinks2} from '@/lib/formatter';

export const PostContent = ({content}: {content: string}) => {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        lineHeight: '1.25rem',
        whiteSpace: 'pre-wrap',
      }}>
      <div dangerouslySetInnerHTML={{__html: extractLinks2(content)}} />
    </div>
  );
};
