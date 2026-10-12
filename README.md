# NextPro — Realtime Blog

NextPro is a full-stack blog built with Next.js App Router, Convex, Better Auth,
and realtime presence. Authors can publish posts with cover images, readers can
search and discuss through live comments, and only authors can edit or delete
their own content.

> Live demo: add your Vercel deployment URL here.

## Stack

- Next.js 16 (App Router, cached server components)
- React 19 + Tailwind CSS 4 + shadcn/ui
- Convex (database, file storage, full-text search indexes)
- Better Auth via `@convex-dev/better-auth`
- Realtime presence via `@convex-dev/presence`
- react-hook-form + Zod validation, Sonner toasts

## Features

- Public homepage with hero, latest posts, Why NextPro section, and content stats
- Blog list with cached rendering and skeleton loading states
- Post detail with cover image, live reader presence, and comments
- Author-only post edit and delete (enforced server-side in Convex)
- Authenticated comments with author-only delete and empty state
- Header full-text search with dismissible results dropdown
- Image uploads through Convex storage

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- A Convex account (`npx convex dev` walks through login)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy the required variables into `.env.local`:

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-deployment.convex.site
```

Also set the Convex backend variable (Convex dashboard → Settings → Environment
Variables, or `npx convex env set`):

```bash
SITE_URL=http://localhost:3000
```

### 3. Start Convex and the app

```bash
npx convex dev
```

In a second terminal:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, create a post, and
it appears in the blog list without a hard refresh.

## Scripts

```bash
pnpm dev    # start the development server
pnpm build  # production build
pnpm start  # run the production build
pnpm lint   # run ESLint
```

## Project Structure

```text
app/(shared-layout)/  # homepage, blog list, post detail, edit, create
app/actions.ts        # post server actions (create, update, delete)
app/schemas/          # Zod schemas for posts, comments, auth
components/web/       # navbar, search, comments, presence, providers
convex/               # posts, comments, presence, auth, schema
lib/                  # auth client/server helpers
```

## Auth Model

Authentication uses Better Auth backed by Convex. Every mutation resolves the
caller with `authComponent.safeGetAuthUser` and rejects anonymous callers.
Post updates/deletes and comment deletes additionally require
`authorId === user._id`, so UI buttons are cosmetic — the server is the
enforcement point.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import it in Vercel and set the same environment variables as `.env.local`.
3. Deploy. Set the Convex `SITE_URL` / allowed origins to the Vercel URL so
   auth callbacks succeed.

Repository: [https://github.com/Ilmanmdifa/my-blog-nextjs](https://github.com/Ilmanmdifa/my-blog-nextjs)
