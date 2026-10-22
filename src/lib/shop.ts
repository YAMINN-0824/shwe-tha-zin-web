import { cacheLife } from "next/cache";

// お店の設定。文章は src/i18n/dictionaries/ にある

// お店の時間は、いつも日本時間
export const SHOP_TIME_ZONE = "Asia/Tokyo";
export const SHOP_UTC_OFFSET = "+09:00";

// 予約できる時間（30 分ごと）
// TODO: 仮の営業時間（11:00〜21:00）に合わせている。本当の営業時間に合わせる
export const RESERVATION_FIRST_SLOT = "11:00";
export const RESERVATION_LAST_SLOT = "20:00";
export const RESERVATION_STEP_MINUTES = 30;
// DB の reservations.party_size と同じ
export const MAX_PARTY_SIZE = 20;

function toMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export const reservationSlots: string[] = (() => {
  const slots: string[] = [];
  for (
    let m = toMinutes(RESERVATION_FIRST_SLOT);
    m <= toMinutes(RESERVATION_LAST_SLOT);
    m += RESERVATION_STEP_MINUTES
  ) {
    const hours = String(Math.floor(m / 60)).padStart(2, "0");
    const minutes = String(m % 60).padStart(2, "0");
    slots.push(`${hours}:${minutes}`);
  }
  return slots;
})();

// タディンジュット祭りのイベントは 11 月 1 日（日本時間）まで
// 11 月 2 日 0:00 になったら、トップページから自動で消える
const THADINGYUT_ENDS_AT = Date.parse(`2026-11-02T00:00:00${SHOP_UTC_OFFSET}`);

// ページは前もって作ってあるので、時間の判定はキャッシュして 1 時間ごとに作り直す
// → 期間が終わってから、おそくとも 1 時間ほどで消える
export async function isThadingyutEventOpen(): Promise<boolean> {
  "use cache";
  cacheLife("hours");
  return Date.now() < THADINGYUT_ENDS_AT;
}
