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
