import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { ArrowRight, FileText, MessagesSquare, PenLine, Search, ShieldCheck, Zap } from "lucide-react";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "NextPro | Realtime Blog",
  description:
    "NextPro is a realtime blog built with Next.js, Convex, Better Auth, and full-text search.",
};

const FALLBACK_COVER =
  "https://plus.unsplash.com/premium_photo-1765838785521-f8905414beb4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function Home() {
  return (
    <div className="py-12 space-y-20">
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          NextPro
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
          A realtime blog for modern web teams
        </h1>
        <p className="mt-6 text-xl text-muted-foreground">
          Write posts, join the discussion, and see everything update live.
          Built with Next.js, Convex, Better Auth, and full-text search.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            className={buttonVariants({ size: "lg" })}
            href="/blog"
          >
            Read blog
            <ArrowRight className="size-4" />
          </Link>
          <Link
            className={buttonVariants({ variant: "outline", size: "lg" })}
            href="/create"
          >
            <PenLine className="size-4" />
            Start writing
          </Link>
        </div>
      </section>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsStrip />
      </Suspense>

      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Latest posts</h2>
            <p className="text-muted-foreground mt-2">
              Fresh articles from the community.
            </p>
          </div>
          <Link
            className={buttonVariants({ variant: "ghost" })}
            href="/blog"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <Suspense fallback={<LatestPostsSkeleton />}>
          <LatestPosts />
        </Suspense>
      </section>

      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Why NextPro</h2>
          <p className="text-muted-foreground mt-2">
            Everything a modern blog needs, working together.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Zap className="size-8 text-primary" />
              <h3 className="text-xl font-bold">Realtime</h3>
              <p className="text-muted-foreground">
                Comments and presence update live for everyone reading the
                same post.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-2">
              <ShieldCheck className="size-8 text-primary" />
              <h3 className="text-xl font-bold">Auth</h3>
              <p className="text-muted-foreground">
                Secure sign-up and login with author-only editing and
                deletion.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Search className="size-8 text-primary" />
              <h3 className="text-xl font-bold">Search</h3>
              <p className="text-muted-foreground">
                Full-text search across titles and bodies from the header.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

async function StatsStrip() {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  const stats = await fetchQuery(api.posts.getStats);

  return (
    <section className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
      <Card>
        <CardContent className="pt-6 flex items-center gap-4">
          <FileText className="size-8 text-primary" />
          <div>
            <p className="text-3xl font-extrabold">{stats.postCount}</p>
            <p className="text-sm text-muted-foreground">
              {stats.postCount === 1 ? "Post" : "Posts"} published
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 flex items-center gap-4">
          <MessagesSquare className="size-8 text-primary" />
          <div>
            <p className="text-3xl font-extrabold">{stats.commentCount}</p>
            <p className="text-sm text-muted-foreground">
              {stats.commentCount === 1 ? "Comment" : "Comments"} posted
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

async function LatestPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  const data = await fetchQuery(api.posts.getPosts);
  const latest = data ?? [];

  if (latest.length === 0) {
    return (
      <div className="text-center border rounded-xl py-16 px-4">
        <h3 className="text-xl font-bold">No posts yet</h3>
        <p className="text-muted-foreground mt-2">
          Be the first to publish something.
        </p>
        <Link
          className={buttonVariants({ className: "mt-6" })}
          href="/create"
        >
          <PenLine className="size-4" />
          Start writing
        </Link>
      </div>
    );
  }

  const [featured, ...rest] = latest;
  const grid = rest.slice(0, 6);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden pt-0">
        <div className="grid md:grid-cols-2">
          <div className="relative h-64 md:h-full md:min-h-80 w-full overflow-hidden">
            <Image
              src={featured.imageUrl ?? FALLBACK_COVER}
              alt={`Cover image for ${featured.title}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Featured post
            </p>
            <Link href={`/blog/${featured._id}`}>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight hover:text-primary">
                {featured.title}
              </h3>
            </Link>
            <p className="text-muted-foreground line-clamp-3">
              {featured.body}
            </p>
            <div>
              <Link
                className={buttonVariants()}
                href={`/blog/${featured._id}`}
              >
                Read featured post
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {grid.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {grid.map((post) => (
            <Card key={post._id} className="pt-0">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.imageUrl ?? FALLBACK_COVER}
                  alt={`Cover image for ${post.title}`}
                  fill
                  className="rounded-t-lg object-cover"
                />
              </div>

              <CardContent>
                <Link href={`/blog/${post._id}`}>
                  <h3 className="text-2xl font-bold hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.body}
                  </p>
                </Link>
              </CardContent>

              <CardFooter>
                <Link
                  className={buttonVariants({
                    className: "w-full",
                  })}
                  href={`/blog/${post._id}`}
                >
                  Read more
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <section className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
      {[0, 1].map((i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </section>
  );
}

function LatestPostsSkeleton() {
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
