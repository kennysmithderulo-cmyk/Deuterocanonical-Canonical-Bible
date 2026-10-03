import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Missing Supabase environment variables" },
      { status: 500 }
    );
  }

  const url = `${supabaseUrl}/rest/v1/bible_data?select=data`;

  const res = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "return=representation",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      {
        error: `Supabase REST error: ${res.status}`,
        details: text,
      },
      { status: res.status }
    );
  }

  const rows = await res.json();
  const row = Array.isArray(rows) ? rows[0] : null;
  const result = row?.data ?? { books: [], translations: [] };

  return NextResponse.json(result);
}
