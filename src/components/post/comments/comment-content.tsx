import {Textarea} from '@/components/ui/textarea';
import {PostContent} from '../post-content';

interface CommentContentProps {
  content: string;
  isEditing: boolean;
  editContent: string;
  onEditContentChange: (content: string) => void;
  onQuoteClick: (quote: string) => void;
  commentId?: string;
}

const CommentContent = ({
  content,
  isEditing,
  editContent,
  onEditContentChange,
  onQuoteClick,
  commentId,
}: CommentContentProps) => {
  const renderCommentContent = () => {
    const contentToRender = isEditing ? editContent : content;

    // Check if the comment starts with a quote
    if (contentToRender.startsWith('> ')) {
      // Find the name and content in the quoted text
      const quoteContentStartIndex = contentToRender.indexOf(': ');

      if (quoteContentStartIndex !== -1) {
        // Extract the quoted person's name
        const quoteName = contentToRender.substring(2, quoteContentStartIndex);

        // Look for the quote end delimiter to separate quoted content from reply
        const quoteEndIndex = contentToRender.indexOf('---QUOTE_END---');

        if (quoteEndIndex !== -1) {
          // If found, split into quote and reply
          const quoteContent = contentToRender.substring(
            quoteContentStartIndex + 2,
            quoteEndIndex,
          );
          const regularContent = contentToRender.substring(quoteEndIndex + 15);

          return (
            <>
              <div
                className="bg-gray-100 p-3 rounded-md mb-3 border-l-4 border-app cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => onQuoteClick(commentId as string)}>
                <p className="text-sm font-semibold text-app mb-1">
                  @{quoteName}
                </p>
                <PostContent content={quoteContent} />
                {/* <p className="text-gray-700">{quoteContent}</p> */}
              </div>
              {isEditing ? (
                <Textarea
                  value={regularContent}
                  onChange={e => {
                    const newContent = `> ${quoteName}: ${quoteContent}---QUOTE_END---${e.target.value}`;
                    onEditContentChange(newContent);
                  }}
                  className="min-h-[100px] form-input"
                />
              ) : (
                // <p className="whitespace-pre-wrap">{regularContent}</p>
                <PostContent content={regularContent} />
              )}
            </>
          );
        } else {
          // If no delimiter separation, all content after the name is the quote
          const quoteContent = contentToRender.substring(
            quoteContentStartIndex + 2,
          );

          return (
            <div
              className="bg-gray-100 p-3 rounded-md border-l-4 border-app cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => onQuoteClick(commentId as string)}>
              <p className="text-sm font-semibold text-app mb-1">
                @{quoteName}
              </p>
              {/* <p className="text-gray-700">{quoteContent}</p> */}
              <PostContent content={quoteContent} />
            </div>
          );
        }
      }
    }

    // If no quote or formatting needed, return content as is
    if (isEditing) {
      return (
        <Textarea
          value={editContent}
          onChange={e => onEditContentChange(e.target.value)}
          className="min-h-[100px] form-input"
        />
      );
    }

    // return <p className="whitespace-pre-wrap">{contentToRender}</p>;
    return <PostContent content={contentToRender} />;
  };

  return <div className="mt-1">{renderCommentContent()}</div>;
};

export default CommentContent;
