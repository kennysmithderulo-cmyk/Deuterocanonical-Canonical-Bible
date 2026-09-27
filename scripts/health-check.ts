import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  const { data, error } = await supabase.from("bible_books").select("id").limit(1);
  if (error) {
    console.error("Supabase health check FAILED:", error.message);
    process.exit(1);
  }
  console.log("Supabase health check OK:", data);
}

main();