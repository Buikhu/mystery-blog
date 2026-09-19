"use server";

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_CATEGORIES = [
  "Unsolved Mysteries",
  "Strange Events",
  "Bizarre Figures",
];

/* =========================================================
   HELPERS
   ========================================================= */

function getString(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() || "";
}

function parseTags(tagsInput: string) {
  if (!tagsInput) {
    return [];
  }

  return [
    ...new Set(
      tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    ),
  ];
}

function validateSlug(slug: string) {
  if (!slug) {
    throw new Error("Slug is required.");
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      "Slug can only contain lowercase letters, numbers, and hyphens."
    );
  }
}

function validateCategory(category: string) {
  if (!ALLOWED_CATEGORIES.includes(category)) {
    throw new Error("Invalid category.");
  }
}

function validateImage(
  value: FormDataEntryValue | null
): File {
  if (!(value instanceof File) || value.size === 0) {
    throw new Error("Please select an image.");
  }

  if (!value.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (value.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be smaller than 5MB.");
  }

  return value;
}

function createFileName(file: File) {
  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const baseName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${Date.now()}-${baseName || "image"}-${crypto.randomUUID()}.${extension}`;
}

/* =========================================================
   SUPABASE UPLOAD
   ========================================================= */

async function uploadToSupabase(
  file: File,
  folder: "articles" | "thumbnails"
) {
  const fileName = createFileName(file);
  const filePath = `${folder}/${fileName}`;

  const fileBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);

    throw new Error(
      `Image upload failed: ${error.message}`
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  return {
    publicUrl,
    filePath,
    originalName: file.name,
  };
}

/* =========================================================
   UPLOAD CONTENT IMAGE
   ========================================================= */

export async function uploadImage(formData: FormData) {
  await requireAdmin();

  const image = validateImage(formData.get("image"));

  const result = await uploadToSupabase(
    image,
    "articles"
  );

  return {
    url: result.publicUrl,
    fileName: result.originalName,
  };
}

/* =========================================================
   CREATE POST
   ========================================================= */

export async function createPost(formData: FormData) {
  await requireAdmin();

  /* -------------------------
     Get data
     ------------------------- */

  const title = getString(formData, "title");
  const slug = getString(formData, "slug");
  const category = getString(formData, "category");
  const summary = getString(formData, "summary");
  const sources = getString(formData, "sources");
  const tagsInput = getString(formData, "tags");
  const content = getString(formData, "content");

  const isPublished =
    formData.get("isPublished") === "on";

  /* -------------------------
     Validate required fields
     ------------------------- */

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!slug) {
    throw new Error("Slug is required.");
  }

  if (!category) {
    throw new Error("Category is required.");
  }

  if (!summary) {
    throw new Error("Summary is required.");
  }

  if (!content) {
    throw new Error("Content is required.");
  }

  validateSlug(slug);
  validateCategory(category);

  /* -------------------------
     Check duplicate slug
     ------------------------- */

  const existingPost = await prisma.post.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  if (existingPost) {
    throw new Error(
      `A post with slug "${slug}" already exists.`
    );
  }

  /* -------------------------
     Thumbnail
     ------------------------- */

  const thumbnail = validateImage(
    formData.get("thumbnail")
  );

  /* -------------------------
     Tags
     ------------------------- */

  const tags = parseTags(tagsInput);

  /* -------------------------
     Upload thumbnail
     ------------------------- */

  const uploadedThumbnail = await uploadToSupabase(
    thumbnail,
    "thumbnails"
  );

  /* -------------------------
     Create post
     ------------------------- */

  try {
    await prisma.post.create({
      data: {
        title,
        slug,
        category,
        summary,
        sources: sources || null,
        thumbnailUrl: uploadedThumbnail.publicUrl,
        tags,
        content,
        isPublished,
      },
    });
  } catch (error) {
    console.error("Create post error:", error);

    /*
      Nếu database create thất bại,
      xóa thumbnail vừa upload.
    */

    try {
      await supabase.storage
        .from("images")
        .remove([uploadedThumbnail.filePath]);
    } catch (cleanupError) {
      console.error(
        "Failed to cleanup thumbnail:",
        cleanupError
      );
    }

    throw new Error(
      "Failed to create post. Please check your data and try again."
    );
  }

  /* -------------------------
     Clear cache
     ------------------------- */

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/category/[slug]", "page");
  revalidatePath(`/posts/${slug}`);

  /* -------------------------
     Redirect
     ------------------------- */

  redirect("/admin");
}

/* =========================================================
   UPDATE POST
   ========================================================= */

export async function updatePost(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid post ID.");
  }

  const title = getString(formData, "title");
  const slug = getString(formData, "slug");
  const category = getString(formData, "category");
  const summary = getString(formData, "summary");
  const sources = getString(formData, "sources");
  const thumbnailUrl = getString(
    formData,
    "thumbnailUrl"
  );
  const tagsInput = getString(formData, "tags");
  const content = getString(formData, "content");

  const isPublished =
    formData.get("isPublished") === "on";

  /* -------------------------
     Validate
     ------------------------- */

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!slug) {
    throw new Error("Slug is required.");
  }

  if (!category) {
    throw new Error("Category is required.");
  }

  if (!summary) {
    throw new Error("Summary is required.");
  }

  if (!thumbnailUrl) {
    throw new Error("Thumbnail is required.");
  }

  if (!content) {
    throw new Error("Content is required.");
  }

  validateSlug(slug);
  validateCategory(category);

  /* -------------------------
     Get old post
     ------------------------- */

  const oldPost = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!oldPost) {
    throw new Error("Post not found.");
  }

  /* -------------------------
     Check duplicate slug
     ------------------------- */

  const duplicatePost =
    await prisma.post.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    });

  if (duplicatePost) {
    throw new Error(
      `A post with slug "${slug}" already exists.`
    );
  }

  /* -------------------------
     Tags
     ------------------------- */

  const tags = parseTags(tagsInput);

  /* -------------------------
     Update
     ------------------------- */

  try {
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
  } catch (error) {
    console.error("Update post error:", error);

    throw new Error(
      "Failed to update post. Please try again."
    );
  }

  /* -------------------------
     Clear cache
     ------------------------- */

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/category/[slug]", "page");
  revalidatePath(`/posts/${slug}`);

  if (oldPost.slug !== slug) {
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

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid post ID.");
  }

  /* -------------------------
     Find post
     ------------------------- */

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!post) {
    throw new Error("Post not found.");
  }

  /* -------------------------
     Delete
     ------------------------- */

  try {
    await prisma.post.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Delete post error:", error);

    throw new Error(
      "Failed to delete post. Please try again."
    );
  }

  /* -------------------------
     Clear cache
     ------------------------- */

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/category/[slug]", "page");
  revalidatePath(`/posts/${post.slug}`);

  redirect("/admin");
}