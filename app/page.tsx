import { getServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-5xl mx-auto">
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Good morning{user ? `, ${user.email?.split("@")[0]}` : ""}.
        </h1>
        <p className="text-muted-foreground">Study the Word. Teach with Confidence.</p>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold mb-2">Continue Reading</h2>
          <p className="text-sm text-muted-foreground">Your last passage will appear here after Phase 2.</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold mb-2">Today&apos;s Scripture</h2>
          <p className="text-sm text-muted-foreground">Daily study card coming in Phase 2.</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold mb-2">Quick Study</h2>
          <p className="text-sm text-muted-foreground">Search and tools arrive in Phase 4.</p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold mb-2">Recent Notes</h2>
          <p className="text-sm text-muted-foreground">Your personal notes will appear here after Phase 5.</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold mb-2">Recent Sermons</h2>
          <p className="text-sm text-muted-foreground">Sermon drafts will appear here after Phase 7.</p>
        </div>
      </section>

      <section className="mt-8 flex gap-3">
        {!user ? (
          <>
            <Link href="/auth/sign-in">
              <Button>Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button variant="outline">Create Account</Button>
            </Link>
          </>
        ) : (
          <Link href="/bible">
            <Button variant="secondary">Open Bible</Button>
          </Link>
        )}
      </section>
    </div>
  );
}