import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";
import PostPresence from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchAuthQuery, isAuthenticated, preloadAuthQuery } from "@/lib/auth-server";
import { fetchQuery} from "convex/nextjs";
import { ArrowLeft, Pencil } from "lucide-react";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { DeletePostButton } from "./DeletePostButton";

interface PostIdRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}

export async function generateMetadata({
  params,
}: PostIdRouteProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await getCachedPostForMetadata(postId);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.body,
  };
}

async function getCachedPostForMetadata(postId: Id<"posts">) {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  return fetchQuery(api.posts.getPostById, { postId: postId });
}
export default async function PostIdRoute({ params }: PostIdRouteProps) {
  await connection();
  const { postId } = await params;

  if(!(await isAuthenticated())){
    return redirect("/auth/login")
  }

  const [post, preloadedComments, userId] = await Promise.all([
    fetchAuthQuery(api.posts.getPostById, { postId: postId }),
    preloadAuthQuery(api.comments.getCommentsByPostId, {
      postId: postId,
    }),
    fetchAuthQuery(api.presence.getUserId, {}),
  ]);

  if (!userId) {
    return redirect("/auth/login");
  }

  if (!post) {
    return (
      <div>
        <h1 className="text-6xl font-extrabold">No post found</h1>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        className={buttonVariants({ variant: "ghost", className: "mb-4" })}
        href="/blog"
      >
        <ArrowLeft />
        Back to blog
      </Link>

      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={
            post.imageUrl ??
            "https://plus.unsplash.com/premium_photo-1765838785521-f8905414beb4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={post.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Posted on:{" "}
            {new Date(post._creationTime).toLocaleDateString("en-US")}
          </p>
          {userId && <PostPresence roomId={post._id} userId={userId} />}
        </div>
        {userId && post.authorId === userId && (
          <div className="flex items-center gap-2 pt-2">
            <Link
              className={buttonVariants({ variant: "outline" })}
              href={`/blog/${post._id}/edit`}
            >
              <Pencil className="size-4" />
              Edit
            </Link>
            <DeletePostButton postId={post._id} />
          </div>
        )}
      </div>
      <Separator className="m-8" />
      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {post.body}
      </p>
      <Separator className="m-8" />
      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
}
