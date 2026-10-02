import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getServerClient();

  const { data, error } = await supabase
    .from("bible_data")
    .select("data")
    .single();

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

  const result = (data as any)?.data ?? { books: [], translations: [] };

  return NextResponse.json(result);
}
