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
  src: StaticImageData;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
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
        preload={preload}
        className="relative h-auto w-full"
      />
    </div>
  );
}
