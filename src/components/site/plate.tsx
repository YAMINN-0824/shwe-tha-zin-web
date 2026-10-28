import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

// 切り抜きの料理の写真と、やわらかい影（DESIGN.md「写真」）
// 正方形のわくの中に、写真の形のまま入れる（丸いお皿も、背の高いグラスも、横長のお皿も）
// わくの大きさが決まっているので、写真を読みこんでも、ページはずれない
// 影は写真の形にそう drop-shadow。朝の光が左上から入るので、右下に少しずれる
// 大きさは、わくのはば（cqw）にあわせる（小さいお皿でも大きいお皿でも、同じ見え方）
export function Plate({
  src,
  alt,
  sizes,
  preload = false,
  onLoad,
  onError,
  className,
}: {
  // import した写真か、Supabase Storage の写真の URL
  src: StaticImageData | string;
  alt: string;
  sizes: string;
  preload?: boolean;
  // 写真を読みこめたとき・読みこめなかったとき（メニューのページで、動きを始めるため）
  onLoad?: (image: HTMLImageElement) => void;
  onError?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("@container relative aspect-square", className)}>
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        fill
        preload={preload}
        onLoad={onLoad && ((event) => onLoad(event.currentTarget))}
        onError={onError}
        className="object-contain [filter:drop-shadow(1.5cqw_2.5cqw_2.5cqw_rgb(31_42_30/0.2))]"
      />
    </div>
  );
}
