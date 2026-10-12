import { buttonVariants } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchAuthQuery, isAuthenticated } from "@/lib/auth-server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { EditPostForm } from "./EditPostForm";

interface EditPostRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}

export default async function EditPostRoute({ params }: EditPostRouteProps) {
  await connection();
  const { postId } = await params;

  if (!(await isAuthenticated())) {
    return redirect("/auth/login");
  }

  const post = await fetchAuthQuery(api.posts.getPostById, {
    postId: postId,
  });

  if (!post) {
    return redirect("/blog");
  }

  const userId = await fetchAuthQuery(api.presence.getUserId, {});

  if (!userId || post.authorId !== userId) {
    return redirect(`/blog/${postId}`);
  }

  return (
    <div className="py-12">
      <div className="max-w-xl mx-auto mb-8">
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href={`/blog/${postId}`}
        >
          <ArrowLeft />
          Back to post
        </Link>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Edit Post
        </h1>
        <p className="text-xl text-muted-foreground pt-4">
          Update your post.
        </p>
      </div>
      <EditPostForm
        postId={postId}
        initialTitle={post.title}
        initialContent={post.body}
      />
    </div>
  );
}
