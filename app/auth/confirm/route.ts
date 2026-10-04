import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as string | null;
  const next = searchParams.get("next") ?? "/";

  if (!token_hash || !type) {
    return redirect("/");
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.verifyOtp({
    type: type as "email" | "mobile",
    token_hash,
  });

  if (!error) {
    // Optionally, you can do additional post-verification logic here
    redirect(`/${next.replace(/^//, "")}`);
  }

  // If verification failed, redirect to a failure page or home
  redirect("/");
}
