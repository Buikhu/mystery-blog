import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "./components/DeleteButton";
import { requireAdmin } from "@/lib/auth";
import { logoutAdmin } from "./logout/actions";

type Props = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

export default async function AdminPage({ searchParams }: Props) {
  await requireAdmin();

  const params = await searchParams;

  const search = params.search?.trim() || "";
  const status = params.status || "all";

  const where = {
    ...(search
      ? {
          title: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {}),

    ...(status === "published"
      ? {
          isPublished: true,
        }
      : status === "draft"
        ? {
            isPublished: false,
          }
        : {}),
  };

  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    posts,
  ] = await Promise.all([
    prisma.post.count(),

    prisma.post.count({
      where: {
        isPublished: true,
      },
    }),

    prisma.post.count({
      where: {
        isPublished: false,
      },
    }),

    prisma.post.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[#172033]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-[#d8d0c0] bg-[#172033] text-[#f5f1e8]">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-6 lg:px-8">

          <div>

            <Link
              href="/"
              className="font-serif text-xl font-bold tracking-wide"
            >
              MYSTERY ARCHIVE
            </Link>

            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#b88a44]">
              Administration
            </p>

          </div>

          {/* =================================================
              ADMIN ACTIONS
          ================================================= */}

          <div className="flex items-center gap-2 sm:gap-3">

            {/* View Site */}

            <Link
              href="/"
              target="_blank"
              className="hidden rounded-full border border-[#667080] px-4 py-2 text-xs font-semibold text-[#e8e5dc] transition hover:border-[#b88a44] hover:text-white sm:block"
            >
              View Site
            </Link>

            {/* New Post */}

            <Link
              href="/admin/posts/new"
              className="rounded-full bg-[#b88a44] px-4 py-2 text-xs font-bold text-[#172033] transition hover:bg-[#d2a963]"
            >
              + New Post
            </Link>

            {/* Logout */}

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-full border border-[#667080] px-4 py-2 text-xs font-semibold text-[#e8e5dc] transition hover:border-red-400 hover:bg-red-400/10 hover:text-red-300"
              >
                Logout
              </button>
            </form>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">

        {/* =====================================================
            PAGE TITLE
        ===================================================== */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <span className="h-px w-8 bg-[#b88a44]" />

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8e3b32]">
              Content Management
            </p>

          </div>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <h1 className="font-serif text-4xl font-bold text-[#172033]">
                Your Archive
              </h1>

              <p className="mt-2 text-sm text-[#6b6b65]">
                Manage stories published on Mystery Archive.
              </p>

            </div>

            <div className="font-serif text-5xl text-[#d8d0c0]">
              ✦
            </div>

          </div>

        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="grid gap-4 sm:grid-cols-3">

          {/* Total */}

          <div className="rounded-xl border border-[#d8d0c0] bg-[#fffdf8] p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77776f]">
                Total Stories
              </p>

              <span className="font-serif text-2xl text-[#b88a44]">
                ✦
              </span>

            </div>

            <p className="mt-3 font-serif text-4xl font-bold text-[#172033]">
              {totalPosts}
            </p>

          </div>

          {/* Published */}

          <div className="rounded-xl border border-[#d8d0c0] bg-[#fffdf8] p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77776f]">
                Published
              </p>

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e4eee5] text-xs text-[#3e6846]">
                ✓
              </span>

            </div>

            <p className="mt-3 font-serif text-4xl font-bold text-[#3e6846]">
              {publishedPosts}
            </p>

          </div>

          {/* Draft */}

          <div className="rounded-xl border border-[#d8d0c0] bg-[#fffdf8] p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77776f]">
                Drafts
              </p>

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f1e8d7] text-xs text-[#9a6a28]">
                ○
              </span>

            </div>

            <p className="mt-3 font-serif text-4xl font-bold text-[#9a6a28]">
              {draftPosts}
            </p>

          </div>

        </div>

        {/* =====================================================
            SEARCH / FILTER
        ===================================================== */}

        <div className="mt-8 rounded-xl border border-[#d8d0c0] bg-[#fffdf8] p-4 shadow-sm">

          <form
            method="GET"
            className="flex flex-col gap-3 sm:flex-row"
          >

            <div className="flex-1">

              <label
                htmlFor="search"
                className="sr-only"
              >
                Search posts
              </label>

              <input
                id="search"
                name="search"
                defaultValue={search}
                placeholder="Search stories..."
                className="w-full rounded-lg border border-[#d8d0c0] bg-[#f8f4eb] px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#99968e] focus:border-[#b88a44] focus:ring-2 focus:ring-[#b88a44]/20"
              />

            </div>

            <select
              name="status"
              defaultValue={status}
              className="rounded-lg border border-[#d8d0c0] bg-[#f8f4eb] px-4 py-3 text-sm text-[#172033] outline-none focus:border-[#b88a44]"
            >
              <option value="all">
                All stories
              </option>

              <option value="published">
                Published
              </option>

              <option value="draft">
                Drafts
              </option>
            </select>

            <button
              type="submit"
              className="rounded-lg bg-[#172033] px-5 py-3 text-sm font-semibold text-[#f5f1e8] transition hover:bg-[#8e3b32]"
            >
              Search
            </button>

          </form>

        </div>

        {/* =====================================================
            POSTS
        ===================================================== */}

        <div className="mt-6 overflow-hidden rounded-xl border border-[#d8d0c0] bg-[#fffdf8] shadow-sm">

          {/* Desktop header */}

          <div className="hidden border-b border-[#e2dbcf] bg-[#eee8dc] px-5 py-4 md:grid md:grid-cols-[1fr_130px_130px_180px] md:gap-4">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#77776f]">
              Story
            </p>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#77776f]">
              Category
            </p>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#77776f]">
              Status
            </p>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#77776f]">
              Actions
            </p>

          </div>

          {posts.length > 0 ? (

            <div>

              {posts.map((post) => (

                <div
                  key={post.id}
                  className="border-b border-[#e5dfd4] p-4 last:border-b-0 sm:p-5"
                >

                  <div className="grid gap-4 md:grid-cols-[1fr_130px_130px_180px] md:items-center md:gap-4">

                    {/* Story */}

                    <div className="flex min-w-0 gap-4">

                      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-[#e9e3d8] sm:h-24 sm:w-36">

                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />

                      </div>

                      <div className="min-w-0">

                        <h2 className="line-clamp-2 font-serif text-lg font-bold leading-tight text-[#172033]">
                          {post.title}
                        </h2>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#77776f]">
                          {post.summary}
                        </p>

                        <time className="mt-2 block text-[10px] text-[#99968e]">
                          {new Date(
                            post.createdAt
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>

                      </div>

                    </div>

                    {/* Category */}

                    <div>

                      <span className="inline-flex rounded-full bg-[#eee3d4] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#8e3b32]">
                        {post.category}
                      </span>

                    </div>

                    {/* Status */}

                    <div>

                      {post.isPublished ? (

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e4eee5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#3e6846]">

                          <span className="h-1.5 w-1.5 rounded-full bg-[#3e6846]" />

                          Published

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1e8d7] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#9a6a28]">

                          <span className="h-1.5 w-1.5 rounded-full bg-[#9a6a28]" />

                          Draft

                        </span>

                      )}

                    </div>

                    {/* Actions */}

                    <div className="flex flex-wrap items-center gap-3 border-t border-[#eee8dc] pt-3 md:border-0 md:pt-0">

                      <Link
                        href={`/posts/${post.slug}`}
                        target="_blank"
                        className="text-xs font-semibold text-[#172033] transition hover:text-[#8e3b32]"
                      >
                        View
                      </Link>

                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-xs font-semibold text-[#8e3b32] transition hover:text-[#b06b4d]"
                      >
                        Edit
                      </Link>

                      <DeleteButton postId={post.id} />

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="px-5 py-16 text-center">

              <div className="font-serif text-5xl text-[#b88a44]">
                ✦
              </div>

              <h2 className="mt-4 font-serif text-2xl font-bold text-[#172033]">
                No stories found
              </h2>

              <p className="mt-2 text-sm text-[#77776f]">
                Try another search or create your first story.
              </p>

              <Link
                href="/admin/posts/new"
                className="mt-6 inline-flex rounded-full bg-[#172033] px-5 py-2.5 text-sm font-semibold text-[#f5f1e8] transition hover:bg-[#8e3b32]"
              >
                Create a story
              </Link>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}