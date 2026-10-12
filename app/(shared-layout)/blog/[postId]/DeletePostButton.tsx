"use client";

import { deleteBlogPost } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeletePostButton({ postId }: { postId: Id<"posts"> }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!window.confirm("Delete this post? This cannot be undone.")) {
      return;
    }
    startTransition(async () => {
      const result = await deleteBlogPost(postId);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Post deleted");
      router.push("/blog");
      router.refresh();
    });
  }

  return (
    <Button
      variant="destructive"
      disabled={isPending}
      onClick={handleDelete}
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Deleting...</span>
        </>
      ) : (
        <>
          <Trash2 className="size-4" />
          <span>Delete</span>
        </>
      )}
    </Button>
  );
}
