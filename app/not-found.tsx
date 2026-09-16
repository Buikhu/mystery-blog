import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f1e8] px-5 py-20">
      <div className="mx-auto max-w-xl text-center">
        <div className="font-serif text-7xl font-bold text-[#b88a44]">
          404
        </div>

        <div className="mx-auto mt-6 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[#b88a44]" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8e3b32]">
            Lost in the archive
          </span>
          <span className="h-px w-10 bg-[#b88a44]" />
        </div>

        <h1 className="mt-6 font-serif text-3xl font-bold text-[#172033] sm:text-4xl">
          This story has disappeared
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#62645f] sm:text-base">
          The page you are looking for could not be found. Perhaps
          the trail has gone cold.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#8e3b32] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#733029]"
        >
          Return to the archive
        </Link>
      </div>
    </main>
  );
}