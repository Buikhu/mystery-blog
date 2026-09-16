import Link from "next/link";
import { loginAdmin } from "./actions";
export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          Admin Login
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Sign in to manage your articles.
        </p>

        <form action={loginAdmin}
              className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white"
          >
            Login
          </button>
        </form>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-gray-500 hover:underline"
        >
          ← Back to website
        </Link>
      </div>
    </main>
  );
}