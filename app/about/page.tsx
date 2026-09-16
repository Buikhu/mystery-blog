import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Mystery Archive, a publication exploring unsolved historical mysteries, strange events, and bizarre figures.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-700">
          About Mystery Archive
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Exploring the mysteries of history
        </h1>
      </header>

      <div className="prose prose-slate max-w-none">
        <p>
          Mystery Archive is a history and mystery publication focused on
          unusual stories from the past.
        </p>

        <p>
          We explore unsolved historical mysteries, strange events,
          unexplained disappearances, and fascinating figures whose stories
          continue to raise questions.
        </p>

        <h2>What we publish</h2>

        <p>
          Our articles are created for readers who enjoy discovering unusual
          historical stories and examining the evidence, theories, and
          unanswered questions surrounding them.
        </p>

        <ul>
          <li>Unsolved historical mysteries</li>
          <li>Strange and unexplained historical events</li>
          <li>Bizarre and unusual historical figures</li>
          <li>Historical investigations and theories</li>
        </ul>

        <h2>Our approach</h2>

        <p>
          We aim to present historical stories in an engaging but responsible
          way. When information is uncertain or disputed, we try to make that
          clear rather than presenting speculation as established fact.
        </p>

        <p>
          Mystery Archive is intended for readers who are curious about
          history, unanswered questions, and the unusual stories hidden in
          the past.
        </p>
      </div>
    </article>
  );
}