import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { requireStaff } from "@/lib/auth/staff";
import { SHOP_TIME_ZONE, SHOP_UTC_OFFSET } from "@/lib/shop";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { ReservationButtons } from "./reservation-buttons";
import { isReservationStatus, statusLabels, type ReservationStatus } from "./status";

export const metadata: Metadata = {
  title: "予約 | SHWE THA ZIN 管理画面",
};

type Reservation = Pick<
  Database["public"]["Tables"]["reservations"]["Row"],
  "id" | "customer_name" | "phone" | "email" | "party_size" | "reserved_at" | "note" | "status"
>;

type Filter = ReservationStatus | "all";

const filters: { value: Filter; label: string }[] = [
  { value: "pending", label: statusLabels.pending },
  { value: "confirmed", label: statusLabels.confirmed },
  { value: "cancelled", label: statusLabels.cancelled },
  { value: "all", label: "すべて" },
];

// 過去の予約は、この日数ぶんだけ出す
const PAST_DAYS = 30;

export default function AdminReservationsPage({
  searchParams,
}: PageProps<"/admin/reservations">) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin"
          className="self-start text-body text-forest-soft underline-offset-4 hover:underline"
        >
          管理画面のトップへ
        </Link>
        <h1 className="text-h2 font-medium tracking-wide">予約</h1>
      </div>
      <Suspense fallback={<p className="text-body text-forest-soft">読み込み中…</p>}>
        <ReservationList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function ReservationList({
  searchParams,
}: Pick<PageProps<"/admin/reservations">, "searchParams">) {
  // staff でなければ、ここでログイン画面へ送られる
  await requireStaff();

  const { status } = await searchParams;
  const filter: Filter = status === "all" || isReservationStatus(status) ? status : "pending";

  const result = await loadReservations(filter);
  if (!result) {
    return (
      <p role="alert" className="text-body text-destructive">
        予約を読み込めませんでした。ページを新しくしてください。
      </p>
    );
  }
  const { upcoming, past, pendingCount, todayKey, tomorrowKey, nowMs } = result;

  return (
    <div className="flex flex-col gap-8">
      <nav aria-label="予約の状態" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {filters.map((f) => {
          const active = f.value === filter;
          return (
            <Link
              key={f.value}
              href={`/admin/reservations?status=${f.value}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-12 items-center justify-center gap-2 rounded-lg border text-body font-medium",
                active
                  ? "border-forest bg-forest text-ivory"
                  : "border-forest/20 bg-ivory-soft text-forest hover:bg-parchment",
              )}
            >
              {f.label}
              {f.value === "pending" && (
                <span
                  className={cn(
                    "min-w-7 rounded-full px-2 text-center text-small",
                    active ? "bg-ivory text-forest" : "bg-accent text-gold-ink",
                  )}
                >
                  {pendingCount}
                  <span className="sr-only">件</span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <section aria-labelledby="upcoming-heading" className="flex flex-col gap-6">
        <h2 id="upcoming-heading" className="text-h3 font-medium tracking-wide">
          今日とこれからの予約
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-body text-forest-soft">
            {filter === "pending"
              ? "確認待ちの予約は、ありません。"
              : "ここに出す予約は、ありません。"}
          </p>
        ) : (
          <DayGroups
            reservations={upcoming}
            todayKey={todayKey}
            tomorrowKey={tomorrowKey}
            nowMs={nowMs}
          />
        )}
      </section>

      {past.length > 0 && (
        <details className="group rounded-lg border border-forest/15 bg-ivory-soft">
          <summary className="flex h-12 cursor-pointer items-center px-4 text-body font-medium">
            過去の予約を見る（{PAST_DAYS}日以内、{past.length}件）
          </summary>
          <div className="flex flex-col gap-6 border-t border-forest/15 p-4">
            <DayGroups
              reservations={past}
              todayKey={todayKey}
              tomorrowKey={tomorrowKey}
              nowMs={nowMs}
            />
          </div>
        </details>
      )}
    </div>
  );
}

async function loadReservations(filter: Filter) {
  const now = new Date();
  const todayKey = dateKey(now);
  const tomorrowKey = dateKey(new Date(now.getTime() + 24 * 60 * 60 * 1000));
  // 今日の 0:00（日本時間）。今日の予約は、時間が過ぎても上のリストに残す
  const todayStart = new Date(`${todayKey}T00:00:00${SHOP_UTC_OFFSET}`);
  const pastStart = new Date(todayStart.getTime() - PAST_DAYS * 24 * 60 * 60 * 1000);

  const supabase = await createClient();
  const columns = "id, customer_name, phone, email, party_size, reserved_at, note, status";

  let upcomingQuery = supabase
    .from("reservations")
    .select(columns)
    .gte("reserved_at", todayStart.toISOString())
    .order("reserved_at", { ascending: true });
  let pastQuery = supabase
    .from("reservations")
    .select(columns)
    .lt("reserved_at", todayStart.toISOString())
    .gte("reserved_at", pastStart.toISOString())
    .order("reserved_at", { ascending: false });
  if (filter !== "all") {
    upcomingQuery = upcomingQuery.eq("status", filter);
    pastQuery = pastQuery.eq("status", filter);
  }
  // タブの数は、今日とこれからの確認待ちだけ（お店がこれから返事をする予約）
  const pendingCountQuery = supabase
    .from("reservations")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending")
    .gte("reserved_at", todayStart.toISOString());

  const [upcomingResult, pastResult, pendingResult] = await Promise.all([
    upcomingQuery,
    pastQuery,
    pendingCountQuery,
  ]);
  if (upcomingResult.error || pastResult.error || pendingResult.error) {
    return null;
  }

  return {
    upcoming: upcomingResult.data,
    past: pastResult.data,
    pendingCount: pendingResult.count ?? 0,
    todayKey,
    tomorrowKey,
    nowMs: now.getTime(),
  };
}

function DayGroups({
  reservations,
  todayKey,
  tomorrowKey,
  nowMs,
}: {
  reservations: Reservation[];
  todayKey: string;
  tomorrowKey: string;
  nowMs: number;
}) {
  // 並び順はそのままで、日にちごとにまとめる
  const groups: { key: string; items: Reservation[] }[] = [];
  for (const reservation of reservations) {
    const key = dateKey(new Date(reservation.reserved_at));
    const last = groups.at(-1);
    if (last && last.key === key) {
      last.items.push(reservation);
    } else {
      groups.push({ key, items: [reservation] });
    }
  }

  return groups.map((group) => {
    const prefix = group.key === todayKey ? "今日 " : group.key === tomorrowKey ? "明日 " : "";
    return (
      <div key={group.key} className="flex flex-col gap-3">
        <h3 className="text-lead font-medium">
          {prefix}
          {formatDay(group.items[0].reserved_at)}
        </h3>
        <ul className="flex flex-col gap-3">
          {group.items.map((reservation) => (
            <li key={reservation.id}>
              <ReservationCard reservation={reservation} nowMs={nowMs} />
            </li>
          ))}
        </ul>
      </div>
    );
  });
}

const badgeStyles: Record<ReservationStatus, string> = {
  pending: "bg-accent text-gold-ink",
  confirmed: "bg-leaf/15 text-leaf-deep",
  cancelled: "bg-parchment text-forest-soft",
};

function ReservationCard({ reservation, nowMs }: { reservation: Reservation; nowMs: number }) {
  const time = formatTime(reservation.reserved_at);
  const canRestore = new Date(reservation.reserved_at).getTime() > nowMs;
  const summary = `${formatDay(reservation.reserved_at)} ${time}　${reservation.customer_name} 様　${reservation.party_size}名`;

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-forest/15 bg-ivory-soft p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-h3 font-medium">{time}</p>
        <span
          className={cn(
            "rounded-full px-3 py-0.5 text-small font-medium",
            badgeStyles[reservation.status],
          )}
        >
          {statusLabels[reservation.status]}
        </span>
      </div>

      <p className="text-lead">
        <span className="font-medium">{reservation.customer_name}</span> 様
        <span className="ml-4">{reservation.party_size}名</span>
      </p>

      <div className="flex flex-col gap-1 text-body">
        <a
          href={`tel:${reservation.phone.replace(/[^\d+]/g, "")}`}
          className="flex items-center gap-2 self-start underline underline-offset-4"
        >
          <Phone aria-hidden="true" className="size-5 text-leaf" strokeWidth={1.25} />
          {reservation.phone}
        </a>
        {reservation.email && (
          <a
            href={`mailto:${reservation.email}`}
            className="flex items-center gap-2 self-start break-all underline underline-offset-4"
          >
            <Mail aria-hidden="true" className="size-5 shrink-0 text-leaf" strokeWidth={1.25} />
            {reservation.email}
          </a>
        )}
      </div>

      {reservation.note && (
        <div className="rounded-md bg-parchment px-3 py-2">
          <p className="text-small text-forest-soft">メモ</p>
          <p className="text-body whitespace-pre-wrap">{reservation.note}</p>
        </div>
      )}

      <ReservationButtons
        id={reservation.id}
        status={reservation.status}
        canRestore={canRestore}
        summary={summary}
      />
    </article>
  );
}

// 日本時間の「2026-10-26」
function dateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: SHOP_TIME_ZONE }).format(date);
}

// 「10月28日(水)」
function formatDay(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: SHOP_TIME_ZONE,
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(iso));
}

// 「18:00」
function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: SHOP_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
}
