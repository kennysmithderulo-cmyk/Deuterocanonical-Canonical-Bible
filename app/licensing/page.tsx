export const dynamic = 'force-dynamic';
export default function LicensingPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Licensing & Source Attribution</h1>
      <p className="text-muted-foreground mb-4">
        This application does not bundle copyrighted Bible translations or scholarly resources without permission. All Bible text and commentary must come from public-domain or properly licensed sources.
      </p>
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <h2 className="font-semibold">Example public-domain translations</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>World English Bible (WEB)</li>
          <li>King James Version (KJV)</li>
          <li>Douay-Rheims Bible (DRB)</li>
          <li>Septuagint (English) public-domain editions</li>
        </ul>
        <h2 className="font-semibold mt-4">Apocrypha / Pseudepigrapha</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>R.H. Charles translations (e.g., 1 Enoch, Jubilees) are public domain.</li>
          <li>Always verify current license status before importing.</li>
        </ul>
        <h2 className="font-semibold mt-4">Commentary & Dictionary</h2>
        <p className="text-sm">
          Use public-domain encyclopedias and commentaries or properly licensed modern resources. Record `license` and `source` metadata in the database.
        </p>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        See `supabase/seed/README_import_guide.md` for import steps and licensing checklist.
      </p>
    </div>
  );
}