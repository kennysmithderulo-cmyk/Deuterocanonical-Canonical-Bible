"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Account created. Check your email for a confirmation link before signing in."
    );
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12">
      <section className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-card-foreground">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Save notes, build studies, and continue reading across devices.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-foreground">
            Email
            <input
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="block text-sm font-medium text-foreground">
            Password
            <input
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>

          {message ? (
            <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
              {message}
            </p>
          ) : null}

          <button
            className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="font-medium text-primary hover:underline" href="/auth/sign-in">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}