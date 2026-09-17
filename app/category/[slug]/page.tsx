import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl = "https://www.themysteryarchive.com";

const categories = {
  "unsolved-mysteries": {
    name: "Unsolved Mysteries",
    description:
      "Cases, disappearances, and historical mysteries that still have no definitive answer.",
  },

  "strange-events": {
    name: "Strange Events",
    description:
      "Unusual historical events that left witnesses, investigators, and historians searching for answers.",
  },

  "bizarre-figures": {
    name: "Bizarre Figures",
    description:
      "The strange, fascinating, and unforgettable people who became part of history.",
  },
} as const;

type CategorySlug = keyof typeof categories;

function getCategory(slug: string) {
  return categories[slug as CategorySlug];
}

/* =========================================================
   STATIC PARAMS
========================================================= */

export function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({
    slug,
  }));
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const category = getCategory(slug);

  if (!category) {
    return {
      title: "Category Not Found",
      description:
        "The requested Mystery Archive category could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${category.name} | Mystery Archive`;

  const canonicalUrl = `/category/${slug}`;

  return {
    title,

    description: category.description,

    metadataBase: new URL(siteUrl),

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
  title,

  description: category.description,

  url: canonicalUrl,

  siteName: "Mystery Archive",

  type: "website",

  locale: "en_US",

  images: [
    {
      url: "https://themysteryarchive.com/og-image.png",
      width: 1200,
      height: 630,
      alt: `${category.name} - Mystery Archive`,
      type: "image/png",
    },
  ],
},

    twitter: {
  card: "summary_large_image",

  title,

  description: category.description,

  images: [
    "https://themysteryarchive.com/og-image.png",
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

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  const category = getCategory(slug);

  if (!category) {
    notFound();
  }

  const posts = await prisma.post.findMany({
    where: {
      category: category.name,
      isPublished: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const categoryUrl = `${siteUrl}/category/${slug}`;

  /* =======================================================
     STRUCTURED DATA
  ======================================================= */

  const structuredData = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "CollectionPage",

        "@id": `${categoryUrl}#collection`,

        url: categoryUrl,

        name: `${category.name} | Mystery Archive`,

        description: category.description,

        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },

        breadcrumb: {
          "@id": `${categoryUrl}#breadcrumb`,
        },

        mainEntity: {
          "@type": "ItemList",

          numberOfItems: posts.length,

          itemListElement: posts.map((post, index) => ({
            "@type": "ListItem",

            position: index + 1,

            url: `${siteUrl}/posts/${post.slug}`,

            name: post.title,
          })),
        },
      },

      {
        "@type": "BreadcrumbList",

        "@id": `${categoryUrl}#breadcrumb`,

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

            name: category.name,

            item: categoryUrl,
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
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* =====================================================
          CATEGORY HEADER
      ===================================================== */}

      <section className="border-b border-[#d8d0c0] bg-[#f5f1e8]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          {/* Breadcrumb */}

          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs"
          >
            <Link
              href="/"
              className="font-semibold text-[#8e3b32] transition hover:text-[#b06b4d]"
            >
              Home
            </Link>

            <span
              aria-hidden="true"
              className="text-[#b8ad9a]"
            >
              /
            </span>

            <span
              aria-current="page"
              className="text-[#77776f]"
            >
              {category.name}
            </span>
          </nav>

          {/* Label */}

          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-10 bg-[#b88a44]" />

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8e3b32]">
              Mystery Archive
            </p>
          </div>

          {/* Title */}

          <div className="mt-4 flex items-end justify-between gap-8">
            <div>
              <h1 className="font-serif text-4xl font-bold tracking-tight text-[#172033] sm:text-5xl md:text-6xl">
                {category.name}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-[#62645f] sm:text-lg sm:leading-8">
                {category.description}
              </p>
            </div>

            <div
              aria-hidden="true"
              className="hidden font-serif text-7xl text-[#d8d0c0] md:block"
            >
              ✦
            </div>
          </div>

          {/* Count */}

          <div className="mt-7 flex items-center gap-3 text-xs">
            <span className="font-bold text-[#172033]">
              {posts.length}
            </span>

            <span className="text-[#77776f]">
              {posts.length === 1
                ? "story"
                : "stories"}{" "}
              in this archive
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          POSTS
      ===================================================== */}

      <section aria-labelledby="category-stories">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          {posts.length > 0 ? (
            <>
              <h2
                id="category-stories"
                className="sr-only"
              >
                Stories in {category.name}
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="group overflow-hidden rounded-xl border border-[#d8d0c0] bg-[#fffdf8] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Image */}

                    <div className="relative aspect-[16/10] overflow-hidden bg-[#e9e3d8]">
                      <Image
                        src={post.thumbnailUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />

                      {/* Number */}

                      <div
                        aria-hidden="true"
                        className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#172033]/85 font-serif text-xs text-[#f5f1e8] backdrop-blur"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      {/* Category */}

                      <div className="absolute bottom-4 left-4">
                        <span className="rounded-full border border-white/30 bg-[#172033]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[10px]">
                        <time
                          dateTime={post.createdAt.toISOString()}
                          className="text-[#85857d]"
                        >
                          {new Date(
                            post.createdAt
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>

                        <span
                          aria-hidden="true"
                          className="text-[#b8ad9a]"
                        >
                          •
                        </span>

                        <span
                          aria-hidden="true"
                          className="text-[#b88a44]"
                        >
                          ✦
                        </span>
                      </div>

                      <h2 className="mt-3 line-clamp-2 font-serif text-xl font-bold leading-tight text-[#172033] transition group-hover:text-[#8e3b32]">
                        {post.title}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#686a65]">
                        {post.summary}
                      </p>

                      {/* Tags */}

                      {post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] text-[#99968e]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-5 flex items-center justify-between border-t border-[#e5dfd4] pt-4">
                        <span className="text-xs font-bold uppercase tracking-wide text-[#172033]">
                          Read story
                        </span>

                        <span
                          aria-hidden="true"
                          className="text-[#b88a44] transition-transform duration-300 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            /* Empty state */

            <div className="rounded-xl border border-[#d8d0c0] bg-[#fffdf8] px-5 py-20 text-center">
              <div
                aria-hidden="true"
                className="font-serif text-5xl text-[#b88a44]"
              >
                ✦
              </div>

              <h2 className="mt-4 font-serif text-2xl font-bold text-[#172033]">
                No stories yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#77776f]">
                This part of the archive is still waiting
                for its first mystery.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex rounded-full bg-[#172033] px-5 py-2.5 text-sm font-semibold text-[#f5f1e8] transition hover:bg-[#8e3b32]"
              >
                Back to archive
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          OTHER CATEGORIES
      ===================================================== */}

      <section className="border-t border-[#d8d0c0] bg-[#eee8dc]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#b88a44]" />

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8e3b32]">
              Explore More
            </p>
          </div>

          <h2 className="mt-2 font-serif text-2xl font-bold text-[#172033]">
            Other archives
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {Object.entries(categories)
              .filter(
                ([categorySlug]) =>
                  categorySlug !== slug
              )
              .map(
                ([categorySlug, otherCategory]) => (
                  <Link
                    key={categorySlug}
                    href={`/category/${categorySlug}`}
                    className="group rounded-xl border border-[#d8d0c0] bg-[#fffdf8] p-5 transition hover:-translate-y-0.5 hover:border-[#b88a44] hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-[#172033] transition group-hover:text-[#8e3b32]">
                        {otherCategory.name}
                      </h3>

                      <span
                        aria-hidden="true"
                        className="text-[#b88a44] transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-[#77776f]">
                      {otherCategory.description}
                    </p>
                  </Link>
                )
              )}
          </div>
        </div>
      </section>
    </>
  );
}