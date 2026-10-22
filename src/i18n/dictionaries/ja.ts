import type { PhotoName } from "@/components/site/photos";

// 日本語のページの文章。en.ts も同じ形にする（型でチェックされる）
const ja = {
  meta: {
    title: "SHWE THA ZIN",
    description:
      "SHWE THA ZIN（シュエ・タジン）。母の味を、ゆっくり味わえるお店です。",
  },
  nav: {
    home: "トップページ",
    menu: "メニュー",
    about: "私たちについて",
    reserve: "予約する",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
    language: "言語",
  },
  hero: {
    meaning:
      "シュエは「金」。タジンは、一年に一度だけ咲く、ミャンマーのめずらしいランの花です。",
    // mark のことばを、金の手がきの丸でかこむ。close は、とちゅうで改行しない
    lead: { before: "", mark: "母", after: "の台所の味を、", close: "ゆっくりどうぞ。" },
    signature: {
      label: "いちばん人気",
      name: "ラペットゥ",
      // TODO: 仮の説明。お店の言葉に入れかえる
      description: "お茶の葉のサラダ。発酵させた茶葉に、豆やナッツをまぜて。",
      alt: "うるしの赤いお盆に、茶葉、豆、ナッツ、トマト、とうがらし、にんにくが分けて盛られている",
    },
  },
  // TODO: 仮の料理名と説明。お店の言葉に入れかえる
  featured: {
    label: "母の台所から",
    heading: "家族で囲む、いつもの料理",
    items: [
      {
        image: "rice-set" as PhotoName,
        name: "ミャンマーごはんセット（仮）",
        description: "ごはんと、小さなおかずをいろいろ。少しずつ味わえます。",
        alt: "竹のお盆に、ごはんと、カレーやスープ、野菜のおかずの小さなお皿がたくさん並んでいる",
      },
      {
        image: "fritters" as PhotoName,
        name: "揚げ物の盛り合わせ（仮）",
        description: "野菜や豆をからりと揚げて、すっぱいたれをつけて。",
        alt: "竹のお盆に、豆や野菜の揚げ物と、レタス、キャベツ、緑のたれが盛られている",
      },
    ],
  },
  // TODO: 仮の文章。お店の本当の話に入れかえる
  about: {
    label: "私たちについて",
    heading: "母のふるさとから",
    body: [
      "母が家族のために作ってきた料理を、そのままお出ししています。",
      "急がなくて大丈夫です。あたたかいごはんと、静かな時間をどうぞ。",
    ],
    photoAlt: "木の並ぶまっすぐな道にかかる、赤と金の大きな門",
    photoCaption: "母のふるさとの入り口にある門",
  },
  reserve: {
    label: "ご予約",
    heading: "お席を用意して、お待ちしています",
    body: "日にちと人数を選んで、リクエストを送ってください。お店から確認のご連絡をします。",
  },
  actions: {
    menu: "メニューを見る",
    reserve: "予約する",
  },
  // TODO: 仮の情報。お店の本当の情報に入れかえる
  footer: {
    addressLabel: "住所",
    address: "〒000-0000 東京都〇〇区〇〇 0-0-0（仮）",
    hoursLabel: "営業時間",
    hours: ["11:00〜21:00（仮）", "定休日：〇曜日（仮）"],
    phoneLabel: "電話",
    phone: "00-0000-0000（仮）",
  },
  notFound: {
    heading: "ページが見つかりません",
    body: "URL がまちがっているか、ページがまだできていません。",
    back: "トップページにもどる",
  },
};

export type Dictionary = typeof ja;
export default ja;
