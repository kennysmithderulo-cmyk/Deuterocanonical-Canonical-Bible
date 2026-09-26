"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-lg border bg-card">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading}>
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