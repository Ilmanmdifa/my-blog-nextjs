import { Navbar } from "@/components/web/navbar";
import { ReactNode } from "react";
import Link from "next/link";

export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <footer className="border-t mt-20">
        <div className="py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/">
            <p className="text-xl font-bold">
              Next<span className="text-primary">Pro</span>
            </p>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link className="hover:text-foreground" href="/">
              Home
            </Link>
            <Link className="hover:text-foreground" href="/blog">
              Blog
            </Link>
            <Link className="hover:text-foreground" href="/create">
              Create
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            Built with Next.js and Convex.
          </p>
        </div>
      </footer>
    </>
  );
}
