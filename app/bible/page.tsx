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
