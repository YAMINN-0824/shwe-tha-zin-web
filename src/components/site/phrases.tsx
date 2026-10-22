import { loadDefaultJapaneseParser } from "budoux";
import { Fragment } from "react";

// 日本語を、ことばのとちゅうで改行しないようにする（DESIGN.md「文字」）
// BudouX で文節に分けて、文節の間だけで改行できるようにする（<wbr>）
// 日本語（かな・漢字）がない文章は、そのまま返す（英語の単語を切らない）
const parser = loadDefaultJapaneseParser();
const JAPANESE = /[\u3040-\u30ff\u3400-\u9fff]/;

export function Phrases({ children }: { children: string }) {
  if (!JAPANESE.test(children)) return children;
  const phrases = parser.parse(children);
  return (
    <span className="phrases">
      {phrases.map((phrase, index) => (
        <Fragment key={index}>
          {index > 0 && <wbr />}
          {phrase}
        </Fragment>
      ))}
    </span>
  );
}
