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
    shwe: {
      term: "シュエ",
      meaning: "金。",
    },
    thazin: {
      term: "タジン",
      meaning:
        "ミャンマーで愛されている、めずらしいランの花。一年に一度だけ咲く、育てるのがむずかしい花です。",
    },
  },
  // TODO: 仮の文章。お店の本当の話に入れかえる
  about: {
    heading: "私たちについて",
    body: [
      "母が家族のために作ってきた料理を、そのままお出ししています。",
      "急がなくて大丈夫です。あたたかいごはんと、静かな時間をどうぞ。",
    ],
  },
  links: {
    menu: {
      heading: "メニュー",
      body: "お店の料理と値段を見られます。",
      action: "メニューを見る",
    },
    reserve: {
      heading: "ご予約",
      body: "日にちと人数を選んで、リクエストを送ってください。お店から確認のご連絡をします。",
      action: "予約する",
    },
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
