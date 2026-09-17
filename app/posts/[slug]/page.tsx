import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
  });

  if (!post || !post.isPublished) {
    return {
      title: "Story Not Found",
      description:
        "The requested story could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const postUrl = `${siteUrl}/posts/${post.slug}`;

  return {
    title: post.title,

    description: post.summary,

    metadataBase: new URL(siteUrl),

    keywords: [
      post.category,
      ...post.tags,
      "historical mystery",
      "historical mysteries",
      "unexplained history",
      "strange historical events",
      "bizarre historical figures",
    ],

    alternates: {
      canonical: postUrl,
    },

    openGraph: {
      type: "article",

      url: postUrl,

      title: post.title,

      description: post.summary,

      siteName: "Mystery Archive",

      locale: "en_US",

      publishedTime:
        post.createdAt.toISOString(),

      modifiedTime:
        post.updatedAt.toISOString(),

      section: post.category,

      tags: post.tags,

      images: [
        {
          url: post.thumbnailUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: "image/png",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: post.title,

      description: post.summary,

      images: [
        {
          url: post.thumbnailUrl,
          alt: post.title,
        },
      ],
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
/* =========================================================
   PAGE
========================================================= */

export default async function PostPage({
  params,
}: Props) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  /* =======================================================
     RELATED POSTS
  ======================================================= */

  const relatedPosts = await prisma.post.findMany({
    where: {
      isPublished: true,

      category: post.category,

      NOT: {
        id: post.id,
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 3,
  });

  /* =======================================================
     CATEGORY SLUG
  ======================================================= */

  const categorySlug = post.category
    .toLowerCase()
    .replace(/\s+/g, "-");

  /* =======================================================
     URL
  ======================================================= */

  const postUrl =
    `${siteUrl}/posts/${post.slug}`;

  const categoryUrl =
    `${siteUrl}/category/${categorySlug}`;

  /* =======================================================
     STRUCTURED DATA
  ======================================================= */

  const structuredData = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "Article",

        "@id": `${postUrl}#article`,

        url: postUrl,

        headline: post.title,

        description: post.summary,

        image: [post.thumbnailUrl],

        datePublished:
          post.createdAt.toISOString(),

        dateModified:
          post.updatedAt.toISOString(),

        author: {
          "@type": "Organization",

          "@id": `${siteUrl}#organization`,

          name: "Mystery Archive",

          url: siteUrl,
        },

        publisher: {
          "@type": "Organization",

          "@id": `${siteUrl}#organization`,

          name: "Mystery Archive",

          url: siteUrl,

          logo: {
            "@type": "ImageObject",

            url: `${siteUrl}/icon-512.png`,
          },
        },

        mainEntityOfPage: {
          "@type": "WebPage",

          "@id": postUrl,
        },

        articleSection: post.category,

        keywords: [
          post.category,
          ...post.tags,
          "historical mystery",
          "historical mysteries",
          "unexplained history",
          "strange historical events",
        ].join(", "),
      },

      {
        "@type": "BreadcrumbList",

        "@id": `${postUrl}#breadcrumb`,

        itemListElement: [
          {
            "@type": "ListItem",

            position: 1,

            name: "Home",

            item: siteUrl,
          },

          {
            "@type": "ListItem",

            position: 2,

            name: post.category,

            item: categoryUrl,
          },

          {
            "@type": "ListItem",

            position: 3,

            name: post.title,

            item: postUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* =====================================================
          STRUCTURED DATA
      ===================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(structuredData),
        }}
      />

      {/* =====================================================
          ARTICLE HEADER
      ===================================================== */}

      <section className="border-b border-[#d8d0c0] bg-[#f5f1e8]">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

          {/* Breadcrumb */}

          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-[#85857d]"
          >
            <Link
              href="/"
              className="transition hover:text-[#8e3b32]"
            >
              Home
            </Link>

            <span aria-hidden="true">
              ›
            </span>

            <Link
              href={`/category/${categorySlug}`}
              className="transition hover:text-[#8e3b32]"
            >
              {post.category}
            </Link>

            <span aria-hidden="true">
              ›
            </span>

            <span className="text-[#a19d93]">
              Story
            </span>
          </nav>

          {/* Category */}

          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-8 bg-[#b88a44]" />

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8e3b32]">
              {post.category}
            </span>
          </div>

          {/* Title */}

          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-bold leading-[1.08] tracking-tight text-[#172033] sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {/* Summary */}

          <p className="mt-6 max-w-3xl text-base leading-7 text-[#5d625f] sm:text-lg sm:leading-8">
            {post.summary}
          </p>

          {/* Date */}

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-[#85857d]">
            <time dateTime={post.createdAt.toISOString()}>
              {new Date(
                post.createdAt
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>

            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full bg-[#b88a44]"
            />

            <span>
              Mystery Archive
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          ARTICLE IMAGE
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[#d8d0c0] bg-[#e9e3d8] shadow-sm">

          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1200px"
            className="object-cover"
          />

        </div>
      </section>

      {/* =====================================================
          ARTICLE CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-6 lg:px-8">

        <div className="grid gap-10 lg:grid-cols-[minmax(0,760px)_260px] lg:justify-center">

          {/* Main article */}

          <article className="min-w-0 rounded-2xl border border-[#d8d0c0] bg-[#fffdf8] px-5 py-8 shadow-sm sm:px-8 sm:py-10 lg:px-12 lg:py-12">

            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Sources & Further Reading */}

            {post.sources && (
              <div className="mt-12 border-t border-[#e1dbcf] pt-8">

                <h2 className="font-serif text-2xl font-bold text-[#172033]">
                  Sources & Further Reading
                </h2>

                <div className="markdown-content mt-4 text-sm">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                  >
                    {post.sources}
                  </ReactMarkdown>
                </div>

              </div>
            )}

            {/* Tags */}

            {post.tags.length > 0 && (
              <div className="mt-10 border-t border-[#e1dbcf] pt-6">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77776f]">
                  Filed under
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#d8d0c0] bg-[#f5f1e8] px-3 py-1.5 text-xs font-semibold text-[#62645f]"
                    >
                      #{tag}
                    </span>
                  ))}

                </div>
              </div>
            )}

          </article>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="hidden lg:block">

            <div className="sticky top-28">

              {/* Archive card */}

              <div className="rounded-xl border border-[#d8d0c0] bg-[#fffdf8] p-5">

                <div className="font-serif text-4xl text-[#b88a44]">
                  ✦
                </div>

                <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8e3b32]">
                  The Archive
                </p>

                <h2 className="mt-2 font-serif text-xl font-bold text-[#172033]">
                  Keep exploring
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#6b6b65]">
                  Discover more strange stories from the
                  unexplained corners of history.
                </p>

                <Link
                  href={`/category/${categorySlug}`}
                  className="mt-5 inline-flex text-sm font-bold text-[#8e3b32] transition hover:text-[#b06b4d]"
                >
                  More from this category →
                </Link>

              </div>

              {/* Related */}

              {relatedPosts.length > 0 && (
                <div className="mt-6">

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8e3b32]">
                    Related Stories
                  </p>

                  <div className="mt-4 space-y-4">

                    {relatedPosts.map(
                      (relatedPost) => (
                        <Link
                          key={relatedPost.id}
                          href={`/posts/${relatedPost.slug}`}
                          className="group block"
                        >

                          <div className="flex gap-3">

                            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#e9e3d8]">

                              <Image
                                src={
                                  relatedPost.thumbnailUrl
                                }
                                alt={
                                  relatedPost.title
                                }
                                fill
                                sizes="80px"
                                className="object-cover transition duration-500 group-hover:scale-105"
                              />

                            </div>

                            <div className="min-w-0">

                              <h3 className="line-clamp-2 font-serif text-sm font-bold leading-5 text-[#172033] transition group-hover:text-[#8e3b32]">
                                {relatedPost.title}
                              </h3>

                              <time className="mt-1 block text-[10px] text-[#99968e]">
                                {new Date(
                                  relatedPost.createdAt
                                ).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </time>

                            </div>

                          </div>

                        </Link>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>

          </aside>

        </div>

      </section>

      {/* =====================================================
          RELATED STORIES - MOBILE
      ===================================================== */}

      {relatedPosts.length > 0 && (
        <section className="border-t border-[#d8d0c0] bg-[#eee8dc] lg:hidden">

          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">

            <div className="flex items-center gap-3">

              <span className="h-px w-8 bg-[#b88a44]" />

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8e3b32]">
                Continue Reading
              </p>

            </div>

            <h2 className="mt-2 font-serif text-3xl font-bold text-[#172033]">
              More from the archive
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              {relatedPosts.map(
                (relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/posts/${relatedPost.slug}`}
                    className="group overflow-hidden rounded-xl border border-[#d8d0c0] bg-[#fffdf8] transition hover:-translate-y-1 hover:shadow-md"
                  >

                    <div className="relative aspect-[16/10] overflow-hidden bg-[#e9e3d8]">

                      <Image
                        src={
                          relatedPost.thumbnailUrl
                        }
                        alt={
                          relatedPost.title
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                    </div>

                    <div className="p-4">

                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#8e3b32]">
                        {relatedPost.category}
                      </span>

                      <h3 className="mt-2 line-clamp-2 font-serif text-lg font-bold leading-tight text-[#172033] transition group-hover:text-[#8e3b32]">
                        {relatedPost.title}
                      </h3>

                    </div>

                  </Link>
                )
              )}

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          BACK TO CATEGORY
      ===================================================== */}

      <section className="border-t border-[#d8d0c0] bg-[#f5f1e8]">

        <div className="mx-auto max-w-5xl px-5 py-10 text-center sm:px-6">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77776f]">
            Continue exploring
          </p>

          <Link
            href={`/category/${categorySlug}`}
            className="mt-3 inline-block font-serif text-2xl font-bold text-[#8e3b32] transition hover:text-[#b06b4d]"
          >
            More {post.category} →
          </Link>

        </div>

      </section>
    </>
  );
}