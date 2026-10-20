import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Staff = {
  userId: string;
  name: string;
  role: Database["public"]["Enums"]["staff_role"];
};

// ログインしている人が staff なら、その情報を返す。ちがえば null
// cache() で、1 回の表示の中では 1 回だけ DB に聞く
export const getStaff = cache(async (): Promise<Staff | null> => {
  // ログインの確認は、いつもリクエストのときにする（先読みや静的な表示に入れない）
  // getClaims() は期限の確認で今の時刻を使うので、これがないと Next.js がエラーを出す
  await connection();

  const supabase = await createClient();

  // getClaims() は JWT の署名を確認する（cookie の中身をそのまま信じない）
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims.sub;
  if (!userId) {
    return null;
  }

  // RLS で、自分の行しか見えない
  const { data: staff } = await supabase
    .from("staff")
    .select("user_id, name, role")
    .eq("user_id", userId)
    .maybeSingle();
  if (!staff) {
    return null;
  }

  return { userId: staff.user_id, name: staff.name, role: staff.role };
});

// 管理画面のページと Server Action のはじめに呼ぶ。staff でなければログイン画面へ
export async function requireStaff(): Promise<Staff> {
  const staff = await getStaff();
  if (!staff) {
    redirect("/admin/login?error=not_staff");
  }
  return staff;
}
