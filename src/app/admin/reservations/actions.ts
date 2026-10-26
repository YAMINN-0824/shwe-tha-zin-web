"use server";

import { refresh } from "next/cache";
import { requireStaff } from "@/lib/auth/staff";
import { createClient } from "@/lib/supabase/server";
import { allowedFrom, isReservationStatus } from "./status";

export type UpdateStatusResult = {
  error: string | null;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// 予約の状態を変える。変えるのは status だけ
export async function updateReservationStatus(
  id: unknown,
  nextStatus: unknown,
): Promise<UpdateStatusResult> {
  // 1 つめの鍵：お店の人でなければ、ここでログイン画面へ
  await requireStaff();

  if (typeof id !== "string" || !UUID_PATTERN.test(id) || !isReservationStatus(nextStatus)) {
    return { error: "予約を変えられませんでした。ページを新しくしてください" };
  }

  const supabase = await createClient();

  // 2 つめの鍵：RLS。staff でなければ、DB は 0 件しか変えない
  // 今の状態が allowedFrom にあるときだけ変える（二度押しや、ほかの人が先に変えたときのため）
  let query = supabase
    .from("reservations")
    .update({ status: nextStatus })
    .eq("id", id)
    .in("status", allowedFrom[nextStatus]);

  // 確認待ちに戻すのは、これからの予約だけ
  if (nextStatus === "pending") {
    query = query.gt("reserved_at", new Date().toISOString());
  }

  // RLS で止められても、エラーにはならず「0 件」になる。変えた行を返してもらって確認する
  const { data, error } = await query.select("id");
  if (error) {
    return { error: "予約を変えられませんでした。少したってから、もう一度ためしてください" };
  }
  if (data.length === 0) {
    refresh();
    return {
      error: "この予約は、もう変わっているか、変えられない予約です。いまの状態を表示しなおしました",
    };
  }

  refresh();
  return { error: null };
}
