import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getServerClient();

  const { data: books, error: eb } = await supabase
    .from("bible_books")
    .select("id,name,testament,book_order,chapters_count")
    .order("book_order");

  const { data: translations, error: et } = await supabase
    .from("translations")
    .select("id,code,name");

  return NextResponse.json({
    books: books ?? null,
    translations: translations ?? null,
    errors: {
      books: eb ? { message: eb.message, details: eb.details } : null,
      translations: et ? { message: et.message, details: et.details } : null,
    },
  });
}