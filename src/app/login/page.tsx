"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      router.replace("/district");
      router.refresh();
    } catch {
      setError(
        "Unable to connect to BeKind. Check your Supabase configuration and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-5 py-12 text-[#302822]">
      <div className="w-full max-w-md">
        <a href="/" className="text-sm font-semibold text-[#6b625a]">
          ← Back to BeKind
        </a>

        <section className="mt-8 rounded-3xl border border-[#e8e0d7] bg-white p-8 shadow-sm sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#66816b]">
              BeKind
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#6b625a]">
              Sign in to manage your district’s bullying-prevention
              activities and school progress.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Work email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-[#d9d0c7] bg-white px-4 py-3 outline-none transition focus:border-[#66816b] focus:ring-2 focus:ring-[#66816b]/20"
                placeholder="you@school.org"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[#d9d0c7] bg-white px-4 py-3 outline-none transition focus:border-[#66816b] focus:ring-2 focus:ring-[#66816b]/20"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#302822] px-4 py-3 font-semibold text-white transition hover:bg-[#494037] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-[#81776e]">
            Administrator access is provided by your district.
            Public account registration is not available.
          </p>
        </section>
      </div>
    </main>
  );
}