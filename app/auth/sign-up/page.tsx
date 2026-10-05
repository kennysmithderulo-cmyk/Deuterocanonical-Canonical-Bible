export const dynamic = 'force-dynamic';
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "Account created. Check your email and confirm your account before signing in."
      );
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg border bg-card p-6">
      <h1 className="mb-2 text-2xl font-bold">Create account</h1>

      <p className="mb-4 text-sm text-muted-foreground">
        Create an account to save study notes and access your preferences.
      </p>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">Password</label>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}

        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}