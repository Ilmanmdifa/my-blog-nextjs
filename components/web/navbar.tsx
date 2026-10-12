"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SearchInput } from "./SearchInput";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/create", label: "Create" },
];

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthPage = pathname?.startsWith("/auth") ?? false;

  function handleSignOut() {
    setMenuOpen(false);
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/");
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    });
  }

  function renderAuthActions(vertical = false) {
    if (isAuthPage) {
      return null;
    }
    if (isLoading) {
      return (
        <div
          className={`flex items-center gap-2 ${vertical ? "flex-col items-stretch" : ""}`}
          aria-hidden="true"
        >
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
        </div>
      );
    }
    if (isAuthenticated) {
      return <Button onClick={handleSignOut}>Logout</Button>;
    }
    return (
      <>
        <Link
          className={buttonVariants()}
          href="/auth/sign-up"
          onClick={() => setMenuOpen(false)}
        >
          Sign Up
        </Link>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href="/auth/login"
          onClick={() => setMenuOpen(false)}
        >
          Login
        </Link>
      </>
    );
  }

  return (
    <nav className="w-full py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <h1 className="text-3xl font-bold">
              Next<span className="text-primary">Pro</span>
            </h1>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                className={buttonVariants({ variant: "ghost" })}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="mr-2">
            <SearchInput />
          </div>
          {renderAuthActions()}
          <ThemeToggle />
        </div>
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4 border-t pt-4">
          <SearchInput />
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                className={buttonVariants({
                  variant: "ghost",
                  className: "justify-start",
                })}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {renderAuthActions(true)}
          </div>
        </div>
      )}
    </nav>
  );
}
