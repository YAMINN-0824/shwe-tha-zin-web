import type { Database } from "@/lib/supabase/database.types";

export type ReservationStatus = Database["public"]["Enums"]["reservation_status"];

export const statusLabels: Record<ReservationStatus, string> = {
  pending: "確認待ち",
  confirmed: "確定",
  cancelled: "キャンセル",
};

// どの状態から、どの状態へ変えてよいか（Server Action で使う）
// 確認待ちに戻すのは、これからの予約だけ（Server Action で日時も確認する）
export const allowedFrom: Record<ReservationStatus, ReservationStatus[]> = {
  confirmed: ["pending"],
  cancelled: ["pending", "confirmed"],
  pending: ["cancelled"],
};

export function isReservationStatus(value: unknown): value is ReservationStatus {
  return value === "pending" || value === "confirmed" || value === "cancelled";
}
