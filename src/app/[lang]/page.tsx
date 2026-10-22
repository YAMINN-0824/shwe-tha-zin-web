import {
  Bike,
  CalendarCheck,
  CalendarHeart,
  ChefHat,
  Clock,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { HandDrawnCircle } from "@/components/site/hand-drawn-circle";
import { MistReveal } from "@/components/site/mist-reveal";
import { Phrases } from "@/components/site/phrases";
import { photos } from "@/components/site/photos";
import { Plate } from "@/components/site/plate";
import { Pollen } from "@/components/site/pollen";
import { ReservationForm } from "@/components/site/reservation-form";
import { SectionHeading } from "@/components/site/section-heading";
import type { OfferIcon } from "@/i18n/dictionaries/ja";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { MAX_PARTY_SIZE, isThadingyutEventOpen, reservationSlots } from "@/lib/shop";
import { cn } from "@/lib/utils";

const reserveClass = cn(buttonVariants({ size: "lg" }), "h-11 px-6 text-base");
const menuLinkClass =
  "inline-block rounded-sm text-lg text-leaf-deep underline decoration-leaf/50 underline-offset-[0.4em] transition-colors duration-300 hover:text-forest hover:decoration-forest focus-visible:outline-2 focus-visible:outline-ring";
// 細い線のアイコン（DESIGN.md「アイコン」）
const iconStroke = 1.25;

const offerIcons: Record<OfferIcon, LucideIcon> = {
  events: CalendarHeart,
  special: ChefHat,
  delivery: Bike,
};

export default async function HomePage() {
  const locale = await getLocale();
  const dict = await getDictionary();
  const { nav, hero, about, shop, info, menu, offer, event, reserve } = dict;
  const showEvent = await isThadingyutEventOpen();
  const reserveHref = `/${locale}#reservation`;

  // お店の情報の帯。くわしい文字は 1 行だけ。ご予約は、全体がフォームへのリンク
  const infoItems = [
    { icon: MapPin, title: info.location, detail: shop.addressShort, href: null },
    { icon: Clock, title: info.hours, detail: shop.hours, href: null },
    { icon: CalendarCheck, title: info.reservation, detail: shop.phone, href: reserveHref },
  ];

  return (
    <main className="flex-1">
      {/* 1. ヒーロー。ページを開いたときの動き：名前 → 写真 → 金の丸 */}
      <section className="relative overflow-x-clip">
        <Pollen />
        <div className="relative mx-auto grid max-w-6xl gap-x-12 px-5 pt-8 pb-20 lg:grid-cols-[1fr_1.15fr] lg:grid-rows-[auto_1fr] lg:pt-16 lg:pb-28">
          <h1 className="flex animate-bloom flex-col text-[clamp(3.5rem,17vw,7.5rem)] leading-none tracking-[0.12em] lg:self-end">
            <span>SHWE</span> <span>THA</span> <span>ZIN</span>
          </h1>

          <figure className="mt-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center">
            <Plate
              src={photos.laphet}
              alt={hero.signature.alt}
              sizes="(min-width: 1152px) 660px, (min-width: 1024px) 58vw, (min-width: 640px) 576px, 92vw"
              preload
              className="ml-auto w-[92%] max-w-xl translate-x-[10%] animate-bloom [animation-delay:600ms] [animation-duration:1.6s] lg:w-full lg:translate-x-[8%]"
            />
            <figcaption className="mt-6 flex max-w-xs animate-bloom items-start gap-4 [animation-delay:1100ms] lg:ml-[8%]">
              <span aria-hidden="true" className="mt-3.5 h-px w-10 shrink-0 bg-gold" />
              <div>
                <p className="flex items-center gap-2 text-sm text-forest-soft">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-lacquer" />
                  {hero.signature.label}
                </p>
                <p className="mt-1 font-heading text-xl tracking-wide">
                  {hero.signature.name}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-forest-soft">
                  <Phrases>{hero.signature.description}</Phrases>
                </p>
              </div>
            </figcaption>
          </figure>

          <div className="mt-14 max-w-md animate-bloom [animation-delay:300ms] lg:col-start-1 lg:row-start-2 lg:mt-12">
            <p className="font-heading text-2xl leading-relaxed tracking-wide lg:text-[1.75rem]">
              {hero.lead.before}
              <HandDrawnCircle drawClassName="[animation-delay:1700ms]">
                {hero.lead.mark}
              </HandDrawnCircle>
              {hero.lead.after}
              <span className="inline-block">{hero.lead.close}</span>
            </p>
            <p className="mt-5 leading-loose text-forest-soft">
              <Phrases>{hero.meaning}</Phrases>
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link href={reserveHref} className={reserveClass}>
                {nav.reserve}
              </Link>
              <Link href={`/${locale}#menu`} className={menuLinkClass}>
                {menu.label}
              </Link>
            </div>
          </div>
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
            <div className="mt-8 flex flex-col gap-4 text-lg leading-loose">
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
            <figcaption className="mt-3 text-sm text-forest-soft">
              <Phrases>{about.photoCaption}</Phrases>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 3. お店の情報の帯。アイボリーの上だけに置く */}
      <section
        aria-labelledby="info-heading"
        className="relative mx-auto max-w-6xl px-5 pt-20 md:pt-28"
      >
        <h2 id="info-heading" className="sr-only">
          {info.heading}
        </h2>
        <div className="relative">
          {/* 帯のまん中から、上と下へ広がる、やわらかい金の光（影ではなくグラデーション） */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -inset-y-16 bg-[radial-gradient(closest-side,rgb(217_169_46/0.26),rgb(217_169_46/0.1)_55%,rgb(217_169_46/0))] md:-inset-y-24"
          />
          <ul className="relative grid gap-2 rounded-xl border border-gold/40 px-3 py-3 md:grid-cols-3 md:gap-4 md:px-6 md:py-6">
            {infoItems.map((item) => {
              const content = (
                <>
                  <item.icon
                    aria-hidden="true"
                    absoluteStrokeWidth
                    strokeWidth={iconStroke}
                    className="size-12 shrink-0 text-forest"
                  />
                  <div>
                    <h3 className="text-lg leading-snug">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gold-deep">
                      {item.detail}
                    </p>
                  </div>
                </>
              );
              const itemClass =
                "flex items-center gap-4 rounded-lg px-3 py-3 md:justify-center md:py-2";
              return (
                <li key={item.title}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        itemClass,
                        "transition-colors duration-300 hover:bg-gold/10 focus-visible:outline-2 focus-visible:outline-ring",
                      )}
                    >
                      {content}
                    </Link>
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
        <ul className="mt-14 flex flex-col gap-20 md:mt-20 md:gap-0">
          {menu.items.map((item, index) => {
            const plateOnRight = index % 2 === 1;
            return (
              <li
                key={item.image}
                className={cn(
                  "grid items-center gap-8 md:grid-cols-2 md:gap-16",
                  plateOnRight && "md:-mt-12",
                )}
              >
                <Plate
                  src={photos[item.image]}
                  alt={item.alt}
                  sizes="(min-width: 768px) 448px, 82vw"
                  className={cn(
                    "w-[82%] max-w-md",
                    plateOnRight
                      ? "ml-auto md:order-2 md:ml-0 md:justify-self-start"
                      : "md:justify-self-end",
                  )}
                />
                <div
                  className={cn(
                    "max-w-sm",
                    plateOnRight && "md:order-1 md:justify-self-end",
                  )}
                >
                  <h3 className="text-2xl leading-snug">
                    <Phrases>{item.name}</Phrases>
                  </h3>
                  <p className="mt-3 leading-relaxed text-forest-soft">
                    <Phrases>{item.description}</Phrases>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        {/* メニューのページは、これから作る */}
        <Link href={`/${locale}/menu`} className={cn(menuLinkClass, "mt-16 md:mt-20")}>
          {menu.action}
        </Link>
      </section>

      {/* 5. お店でできること */}
      <section
        aria-labelledby="offer-heading"
        className="mx-auto max-w-6xl px-5 pb-20 md:pb-32"
      >
        <SectionHeading id="offer-heading" label={offer.label} heading={offer.heading} />
        <ul className="mt-14 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-10">
          {offer.items.map((item) => {
            const Icon = offerIcons[item.icon];
            return (
              <li key={item.icon}>
                <span className="flex size-14 items-center justify-center rounded-full border border-gold/50">
                  <Icon
                    aria-hidden="true"
                    strokeWidth={iconStroke}
                    className="size-6 text-gold"
                  />
                </span>
                <h3 className="mt-5 text-xl leading-snug">{item.title}</h3>
                <p className="mt-2 max-w-xs leading-relaxed text-forest-soft">
                  <Phrases>{item.body}</Phrases>
                </p>
              </li>
            );
          })}
        </ul>
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
              <p className="mt-3 font-heading text-lg tracking-wide text-ivory/80">
                {event.subheading}
              </p>
              <p className="mt-8 text-lg leading-loose">
                <Phrases>{event.offer}</Phrases>
              </p>
              <p className="mt-4 leading-loose text-ivory/80">
                <Phrases>{event.body}</Phrases>
              </p>
              <dl className="mt-8 grid gap-3 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6">
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
            <p className="mt-6 max-w-md leading-loose">
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
