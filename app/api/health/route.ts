import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { data, error } = await supabase.from("bible_books").select("id").limit(1);
    if (error) throw error;
    return NextResponse.json({ status: "ok", sample: data?.[0] || null });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e?.message || String(e) }, { status: 500 });
  }
}