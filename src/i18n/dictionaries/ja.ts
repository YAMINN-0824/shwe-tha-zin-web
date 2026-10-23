import type { PhotoName } from "@/components/site/photos";

// サービスのアイコン（src/app/[lang]/page.tsx で絵にする）
export type OfferIcon = "events" | "special" | "delivery";

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
    // gap は after と close のあいだ（英語はスペース、日本語はなし）
    lead: { before: "", mark: "母", after: "の台所の味を、", gap: "", close: "ゆっくりどうぞ。" },
    // 料理をする母（ミャー）のマスコット
    mascot: {
      // TODO: 仮のあいさつ。お店の言葉に入れかえる（1 つが 1 行になる）
      greeting: ["ミャーです。", "母の台所へ、ようこそ。（仮）"],
      alt: "コック帽をかぶって、お茶の葉のサラダを持ってほほえむ、ミャーのイラスト",
    },
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
  // TODO: 仮の情報。お店の本当の情報に入れかえる（フッターと、お店の情報の帯で使う）
  // お店の情報（フッターと、お店の情報の帯で使う。en.ts も同じ形）
  shop: {
    // TODO: 本当の住所が決まったら、ここに足して、帯とフッターに出す
    // 今は住所のかわりに、Google マップへのリンクだけ出す
    mapUrl: "https://maps.app.goo.gl/nvb5322Lr6qkBrjL6",
    mapLink: "Googleマップで見る",
    // 定休日はない。時間を変えたら src/lib/shop.ts の予約の時間も合わせる
    hours: "毎日 5:00〜19:00",
    // TODO: 仮の電話番号。本当の番号に入れかえる
    phone: "09-0000-xxxx",
    // TODO: 本当の番号になったら "tel:+81..." を入れる（入れると、電話番号がリンクになる）
    phoneHref: "",
  },
  info: {
    heading: "お店の情報",
    location: "お店の場所",
    newTab: "（新しいタブで開きます）",
    hours: "営業時間",
    reservation: "ご予約",
  },
  // TODO: 仮の料理名と説明。お店の言葉に入れかえる
  menu: {
    label: "メニュー",
    heading: "家族で囲む、いつもの料理",
    action: "メニューをすべて見る",
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
  // TODO: 仮の文章。お店の言葉に入れかえる
  offer: {
    label: "お店でできること",
    heading: "食事のほかにも",
    // TODO: 仮の文章。お店の言葉に入れかえる
    body: "お祭りの日の食事会や、お祝いの日の料理のご相談、デリバリーも。（仮）",
    items: [
      {
        icon: "events" as OfferIcon,
        title: "イベント",
      },
      {
        icon: "special" as OfferIcon,
        title: "特別メニュー",
      },
      // TODO: confirm if delivery is really offered before going live
      // （今は表示だけ。注文の仕組みはない）
      {
        icon: "delivery" as OfferIcon,
        title: "デリバリー",
      },
    ],
  },
  event: {
    label: "イベント",
    heading: "タディンジュット祭り",
    subheading: "ミャンマーの光の祭り",
    offer: "祭りのあいだ、ラペットゥ（お茶の葉のサラダ）を無料でお出しします。",
    body: "満月の夜に、家や町に灯りをともして、両親や年上の人に感謝を伝えるお祭りです。",
    // TODO: 始まる日と条件は仮。お店に確認して入れかえる
    periodLabel: "期間",
    period: "〇月〇日（仮）〜11月1日",
    conditionsLabel: "条件",
    conditions: "店内でお食事の方、お一人さま一皿（仮）",
    alt: "うるしの赤いお盆に盛られた、ラペットゥ（お茶の葉のサラダ）",
  },
  reserve: {
    label: "ご予約",
    heading: "お席を用意して、お待ちしています",
    body: "日にちと人数を選んで、リクエストを送ってください。お店から確認のご連絡をします。",
    form: {
      name: "お名前",
      phone: "電話番号",
      email: "メールアドレス",
      optional: "任意",
      partySize: "人数",
      partySizeSuffix: "名",
      partySizeSummary: "{count}名",
      date: "日にち",
      time: "時間",
      choose: "選んでください",
      note: "ご要望",
      notePlaceholder: "アレルギーや、お祝いの予定など",
      // ロボット対策の見えない欄（人には見えない）
      honeypot: "この欄は空のままにしてください",
      submit: "予約をリクエストする",
      submitting: "送っています…",
      errors: {
        name: "お名前を入れてください（100 文字まで）",
        phone: "電話番号を、数字で入れてください",
        email: "メールアドレスの形がちがいます",
        partySize: "人数を選んでください",
        date: "日にちを選んでください",
        time: "時間を選んでください",
        past: "これから先の日にちと時間を選んでください",
        note: "ご要望は 500 文字までにしてください",
        failed:
          "送れませんでした。少し時間をおいて、もう一度お試しください。急ぎの方はお電話ください。",
      },
      success: {
        heading: "リクエストを受け付けました",
        body: "お店から、確認のご連絡をします。ご連絡があるまで、予約はまだ決まっていません。",
        again: "別の予約をリクエストする",
      },
    },
  },
  footer: {
    addressLabel: "お店の場所",
    hoursLabel: "営業時間",
    phoneLabel: "電話",
  },
  notFound: {
    heading: "ページが見つかりません",
    body: "URL がまちがっているか、ページがまだできていません。",
    back: "トップページにもどる",
  },
};

export type Dictionary = typeof ja;
export default ja;
