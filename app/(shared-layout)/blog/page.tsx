import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { LoadMorePosts } from "./LoadMorePosts";
import { PostCard } from "./PostCard";
import { buttonVariants } from "@/components/ui/button";
import { PenLine } from "lucide-react";

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "NextPro | Blog",
  description: "Read our latest articles and insights.",
  category: "Web development",
  authors: [{ name: "Ilman M Difa" }],
};

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts, and trends from our team.
        </p>
      </div>
      <Suspense fallback={<SkeletonLoadingUi />}>
        <LoadBlogList />
      </Suspense>
    </div>
  );
}

async function LoadBlogList() {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  const data = await fetchQuery(api.posts.getPosts);
  const firstPage = data?.slice(0, PAGE_SIZE) ?? [];

  if (firstPage.length === 0) {
    return (
      <div className="text-center border rounded-xl py-16 px-4">
        <h2 className="text-xl font-bold">No posts yet</h2>
        <p className="text-muted-foreground mt-2">
          Be the first to publish something.
        </p>
        <Link className={buttonVariants({ className: "mt-6" })} href="/create">
          <PenLine className="size-4" />
          Start writing
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {firstPage.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      <LoadMorePosts
        firstPageIds={firstPage.map((post) => post._id)}
        oldestFirstPageTime={firstPage[firstPage.length - 1]._creationTime}
      />
    </>
  );
}

function SkeletonLoadingUi() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div className="flex flex-col space-y-3" key={i}>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
