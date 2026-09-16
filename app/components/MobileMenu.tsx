"use client";

import { useState } from "react";
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

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Menu Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cfc6b6] bg-[#f5f1e8] text-[#172033] transition hover:border-[#b88a44] hover:bg-[#eee8dc]"
      >
        {open ? (
          <span className="text-lg">✕</span>
        ) : (
          <span className="text-lg">☰</span>
        )}
      </button>

      {/* Mobile Navigation */}
      {open && (
        <div className="absolute left-0 right-0 top-[72px] border-b border-[#d8d0c0] bg-[#f5f1e8] shadow-lg">

          <div className="mx-auto max-w-7xl px-5 py-6">

            {/* Menu heading */}
            <div className="mb-5 border-b border-[#d8d0c0] pb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8e3b32]">
                Explore
              </p>

              <p className="mt-1 font-serif text-xl font-bold text-[#172033]">
                The Mystery Archive
              </p>
            </div>

            {/* Main navigation */}
            <nav className="space-y-1">

              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3.5 text-sm font-semibold text-[#172033] transition hover:bg-[#eee8dc]"
              >
                <span>Home</span>
                <span className="text-[#b88a44]">→</span>
              </Link>

              {/* Section title */}
              <div className="px-3 pb-1 pt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8e3b32]">
                  Categories
                </p>
              </div>

              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3.5 text-sm font-medium text-[#5d625f] transition hover:bg-[#eee8dc] hover:text-[#172033]"
                >
                  <span>{category.name}</span>
                  <span className="text-[#b88a44]">→</span>
                </Link>
              ))}

            </nav>

            {/* Bottom decoration */}
            <div className="mt-6 border-t border-[#d8d0c0] pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8b8982]">
                  Stories from the unexplained past
                </span>

                <span className="text-[#b88a44]">
                  ✦
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}