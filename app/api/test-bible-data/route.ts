import { NextResponse } from "next/server";

export async function GET() {
  // Hard-coded to the working Supabase project (debug only)
  const supabaseUrl = "https://ylspdrjrvhixrregmqtg.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsc3BkcmpydmhpeHJyZWdtcXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MTY2MTgsImV4cCI6MjEwNDM5MjYxOH0.w-N4jnexSpu3r2x2vJdBv62tCg9xzsOyBLiYlFBaEn4";

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
