"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bookmark, Highlighter, MessageSquare, Share2 } from "lucide-react";

type Book = { id: string; name: string; testament: string; book_order: number; chapters_count: number };
type Chapter = { id: string; chapter_number: number };
type Translation = { id: string; code: string; name: string };
type Verse = { id: string; verse_number: number };
type TranslationVerse = { verse_id: string; verse_number: number; text_content: string };

export default function BiblePage() {
  const supabase = createClient();
  const [books, setBooks] = useState<Book[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedTranslation, setSelectedTranslation] = useState<Translation | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [translationVerses, setTranslationVerses] = useState<TranslationVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: b, error: eb } = await supabase
        .from("books")
        .select("id, name, testament, order, chapters_count");
      const { data: t, error: et } = await supabase
        .from("translations")
        .select("id, code, name");

      if (eb || et) {
        setError("Unable to load Bible data. Ensure migrations and seeds are applied.");
        return;
      }

      const booksMapped = (b || []).map((x: any) => ({
        id: x.id,
        name: x.name,
        testament: x.testament,
        book_order: (x as any).order ?? 0,
        chapters_count: (x as any).chapters_count ?? 0,
      }));

      const translationsMapped = (t || []).map((x) => ({
        id: x.id,
        code: x.code ?? "TEST",
        name: x.name,
      }));

      setBooks(booksMapped);
      setTranslations(translationsMapped);
      if (booksMapped.length > 0) setSelectedBook(booksMapped[0]);
      if (translationsMapped.length > 0) setSelectedTranslation(translationsMapped[0]);
    })();
  }, []);

  useEffect(() => {
    if (!selectedBook) return;
    (async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("id, chapter")
        .eq("book_id", selectedBook.id)
        .order("chapter");

      if (error) return;

      const chaptersMapped = (data || []).map((x: any) => ({
        id: x.id,
        chapter_number: x.chapter,
      }));

      setChapters(chaptersMapped);
      if (chaptersMapped.length > 0) setSelectedChapter(chaptersMapped[0]);
    })();
  }, [selectedBook]);

  useEffect(() => {
    if (!selectedChapter) return;
    (async () => {
      const { data, error } = await supabase
        .from("verses")
        .select("id, verse")
        .eq("chapter_id", selectedChapter.id)
        .order("verse");

      if (error) return;

      const versesMapped = (data || []).map((x: any) => ({
        id: x.id,
        verse_number: x.verse,
      }));

      setVerses(versesMapped);
    })();
  }, [selectedChapter]);

  useEffect(() => {
    if (!selectedChapter || !selectedTranslation) return;
    setLoading(true);
    setError(null);
    (async () => {
      const verseData = await supabase
        .from("verses")
        .select("id")
        .eq("chapter_id", selectedChapter.id);
      const verseIds = (verseData.data || []).map((v) => v.id);

      if (verseIds.length === 0) {
        setTranslationVerses([]);
        setLoading(false);
        return;
      }

      const { data: tv, error } = await supabase
        .from("translation_verses")
        .select("verse_id, text_content")
        .eq("translation_id", selectedTranslation.id)
        .in("verse_id", verseIds);

      if (error) {
        setError("Unable to load translation text. This may mean the translation text has not been imported yet.");
        setLoading(false);
        return;
      }

      const versesWithNums = await supabase
        .from("verses")
        .select("id, verse")
        .in("id", verseIds);
      const map = new Map((versesWithNums.data || []).map((v: any) => [v.id, v.verse]));
      const merged = (tv || []).map((t) => ({
        verse_id: t.verse_id,
        verse_number: map.get(t.verse_id) || 0,
        text_content: t.text_content,
      }));
      setTranslationVerses(merged.sort((a, b) => a.verse_number - b.verse_number));
      setLoading(false);
    })();
  }, [selectedChapter, selectedTranslation]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Book</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedBook?.id || ""}
            onChange={(e) => {
              const b = books.find((x) => x.id === e.target.value) || null;
              setSelectedBook(b);
            }}
          >
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Chapter</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedChapter?.id || ""}
            onChange={(e) => {
              const c = chapters.find((x) => x.id === e.target.value) || null;
              setSelectedChapter(c);
            }}
          >
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.chapter_number}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Translation</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedTranslation?.id || ""}
            onChange={(e) => {
              const t = translations.find((x) => x.id === e.target.value) || null;
              setSelectedTranslation(t);
            }}
          >
            {translations.map((t) => (
              <option key={t.id} value={t.id}>
                {t.code} — {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h2 className="font-serif text-xl mb-1">
          {selectedBook?.name} {selectedChapter?.chapter_number}
        </h2>
        <p className="text-sm text-muted-foreground mb-3">
          {selectedTranslation?.code} {selectedTranslation?.name}
        </p>

        {error && <div className="mb-3 text-sm text-destructive">{error}</div>}

        <div className="prose-bible space-y-2">
          {loading && <p className="text-sm text-muted-foreground">Loading passage...</p>}
          {!loading && translationVerses.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No Bible data is available for this translation yet. Import translation text via the seed/import process.
            </p>
          )}
          {!loading &&
            translationVerses.map((tv) => (
              <div key={tv.verse_id} className="rounded-md border bg-background p-2">
                <span className="font-semibold text-sm mr-2">{tv.verse_number}</span>
                <span>{tv.text_content}</span>
                <div className="inline-flex items-center gap-1 ml-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" title="Highlight">
                    <Highlighter className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" title="Note">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" title="Bookmark">
                    <Bookmark className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" title="Share">
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
