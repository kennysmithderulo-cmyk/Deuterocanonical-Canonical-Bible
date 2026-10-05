"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type WorkOption = { id: string; title: string };

export default function ApocryphaImportPage() {
  const supabase = createClient();
  const [works, setWorks] = useState<WorkOption[]>([]);
  const [selectedWorkId, setSelectedWorkId] = useState<string>("");
  const [editionName, setEditionName] = useState("");
  const [translator, setTranslator] = useState("");
  const [publicationInfo, setPublicationInfo] = useState("");
  const [licenseText, setLicenseText] = useState("Public Domain");
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const loadWorks = async () => {
    const { data, error } = await supabase.from("apocryphal_works").select("id,title").order("title");
    if (error) {
      setError("Unable to load works. Ensure migrations are applied.");
      return;
    }
    setWorks(data || []);
  };

  const handleImport = async () => {
    if (!selectedWorkId || !editionName) {
      setError("Select a work and provide an edition name.");
      return;
    }
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.sections || !Array.isArray(parsed.sections)) {
        throw new Error("JSON must have a 'sections' array.");
      }
      const { data: edition, error: eErr } = await supabase
        .from("apocryphal_editions")
        .insert({
          work_id: selectedWorkId,
          edition_name: editionName,
          translator: translator || null,
          publication_info: publicationInfo || null,
          license: licenseText || null,
          language: "en",
        })
        .select()
        .single();
      if (eErr || !edition) throw new Error("Failed to create edition.");

      for (const sec of parsed.sections) {
        const { data: section, error: sErr } = await supabase
          .from("apocryphal_sections")
          .insert({
            edition_id: edition.id,
            section_number: sec.section_number,
            verses_count: sec.verses?.length || 0,
          })
          .select()
          .single();
        if (sErr || !section) throw new Error(`Failed to create section ${sec.section_number}.`);

        const verseRows = (sec.verses || []).map((v: any) => ({
          section_id: section.id,
          verse_number: v.verse_number,
          text_content: v.text,
        }));
        if (verseRows.length > 0) {
          const { error: vErr } = await supabase.from("apocryphal_verses").insert(verseRows);
          if (vErr) throw new Error(`Failed to insert verses for section ${sec.section_number}.`);
        }
      }

      setInfo("Import completed successfully. You can now read this edition in the Apocrypha reader.");
      setJsonInput("");
    } catch (e: any) {
      setError(e.message || "Import failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Apocrypha Import</h1>
      <p className="text-muted-foreground mb-4">
        Import sections and verses for an apocryphal/extended work from JSON. Use only public-domain or properly licensed texts.
      </p>

      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadWorks}>Load Works</Button>
          <select
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedWorkId}
            onChange={(e) => setSelectedWorkId(e.target.value)}
          >
            <option value="">Select a work...</option>
            {works.map((w) => (
              <option key={w.id} value={w.id}>{w.title}</option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Edition name</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={editionName}
              onChange={(e) => setEditionName(e.target.value)}
              placeholder="e.g., R.H. Charles (Public Domain)"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Translator</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={translator}
              onChange={(e) => setTranslator(e.target.value)}
              placeholder="e.g., R.H. Charles"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Publication info</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={publicationInfo}
              onChange={(e) => setPublicationInfo(e.target.value)}
              placeholder="e.g., The Book of Enoch, 1917 (public domain)"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">License</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={licenseText}
              onChange={(e) => setLicenseText(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">JSON import</label>
          <textarea
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            rows={12}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"sections":[{"section_number":1,"verses":[{"verse_number":1,"text":"..."}]}]}'
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {info && <p className="text-sm text-green-600">{info}</p>}

        <div className="flex justify-end">
          <Button onClick={handleImport} disabled={loading}>
            {loading ? "Importing..." : "Import"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Example file: data/sample_apocrypha_imports/1_enoch_charles_sample.json
        </p>
      </div>
    </div>
  );
}export const dynamic = 'force-dynamic';
