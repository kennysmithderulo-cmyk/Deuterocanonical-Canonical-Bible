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

  const res = await fetch(
    `${supabaseUrl}/rest/v1/rpc/get_bible_data_v3`,
    {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: "{}",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const details = await res.text();

    return NextResponse.json(
      {
        error: `Supabase RPC error: ${res.status}`,
        details,
      },
      { status: res.status }
    );
  }

  const data = await res.json();

  return NextResponse.json(data);
}
