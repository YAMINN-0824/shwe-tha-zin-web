import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  // お客さん用のページは、URL の最初に言語を入れる（/ → /ja、/menu → /ja/menu）
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";
  const isAdmin = firstSegment === "admin";
  const isFile = pathname.includes(".");
  if (!isAdmin && !isFile && !hasLocale(firstSegment)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    // 画像や静的ファイル以外のすべてのページで動かす
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
