"use server";

import { MAX_PARTY_SIZE, SHOP_UTC_OFFSET, reservationSlots } from "@/lib/shop";
import { createClient } from "@/lib/supabase/server";

export type ReservationField =
  | "name"
  | "phone"
  | "email"
  | "partySize"
  | "date"
  | "time"
  | "note";

// 画面に出すエラーの種類。文章は辞書（reserve.form.errors）にある
export type ReservationError = ReservationField | "past" | "failed";

export type ReservationValues = Record<ReservationField, string>;

export type ReservationState =
  | { status: "idle" }
  | {
      status: "error";
      fieldErrors: Partial<Record<ReservationField, ReservationError>>;
      formError: "failed" | null;
      values: ReservationValues;
    }
  | {
      status: "success";
      // 日本時間の日時（ISO）と人数。画面で「〇月〇日 18:00 2名」の形にする
      reservedAt: string;
      partySize: number;
    };

const PHONE_PATTERN = /^[0-9０-９+\-ー() ]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

// 予約のリクエスト。DB の request_reservation() を呼ぶ
// テーブルは RLS で守られていて、お客さんは関数を通してしか書けない
export async function requestReservation(
  _prevState: ReservationState,
  formData: FormData,
): Promise<ReservationState> {
  const values: ReservationValues = {
    name: text(formData, "name"),
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    partySize: text(formData, "partySize"),
    date: text(formData, "date"),
    time: text(formData, "time"),
    note: text(formData, "note"),
  };

  // ロボット対策：人には見えない欄に何か入っていたら、保存しないで成功のふりをする
  if (text(formData, "website") !== "") {
    return { status: "success", reservedAt: "", partySize: 0 };
  }

  // 入力のチェック（DB の制約と同じ）
  const fieldErrors: Partial<Record<ReservationField, ReservationError>> = {};
  if (values.name.length < 1 || values.name.length > 100) {
    fieldErrors.name = "name";
  }
  if (
    values.phone.length < 5 ||
    values.phone.length > 30 ||
    !PHONE_PATTERN.test(values.phone)
  ) {
    fieldErrors.phone = "phone";
  }
  if (
    values.email !== "" &&
    (values.email.length > 254 || !EMAIL_PATTERN.test(values.email))
  ) {
    fieldErrors.email = "email";
  }
  const partySize = Number(values.partySize);
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > MAX_PARTY_SIZE) {
    fieldErrors.partySize = "partySize";
  }
  if (values.note.length > 500) {
    fieldErrors.note = "note";
  }

  // 日時は日本時間として読む（お客さんのブラウザの時間帯に関係なく）
  const dateOk = DATE_PATTERN.test(values.date);
  const timeOk = reservationSlots.includes(values.time);
  if (!dateOk) fieldErrors.date = "date";
  if (!timeOk) fieldErrors.time = "time";
  const reservedAt = new Date(`${values.date}T${values.time}:00${SHOP_UTC_OFFSET}`);
  if (dateOk && timeOk) {
    if (Number.isNaN(reservedAt.getTime())) {
      fieldErrors.date = "date";
    } else if (reservedAt.getTime() <= Date.now()) {
      fieldErrors.date = "past";
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, formError: null, values };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("request_reservation", {
    p_customer_name: values.name,
    p_phone: values.phone,
    p_party_size: partySize,
    p_reserved_at: reservedAt.toISOString(),
    p_email: values.email || undefined,
    p_note: values.note || undefined,
  });

  if (error) {
    // DB のエラーの文章は、お客さんには見せない
    console.error("request_reservation failed", error.code, error.message);
    return { status: "error", fieldErrors: {}, formError: "failed", values };
  }

  return { status: "success", reservedAt: reservedAt.toISOString(), partySize };
}
