import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { HandDrawnCircle } from "@/components/site/hand-drawn-circle";
import { MistReveal } from "@/components/site/mist-reveal";
import { photos } from "@/components/site/photos";
import { Plate } from "@/components/site/plate";
import { Pollen } from "@/components/site/pollen";
import { SectionHeading } from "@/components/site/section-heading";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

const reserveClass = cn(buttonVariants({ size: "lg" }), "h-11 px-6 text-base");
const menuLinkClass =
  "inline-block rounded-sm text-lg text-leaf-deep underline decoration-leaf/50 underline-offset-[0.4em] transition-colors duration-300 hover:text-forest hover:decoration-forest focus-visible:outline-2 focus-visible:outline-ring";

export default async function HomePage() {
  const locale = await getLocale();
  const { hero, featured, about, reserve, actions } = await getDictionary();
  const menuHref = `/${locale}/menu`;
  const reserveHref = `/${locale}/reservation`;

  return (
    <main className="flex-1">
      {/* ヒーロー。ページを開いたときの動き：名前 → 写真 → 金の丸 */}
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
                  {hero.signature.description}
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
            <p className="mt-5 leading-loose text-forest-soft">{hero.meaning}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link href={reserveHref} className={reserveClass}>
                {actions.reserve}
              </Link>
              <Link href={menuHref} className={menuLinkClass}>
                {actions.menu}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 料理：左右にジグザグ */}
      <section
        aria-labelledby="featured-heading"
        className="mx-auto max-w-6xl overflow-x-clip px-5 py-20 md:py-32"
      >
        <SectionHeading
          id="featured-heading"
          label={featured.label}
          heading={featured.heading}
        />
        <ul className="mt-14 flex flex-col gap-20 md:mt-20 md:gap-0">
          {featured.items.map((item, index) => {
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
                  <h3 className="text-2xl leading-snug">{item.name}</h3>
                  <p className="mt-3 leading-relaxed text-forest-soft">
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <Link href={menuHref} className={cn(menuLinkClass, "mt-16 md:mt-20")}>
          {actions.menu}
        </Link>
      </section>

      {/* 私たちについて。スクロールしたときの動き：霧が晴れる */}
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
                <p key={line}>{line}</p>
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
              {about.photoCaption}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ご予約 */}
      <section
        aria-labelledby="reserve-heading"
        className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1fr_auto] md:items-end md:py-32"
      >
        <div>
          <SectionHeading
            id="reserve-heading"
            label={reserve.label}
            heading={reserve.heading}
          />
          <p className="mt-6 max-w-lg leading-loose">{reserve.body}</p>
        </div>
        <Link href={reserveHref} className={cn(reserveClass, "justify-self-start")}>
          {actions.reserve}
        </Link>
      </section>
    </main>
  );
}
