import {CreatePostPage} from '@/modules/posts/create-post';
import {Suspense} from 'react';

export default function Page() {
  return (
    <Suspense
      fallback={<div className="mt-20 text-center text-app">Loading...</div>}>
      <CreatePostPage />
    </Suspense>
  );
}
