import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (!tokenHash || !type) {
    return redirect("/");
  }

  const supabase = await getServerClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  return redirect(error ? "/" : next);
}