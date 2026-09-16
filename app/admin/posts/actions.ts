"use server";

import { prisma } from "@/lib/prisma";

import { supabase } from "@/lib/supabase";

import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

import { revalidatePath } from "next/cache";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function createFileName(file: File) {
  const fileExtension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const safeFileName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();

  return `${Date.now()}-${safeFileName}-${crypto.randomUUID()}.${fileExtension}`;
}

function validateImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please select an image.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be smaller than 5MB.");
  }

  return file;
}

/* =========================================================
   UPLOAD CONTENT IMAGE
   ========================================================= */

export async function uploadImage(formData: FormData) {
  await requireAdmin();

  const image = validateImage(formData.get("image"));

  const fileName = createFileName(image);

  const filePath = `articles/${fileName}`;

  const fileBuffer = await image.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, fileBuffer, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    console.error(
      "Supabase image upload error:",
      uploadError
    );

    throw new Error(
      `Supabase upload failed: ${uploadError.message}`
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    fileName: image.name,
  };
}

/* =========================================================
   CREATE POST
   ========================================================= */

export async function createPost(formData: FormData) {
  await requireAdmin();

  const title = formData.get("title")?.toString().trim();

  const slug = formData.get("slug")?.toString().trim();

  const category = formData.get("category")?.toString().trim();

  const summary = formData.get("summary")?.toString().trim();

  const sources = formData.get("sources")?.toString().trim();

  const tagsInput = formData.get("tags")?.toString().trim();

  const content = formData.get("content")?.toString().trim();

  const isPublished =
    formData.get("isPublished") === "on";

  const thumbnail = validateImage(
    formData.get("thumbnail")
  );

  /* Validate required fields */

  if (
    !title ||
    !slug ||
    !category ||
    !summary ||
    !content
  ) {
    throw new Error(
      "Please fill in all required fields."
    );
  }

  /* Upload thumbnail */

  const fileName = createFileName(thumbnail);

  const filePath = `thumbnails/${fileName}`;

  const fileBuffer = await thumbnail.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, fileBuffer, {
      contentType: thumbnail.type,
      upsert: false,
    });

  if (uploadError) {
    console.error(
      "Supabase thumbnail upload error:",
      uploadError
    );

    throw new Error(
      "Failed to upload thumbnail."
    );
  }

  /* Get public thumbnail URL */

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  /* Convert tags */

  const tags = tagsInput
    ? tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  /* Create database record */

  await prisma.post.create({
    data: {
      title,
      slug,
      category,
      summary,
      sources: sources || null,
      thumbnailUrl: publicUrl,
      tags,
      content,
      isPublished,
    },
  });

  /* Clear cache */

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/category/[slug]", "page");
  revalidatePath(`/posts/${slug}`);

  redirect("/admin");
}

/* =========================================================
   UPDATE POST
   ========================================================= */

export async function updatePost(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));

  const title = formData.get("title")?.toString().trim();

  const slug = formData.get("slug")?.toString().trim();

  const category = formData.get("category")?.toString().trim();

  const summary = formData.get("summary")?.toString().trim();

  const sources = formData.get("sources")?.toString().trim();

  const thumbnailUrl = formData
    .get("thumbnailUrl")
    ?.toString()
    .trim();

  const tagsInput = formData.get("tags")?.toString().trim();

  const content = formData.get("content")?.toString().trim();

  const isPublished =
    formData.get("isPublished") === "on";

  /* Validate required fields */

  if (
    !id ||
    !title ||
    !slug ||
    !category ||
    !summary ||
    !thumbnailUrl ||
    !content
  ) {
    throw new Error(
      "Please fill in all required fields."
    );
  }

  /* Get old slug */

  const oldPost = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      slug: true,
    },
  });

  /* Convert tags */

  const tags = tagsInput
    ? tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  /* Update database */

  await prisma.post.update({
    where: {
      id,
    },
    data: {
      title,
      slug,
      category,
      summary,
      sources: sources || null,
      thumbnailUrl,
      tags,
      content,
      isPublished,
    },
  });

  /* Clear cache */

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/category/[slug]", "page");
  revalidatePath(`/posts/${slug}`);

  /* Clear old post URL if slug changed */

  if (oldPost && oldPost.slug !== slug) {
    revalidatePath(`/posts/${oldPost.slug}`);
  }

  redirect("/admin");
}

/* =========================================================
   DELETE POST
   ========================================================= */

export async function deletePost(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));

  if (!id) {
    throw new Error("Invalid post ID.");
  }

  /* Get post slug before deleting */

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      slug: true,
    },
  });

  if (!post) {
    throw new Error("Post not found.");
  }

  await prisma.post.delete({
    where: {
      id,
    },
  });

  /* Clear cache */

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/category/[slug]", "page");
  revalidatePath(`/posts/${post.slug}`);

  redirect("/admin");
}