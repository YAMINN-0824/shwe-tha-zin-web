import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { getSupabaseEnv } from "./env";

const ADMIN_LOGIN_PATH = "/admin/login";

// リクエストのたびにログインのセッションを更新して、新しい cookie をレスポンスに入れる
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        // ログイン情報の入ったレスポンスを CDN にキャッシュさせないためのヘッダー
        Object.entries(headers).forEach(([key, value]) =>
          response.headers.set(key, value),
        );
      },
    },
  });

  // createServerClient と getClaims() の間に、ほかの処理を入れないこと
  const { data } = await supabase.auth.getClaims();

  // ログインしていない人を /admin から早めにログイン画面へ送る
  // ここは「ログインしているか」だけ。staff かどうかは各ページの requireStaff() で確認する
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  if (isAdminPage && pathname !== ADMIN_LOGIN_PATH && !data?.claims) {
    const redirectResponse = NextResponse.redirect(
      new URL(ADMIN_LOGIN_PATH, request.url),
    );
    // 更新された cookie をリダイレクトにも入れる
    response.cookies
      .getAll()
      .forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  return response;
}
