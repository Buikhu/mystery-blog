import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Mystery Archive explaining how information is collected and used.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-700">
          Legal
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Privacy Policy
        </h1>

        <p className="mt-4 text-sm text-slate-500">
          Last updated: September 2026
        </p>
      </header>

      <div className="prose prose-slate max-w-none">
        <h2>Introduction</h2>

        <p>
          Mystery Archive respects your privacy. This Privacy Policy explains
          how information may be collected, used, and protected when you visit
          our website.
        </p>

        <h2>Information we collect</h2>

        <p>
          We do not require visitors to create an account to read our
          publicly available articles.
        </p>

        <p>
          Like many websites, we may collect limited technical information
          such as browser type, device information, approximate location, and
          pages visited for security, analytics, and website improvement.
        </p>

        <h2>Cookies</h2>

        <p>
          Mystery Archive or third-party services used by the website may use
          cookies or similar technologies to provide essential functionality,
          understand website usage, or deliver relevant advertising.
        </p>

        <h2>Advertising</h2>

        <p>
          We may use third-party advertising services, including Google
          AdSense, to display advertisements on the website.
        </p>

        <p>
          Advertising providers may use cookies or similar technologies in
          accordance with their own privacy policies and applicable laws.
        </p>

        <h2>Analytics</h2>

        <p>
          We may use analytics services to understand how visitors interact
          with the website. This information helps us improve our content,
          navigation, performance, and overall user experience.
        </p>

        <h2>Third-party services</h2>

        <p>
          Some website features may rely on third-party services. These
          services may process information according to their own privacy
          policies.
        </p>

        <h2>Children's privacy</h2>

        <p>
          Our website is intended for a general audience and does not
          knowingly collect personal information from children through
          account registration.
        </p>

        <h2>Your privacy rights</h2>

        <p>
          Depending on where you live, you may have rights concerning your
          personal information, including rights to access, correct, delete,
          or restrict certain processing of your information.
        </p>

        <h2>Contact</h2>

        <p>
          If you have questions about this Privacy Policy, please contact us
          through our{" "}
          <a href="/contact">Contact page</a>.
        </p>

        <h2>Changes to this policy</h2>

        <p>
          We may update this Privacy Policy when our website, services, or
          legal requirements change. Any updated version will be published on
          this page.
        </p>
      </div>
    </article>
  );
}