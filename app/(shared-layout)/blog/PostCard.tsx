import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_COVER =
  "https://plus.unsplash.com/premium_photo-1765838785521-f8905414beb4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export interface PostCardPost {
  _id: string;
  title: string;
  body: string;
  imageUrl: string | null;
}

export function PostCard({ post }: { post: PostCardPost }) {
  return (
    <Card className="pt-0">
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
          <h1 className="text-2xl font-bold hover:text-primary">
            {post.title}
          </h1>
          <p className="text-muted-foreground line-clamp-3">{post.body}</p>
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
  );
}
