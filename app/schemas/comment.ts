import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

export const commentSchema = z.object({
  body: z.string().min(3, "Comment must be at least 3 characters"),
  postId: z.custom<Id<"posts">>(),
});
