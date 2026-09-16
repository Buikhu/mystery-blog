"use client";

import Link from "next/link";
import { useState } from "react";

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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8d0c0] bg-[#f5f1e8]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="Mystery Archive home"
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b88a44] text-[#8e3b32]">
              <span className="font-serif text-lg font-bold">
                M
              </span>
            </div>

            <div>
              <div className="font-serif text-lg font-bold tracking-wide text-[#172033]">
                Mystery Archive
              </div>

              <div className="hidden text-[10px] uppercase tracking-[0.25em] text-[#77776f] sm:block">
                The Unexplained Past
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 md:flex"
          >
            <Link
              href="/"
              className="text-sm font-semibold text-[#394150] transition hover:text-[#8e3b32]"
            >
              Home
            </Link>

            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="text-sm font-semibold text-[#394150] transition hover:text-[#8e3b32]"
              >
                {category.name}
              </Link>
            ))}

            <Link
              href="/about"
              className="text-sm font-semibold text-[#394150] transition hover:text-[#8e3b32]"
            >
              About
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[#d8d0c0] text-[#172033] transition hover:border-[#b88a44] hover:text-[#8e3b32] md:hidden"
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-[#d8d0c0] py-4 md:hidden"
          >
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col"
            >
              <Link
                href="/"
                onClick={closeMenu}
                className="border-b border-[#e2dccf] py-3 text-sm font-semibold text-[#394150] transition hover:text-[#8e3b32]"
              >
                Home
              </Link>

              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  onClick={closeMenu}
                  className="border-b border-[#e2dccf] py-3 text-sm font-semibold text-[#394150] transition hover:text-[#8e3b32]"
                >
                  {category.name}
                </Link>
              ))}

              <Link
                href="/about"
                onClick={closeMenu}
                className="py-3 text-sm font-semibold text-[#394150] transition hover:text-[#8e3b32]"
              >
                About
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}