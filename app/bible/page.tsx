"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Chapter = { id: number; book_id: number; chapter: number };
type Book = {
  id: number;
  name: string;
  testament: string;
  order: number;
  chapters: Chapter[];
};
type Translation = {
  id: number;
  name: string;
  abbreviation: string;
  language: string;
  year: number;
  notes: string;
};

type ApiResponse = {
  books: Book[];
  translations: Translation[];
};

type VerseText = {
  verse_number: number;
  text_content: string;
};

export default function BiblePage() {
  const supabase = createClient();

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedChapterNum, setSelectedChapterNum] = useState<number | null>(null);
  const [selectedTranslationId, setSelectedTranslationId] = useState<number | null>(null);

  const [verseTexts, setVerseTexts] = useState<VerseText[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  // Load structure from API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/test-bible-data");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json: ApiResponse = await res.json();
        setData(json);

        if (json.books && json.books.length > 0) {
          setSelectedBookId(json.books[0].id);
          const firstBook = json.books[0];
          if (firstBook.chapters && firstBook.chapters.length > 0) {
            setSelectedChapterNum(firstBook.chapters[0].chapter);
          }
        }

        if (json.translations && json.translations.length > 0) {
          setSelectedTranslationId(json.translations[0].id);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load Bible data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load verse text when chapter/translation changes
  useEffect(() => {
    if (!selectedChapterNum || !selectedBookId || !selectedTranslationId || !data) {
      setVerseTexts([]);
      return;
    }

    setLoadingVerses(true);

    (async () => {
      try {
        const book = data.books.find((b) => b.id === selectedBookId);
        if (!book) {
          setLoadingVerses(false);
          return;
        }

        const chapter = book.chapters.find((c) => c.chapter === selectedChapterNum);
        if (!chapter) {
          setLoadingVerses(false);
          return;
        }

        const chapterId = chapter.id;

        const res = await fetch(
          `/api/verses?chapterId=${chapterId}&translationId=${selectedTranslationId}`
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        const texts: VerseText[] = (json.texts || []).map((t: any) => ({
          verse_number: t.verse_number,
          text_content: t.text_content,
        }));

        setVerseTexts(texts);
      } catch (e) {
        console.error(e);
        setVerseTexts([]);
      } finally {
        setLoadingVerses(false);
      }
    })();
  }, [selectedChapterNum, selectedBookId, selectedTranslationId, data]);

  if (loading) {
    return <div className="p-4">Loading Bible data...</div>;
  }

  if (error || !data) {
    return (
      <div className="p-4 text-destructive">
        {error || "No Bible data available"}
      </div>
    );
  }

  const book = data.books.find((b) => b.id === selectedBookId) || null;
  const translation =
    data.translations.find((t) => t.id === selectedTranslationId) || null;

  const chapter =
    book?.chapters.find((c) => c.chapter === selectedChapterNum) || null;

  // Debug info
  const debugInfo = chapter
    ? `chapterId=${chapter.id}, bookId=${selectedBookId}, transId=${selectedTranslationId}`
    : "no chapter";

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bible</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm mb-1">Book</label>
          <select
            className="w-full rounded border px-3 py-2 text-sm"
            value={selectedBookId ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              setSelectedBookId(id);
              const b = data.books.find((x) => x.id === id) || null;
              if (b?.chapters?.length) {
                setSelectedChapterNum(b.chapters[0].chapter);
              }
            }}
          >
            {data.books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Chapter</label>
          <select
            className="w-full rounded border px-3 py-2 text-sm"
            value={selectedChapterNum ?? ""}
            onChange={(e) => setSelectedChapterNum(Number(e.target.value))}
          >
            {book?.chapters.map((c) => (
              <option key={c.id} value={c.chapter}>
                {c.chapter}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Translation</label>
          <select
            className="w-full rounded border px-3 py-2 text-sm"
            value={selectedTranslationId ?? ""}
            onChange={(e) => setSelectedTranslationId(Number(e.target.value))}
          >
            {data.translations.map((t) => (
              <option key={t.id} value={t.id}>
                {t.abbreviation} — {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded border p-4 bg-card">
        <h2 className="font-serif text-xl mb-1">
          {book?.name} {selectedChapterNum}
        </h2>
        <p className="text-sm text-muted-foreground mb-3">
          {translation?.abbreviation} {translation?.name}
        </p>

        {loadingVerses && (
          <p className="text-sm text-muted-foreground">Loading passage...</p>
        )}

        {!loadingVerses && (
          <>
            <p className="text-xs text-muted-foreground mb-2">{debugInfo}</p>

            {verseTexts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No verse text available for this translation yet.
              </p>
            ) : (
              verseTexts.map((v) => (
                <div key={v.verse_number} className="mb-2">
                  <span className="font-semibold text-sm mr-2">{v.verse_number}</span>
                  <span>{v.text_content}</span>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
