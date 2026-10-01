import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { getServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (!token_hash || !type) {
    return redirect("/");
  }

  const supabase = await getServerClient();

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  if (error) {
    // Optionally log error for debugging
    return redirect("/");
  }

  return redirect(next);
}