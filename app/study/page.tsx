export const dynamic = 'force-dynamic';
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type SearchResult = {
  type: "verse" | "topic" | "dictionary" | "apocrypha";
  label: string;
  snippet?: string;
};

export default function StudyPage() {
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const { data: v, error: ev } = await supabase
        .from("translation_verses")
        .select("text_content")
        .ilike("text_content", `%${query}%`)
        .limit(20);
      const { data: t, error: et } = await supabase
        .from("topics")
        .select("name,definition")
        .ilike("name", `%${query}%`)
        .limit(10);
      const { data: d, error: ed } = await supabase
        .from("dictionary_entries")
        .select("name,description")
        .ilike("name", `%${query}%`)
        .limit(10);
      const { data: a, error: ea } = await supabase
        .from("apocryphal_verses")
        .select("text_content")
        .ilike("text_content", `%${query}%`)
        .limit(10);

      if (ev || et || ed || ea) {
        setError("Unable to load search results. Ensure tables exist and RLS allows reads.");
        setLoading(false);
        return;
      }

      const res: SearchResult[] = [
        ...(v || []).map((r) => ({ type: "verse" as const, label: "Verse", snippet: r.text_content.slice(0, 120) })),
        ...(t || []).map((r) => ({ type: "topic" as const, label: `Topic: ${r.name}`, snippet: r.definition })),
        ...(d || []).map((r) => ({ type: "dictionary" as const, label: `Dictionary: ${r.name}`, snippet: r.description.slice(0, 120) })),
        ...(a || []).map((r) => ({ type: "apocrypha" as const, label: "Apocrypha", snippet: r.text_content.slice(0, 120) })),
      ];
      setResults(res.slice(0, 50));
    } catch (e: any) {
      setError("Search failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Study</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Search Scripture, topics, dictionary, apocrypha..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
      </div>
      {error && <p className="text-sm text-destructive mb-3">{error}</p>}
      {loading && <p className="text-sm text-muted-foreground">Searching...</p>}
      {!loading && results.length === 0 && query.trim() !== "" && (
        <p className="text-sm text-muted-foreground">No results found.</p>
      )}
      {!loading && results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className="rounded-md border bg-card p-3">
              <div className="font-semibold text-sm mb-1">{r.label}</div>
              {r.snippet && <p className="text-sm text-muted-foreground">{r.snippet}</p>}
            </div>
          ))}
        </div>
      )}
      <p className="mt-6 text-xs text-muted-foreground">
        Note: Search depends on imported Bible text and study resources. See supabase/seed/README_import_guide.md.
      </p>
    </div>
  );
}