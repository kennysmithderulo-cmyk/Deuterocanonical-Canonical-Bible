"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace("/bible");
    router.refresh();
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg border bg-card p-6">
      <h1 className="mb-4 text-2xl font-bold">Sign In</h1>

      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm" htmlFor="email">
            Email
          </label>

          <input
            id="email"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm" htmlFor="password">
            Password
          </label>

          <input
            id="password"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <p className="text-sm text-muted-foreground">
          No account?{" "}
          <Link href="/auth/sign-up" className="text-primary underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}