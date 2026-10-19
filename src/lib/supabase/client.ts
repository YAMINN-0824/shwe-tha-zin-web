import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

// ブラウザ（Client Component）で使う Supabase クライアント
export function createClient() {
  const { url, publishableKey } = getSupabaseEnv();
  return createBrowserClient(url, publishableKey);
}
