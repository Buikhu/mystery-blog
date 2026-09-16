import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
export const revalidate = 0;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

const siteDescription =
  "Discover unsolved historical mysteries, strange events, unexplained disappearances, and bizarre figures from the past.";

export const metadata: Metadata = {
  title: "Unsolved Historical Mysteries & Strange Events",

  description: siteDescription,

  metadataBase: new URL(siteUrl),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Unsolved Historical Mysteries & Strange Events",
    description: siteDescription,
    type: "website",
    url: "/",
    siteName: "Mystery Archive",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Unsolved Historical Mysteries & Strange Events",
    description: siteDescription,
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

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 7,
  });

  const featuredPost = posts[0];
  const latestPosts = posts.slice(1);

  const structuredData = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "WebSite",

        "@id": `${siteUrl}/#website`,

        url: siteUrl,

        name: "Mystery Archive",

        description: siteDescription,

        inLanguage: "en-US",

        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },

      {
        "@type": "Organization",

        "@id": `${siteUrl}/#organization`,

        name: "Mystery Archive",

        url: siteUrl,
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
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-[#d8d0c0]">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-[#d8d0c0] opacity-60" />

        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-[#d8d0c0] opacity-60" />

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-[#b88a44]" />

                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8e3b32]">
                  The Unexplained Past
                </p>
              </div>

              <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[1.05] tracking-tight text-[#172033] sm:text-6xl lg:text-7xl">
                Stories history
                <br />
                <span className="text-[#8e3b32]">
                  never fully explained.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-[#5d625f] sm:text-lg sm:leading-8">
                Explore forgotten mysteries, strange historical events,
                unexplained disappearances, and the bizarre figures who
                left their mark on history.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#latest"
                  className="rounded-full bg-[#172033] px-6 py-3 text-sm font-semibold text-[#f5f1e8] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#8e3b32]"
                >
                  Explore Stories
                </a>

                <a
                  href="#about"
                  className="rounded-full border border-[#cfc6b6] px-6 py-3 text-sm font-semibold text-[#172033] transition hover:border-[#b88a44] hover:bg-[#eee8dc]"
                >
                  About the Archive
                </a>
              </div>
            </div>

            <div className="hidden justify-center lg:flex">
              <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-[#cfc6b6]">
                <div className="absolute inset-5 rounded-full border border-[#d8d0c0]" />

                <div className="absolute inset-12 rounded-full border border-[#b88a44]" />

                <div className="text-center">
                  <div className="font-serif text-6xl text-[#b88a44]">
                    ✦
                  </div>

                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8e3b32]">
                    Mystery
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#6b6b65]">
                    History · Truth · Unknown
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED STORY
      ===================================================== */}

      {featuredPost && (
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#b88a44]" />

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8e3b32]">
                  Featured Mystery
                </p>
              </div>

              <h2 className="mt-2 font-serif text-3xl font-bold text-[#172033] sm:text-4xl">
                The story worth remembering
              </h2>
            </div>

            <span className="hidden font-serif text-4xl text-[#d8d0c0] sm:block">
              01
            </span>
          </div>

          <Link
            href={`/posts/${featuredPost.slug}`}
            className="group block overflow-hidden rounded-2xl border border-[#d8d0c0] bg-[#fffdf8] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#e9e3d8] lg:aspect-auto lg:min-h-[460px]">
                <Image
                  src={featuredPost.thumbnailUrl}
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/40 via-transparent to-transparent opacity-70" />

                <div className="absolute bottom-5 left-5">
                  <span className="rounded-full border border-white/40 bg-[#172033]/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-12">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#8e3b32]">
                    Featured
                  </span>

                  <span className="h-1 w-1 rounded-full bg-[#b88a44]" />

                  <time dateTime={featuredPost.createdAt.toISOString()}>
                    {new Date(
                      featuredPost.createdAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>

                <h3 className="mt-5 font-serif text-3xl font-bold leading-tight text-[#172033] transition group-hover:text-[#8e3b32] sm:text-4xl">
                  {featuredPost.title}
                </h3>

                <p className="mt-5 line-clamp-5 text-sm leading-7 text-[#62645f] sm:text-base">
                  {featuredPost.summary}
                </p>

                <div className="mt-7 flex items-center gap-3 text-sm font-bold text-[#172033]">
                  <span>Read the full story</span>

                  <span className="text-lg text-[#b88a44] transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </div>

                <div className="mt-8 h-px w-full bg-[#e1dbcf]" />

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#99968e]">
                    Mystery Archive
                  </span>

                  <span className="text-[#b88a44]">
                    ✦
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* =====================================================
          LATEST STORIES
      ===================================================== */}

      <section
        id="latest"
        className="border-y border-[#d8d0c0] bg-[#eee8dc]"
      >
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#b88a44]" />

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8e3b32]">
                  From the Archive
                </p>
              </div>

              <h2 className="mt-2 font-serif text-3xl font-bold text-[#172033] sm:text-4xl">
                Latest Mysteries
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#6b6b65]">
                New stories of unexplained events, forgotten figures,
                and historical mysteries.
              </p>
            </div>

            <div className="font-serif text-4xl text-[#d0c8b9]">
              02
            </div>
          </div>

          {latestPosts.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="group overflow-hidden rounded-xl border border-[#d8d0c0] bg-[#fffdf8] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#e9e3d8]">
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#172033]/85 font-serif text-sm text-[#f5f1e8] backdrop-blur">
                      {String(index + 2).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-full bg-[#eee3d4] px-2.5 py-1 font-bold uppercase tracking-wide text-[#8e3b32]">
                        {post.category}
                      </span>

                      <span className="text-[#b5ad9e]">
                        •
                      </span>

                      <time dateTime={post.createdAt.toISOString()}>
                        {new Date(
                          post.createdAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>

                    <h3 className="mt-4 line-clamp-2 font-serif text-xl font-bold leading-tight text-[#172033] transition group-hover:text-[#8e3b32]">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#686a65]">
                      {post.summary}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-[#e5dfd4] pt-4">
                      <span className="text-xs font-bold uppercase tracking-wide text-[#172033]">
                        Read story
                      </span>

                      <span className="text-[#b88a44] transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-[#d8d0c0] bg-[#fffdf8] px-5 py-16 text-center">
              <div className="font-serif text-4xl text-[#b88a44]">
                ✦
              </div>

              <h3 className="mt-3 font-serif text-xl font-bold text-[#172033]">
                The archive is just beginning
              </h3>

              <p className="mt-2 text-sm text-[#77776f]">
                More mysteries will be added soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#b88a44]" />

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8e3b32]">
              Explore
            </p>

            <span className="h-px w-8 bg-[#b88a44]" />
          </div>

          <h2 className="mt-3 font-serif text-3xl font-bold text-[#172033] sm:text-4xl">
            Choose your mystery
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6b6b65]">
            Dive into a collection of stories where history meets
            the unexplained.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link
            href="/category/unsolved-mysteries"
            className="group rounded-xl border border-[#d8d0c0] bg-[#fffdf8] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-[#b88a44] hover:shadow-md"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eee8dc] font-serif text-2xl text-[#8e3b32]">
              ?
            </div>

            <h3 className="mt-4 font-serif text-xl font-bold text-[#172033]">
              Unsolved Mysteries
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#6b6b65]">
              Cases and mysteries that history never managed to solve.
            </p>

            <div className="mt-4 text-sm font-bold text-[#8e3b32]">
              Explore →
            </div>
          </Link>

          <Link
            href="/category/strange-events"
            className="group rounded-xl border border-[#d8d0c0] bg-[#fffdf8] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-[#b88a44] hover:shadow-md"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eee8dc] font-serif text-2xl text-[#8e3b32]">
              ✦
            </div>

            <h3 className="mt-4 font-serif text-xl font-bold text-[#172033]">
              Strange Events
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#6b6b65]">
              Unusual events that left witnesses and historians puzzled.
            </p>

            <div className="mt-4 text-sm font-bold text-[#8e3b32]">
              Explore →
            </div>
          </Link>

          <Link
            href="/category/bizarre-figures"
            className="group rounded-xl border border-[#d8d0c0] bg-[#fffdf8] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-[#b88a44] hover:shadow-md"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eee8dc] font-serif text-2xl text-[#8e3b32]">
              ◇
            </div>

            <h3 className="mt-4 font-serif text-xl font-bold text-[#172033]">
              Bizarre Figures
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#6b6b65]">
              The strange and fascinating people history could not forget.
            </p>

            <div className="mt-4 text-sm font-bold text-[#8e3b32]">
              Explore →
            </div>
          </Link>
        </div>
      </section>

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        id="about"
        className="border-y border-[#d8d0c0] bg-[#172033] text-[#f5f1e8]"
      >
        <div className="mx-auto max-w-5xl px-5 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
          <div className="text-3xl text-[#b88a44]">
            ✦
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-[#b88a44]">
            About the Archive
          </p>

          <h2 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            History is full of questions.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#c5c7c5] sm:text-base">
            Mystery Archive explores the forgotten corners of history:
            strange events, unexplained stories, unusual characters,
            and questions that continue to fascinate us long after
            the original witnesses are gone.
          </p>

          <div className="mx-auto mt-8 h-px w-16 bg-[#b88a44]" />

          <p className="mt-6 font-serif text-sm italic text-[#9fa4a3]">
            "Some stories end with an answer. Others become mysteries."
          </p>
        </div>
      </section>
    </>
  );
}