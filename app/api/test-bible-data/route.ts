import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getServerClient();

  // Call the SQL function instead of querying tables
  const { data, error } = await supabase.rpc("get_bible_data");

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

  // data is already { books: [...], translations: [...] }
  return NextResponse.json(data as any);
}

