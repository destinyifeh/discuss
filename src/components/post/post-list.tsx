'use client';
import {Posts} from '@/constants/data';
import {useVirtualizer} from '@tanstack/react-virtual';
import {useCallback, useRef} from 'react';
import {VariableSizeList as List} from 'react-window';
import {PostCard} from './post-card';

export const PostList = () => {
  const sortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  // The scrollable element for your list
  //const parentRef = useRef(null);

  // The virtualizer
  //   const rowVirtualizer = useVirtualizer({
  //     count: 10000,
  //     getScrollElement: () => parentRef.current,
  //     estimateSize: () => 35,
  //   });

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: sortedPosts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // adjust if your card is taller or shorter
  });

  return (
    <>
      {/* The scrollable element for your list */}
      {sortedPosts.length > 0 ? (
        <div
          ref={parentRef}
          style={{
            height: `800px`,
            overflow: 'auto', // Make it scroll!
          }}>
          {/* The large inner element to hold all of the items */}
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}>
            {/* Only the visible items in the virtualizer, manually positioned to be in view */}
            {rowVirtualizer.getVirtualItems().map(virtualItem => {
              const post = sortedPosts[virtualItem.index];

              console.log(post, 'myyyous');

              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}>
                  <PostCard post={post} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No posts yet</h2>
          <p className="text-app-gray">Be the first to post!</p>
        </div>
      )}
    </>
  );
};

export const PostList5 = () => {
  const sortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const itemHeights = useRef<{[key: number]: number}>({});

  const getItemSize = (index: number) => itemHeights.current[index] ?? 180; // fallback

  const Row = ({index, style}: {index: number; style: React.CSSProperties}) => {
    const post = sortedPosts[index];
    const rowRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (node) {
          const height = node.getBoundingClientRect().height;
          if (itemHeights.current[index] !== height) {
            itemHeights.current[index] = height;
          }
        }
      },
      [index],
    );

    return (
      <div style={style}>
        <div ref={rowRef} style={{padding: '12px', boxSizing: 'border-box'}}>
          <PostCard post={post} />
        </div>
      </div>
    );
  };
};

export const PostList6 = () => {
  const sortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const ITEM_HEIGHT = 380; // Assume all PostCards are 180px tall

  // Function that returns the height of each item
  const getItemSize = () => ITEM_HEIGHT;

  // Row renderer
  const Row = ({index, style}: {index: number; style: React.CSSProperties}) => {
    const post = sortedPosts[index];
    return (
      <div
        style={{
          ...style,
          boxSizing: 'border-box',
          padding: '12px',
        }}>
        <PostCard post={post} />
      </div>
    );
  };

  return (
    <List
      height={800} // height of visible area
      itemCount={sortedPosts.length}
      itemSize={getItemSize}
      width="100%">
      {Row}
    </List>
  );
};
