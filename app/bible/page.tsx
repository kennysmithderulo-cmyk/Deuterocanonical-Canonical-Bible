useEffect(() => {
  if (!selectedChapter || !selectedTranslation) {
    console.log("BiblePage: missing selectedChapter or selectedTranslation", {
      selectedChapter,
      selectedTranslation,
    });
    return;
  }

  setLoading(true);
  setError(null);

  (async () => {
    try {
      console.log("BiblePage: loading verses for chapter", selectedChapter.id);

      const verseData = await supabase
        .from("verses")
        .select("id")
        .eq("chapter_id", selectedChapter.id);

      console.log("BiblePage: verses query result", verseData);

      const verseIds = (verseData.data || []).map((v: any) => v.id);

      if (verseIds.length === 0) {
        console.log("BiblePage: no verses found for chapter", selectedChapter.id);
        setTranslationVerses([]);
        setLoading(false);
        return;
      }

      console.log("BiblePage: loading translation_verses for translation", selectedTranslation.id, "verseIds", verseIds);

      const { data: tv, error } = await supabase
        .from("translation_verses")
        .select("verse_id, text_content")
        .eq("translation_id", selectedTranslation.id)
        .in("verse_id", verseIds);

      console.log("BiblePage: translation_verses query result", { tv, error });

      if (error) {
        console.error("BiblePage: error loading translation_verses", error);
        setError("Unable to load translation text. This may mean the translation text has not been imported yet.");
        setLoading(false);
        return;
      }

      const versesWithNums = await supabase
        .from("verses")
        .select("id, verse")
        .in("id", verseIds);

      console.log("BiblePage: versesWithNums query result", versesWithNums);

      const map = new Map((versesWithNums.data || []).map((v: any) => [v.id, v.verse]));
      const merged = (tv || []).map((t: any) => ({
        verse_id: t.verse_id,
        verse_number: map.get(t.verse_id) || 0,
        text_content: t.text_content,
      }));

      console.log("BiblePage: merged translation verses", merged);

      setTranslationVerses(merged.sort((a, b) => a.verse_number - b.verse_number));
      setLoading(false);
    } catch (e) {
      console.error("BiblePage: unexpected error", e);
      setError("Unexpected error loading Bible data.");
      setLoading(false);
    }
  })();
}, [selectedChapter, selectedTranslation]);

