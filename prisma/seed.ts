import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.post.createMany({
    data: [
      {
        title: "The Mystery of the Lost Colony",
        slug: "the-mystery-of-the-lost-colony",
        summary:
          "An entire colony vanished without leaving a clear explanation. Centuries later, the fate of its inhabitants remains one of history's enduring mysteries.",
        content: `## The Mystery

This is a sample historical mystery article.

## Timeline

- **1587** — The colony was established.
- **1590** — The settlement was found abandoned.
- **Later years** — Several theories emerged.

## Verified Facts

The historical record provides evidence that the settlement was abandoned, but the exact fate of its inhabitants remains uncertain.

## Theories

Historians have proposed several explanations, but these theories should not be treated as established facts.`,
        thumbnailUrl: "https://placehold.co/800x450",
        category: "Unsolved Mysteries",
        tags: ["history", "mystery", "colonies"],
        isPublished: true,
      },
      {
        title: "The Strange Case of the Dancing Plague",
        slug: "the-strange-case-of-the-dancing-plague",
        summary:
          "In 1518, people in Strasbourg reportedly began dancing uncontrollably. The strange episode has fascinated historians for centuries.",
        content: `## What Happened?

In 1518, an unusual outbreak of compulsive dancing was recorded in Strasbourg.

## Timeline

- **July 1518** — Reports of people dancing appeared.
- **Following weeks** — More people reportedly joined.
- **Later** — The episode eventually ended.

## Verified Facts

Historical records confirm that an unusual dancing episode occurred.

## Theories

Historians have proposed different explanations for the event. However, the exact cause remains debated.`,
        thumbnailUrl: "https://placehold.co/800x450",
        category: "Strange Events",
        tags: ["history", "strange events", "1518"],
        isPublished: true,
      },
    ],
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });