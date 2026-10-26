import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

// 切り抜きの料理の写真と、やわらかい影（DESIGN.md「写真」）
// 朝の光が左上から入るので、影は右下に少しずれる
export function Plate({
  src,
  alt,
  sizes,
  preload = false,
  className,
}: {
  // import した写真か、Supabase Storage の写真の URL
  src: StaticImageData | string;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  // URL の写真は大きさがわからないので、正方形として場所をとる（切り抜きのお皿は、ほぼ正方形）
  // h-auto なので、読みこんだあとは写真の本当の形になる
  const size = typeof src === "string" ? { width: 1024, height: 1024 } : {};
  return (
    <div className={cn("relative", className)}>
      <span
        aria-hidden="true"
        className="absolute inset-[3%] translate-x-[3%] translate-y-[5%] rounded-full bg-[radial-gradient(closest-side,rgb(31_42_30/0.3)_72%,rgb(31_42_30/0))]"
      />
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        {...size}
        preload={preload}
        className="relative h-auto w-full"
      />
    </div>
  );
}
