import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getServerClient();

  const { data, error } = await supabase.query(`
    SELECT public.get_bible_data_v2() AS result; -- v3 deploy test
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

  const result = (data as any[])?.[0]?.result ?? { books: [], translations: [] };

  return NextResponse.json(result);
}
