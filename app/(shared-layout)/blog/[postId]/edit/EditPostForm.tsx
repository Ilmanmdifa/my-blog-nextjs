"use client";

import { updateBlogPost } from "@/app/actions";
import { editPostSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface EditPostFormProps {
  postId: Id<"posts">;
  initialTitle: string;
  initialContent: string;
}

export function EditPostForm({
  postId,
  initialTitle,
  initialContent,
}: EditPostFormProps) {
  const [isPending, startTransition] = useTransition();
  const [fileKey, setFileKey] = useState(0);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: initialTitle,
      content: initialContent,
      image: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof editPostSchema>) {
    startTransition(async () => {
      const result = await updateBlogPost(postId, values);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Post updated");
      form.reset(values);
      setFileKey((key) => key + 1);
      router.push(`/blog/${postId}`);
    });
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Blog Article</CardTitle>
        <CardDescription>Update your blog article</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-4">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="My first blog post"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Content</FieldLabel>
                  <Textarea
                    aria-invalid={fieldState.invalid}
                    placeholder="Write your post content here..."
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Cover image (optional, keeps current)</FieldLabel>
                  <Input
                    key={fileKey}
                    aria-invalid={fieldState.invalid}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save changes</span>
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
