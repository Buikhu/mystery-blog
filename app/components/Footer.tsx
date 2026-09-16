import Link from "next/link";

const categories = [
  {
    name: "Unsolved Mysteries",
    slug: "unsolved-mysteries",
  },
  {
    name: "Strange Events",
    slug: "strange-events",
  },
  {
    name: "Bizarre Figures",
    slug: "bizarre-figures",
  },
];

const siteLinks = [
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
  {
    name: "Privacy Policy",
    href: "/privacy",
  },
  {
    name: "Terms of Use",
    href: "/terms",
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#d8d0c0] bg-[#ebe5d8]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-wide text-[#172033]"
            >
              Mystery Archive
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-[#62645f]">
              Exploring unsolved mysteries, strange events, and
              bizarre figures from history.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#172033]">
              Explore
            </h3>

            <nav className="mt-4 flex flex-col gap-3">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="w-fit text-sm text-[#62645f] transition hover:text-[#8e3b32]"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Site */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#172033]">
              Information
            </h3>

            <nav className="mt-4 flex flex-col gap-3">
              {siteLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-[#62645f] transition hover:text-[#8e3b32]"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* About */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#172033]">
              The Archive
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#62645f]">
              Forgotten stories. Strange evidence. Historical
              questions that still have no definitive answer.
            </p>

            <Link
              href="/"
              className="mt-5 inline-block text-sm font-bold uppercase tracking-[0.15em] text-[#8e3b32] transition hover:text-[#b06b4d]"
            >
              Enter the archive →
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-3 border-t border-[#d8d0c0] pt-6 text-xs text-[#77776f] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Mystery Archive. All
            rights reserved.
          </p>

          <p className="uppercase tracking-[0.15em]">
            History · Mystery · The Unexplained
          </p>
        </div>
      </div>
    </footer>
  );
}