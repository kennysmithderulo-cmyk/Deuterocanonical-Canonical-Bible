import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chapterId = searchParams.get("chapterId");
  const translationId = searchParams.get("translationId");

  if (!chapterId || !translationId) {
    return NextResponse.json(
      { error: "Missing chapterId or translationId" },
      { status: 400 }
    );
  }

  // Use custom env var to avoid team-level override
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL_CUSTOM ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      {
        error: "Missing Supabase env vars",
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceRoleKey,
        urlValue: supabaseUrl,
      },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // Get verses for this chapter
  const versesRes = await supabase
    .from("verses")
    .select("id, verse")
    .eq("chapter_id", Number(chapterId))
    .order("verse");

  if (versesRes.error) {
    return NextResponse.json(
      {
        error: "Failed to fetch verses",
        details: versesRes.error.message,
        url: supabaseUrl,
      },
      { status: 500 }
    );
  }

  const verses = versesRes.data || [];

  if (verses.length === 0) {
    return NextResponse.json(
      {
        message: "No verses found for this chapter",
        chapterId,
        verses: [],
        texts: [],
      },
      { status: 200 }
    );
  }

  const verseIds = verses.map((v: any) => v.id);
  const verseNumMap = new Map<number, number>();
  verses.forEach((v: any) => {
    verseNumMap.set(Number(v.id), Number(v.verse));
  });

  // Get translation text (service role bypasses RLS)
  const tvRes = await supabase
    .from("translation_verses")
    .select("verse_id, text_content")
    .eq("translation_id", Number(translationId))
    .in("verse_id", verseIds);

  if (tvRes.error) {
    return NextResponse.json(
      {
        error: "Failed to fetch translation text",
        details: tvRes.error.message,
        url: supabaseUrl,
      },
      { status: 500 }
    );
  }

  const tvData = tvRes.data || [];

  const texts = tvData
    .map((t: any) => ({
      verse_id: Number(t.verse_id),
      verse_number: verseNumMap.get(Number(t.verse_id)) ?? 0,
      text_content: t.text_content,
    }))
    .sort((a, b) => a.verse_number - b.verse_number);

  return NextResponse.json({ verses, texts });
}