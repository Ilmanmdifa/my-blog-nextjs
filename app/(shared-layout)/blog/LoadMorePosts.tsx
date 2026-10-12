"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { ArrowDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { PostCard } from "./PostCard";

const PAGE_SIZE = 9;

interface LoadMorePostsProps {
  firstPageIds: string[];
  oldestFirstPageTime: number;
}

export function LoadMorePosts({
  firstPageIds,
  oldestFirstPageTime,
}: LoadMorePostsProps) {
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.getPostsPaginated,
    {},
    { initialNumItems: PAGE_SIZE }
  );

  const firstPageIdSet = new Set(firstPageIds);
  const more = results.filter(
    (post) =>
      post._creationTime <= oldestFirstPageTime &&
      !firstPageIdSet.has(post._id)
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";

  if (status === "Exhausted" && more.length === 0) {
    if (!hasLoadedMore) {
      return null;
    }
    return (
      <p className="text-center text-sm text-muted-foreground pt-8">
        You have reached the end.
      </p>
    );
  }

  return (
    <div className="pt-6">
      {more.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {more.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
      {status === "CanLoadMore" && (
        <div className="flex justify-center pt-8">
          <Button
            variant="outline"
            size="lg"
            disabled={isLoading}
            onClick={() => {
              setHasLoadedMore(true);
              loadMore(PAGE_SIZE);
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <ArrowDown className="size-4" />
                <span>Load more</span>
              </>
            )}
          </Button>
        </div>
      )}
      {status === "LoadingFirstPage" && (
        <div className="flex justify-center items-center pt-8 text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          <span>Loading more posts...</span>
        </div>
      )}
    </div>
  );
}
