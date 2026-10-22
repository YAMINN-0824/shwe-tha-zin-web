import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Hanging, Stem, StemDivider } from "@/components/site/stem";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const locale = await getLocale();
  const { hero, about, links } = await getDictionary();

  return (
    <main className="flex-1">
      {/* ヒーロー：お店の名前。ページを開いたときの動きは、ここだけ */}
      <section className="mx-auto max-w-5xl px-5 pt-16 md:pt-28">
        {/* スマホでは 1 語ずつ下へ垂れるように並べる。字間のぶん左にもあけて、まん中に見せる */}
        <h1 className="flex animate-bloom flex-col text-[clamp(3rem,15vw,5.75rem)] leading-[1.05] tracking-[0.16em] md:flex-row md:justify-center md:gap-[0.32em] md:pl-[0.16em] md:text-[clamp(3rem,7.5vw,5.75rem)]">
          <span>SHWE</span> <span>THA</span> <span>ZIN</span>
        </h1>
      </section>

      <div className="relative mx-auto max-w-5xl px-5 pb-24 md:pb-36">
        <Stem className="animate-stem-grow [animation-delay:500ms]" />

        {/* 名前の意味 */}
        <div className="grid gap-y-14 pt-14 md:grid-cols-2 md:pt-20">
          <Hanging
            side="left"
            className="animate-bloom [animation-delay:1300ms]"
          >
            <p className="font-heading text-4xl leading-snug tracking-wide">
              {hero.shwe.term}
            </p>
            <p className="mt-3 text-lg">{hero.shwe.meaning}</p>
          </Hanging>
          <Hanging
            side="right"
            className="animate-bloom [animation-delay:1900ms] md:mt-28"
          >
            <p className="font-heading text-4xl leading-snug tracking-wide">
              {hero.thazin.term}
            </p>
            <p className="mt-3 text-lg leading-loose">{hero.thazin.meaning}</p>
          </Hanging>
        </div>

        <StemDivider className="my-20 md:my-28" />

        {/* 私たちについて */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="grid scroll-mt-10 md:grid-cols-2"
        >
          <Hanging side="left">
            <h2 id="about-heading" className="text-3xl leading-snug">
              {about.heading}
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-lg leading-loose">
              {about.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </Hanging>
        </section>

        <StemDivider className="my-20 md:my-28" />

        {/* メニューと予約へ */}
        <div className="grid gap-y-16 md:grid-cols-2">
          <Hanging side="left">
            <h2 className="text-3xl leading-snug">{links.menu.heading}</h2>
            <p className="mt-4 leading-loose">{links.menu.body}</p>
            <Link
              href={`/${locale}/menu`}
              className="mt-6 inline-block rounded-sm text-lg text-leaf-deep underline decoration-leaf/50 underline-offset-[0.4em] transition-colors duration-300 hover:text-forest hover:decoration-forest focus-visible:outline-2 focus-visible:outline-ring"
            >
              {links.menu.action}
            </Link>
          </Hanging>
          <Hanging side="right" className="md:mt-28">
            <h2 className="text-3xl leading-snug">{links.reserve.heading}</h2>
            <p className="mt-4 leading-loose">{links.reserve.body}</p>
            <Link
              href={`/${locale}/reservation`}
              className={cn(buttonVariants({ size: "lg" }), "mt-6 h-11 px-6 text-base")}
            >
              {links.reserve.action}
            </Link>
          </Hanging>
        </div>
      </div>
    </main>
  );
}
