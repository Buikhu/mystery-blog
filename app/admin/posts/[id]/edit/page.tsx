import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import EditPostForm from "./EditPostForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPostPage({
  params,
}: Props) {
  await requireAdmin();

  const { id } = await params;

  const postId = Number(id);

  if (!Number.isInteger(postId)) {
    notFound();
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <EditPostForm
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category,
        summary: post.summary,
        sources: post.sources,
        thumbnailUrl: post.thumbnailUrl,
        tags: post.tags,
        content: post.content,
        isPublished: post.isPublished,
      }}
    />
  );
}