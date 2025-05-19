import {AdProps} from '@/types/ad-types';
import {CommentProps, PostProps} from '@/types/post-item.type';

export type MergedItem =
  | {type: 'post'; data: PostProps}
  | {type: 'ad'; data: AdProps};

export type MergedCommentItem =
  | {type: 'comment'; data: CommentProps}
  | {type: 'ad'; data: AdProps};
export function insertAdsAtRandomPositions(
  posts: PostProps[],
  ads: AdProps[],
): MergedItem[] {
  const merged: MergedItem[] = posts.map(post => ({type: 'post', data: post}));
  const shuffledAds = shuffleArray(ads);

  shuffledAds.forEach((ad, i) => {
    const insertAt = Math.floor(Math.random() * (merged.length + 1));
    merged.splice(insertAt, 0, {type: 'ad', data: ad});
  });

  return merged;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function mergePostsWithAds(
  posts: PostProps[],
  ads: AdProps[],
  adInterval: number = 5,
  randomAdCount: number = 2,
): MergedItem[] {
  const merged: MergedItem[] = [];
  const remainingAds = [...ads];

  // Step 1: Insert ads at fixed intervals
  for (let i = 0; i < posts.length; i++) {
    merged.push({type: 'post', data: posts[i]});

    if ((i + 1) % adInterval === 0 && remainingAds.length > 0) {
      merged.push({type: 'ad', data: remainingAds.shift()!});
    }
  }

  // Step 2: Insert ads at random positions
  for (let i = 0; i < randomAdCount && remainingAds.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * merged.length);
    merged.splice(randomIndex, 0, {type: 'ad', data: remainingAds.shift()!});
  }

  // Step 3: Append any remaining ads to the end
  while (remainingAds.length > 0) {
    merged.push({type: 'ad', data: remainingAds.shift()!});
  }

  return merged;
}

export function mergeCommentsWithAds(
  comments: CommentProps[],
  ads: AdProps[],
  adInterval: number = 5,
  randomAdCount: number = 2,
): MergedCommentItem[] {
  const merged: MergedCommentItem[] = [];
  const remainingAds = [...ads];

  // Step 1: Insert ads at fixed intervals
  for (let i = 0; i < comments.length; i++) {
    merged.push({type: 'comment', data: comments[i]});

    if ((i + 1) % adInterval === 0 && remainingAds.length > 0) {
      merged.push({type: 'ad', data: remainingAds.shift()!});
    }
  }

  // Step 2: Insert ads at random positions
  for (let i = 0; i < randomAdCount && remainingAds.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * merged.length);
    merged.splice(randomIndex, 0, {type: 'ad', data: remainingAds.shift()!});
  }

  // Step 3: Append any remaining ads to the end
  while (remainingAds.length > 0) {
    merged.push({type: 'ad', data: remainingAds.shift()!});
  }

  return merged;
}

export function insertAdsAtRandomCommentsPositions(
  comments: CommentProps[],
  ads: AdProps[],
): MergedCommentItem[] {
  const merged: MergedCommentItem[] = comments.map(comment => ({
    type: 'comment',
    data: comment,
  }));
  const shuffledAds = shuffleArray(ads);

  shuffledAds.forEach((ad, i) => {
    const insertAt = Math.floor(Math.random() * (merged.length + 1));
    merged.splice(insertAt, 0, {type: 'ad', data: ad});
  });

  return merged;
}
