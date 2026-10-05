export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Admin</h1>
      <p className="text-muted-foreground mb-4">
        Manage translations, books, apocrypha, commentary, dictionary, topics, users, and subscriptions.
      </p>
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm">
          Admin dashboard and role-based authorization will be implemented in later phases. Ensure you have the appropriate role before enabling write operations.
        </p>
      </div>
    </div>
  );
}export const dynamic = 'force-dynamic';
