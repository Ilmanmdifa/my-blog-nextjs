"use server";

import z from "zod";
import { editPostSchema, postSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { updateTag } from "next/cache";

export async function createBlogPost(values: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error("Invalid form data");
    }

    const token = await getToken();
    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadURL,
      {},
      { token }
    );

    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return {
        error: "Failed to upload image",
      };
    }

    const { storageId } = await uploadResult.json();

    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        body: parsed.data.content,
        imageStorageId: storageId,
      },
      { token }
    );
  } catch {
    return {
      error: "Failed to create post",
    };
  }

  updateTag("blog");
  return { success: true as const };
}

export async function updateBlogPost(
  postId: Id<"posts">,
  values: z.infer<typeof editPostSchema>
) {
  try {
    const parsed = editPostSchema.safeParse(values);

    if (!parsed.success) {
      return {
        error: "Invalid form data",
      };
    }

    const token = await getToken();

    let imageStorageId: Id<"_storage"> | undefined;
    if (parsed.data.image) {
      const imageUrl = await fetchMutation(
        api.posts.generateImageUploadURL,
        {},
        { token }
      );

      const uploadResult = await fetch(imageUrl, {
        method: "POST",
        headers: {
          "Content-Type": parsed.data.image.type,
        },
        body: parsed.data.image,
      });

      if (!uploadResult.ok) {
        return {
          error: "Failed to upload image",
        };
      }

      const { storageId } = await uploadResult.json();
      imageStorageId = storageId;
    }

    await fetchMutation(
      api.posts.updatePost,
      {
        postId,
        title: parsed.data.title,
        body: parsed.data.content,
        ...(imageStorageId ? { imageStorageId } : {}),
      },
      { token }
    );
  } catch {
    return {
      error: "Failed to update post",
    };
  }

  updateTag("blog");
  return { success: true as const };
}

export async function deleteBlogPost(postId: Id<"posts">) {
  try {
    const token = await getToken();

    await fetchMutation(api.posts.deletePost, { postId }, { token });
  } catch {
    return {
      error: "Failed to delete post",
    };
  }

  updateTag("blog");
  return { success: true as const };
}
