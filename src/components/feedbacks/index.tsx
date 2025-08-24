'use client';
import {useRouter} from 'next/navigation';
import {Button} from '../ui/button';

export const FallbackMessage = ({
  buttonText,
  message,
  page,
}: {
  buttonText: string;
  message: string;
  page: string;
}) => {
  const router = useRouter();
  return (
    <div>
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">{message}</h2>
        <Button variant="outline" onClick={() => router.push(page)}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export const LoadingMore = () => {
  return (
    <div className="py-4 flex items-center justify-center text-sm text-gray-500">
      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-gray-400 mr-2"></div>
      Loading more...
    </div>
  );
};

export const LoadMoreError = ({
  fetchNextError,
  handleFetchNext,
}: {
  fetchNextError: string;
  handleFetchNext: () => void;
}) => {
  return (
    <div className="py-4 text-center text-sm text-red-500">
      <span> {fetchNextError}</span>
      <button
        onClick={handleFetchNext}
        className="ml-2 text-red-600 underline hover:text-red-700">
        Retry
      </button>
    </div>
  );
};
