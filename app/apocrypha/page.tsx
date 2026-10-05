"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Work = {
  id: string;
  title: string;
  category: string;
  canonical_status: string;
  tradition: string | null;
  approx_date: string | null;
  language: string | null;
};

const categories = [
  "All",
  "Deuterocanonical",
  "Old Testament Apocrypha",
  "Pseudepigrapha",
  "Second Temple",
  "Dead Sea Scrolls",
  "Early Christian Apocrypha",
  "Ethiopian/Eritrean",
  "Eastern Christian",
];

export default function ApocryphaPage() {
  const supabase = createClient();
  const [works, setWorks] = useState<Work[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("apocryphal_works")
        .select("id,title,category,canonical_status,tradition,approx_date,language")
        .order("title");
      if (error) {
        setError("Unable to load apocryphal works. Ensure migrations and seeds are applied.");
        setLoading(false);
        return;
      }
      setWorks(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = works.filter((w) => {
    if (filter === "All") return true;
    const cat = w.category.toLowerCase();
    const status = w.canonical_status.toLowerCase();
    if (filter === "Deuterocanonical") return status.includes("deutero");
    if (filter === "Old Testament Apocrypha") return cat.includes("old_testament_apocrypha");
    if (filter === "Pseudepigrapha") return cat.includes("pseudepigrapha") || status.includes("pseudepigraphal");
    if (filter === "Second Temple") return cat.includes("second_temple");
    if (filter === "Dead Sea Scrolls") return cat.includes("dead_sea") || cat.includes("qumran");
    if (filter === "Early Christian Apocrypha") return status.includes("early_christian");
    if (filter === "Ethiopian/Eritrean") return cat.includes("ethiopian");
    if (filter === "Eastern Christian") return cat.includes("greek_eastern") || cat.includes("syriac_collection");
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Apocrypha & Extended Literature</h1>
      <p className="text-muted-foreground mb-4">
        Browse deuterocanonical books, apocrypha, pseudepigrapha, Second Temple literature, and early Christian writings. Canonical status varies by tradition.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <Button key={c} variant={filter === c ? "default" : "outline"} size="sm" onClick={() => setFilter(c)}>
            {c}
          </Button>
        ))}
      </div>

      {error && <p className="text-destructive mb-3">{error}</p>}
      {loading && <p className="text-muted-foreground">Loading...</p>}
      {!loading && filtered.length === 0 && <p className="text-muted-foreground">No works found for this filter.</p>}

      {!loading && filtered.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((w) => (
            <div key={w.id} className="rounded-md border bg-card p-3">
              <div className="font-semibold">{w.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {w.canonical_status} • {w.category}
              </div>
              {w.tradition && <div className="text-xs text-muted-foreground">Tradition: {w.tradition}</div>}
              {w.approx_date && <div className="text-xs text-muted-foreground">Date: {w.approx_date}</div>}
              {w.language && <div className="text-xs text-muted-foreground">Language: {w.language}</div>}
              <div className="mt-2">
                <Link href={`/apocrypha/${w.id}`}>
                  <Button variant="outline" size="sm">Read</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Note: This application does not bundle copyrighted texts. Add editions via the import process (see supabase/seed/README_import_guide.md).
      </p>
    </div>
  );
}export const dynamic = 'force-dynamic';
