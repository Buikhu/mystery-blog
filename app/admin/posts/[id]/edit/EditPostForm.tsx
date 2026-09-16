"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { updatePost, uploadImage } from "../../actions";

type Post = {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  sources: string | null;
  thumbnailUrl: string;
  tags: string[];
  content: string;
  isPublished: boolean;
};

type Props = {
  post: Post;
};

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

export default function EditPostForm({ post }: Props) {
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [category, setCategory] = useState(post.category);
  const [summary, setSummary] = useState(post.summary);

  const [sources, setSources] = useState(
    post.sources ?? ""
  );

  const [thumbnailUrl, setThumbnailUrl] = useState(
    post.thumbnailUrl
  );

  const [thumbnail, setThumbnail] = useState<File | null>(
    null
  );

  const [thumbnailPreview, setThumbnailPreview] = useState(
    post.thumbnailUrl
  );

  const [tags, setTags] = useState(
    post.tags.join(", ")
  );

  const [content, setContent] = useState(
    post.content
  );

  const [isPublished, setIsPublished] = useState(
    post.isPublished
  );

  const [preview, setPreview] = useState(false);

  const [uploadingThumbnail, setUploadingThumbnail] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const generatedSlug = useMemo(() => {
    return createSlug(title);
  }, [title]);

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

  async function handleThumbnailUpload() {
    if (!thumbnail) {
      alert("Please select a new thumbnail first.");
      return;
    }

    setUploadingThumbnail(true);

    try {
      const formData = new FormData();

      formData.append("image", thumbnail);

      const result = await uploadImage(formData);

      setThumbnailUrl(result.url);
      setThumbnailPreview(result.url);

      alert("Thumbnail uploaded successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to upload thumbnail.");
    } finally {
      setUploadingThumbnail(false);
    }
  }

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

      const textarea = document.getElementById(
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

      const newContent =
        content.slice(0, start) +
        imageMarkdown +
        content.slice(end);

      setContent(newContent);

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
      console.error(error);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#172033]">
      {/* HEADER */}

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
              Edit Story
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/posts/${post.slug}`}
              target="_blank"
              className="hidden rounded-full border border-[#667080] px-4 py-2 text-xs font-semibold text-[#e8e5dc] transition hover:border-[#b88a44] hover:text-white sm:block"
            >
              View Story
            </Link>

            <Link
              href="/admin"
              className="rounded-full border border-[#667080] px-4 py-2 text-xs font-semibold text-[#e8e5dc] transition hover:border-[#b88a44] hover:text-white"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN */}

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        {/* HEADING */}

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
                Edit Story
              </h1>

              <p className="mt-2 text-sm text-[#6b6b65]">
                Update your story, Markdown content, sources,
                or publishing status.
              </p>
            </div>

            <div className="hidden font-serif text-5xl text-[#d8d0c0] sm:block">
              ✦
            </div>
          </div>
        </div>

        {/* FORM */}

        <form
          action={updatePost}
          className="space-y-6"
        >
          <input
            type="hidden"
            name="id"
            value={post.id}
          />

          {/* STORY INFORMATION */}

          <section className="rounded-xl border border-[#d8d0c0] bg-[#fffdf8] shadow-sm">
            <div className="border-b border-[#e5dfd4] px-5 py-4 sm:px-6">
              <h2 className="font-serif text-xl font-bold text-[#172033]">
                Story Information
              </h2>

              <p className="mt-1 text-xs text-[#77776f]">
                Update the information displayed on your website.
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
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
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
                  value={slug}
                  onChange={(event) =>
                    setSlug(
                      createSlug(event.target.value)
                    )
                  }
                  required
                  className="w-full rounded-lg border border-[#d8d0c0] bg-[#f8f4eb] px-4 py-3 font-mono text-sm text-[#172033] outline-none transition placeholder:text-[#aaa59b] focus:border-[#b88a44] focus:ring-2 focus:ring-[#b88a44]/20"
                />

                <p className="mt-2 text-[11px] text-[#99968e]">
                  URL: /posts/
                  {slug || generatedSlug}
                </p>

                <p className="mt-1 text-[11px] text-[#9a6a28]">
                  Changing the slug will change the article URL.
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
                  rows={4}
                  required
                  className="w-full resize-y rounded-lg border border-[#d8d0c0] bg-[#f8f4eb] px-4 py-3 text-sm leading-6 text-[#172033] outline-none transition placeholder:text-[#aaa59b] focus:border-[#b88a44] focus:ring-2 focus:ring-[#b88a44]/20"
                />

                <p className="mt-2 text-[11px] text-[#99968e]">
                  Used on the homepage, article metadata,
                  and social previews.
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
                  Add reliable sources or further reading
                  in Markdown format. This section is optional.
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
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    disabled={uploadingThumbnail}
                    className="block w-full cursor-pointer text-sm text-[#5d625f] file:mr-4 file:rounded-full file:border-0 file:bg-[#172033] file:px-5 file:py-2.5 file:text-xs file:font-bold file:text-[#f5f1e8] file:transition hover:file:bg-[#8e3b32]"
                  />

                  <p className="mt-2 text-[11px] text-[#99968e]">
                    Select a new image only if you want
                    to replace the current thumbnail.
                    Maximum 5MB.
                  </p>

                  {thumbnail && (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="text-xs text-[#77776f]">
                        Selected:{" "}
                        <span className="font-semibold text-[#172033]">
                          {thumbnail.name}
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={handleThumbnailUpload}
                        disabled={uploadingThumbnail}
                        className="rounded-full bg-[#172033] px-4 py-2 text-xs font-bold text-[#f5f1e8] transition hover:bg-[#8e3b32] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {uploadingThumbnail
                          ? "Uploading..."
                          : "Upload New Thumbnail"}
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="hidden"
                  name="thumbnailUrl"
                  value={thumbnailUrl}
                />

                {thumbnailPreview && (
                  <div className="mt-4 overflow-hidden rounded-lg border border-[#d8d0c0] bg-[#e9e3d8]">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="aspect-[16/9] max-h-72 w-full object-cover"
                    />
                  </div>
                )}

                <p className="mt-2 text-[11px] text-[#99968e]">
                  Current thumbnail is kept automatically
                  if you do not upload a new one.
                </p>
              </div>
            </div>
          </section>

          {/* MARKDOWN */}

          <section className="overflow-hidden rounded-xl border border-[#d8d0c0] bg-[#fffdf8] shadow-sm">
            <div className="flex flex-col gap-3 border-b border-[#e5dfd4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#172033]">
                  Article Content
                </h2>

                <p className="mt-1 text-xs text-[#77776f]">
                  Edit your Markdown article.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="rounded-full border border-[#cfc6b6] bg-[#f8f4eb] px-4 py-2 text-xs font-bold text-[#172033] transition hover:border-[#b88a44] hover:bg-[#eee8dc]"
              >
                {preview
                  ? "← Edit Markdown"
                  : "Preview Markdown →"}
              </button>
            </div>

            {!preview ? (
              <div className="p-5 sm:p-6">
                {/* UPLOAD IMAGE */}

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

                <textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={(event) =>
                    setContent(event.target.value)
                  }
                  required
                  spellCheck={false}
                  className="min-h-[600px] w-full resize-y rounded-lg border border-[#d8d0c0] bg-[#172033] px-5 py-5 font-mono text-sm leading-7 text-[#f5f1e8] outline-none placeholder:text-[#8d9299] focus:border-[#b88a44] focus:ring-2 focus:ring-[#b88a44]/20"
                />

                <div className="mt-3 flex items-center justify-between text-[11px] text-[#99968e]">
                  <span>Markdown supported</span>

                  <span>
                    {content.length.toLocaleString()} characters
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

          {/* PUBLISHING */}

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
                    Published
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-[#77776f]">
                    Uncheck this option to turn the story
                    into a draft.
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
                  className="rounded-full bg-[#172033] px-6 py-2.5 text-sm font-bold text-[#f5f1e8] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#8e3b32]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}