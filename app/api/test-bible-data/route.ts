import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getServerClient();

  const { data: books, error: booksError } = await supabase
    .from("bible_books")
    .select("id,name,testament,book_order,chapters_count")
    .order("book_order")
    .limit(5);

  const { data: translations, error: translationsError } = await supabase
    .from("translations")
    .select("id,code,name")
    .order("code");

  return NextResponse.json({
    books,
    translations,
    errors: {
      books: booksError
        ? {
            code: booksError.code,
            message: booksError.message,
            details: booksError.details,
            hint: booksError.hint,
          }
        : null,
      translations: translationsError
        ? {
            code: translationsError.code,
            message: translationsError.message,
            details: translationsError.details,
            hint: translationsError.hint,
          }
        : null,
    },
  });
}