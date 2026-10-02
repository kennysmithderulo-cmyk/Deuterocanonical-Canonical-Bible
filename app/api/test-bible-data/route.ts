import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getServerClient();

  // Call the SQL function via raw SQL to bypass schema cache
  const { data, error } = await supabase.query(`
    SELECT public.get_bible_data() AS result;
  `);

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        details: error.details,
        hint: error.hint,
      },
      { status: 500 }
    );
  }

  // data is an array of rows; first row has { result: { books, translations } }
  const result = (data as any[])?.[0]?.result ?? { books: [], translations: [] };

  return NextResponse.json(result);
}

