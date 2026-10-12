import z from "zod";

export const MAX_IMAGE_BYTES = 1 * 1024 * 1024;

const imageField = z
  .instanceof(File, { error: "A cover image is required" })
  .refine(
    (file) => file.size <= MAX_IMAGE_BYTES,
    "Image must be 1MB or smaller"
  );

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be 50 characters or fewer"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  image: imageField,
});

export const editPostSchema = postSchema.extend({
  image: imageField.optional(),
});
