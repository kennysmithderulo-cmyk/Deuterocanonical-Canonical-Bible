import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Pastors Study Bible
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl">
          A comprehensive Bible study resource with canonical and deuterocanonical books.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/bible">
            <Button size="lg">Read Bible</Button>
          </Link>
          <Link href="/library">
            <Button variant="outline" size="lg">Library</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left">
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Canonical Books</h3>
            <p className="text-sm text-muted-foreground">
              All 66 books of the Protestant Bible with multiple translations.
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Deuterocanonical Books</h3>
            <p className="text-sm text-muted-foreground">
              The 7 additional books used by Catholic and Orthodox traditions.
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Study Resources</h3>
            <p className="text-sm text-muted-foreground">
              Sermons, notes, and reference materials for deeper study.
            </p>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Log in
            </Link>{" "}
            or{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}