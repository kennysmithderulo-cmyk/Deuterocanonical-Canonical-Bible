import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // During build/static generation, these may be undefined; return a dummy client
  if (!url || !serviceRoleKey) {
    // Return a minimal object that won't crash during build
    return {
      auth: {
        getUser: async () => ({ data: { user: null } as { user: null }, error: null }),
        getSession: async () => ({ data: { session: null } as { session: null }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({ data: [], error: null }),
          in: () => ({ data: [], error: null }),
          order: () => ({ data: [], error: null }),
          single: () => ({ data: null, error: null }),
        }),
        insert: () => ({
          select: () => ({
            single: () => ({ data: null, error: null }),
          }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => ({ data: null, error: null }),
            }),
          }),
        }),
        delete: () => ({
          eq: () => ({
            select: () => ({
              single: () => ({ data: null, error: null }),
            }),
          }),
        }),
      }),
    } as any;
  }

  return createServerClient(url, serviceRoleKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component, which is fine
        }
      },
    },
  });
}
