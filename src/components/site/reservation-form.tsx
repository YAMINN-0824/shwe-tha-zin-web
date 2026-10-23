"use client";

import { ChevronDown } from "lucide-react";
import { useActionState, useEffect, useRef, type ReactNode } from "react";
import {
  requestReservation,
  type ReservationField,
  type ReservationState,
  type ReservationValues,
} from "@/app/[lang]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/ja";
import { cn } from "@/lib/utils";

// attempt：送った回数。フォームを作り直すのに使う
type FormState = ReservationState & { attempt: number };
const initialState: FormState = { status: "idle", attempt: 0 };

// 送ったあと React はフォームを空にもどす。select は入れた値にもどらないので、
// 送るたびに key を変えて、入れた値（defaultValue）でフォームを作り直す
async function submit(prev: FormState, formData: FormData): Promise<FormState> {
  const result = await requestReservation(prev, formData);
  return { ...result, attempt: prev.attempt + 1 };
}

const fieldClass = "h-11 bg-ivory-soft md:text-base";
// ネイティブの select を Input と同じ見た目にする（スマホで選びやすい）
const selectClass = cn(
  "h-11 w-full min-w-0 appearance-none rounded-lg border border-input bg-ivory-soft px-2.5 pr-9 text-base transition-colors outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
);

// お店の時間（日本時間）の「今日」。YYYY-MM-DD
function todayInJapan(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(new Date());
}

function formatReservedAt(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    timeZone: "Asia/Tokyo",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function ReservationForm({
  locale,
  form,
  slots,
  maxPartySize,
  successBody,
}: {
  locale: Locale;
  form: Dictionary["reserve"]["form"];
  slots: string[];
  maxPartySize: number;
  // 日本語の改行を整えた文章（サーバーで作る）
  successBody: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(submit, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // 今日より前の日は選べないようにする（フォームを作り直したときも）
  useEffect(() => {
    if (dateRef.current) dateRef.current.min = todayInJapan();
  }, [state.attempt]);

  // 送れたら、お知らせにフォーカスを移す（読み上げのため）
  // まちがいがあったら、はじめのまちがった欄にフォーカスを移す
  useEffect(() => {
    if (state.status === "success") {
      successRef.current?.focus();
    } else if (state.status === "error") {
      formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-lg border border-gold/30 bg-ivory-soft px-6 py-10 outline-none md:px-10"
      >
        <span aria-hidden="true" className="block h-px w-8 bg-gold" />
        <h3 className="mt-5 text-h3">{form.success.heading}</h3>
        {state.reservedAt !== "" && (
          <p className="mt-4 font-heading text-lead tracking-wide">
            {formatReservedAt(state.reservedAt, locale)}
            <br />
            {form.partySizeSummary.replace("{count}", String(state.partySize))}
          </p>
        )}
        <p className="mt-4 text-body text-forest-soft">{successBody}</p>
        <Button
          type="button"
          variant="link"
          className="mt-6 h-auto px-0 text-base text-leaf-deep"
          onClick={() => window.location.reload()}
        >
          {form.success.again}
        </Button>
      </div>
    );
  }

  const values: Partial<ReservationValues> = state.status === "error" ? state.values : {};
  const errors = state.status === "error" ? state.fieldErrors : {};
  const formError = state.status === "error" ? state.formError : null;

  // 欄ごとのエラー表示に使う属性
  function errorProps(field: ReservationField) {
    return errors[field]
      ? { "aria-invalid": true, "aria-describedby": `${field}-error` }
      : {};
  }
  function errorText(field: ReservationField) {
    const key = errors[field];
    if (!key) return null;
    return (
      <p id={`${field}-error`} className="text-small text-destructive">
        {form.errors[key]}
      </p>
    );
  }
  const optionalMark = (
    <span className="ml-2 text-small font-normal text-forest-soft">{form.optional}</span>
  );

  return (
    <form
      key={state.attempt}
      ref={formRef}
      action={formAction}
      noValidate
      className="grid gap-6 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">{form.name}</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          required
          maxLength={100}
          defaultValue={values.name}
          className={fieldClass}
          {...errorProps("name")}
        />
        {errorText("name")}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">{form.phone}</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          maxLength={30}
          defaultValue={values.phone}
          className={fieldClass}
          {...errorProps("phone")}
        />
        {errorText("phone")}
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="email">
          {form.email}
          {optionalMark}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          defaultValue={values.email}
          className={fieldClass}
          {...errorProps("email")}
        />
        {errorText("email")}
      </div>

      <div className="grid gap-6 sm:col-span-2 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="partySize">{form.partySize}</Label>
          <div className="relative">
            <select
              id="partySize"
              name="partySize"
              required
              defaultValue={values.partySize ?? "2"}
              className={selectClass}
              {...errorProps("partySize")}
            >
              {Array.from({ length: maxPartySize }, (_, i) => String(i + 1)).map((n) => (
                <option key={n} value={n}>
                  {n}
                  {form.partySizeSuffix}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              strokeWidth={1.25}
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-forest-soft"
            />
          </div>
          {errorText("partySize")}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="date">{form.date}</Label>
          <Input
            ref={dateRef}
            id="date"
            name="date"
            type="date"
            required
            defaultValue={values.date}
            className={fieldClass}
            {...errorProps("date")}
          />
          {errorText("date")}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="time">{form.time}</Label>
          <div className="relative">
            <select
              id="time"
              name="time"
              required
              defaultValue={values.time ?? ""}
              className={selectClass}
              {...errorProps("time")}
            >
              <option value="" disabled>
                {form.choose}
              </option>
              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              strokeWidth={1.25}
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-forest-soft"
            />
          </div>
          {errorText("time")}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="note">
          {form.note}
          {optionalMark}
        </Label>
        <Textarea
          id="note"
          name="note"
          rows={3}
          maxLength={500}
          placeholder={form.notePlaceholder}
          defaultValue={values.note}
          className="min-h-24 bg-ivory-soft md:text-base"
          {...errorProps("note")}
        />
        {errorText("note")}
      </div>

      {/* ロボット対策。人には見えない欄 */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">{form.honeypot}</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2">
        {formError && (
          <p role="alert" className="text-small text-destructive">
            {form.errors[formError]}
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-11 justify-self-start px-6 text-base sm:w-fit"
        >
          {pending ? form.submitting : form.submit}
        </Button>
      </div>
    </form>
  );
}
