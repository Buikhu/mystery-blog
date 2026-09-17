import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
    },

    select: {
      slug: true,
      updatedAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  /* =======================================================
     FIND LATEST POST UPDATE
  ======================================================= */

  const latestPostUpdatedAt =
    posts.length > 0
      ? posts.reduce(
          (latest, post) =>
            post.updatedAt > latest
              ? post.updatedAt
              : latest,
          posts[0].updatedAt
        )
      : new Date();

  /* =======================================================
     PUBLIC STATIC PAGES
  ======================================================= */

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: latestPostUpdatedAt,
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },

    {
      url: `${siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },

    {
      url: `${siteUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${siteUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  /* =======================================================
     CATEGORY PAGES
  ======================================================= */

  const categoryUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/category/unsolved-mysteries`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${siteUrl}/category/strange-events`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${siteUrl}/category/bizarre-figures`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  /* =======================================================
     ARTICLE PAGES
  ======================================================= */

  const postUrls: MetadataRoute.Sitemap = posts.map(
    (post) => ({
      url: `${siteUrl}/posts/${post.slug}`,

      lastModified: post.updatedAt,

      changeFrequency: "weekly",

      priority: 0.8,
    })
  );

  return [
    ...staticUrls,
    ...categoryUrls,
    ...postUrls,
  ];
}