import { createCn } from "cn/config"

// globals.css の文字の大きさ（text-hero など）を、cn に教える
// 教えないと、色のクラス（text-gold-deep など）と同じなかまと思われて、消されてしまう
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["hero", "h2", "label", "h3", "lead", "body", "small"] }],
    },
  },
})
