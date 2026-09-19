"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createPost, uploadImage } from "../actions";

/* =========================================================
   SLUG
   ========================================================= */

function createSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* =========================================================
   PAGE
   ========================================================= */

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const [category, setCategory] =
    useState("Unsolved Mysteries");

  const [summary, setSummary] = useState("");
  const [sources, setSources] = useState("");

  const [thumbnail, setThumbnail] =
    useState<File | null>(null);

  const [thumbnailPreview, setThumbnailPreview] =
    useState("");

  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  const [isPublished, setIsPublished] = useState(true);

  const [preview, setPreview] = useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  /* =========================================================
     TITLE
     ========================================================= */

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugEdited) {
      setSlug(createSlug(value));
    }
  }

  /* =========================================================
     SLUG
     ========================================================= */

  function handleSlugChange(value: string) {
    setSlugEdited(true);
    setSlug(createSlug(value));
  }

  /* =========================================================
     THUMBNAIL
     ========================================================= */

  function handleThumbnailChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    setThumbnail(file);

    const previewUrl = URL.createObjectURL(file);

    setThumbnailPreview(previewUrl);
  }

  /* =========================================================
     CONTENT IMAGE UPLOAD
     ========================================================= */

  async function handleContentImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();

      formData.append("image", file);

      const result = await uploadImage(formData);

      const imageMarkdown =
        `\n\n![${file.name}](${result.url})\n\n`;

      const textarea =
        document.getElementById(
          "content"
        ) as HTMLTextAreaElement | null;

      if (!textarea) {
        setContent(
          (current) => current + imageMarkdown
        );

        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      setContent((current) => {
        return (
          current.slice(0, start) +
          imageMarkdown +
          current.slice(end)
        );
      });

      requestAnimationFrame(() => {
        textarea.focus();

        const newCursorPosition =
          start + imageMarkdown.length;

        textarea.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      });
    } catch (error) {
      console.error(
        "Content image upload error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      setUploadingImage(false);

      event.target.value = "";
    }
  }

  /* =========================================================
     SUBMIT
     ========================================================= */

  async function handleSubmit(formData: FormData) {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await createPost(formData);
    } catch (error) {
      console.error("Create post error:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create post.");
      }

      setSubmitting(false);
    }
  }

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#172033]">
      {/* =====================================================
          ADMIN HEADER
          ===================================================== */}

      <header className="border-b border-[#d8d0c0] bg-[#172033] text-[#f5f1e8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-6 lg:px-8">
          <div>
            <Link
              href="/admin"
              className="font-serif text-xl font-bold tracking-wide"
            >
              MYSTERY ARCHIVE
            </Link>

            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#b88a44]">
              New Story
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-full border border-[#667080] px-4 py-2 text-xs font-semibold text-[#e8e5dc] transition hover:border-[#b88a44] hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* =====================================================
          PAGE
          ===================================================== */}

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        {/* PAGE TITLE */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#b88a44]" />

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8e3b32]">
              Content Management
            </p>
          </div>

          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl font-bold text-[#172033]">
                Create New Story
              </h1>

              <p className="mt-2 text-sm text-[#6b6b65]">
                Paste your AI-generated Markdown and publish
                it to the archive.
              </p>
            </div>

            <div className="hidden font-serif text-5xl text-[#d8d0c0] sm:block">
              ✦
            </div>
          </div>
        </div>

        {/* =================================================
            FORM
            ================================================= */}

        <form
          action={handleSubmit}
          className="space-y-6"
        >
          {/* =================================================
              ERROR
              ================================================= */}

          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">
              <p className="font-bold">
                Failed to create post
              </p>

              <p className="mt-1">{error}</p>
            </div>
          )}

          {/* =================================================
              STORY INFORMATION
              ================================================= */}

          <section className="rounded-xl border border-[#d8d0c0] bg-[#fffdf8] shadow-sm">
            <div className="border-b border-[#e5dfd4] px-5 py-4 sm:px-6">
              <h2 className="font-serif text-xl font-bold text-[#172033]">
                Story Information
              </h2>

              <p className="mt-1 text-xs text-[#77776f]">
                Basic information displayed on the website and
                Facebook preview.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:p-6">
              {/* TITLE */}

              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#5d625f]"
                >
                  Title *
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    handleTitleChange(event.target.value)
                  }
                  placeholder="The Strange Disappearance of..."
                  required
                  className="w-full rounded-lg border border-[#d8d0c0] bg-[#f8f4eb] px-4 py-3 font-serif text-lg text-[#172033] outline-none transition placeholder:text-[#aaa59b] focus:border-[#b88a44] focus:ring-2 focus:ring-[#b88a44]/20"
                />
              </div>

              {/* SLUG */}

              <div>
                <label
                  htmlFor="slug"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#5d625f]"
                >
                  Slug *
                </label>

                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={slug}
                  onChange={(event) =>
                    handleSlugChange(event.target.value)
                  }
                  placeholder="the-strange-disappearance-of"
                  required
                  className="w-full rounded-lg border border-[#d8d0c0] bg-[#f8f4eb] px-4 py-3 font-mono text-sm text-[#172033] outline-none transition placeholder:text-[#aaa59b] focus:border-[#b88a44] focus:ring-2 focus:ring-[#b88a44]/20"
                />

                <p className="mt-2 text-[11px] text-[#99968e]">
                  URL: /posts/
                  {slug || "your-story"}
                </p>
              </div>

              {/* CATEGORY + TAGS */}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#5d625f]"
                  >
                    Category *
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value)
                    }
                    required
                    className="w-full rounded-lg border border-[#d8d0c0] bg-[#f8f4eb] px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#b88a44] focus:ring-2 focus:ring-[#b88a44]/20"
                  >
                    <option value="Unsolved Mysteries">
                      Unsolved Mysteries
                    </option>

                    <option value="Strange Events">
                      Strange Events
                    </option>

                    <option value="Bizarre Figures">
                      Bizarre Figures
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="tags"
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#5d625f]"
                  >
                    Tags
                  </label>

                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    value={tags}
                    onChange={(event) =>
                      setTags(event.target.value)
                    }
                    placeholder="history, mystery, disappearance"
                    className="w-full rounded-lg border border-[#d8d0c0] bg-[#f8f4eb] px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#aaa59b] focus:border-[#b88a44] focus:ring-2 focus:ring-[#b88a44]/20"
                  />

                  <p className="mt-2 text-[11px] text-[#99968e]">
                    Separate tags with commas.
                  </p>
                </div>
              </div>

              {/* SUMMARY */}

              <div>
                <label
                  htmlFor="summary"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#5d625f]"
                >
                  Summary *
                </label>

                <textarea
                  id="summary"
                  name="summary"
                  value={summary}
                  onChange={(event) =>
                    setSummary(event.target.value)
                  }
                  placeholder="A short description that makes readers want to discover the story..."
                  rows={4}
                  required
                  className="w-full resize-y rounded-lg border border-[#d8d0c0] bg-[#f8f4eb] px-4 py-3 text-sm leading-6 text-[#172033] outline-none transition placeholder:text-[#aaa59b] focus:border-[#b88a44] focus:ring-2 focus:ring-[#b88a44]/20"
                />

                <p className="mt-2 text-[11px] text-[#99968e]">
                  Used on the homepage, article metadata, and
                  social previews.
                </p>
              </div>

              {/* SOURCES */}

              <div>
                <label
                  htmlFor="sources"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#5d625f]"
                >
                  Sources & Further Reading
                </label>

                <textarea
                  id="sources"
                  name="sources"
                  value={sources}
                  onChange={(event) =>
                    setSources(event.target.value)
                  }
                  placeholder={`- [National Archives](https://example.com)
- [Library of Congress](https://example.com)
- [Further Reading](https://example.com)`}
                  rows={6}
                  className="w-full resize-y rounded-lg border border-[#d8d0c0] bg-[#f8f4eb] px-4 py-3 font-mono text-sm leading-6 text-[#172033] outline-none transition placeholder:text-[#aaa59b] focus:border-[#b88a44] focus:ring-2 focus:ring-[#b88a44]/20"
                />

                <p className="mt-2 text-[11px] leading-5 text-[#99968e]">
                  Add reliable sources or further reading in
                  Markdown format. This section is optional.
                </p>
              </div>

              {/* THUMBNAIL */}

              <div>
                <label
                  htmlFor="thumbnail"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#5d625f]"
                >
                  Thumbnail *
                </label>

                <div className="rounded-lg border border-dashed border-[#cfc6b6] bg-[#f8f4eb] p-5">
                  <input
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    required
                    className="block w-full cursor-pointer text-sm text-[#5d625f] file:mr-4 file:rounded-full file:border-0 file:bg-[#172033] file:px-5 file:py-2.5 file:text-xs file:font-bold file:text-[#f5f1e8] file:transition hover:file:bg-[#8e3b32]"
                  />

                  <p className="mt-2 text-[11px] text-[#99968e]">
                    JPG, PNG, WEBP or other image formats.
                    Maximum 5MB.
                  </p>
                </div>

                {thumbnail && (
                  <p className="mt-3 text-xs text-[#77776f]">
                    Selected:{" "}
                    <span className="font-semibold text-[#172033]">
                      {thumbnail.name}
                    </span>
                  </p>
                )}

                {thumbnailPreview && (
                  <div className="mt-4 overflow-hidden rounded-lg border border-[#d8d0c0] bg-[#e9e3d8]">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="aspect-[16/9] max-h-72 w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* =================================================
              MARKDOWN EDITOR
              ================================================= */}

          <section className="overflow-hidden rounded-xl border border-[#d8d0c0] bg-[#fffdf8] shadow-sm">
            <div className="flex flex-col gap-3 border-b border-[#e5dfd4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#172033]">
                  Article Content
                </h2>

                <p className="mt-1 text-xs text-[#77776f]">
                  Paste your Markdown here.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreview((current) => !current)
                }
                className="rounded-full border border-[#cfc6b6] bg-[#f8f4eb] px-4 py-2 text-xs font-bold text-[#172033] transition hover:border-[#b88a44] hover:bg-[#eee8dc]"
              >
                {preview
                  ? "← Edit Markdown"
                  : "Preview Markdown →"}
              </button>
            </div>

            {!preview ? (
              <div className="p-5 sm:p-6">
                {/* IMAGE UPLOAD */}

                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <label
                    htmlFor="contentImage"
                    className={`cursor-pointer rounded-full border border-[#cfc6b6] bg-[#f8f4eb] px-4 py-2 text-xs font-bold text-[#172033] transition hover:border-[#b88a44] hover:bg-[#eee8dc] ${
                      uploadingImage
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    {uploadingImage
                      ? "Uploading..."
                      : "＋ Upload Image"}
                  </label>

                  <input
                    id="contentImage"
                    type="file"
                    accept="image/*"
                    onChange={handleContentImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />

                  <span className="text-[11px] text-[#99968e]">
                    Upload an image and it will be inserted
                    into your Markdown.
                  </span>
                </div>

                {/* CONTENT */}

                <textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={(event) =>
                    setContent(event.target.value)
                  }
                  placeholder={`# The Mystery

Write or paste your Markdown article here...

## The Beginning

According to historical records...

## What Happened?

...

## Theories

- Theory one
- Theory two

## The Unanswered Questions

...`}
                  required
                  spellCheck={false}
                  className="min-h-[600px] w-full resize-y rounded-lg border border-[#d8d0c0] bg-[#172033] px-5 py-5 font-mono text-sm leading-7 text-[#f5f1e8] outline-none placeholder:text-[#8d9299] focus:border-[#b88a44] focus:ring-2 focus:ring-[#b88a44]/20"
                />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#99968e]">
                  <span>Markdown supported</span>

                  <span>
                    {content.length.toLocaleString()}{" "}
                    characters
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5 sm:p-8">
                {content.trim() ? (
                  <div className="markdown-content max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <div className="font-serif text-5xl text-[#b88a44]">
                      ✦
                    </div>

                    <p className="mt-4 font-serif text-xl font-bold text-[#172033]">
                      Nothing to preview
                    </p>

                    <p className="mt-2 text-sm text-[#77776f]">
                      Paste some Markdown into the editor
                      first.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* =================================================
              PUBLISHING
              ================================================= */}

          <section className="rounded-xl border border-[#d8d0c0] bg-[#fffdf8] shadow-sm">
            <div className="border-b border-[#e5dfd4] px-5 py-4 sm:px-6">
              <h2 className="font-serif text-xl font-bold text-[#172033]">
                Publishing
              </h2>
            </div>

            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={isPublished}
                  onChange={(event) =>
                    setIsPublished(event.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-[#8e3b32]"
                />

                <span>
                  <span className="block text-sm font-bold text-[#172033]">
                    Publish immediately
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-[#77776f]">
                    The story will appear on the public
                    website immediately.
                  </span>
                </span>
              </label>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Link
                  href="/admin"
                  className="rounded-full border border-[#cfc6b6] px-5 py-2.5 text-center text-sm font-semibold text-[#172033] transition hover:border-[#b88a44] hover:bg-[#eee8dc]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#172033] px-6 py-2.5 text-sm font-bold text-[#f5f1e8] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#8e3b32] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Publishing..."
                    : isPublished
                      ? "Publish Story"
                      : "Save Draft"}
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}