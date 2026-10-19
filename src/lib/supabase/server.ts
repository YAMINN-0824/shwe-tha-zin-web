import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

// サーバー（Server Component / Server Action / Route Handler）で使う Supabase クライアント
// リクエストごとに新しく作ること（ユーザー間でセッションを共有しないため）
export async function createClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabaseEnv();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component からは cookie を書けない。
          // セッションの更新は proxy.ts がするので、ここは無視してよい
        }
      },
    },
  });
}
