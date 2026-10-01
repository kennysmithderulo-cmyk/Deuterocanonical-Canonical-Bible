import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getServerClient();

  const { data: books, error: eb } = await supabase
    .from("public.bible_books")
    .select("id,name,testament,book_order,chapters_count")
    .order("book_order")
    .limit(5);

  const { data: translations, error: et } = await supabase
    .from("public.translations")
    .select("id,code,name")
    .limit(5);

  return NextResponse.json({
    books: books ?? null,
    translations: translations ?? null,
    errors: {
      books: eb ? { message: eb.message, details: eb.details } : null,
      translations: et ? { message: et.message, details: et.details } : null,
    },
  });
}