import { CalendarCheck, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HandDrawnCircle } from "@/components/site/hand-drawn-circle";
import { MistReveal } from "@/components/site/mist-reveal";
import { OfferList } from "@/components/site/offer-list";
import { Phrases } from "@/components/site/phrases";
import { photos } from "@/components/site/photos";
import { Plate } from "@/components/site/plate";
import { ReservationForm } from "@/components/site/reservation-form";
import { SectionHeading } from "@/components/site/section-heading";
import { SectionLink } from "@/components/site/section-link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { getPopularDishes } from "@/lib/menu";
import { MAX_PARTY_SIZE, isThadingyutEventOpen, reservationSlots } from "@/lib/shop";
import { cn } from "@/lib/utils";

const menuLinkClass =
  "inline-block rounded-sm text-body text-leaf-deep underline decoration-leaf/50 underline-offset-[0.4em] transition-colors duration-300 hover:text-forest hover:decoration-forest focus-visible:outline-2 focus-visible:outline-ring";
// 細い線のアイコン（DESIGN.md「アイコン」）
const iconStroke = 1.25;

export default async function HomePage() {
  const locale = await getLocale();
  const dict = await getDictionary();
  const { hero, about, shop, info, menu, offer, event, reserve } = dict;
  const showEvent = await isThadingyutEventOpen();
  // メニューの人気料理（Supabase。最大 4 つ）
  const popularDishes = await getPopularDishes(locale);
  const reserveHref = `/${locale}#reservation`;

  // お店の情報の帯。くわしい文字は 1 行だけ。ご予約は、全体がフォームへのリンク
  // お店の場所は Google マップ（新しいタブ）、ご予約はフォームへのリンク
  const infoItems = [
    { icon: MapPin, title: info.location, detail: shop.mapLink, href: shop.mapUrl, external: true },
    { icon: Clock, title: info.hours, detail: shop.hours, href: null, external: false },
    { icon: CalendarCheck, title: info.reservation, detail: shop.phone, href: reserveHref, external: false },
  ];

  return (
    <main className="flex-1">
      {/* 1. ヒーロー。ページを開いたときの動き：ことば → ミャー → ふきだし → 金の丸 */}
      <section className="relative overflow-x-clip">
        <div className="relative mx-auto grid max-w-6xl gap-x-12 px-5 pt-10 pb-20 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:pt-16 lg:pb-28 xl:grid-cols-[1fr_31.5rem] xl:gap-x-8">
          {/* 左：いちばん大きいひとことと、名前の意味。1 つのまとまりで、ミャーと上下まん中にそろえる
              意味の文章は、ひとことから少しはなす（lg:mt-14） */}
          <div className="max-w-xl animate-bloom lg:max-w-none">
            {/* text-balance：1 語だけの行ができないよう、行の長さをそろえる */}
            {/* text-hero（30px → 48px）。金の丸も、この大きさに合わせて大きくなる */}
            <h1 className="text-hero tracking-wide text-balance">
              {hero.lead.before}
              {/* 丸のことばと、そのあと（"mother's kitchen."）は、とちゅうで改行しない */}
              <span className="inline-block whitespace-nowrap">
                <HandDrawnCircle drawClassName="[animation-delay:1700ms]">
                  {hero.lead.mark}
                </HandDrawnCircle>
                {hero.lead.after}
              </span>
              {hero.lead.gap}
              <span className="inline-block">{hero.lead.close}</span>
            </h1>
            <p className="mt-8 max-w-lg text-lead text-forest-soft lg:mt-12">
              <Phrases>{hero.meaning}</Phrases>
            </p>
          </div>

          {/* 母（ミャー）のマスコットと、小さいふきだしのあいさつ */}
          {/* 広い画面（xl）では、ミャーを少しまん中へ。右に、ふきだしのぶんだけあける（11.5rem） */}
          <figure className="relative mt-14 flex flex-col items-end lg:mt-0 xl:mr-[11.5rem]">
            {/* ふきだし：スマホ〜タブレットはミャーの頭の上、広い画面（xl）は頭の右（コック帽の横の、空いたところ）
                右はしは、ヘッダーの「予約する」の右はしとそろえる。ミャーのあとに、しずかに出る */}
            <figcaption className="relative z-10 mr-[15%] mb-4 animate-bloom [animation-delay:1400ms] sm:mr-24 lg:mr-28 xl:absolute xl:top-[5%] xl:-right-[11.5rem] xl:mr-0 xl:mb-0">
              <p className="relative rounded-xl border border-gold-deep/35 bg-ivory-soft px-4 py-2.5 font-heading text-small tracking-wide whitespace-nowrap text-forest-soft">
                {hero.mascot.greeting.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                {/* しっぽ：下むき（頭の上のとき）と、左むき（頭の右のとき）。どちらもミャーのほうへ */}
                <span
                  aria-hidden="true"
                  className="absolute size-2.5 rotate-45 border-gold-deep/35 bg-ivory-soft right-10 -bottom-[5.5px] border-r border-b xl:hidden"
                />
                <span
                  aria-hidden="true"
                  className="absolute size-2.5 rotate-45 border-gold-deep/35 bg-ivory-soft top-[62%] -left-[5.5px] hidden -translate-y-1/2 border-b border-l xl:block"
                />
              </p>
            </figcaption>
            <Image
              src={photos.mya}
              alt={hero.mascot.alt}
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 280px, 54vw"
              preload
              className="h-auto w-[54%] max-w-[17.5rem] animate-bloom [animation-delay:600ms] [animation-duration:1.6s] sm:w-[17.5rem] lg:w-80 lg:max-w-none"
            />
          </figure>

        </div>
      </section>

      {/* 2. 私たちについて。スクロールしたときの動き：霧が晴れる */}
      <section
        id="about"
        aria-labelledby="about-heading"
        className="scroll-mt-10 bg-parchment"
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[2fr_3fr] md:items-center md:gap-16 md:py-32">
          <div>
            <SectionHeading
              id="about-heading"
              label={about.label}
              heading={about.heading}
            />
            <div className="mt-8 flex flex-col gap-4 text-body">
              {about.body.map((line) => (
                <p key={line}>
                  <Phrases>{line}</Phrases>
                </p>
              ))}
            </div>
          </div>
          <figure>
            <MistReveal className="rounded-lg">
              <Image
                src={photos["hometown-gate"]}
                alt={about.photoAlt}
                sizes="(min-width: 1152px) 660px, (min-width: 768px) 58vw, 100vw"
                className="h-auto w-full"
              />
            </MistReveal>
            <figcaption className="mt-3 text-small text-forest-soft">
              <Phrases>{about.photoCaption}</Phrases>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 3. お店の情報の帯。アイボリーの上だけに置く。光が左右にはみ出してもスクロールが出ないよう clip */}
      <section aria-labelledby="info-heading" className="overflow-x-clip pt-20 md:pt-28">
        <h2 id="info-heading" className="sr-only">
          {info.heading}
        </h2>
        <div className="relative mx-auto max-w-6xl px-5">
          {/* 帯の形にそった、横長のやわらかい金の光（影ではなくグラデーション）
              まん中で gold/30 まで。これより濃いと gold-deep の文字が読みにくくなる */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[4%] -inset-y-10 bg-[radial-gradient(ellipse_closest-side,rgb(217_169_46/0.3),rgb(217_169_46/0.16)_55%,rgb(217_169_46/0))] lg:-inset-x-[8%] lg:-inset-y-12"
          />
          <ul className="relative grid rounded-[6px] border border-forest/15 px-2 py-1 lg:grid-cols-3 lg:px-4">
            {infoItems.map((item) => {
              const content = (
                <>
                  <item.icon
                    aria-hidden="true"
                    absoluteStrokeWidth
                    strokeWidth={iconStroke}
                    className="size-8 shrink-0 text-forest"
                  />
                  <div className="min-w-0">
                    <h3 className="text-h3">{item.title}</h3>
                    {/* 光が強くなると、文字も少し濃くして読みやすさを保つ */}
                    {/* 地図のリンクは、マウスをのせると、うすい下線が出る */}
                    <p
                      className={cn(
                        "text-small text-gold-deep transition-colors duration-400 ease-in-out group-hover:text-gold-ink group-has-focus-visible:text-gold-ink motion-reduce:transition-none lg:whitespace-nowrap",
                        item.external &&
                          "decoration-gold-deep/40 underline-offset-[0.3em] group-hover:underline group-focus-visible:underline",
                      )}
                    >
                      {item.detail}
                      {item.external && <span className="sr-only">{info.newTab}</span>}
                    </p>
                  </div>
                </>
              );
              const itemClass =
                "relative flex items-center gap-3.5 rounded-[4px] px-3 py-2 lg:justify-center";
              // フォーカスの線はキーボードのときだけ。細く、目立ちすぎない
              const focusRing =
                "focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-gold-deep focus-visible:outline-solid";
              return (
                <li key={item.title} className="group relative">
                  {/* マウスをのせると、この項目のうしろの金の光が、ゆっくり強くなる
                      （hover はマウスのある画面だけ。キーボードのフォーカスでも同じ） */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-x-4 -inset-y-6 bg-[radial-gradient(ellipse_closest-side,rgb(217_169_46/0.25),rgb(217_169_46/0.1)_55%,rgb(217_169_46/0))] opacity-0 transition-opacity duration-400 ease-in-out group-hover:opacity-100 group-has-focus-visible:opacity-100 motion-reduce:transition-none"
                  />
                  {item.href && item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(itemClass, focusRing)}
                    >
                      {content}
                    </a>
                  ) : item.href ? (
                    <SectionLink href={item.href} className={cn(itemClass, focusRing)}>
                      {content}
                    </SectionLink>
                  ) : (
                    <div className={itemClass}>{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 4. メニュー：左右にジグザグ */}
      <section
        id="menu"
        aria-labelledby="menu-heading"
        className="mx-auto max-w-6xl scroll-mt-10 overflow-x-clip px-5 py-20 md:py-32"
      >
        <SectionHeading id="menu-heading" label={menu.label} heading={menu.heading} />
        {popularDishes.length > 0 && (
          <ul className="mt-14 flex flex-col gap-20 md:mt-20 md:gap-0">
            {popularDishes.map((dish, index) => {
              const plateOnRight = index % 2 === 1;
              return (
                <li
                  key={dish.id}
                  className={cn(
                    "grid items-center gap-8 md:grid-cols-2 md:gap-16",
                    plateOnRight && "md:-mt-12",
                  )}
                >
                  {/* 人気料理は、写真のあるものだけ（src/lib/menu.ts） */}
                  {dish.image && (
                    <Plate
                      src={dish.image.url}
                      alt={dish.image.alt}
                      sizes="(min-width: 768px) 448px, 82vw"
                      className={cn(
                        "w-[82%] max-w-md",
                        plateOnRight
                          ? "ml-auto md:order-2 md:ml-0 md:justify-self-start"
                          : "md:justify-self-end",
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "max-w-sm",
                      plateOnRight && "md:order-1 md:justify-self-end",
                    )}
                  >
                    <h3 className="text-h3">
                      <Phrases>{dish.name}</Phrases>
                    </h3>
                    <p className="mt-3 text-body text-forest-soft">
                      <Phrases>{dish.description}</Phrases>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <Link href={`/${locale}/menu`} className={cn(menuLinkClass, "mt-16 md:mt-20")}>
          {menu.action}
        </Link>
      </section>

      {/* 5. お店でできること。PC は 2 列：左に見出しと説明、右に 3 つの項目 */}
      <section
        aria-labelledby="offer-heading"
        className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 md:pb-32 lg:grid-cols-[1fr_1.5fr] lg:items-center lg:gap-16"
      >
        <div>
          <SectionHeading id="offer-heading" label={offer.label} heading={offer.heading} />
          <p className="mt-6 max-w-sm text-body text-forest-soft">
            <Phrases>{offer.body}</Phrases>
          </p>
        </div>
        {/* 押すと、見出しのうしろに金の光がともる、トグルのボタン（クライアント） */}
        <OfferList
          items={offer.items.map((item) => ({
            icon: item.icon,
            title: <Phrases>{item.title}</Phrases>,
          }))}
        />
      </section>

      {/* 6. イベント：タディンジュット祭り。11 月 1 日（日本時間）が終わったら出さない */}
      {showEvent && (
        <section
          id="event"
          aria-labelledby="event-heading"
          className="mx-auto max-w-6xl scroll-mt-10 px-5 pb-20 md:pb-32"
        >
          <div className="grid items-center gap-10 overflow-hidden rounded-2xl bg-forest px-6 py-14 text-ivory md:grid-cols-[1.15fr_1fr] md:px-14 md:py-20">
            <div>
              <SectionHeading
                id="event-heading"
                label={event.label}
                heading={event.heading}
                tone="dark"
              />
              <p className="mt-3 font-heading text-lead tracking-wide text-ivory/80">
                {event.subheading}
              </p>
              <p className="mt-8 text-body">
                <Phrases>{event.offer}</Phrases>
              </p>
              <p className="mt-4 text-body text-ivory/80">
                <Phrases>{event.body}</Phrases>
              </p>
              <dl className="mt-8 grid gap-3 text-small sm:grid-cols-[auto_1fr] sm:gap-x-6">
                <dt className="text-gold">{event.periodLabel}</dt>
                <dd className="text-ivory/90">
                  <Phrases>{event.period}</Phrases>
                </dd>
                <dt className="mt-2 text-gold sm:mt-0">{event.conditionsLabel}</dt>
                <dd className="text-ivory/90">
                  <Phrases>{event.conditions}</Phrases>
                </dd>
              </dl>
            </div>
            {/* 灯りのような、動かない金の光 */}
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -inset-[12%] bg-[radial-gradient(closest-side,rgb(217_169_46/0.3),rgb(217_169_46/0.08)_60%,rgb(217_169_46/0))]"
              />
              <Plate
                src={photos.laphet}
                alt={event.alt}
                sizes="(min-width: 768px) 384px, 76vw"
                className="mx-auto w-[76%] max-w-sm"
              />
            </div>
          </div>
        </section>
      )}

      {/* 7. ご予約 */}
      <section
        id="reservation"
        aria-labelledby="reservation-heading"
        className="scroll-mt-10 bg-parchment"
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[2fr_3fr] md:gap-16 md:py-32">
          <div>
            <SectionHeading
              id="reservation-heading"
              label={reserve.label}
              heading={reserve.heading}
            />
            <p className="mt-6 max-w-md text-body">
              <Phrases>{reserve.body}</Phrases>
            </p>
          </div>
          <ReservationForm
            locale={locale}
            form={reserve.form}
            slots={reservationSlots}
            maxPartySize={MAX_PARTY_SIZE}
            successBody={<Phrases>{reserve.form.success.body}</Phrases>}
          />
        </div>
      </section>
    </main>
  );
}
