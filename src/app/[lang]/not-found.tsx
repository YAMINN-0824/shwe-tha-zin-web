import Link from "next/link";
import { OrchidMark } from "@/components/site/orchid-mark";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export default async function NotFound() {
  const locale = await getLocale();
  const { notFound } = await getDictionary();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 py-24">
      <OrchidMark className="size-10 text-leaf" />
      <h1 className="mt-8 text-3xl leading-snug">{notFound.heading}</h1>
      <p className="mt-4 leading-loose">{notFound.body}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 self-start rounded-sm text-lg text-leaf-deep underline decoration-leaf/50 underline-offset-[0.4em] transition-colors duration-300 hover:text-forest focus-visible:outline-2 focus-visible:outline-ring"
      >
        {notFound.back}
      </Link>
    </main>
  );
}
