import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabaseEnv } from "./env";

// お客さん用のページで、だれでも見てよいもの（メニューなど）を読む Supabase クライアント
// cookie を使わないので "use cache" の中でも使える。いつも anon として読む（RLS がそのまま効く）
export function createPublicClient() {
  const { url, publishableKey } = getSupabaseEnv();
  return createClient<Database>(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
