export const dynamic = 'force-dynamic';
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Edition = { id: string; edition_name: string; translator: string | null; license: string | null };
type Section = { id: string; section_number: number; verses_count: number };
type Verse = { verse_number: number; text_content: string };

export default function ApocryphaReaderPage() {
  const params = useParams();
  const workId = params.workId as string;
  const supabase = createClient();

  const [editions, setEditions] = useState<Edition[]>([]);
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("apocryphal_editions")
        .select("id,edition_name,translator,license")
        .eq("work_id", workId)
        .order("edition_name");
      if (error) {
        setError("Unable to load editions for this work.");
        return;
      }
      setEditions(data || []);
      if (data && data.length > 0) setSelectedEdition(data[0]);
    })();
  }, [workId]);

  useEffect(() => {
    if (!selectedEdition) return;
    (async () => {
      const { data, error } = await supabase
        .from("apocryphal_sections")
        .select("id,section_number,verses_count")
        .eq("edition_id", selectedEdition.id)
        .order("section_number");
      if (error) {
        setError("Unable to load sections.");
        return;
      }
      setSections(data || []);
      if (data && data.length > 0) setSelectedSection(data[0]);
    })();
  }, [selectedEdition]);

  useEffect(() => {
    if (!selectedSection) return;
    setLoading(true);
    setError(null);
    (async () => {
      const { data, error } = await supabase
        .from("apocryphal_verses")
        .select("verse_number,text_content")
        .eq("section_id", selectedSection.id)
        .order("verse_number");
      if (error) {
        setError("Unable to load verses for this section.");
        setLoading(false);
        return;
      }
      setVerses(data || []);
      setLoading(false);
    })();
  }, [selectedSection]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Apocrypha Reader</h1>
      <p className="text-muted-foreground mb-4">
        Select an edition and section to read. Only public-domain or properly licensed texts should be imported.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Edition</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedEdition?.id || ""}
            onChange={(e) => {
              const ed = editions.find((x) => x.id === e.target.value) || null;
              setSelectedEdition(ed);
            }}
          >
            {editions.map((ed) => (
              <option key={ed.id} value={ed.id}>{ed.edition_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Section</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedSection?.id || ""}
            onChange={(e) => {
              const sec = sections.find((x) => x.id === e.target.value) || null;
              setSelectedSection(sec);
            }}
          >
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>{sec.section_number}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          {selectedEdition && (
            <div className="text-xs text-muted-foreground">
              {selectedEdition.translator && <div>Translator: {selectedEdition.translator}</div>}
              {selectedEdition.license && <div>License: {selectedEdition.license}</div>}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h2 className="font-serif text-xl mb-1">Section {selectedSection?.section_number}</h2>
        {error && <p className="text-sm text-destructive mb-2">{error}</p>}
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {!loading && verses.length === 0 && <p className="text-sm text-muted-foreground">No verses available for this section.</p>}
        <div className="prose-bible space-y-2 mt-2">
          {verses.map((v) => (
            <div key={v.verse_number}>
              <span className="font-semibold text-sm mr-2">{v.verse_number}</span>
              <span>{v.text_content}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Cross-references, notes, and highlights for apocryphal verses will be added in later phases.
      </p>
    </div>
  );
}