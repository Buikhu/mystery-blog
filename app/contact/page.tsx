import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Mystery Archive for questions, feedback, corrections, or other inquiries.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-700">
          Contact
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Get in touch
        </h1>
      </header>

      <div className="prose prose-slate max-w-none">
        <p>
          Have a question, suggestion, or correction regarding an article?
          We would be happy to hear from you.
        </p>

        <h2>Questions and feedback</h2>

        <p>
          For general questions, feedback, article suggestions, or historical
          information that may help improve an article, please contact us by
          email.
        </p>

        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:buiduckhu2@gmail.com"> 
            buiduckhu2@gmail.com 
            </a>
        </p>

        <h2>Corrections</h2>

        <p>
          If you believe an article contains an inaccurate or misleading
          statement, please let us know. When possible, include the article
          title and explain what information should be corrected.
        </p>

        <h2>Article suggestions</h2>

        <p>
          We welcome suggestions for unusual historical mysteries, strange
          events, and fascinating historical figures that deserve further
          investigation.
        </p>
      </div>
    </article>
  );
}