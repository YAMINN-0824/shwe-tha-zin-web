"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  error: string | null;
  email: string;
};

export async function signIn(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入れてください", email };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) {
    return { error: "メールアドレスかパスワードがちがいます", email };
  }

  // ログインできても、staff テーブルにいない人は入れない
  const { data: staff } = await supabase
    .from("staff")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!staff) {
    await supabase.auth.signOut();
    return { error: "このアカウントは管理画面に入れません", email };
  }

  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
