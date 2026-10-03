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

  // Call the SQL function directly via PostgREST RPC
  const url = `${supabaseUrl}/rest/v1/rpc/get_bible_data_v2`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      {
        error: `Supabase RPC error: ${res.status}`,
        details: text,
      },
      { status: res.status }
    );
  }

  const rows = await res.json();
  // RPC returns an array; function returns jsonb
  const result = Array.isArray(rows) && rows.length > 0 ? rows[0] : { books: [], translations: [] };

  return NextResponse.json(result);
}
