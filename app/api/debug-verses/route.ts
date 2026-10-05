import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
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
      },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // Get all chapters for Genesis (book_id = 11)
  const chaptersRes = await supabase
    .from("chapters")
    .select("id, chapter, book_id")
    .eq("book_id", 11)
    .order("chapter");

  // Get all verses for those chapters
  const chapterIds = (chaptersRes.data || []).map((c: any) => c.id);

  const versesRes = await supabase
    .from("verses")
    .select("id, verse, chapter_id")
    .in("chapter_id", chapterIds)
    .order("chapter_id");

  // Get translation_verses for translation_id = 7
  const tvRes = await supabase
    .from("translation_verses")
    .select("verse_id, text_content, translation_id")
    .eq("translation_id", 7)
    .in("verse_id", (versesRes.data || []).map((v: any) => v.id));

  return NextResponse.json({
    env: {
      url: supabaseUrl,
      hasKey: !!supabaseServiceRoleKey,
    },
    chapters: chaptersRes.data || [],
    chaptersError: chaptersRes.error,
    verses: versesRes.data || [],
    versesError: versesRes.error,
    translationVerses: tvRes.data || [],
    translationVersesError: tvRes.error,
  });
}