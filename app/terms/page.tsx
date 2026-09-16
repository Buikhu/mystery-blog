import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for Mystery Archive.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-700">
          Legal
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Terms of Use
        </h1>

        <p className="mt-4 text-sm text-slate-500">
          Last updated: September 2026
        </p>
      </header>

      <div className="prose prose-slate max-w-none">
        <h2>Acceptance of these terms</h2>

        <p>
          By accessing and using Mystery Archive, you agree to these Terms of
          Use. If you do not agree with these terms, please do not use the
          website.
        </p>

        <h2>Content</h2>

        <p>
          Mystery Archive publishes articles about historical mysteries,
          strange events, unexplained stories, and unusual historical figures.
        </p>

        <p>
          Historical information may sometimes be incomplete, disputed, or
          subject to different interpretations. Articles are provided for
          informational and entertainment purposes and should not be treated
          as definitive historical or professional advice.
        </p>

        <h2>Accuracy</h2>

        <p>
          We make reasonable efforts to present information accurately, but we
          cannot guarantee that every statement on the website is complete,
          current, or free from error.
        </p>

        <p>
          If you believe that an article contains an error, please contact us
          so that we can review the information.
        </p>

        <h2>Intellectual property</h2>

        <p>
          Unless otherwise stated, the original text, design, branding, and
          other materials published by Mystery Archive belong to the website
          or their respective rights holders.
        </p>

        <p>
          You may read and share links to our articles for personal and
          informational purposes. Republishing substantial portions of our
          original content without permission is not permitted.
        </p>

        <h2>External links</h2>

        <p>
          Our articles may contain links to third-party websites. We are not
          responsible for the content, availability, or policies of external
          websites.
        </p>

        <h2>Website availability</h2>

        <p>
          We may modify, suspend, or discontinue parts of the website at any
          time. We do not guarantee that the website will always be available
          or free from technical problems.
        </p>

        <h2>Changes to these terms</h2>

        <p>
          We may update these Terms of Use when necessary. Changes will be
          published on this page, and the updated date will be revised when
          appropriate.
        </p>

        <h2>Contact</h2>

        <p>
          If you have questions about these Terms of Use, please visit our{" "}
          <a href="/contact">Contact page</a>.
        </p>
      </div>
    </article>
  );
}