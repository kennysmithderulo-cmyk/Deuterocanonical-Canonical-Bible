import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chapterId = searchParams.get("chapterId");
  const translationId = searchParams.get("translationId");

  console.log("verses API called with", { chapterId, translationId });

  if (!chapterId || !translationId) {
    return NextResponse.json(
      { error: "Missing chapterId or translationId" },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("env check", {
    supabaseUrl: !!supabaseUrl,
    supabaseServiceRoleKey: !!supabaseServiceRoleKey,
  });

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing Supabase env vars", {
      supabaseUrl,
      supabaseServiceRoleKey: supabaseServiceRoleKey ? "[present]" : "[missing]",
    });
    return NextResponse.json(
      { error: "Missing Supabase env vars" },
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

  console.log("verses query result", {
    data: versesRes.data,
    error: versesRes.error,
  });

  const verses = versesRes.data || [];

  if (verses.length === 0) {
    console.log("No verses found for chapter", chapterId);
    return NextResponse.json({ verses: [], texts: [] });
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

  console.log("translation_verses query result", {
    data: tvRes.data,
    error: tvRes.error,
  });

  const tvData = tvRes.data || [];

  const texts = tvData
    .map((t: any) => ({
      verse_id: Number(t.verse_id),
      verse_number: verseNumMap.get(Number(t.verse_id)) ?? 0,
      text_content: t.text_content,
    }))
    .sort((a, b) => a.verse_number - b.verse_number);

  console.log("returning", { versesCount: verses.length, textsCount: texts.length });

  return NextResponse.json({ verses, texts });
}
