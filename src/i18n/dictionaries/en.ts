import type { Dictionary } from "./ja";

// 英語のページの文章。ja.ts と同じ形にする
const en: Dictionary = {
  meta: {
    title: "SHWE THA ZIN",
    description:
      "SHWE THA ZIN is a quiet restaurant where you can take your time with a mother's home cooking.",
  },
  nav: {
    home: "Home",
    menu: "Menu",
    about: "About us",
    reserve: "Reserve a table",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },
  hero: {
    shwe: {
      term: "Shwe",
      meaning: "Gold.",
    },
    thazin: {
      term: "Thazin",
      meaning:
        "A rare orchid loved in Myanmar. It blooms only once a year, and it is hard to grow.",
    },
  },
  // TODO: placeholder text. Replace with the shop's real story
  about: {
    heading: "About us",
    body: [
      "We serve the dishes a mother has always cooked for her family, just as they are.",
      "There is no need to hurry. Enjoy a warm meal and a quiet moment.",
    ],
  },
  links: {
    menu: {
      heading: "Menu",
      body: "See our dishes and prices.",
      action: "See the menu",
    },
    reserve: {
      heading: "Reservations",
      body: "Choose a date and the number of guests, then send a request. We will contact you to confirm.",
      action: "Reserve a table",
    },
  },
  // TODO: placeholder details. Replace with the shop's real details
  footer: {
    addressLabel: "Address",
    address: "0-0-0 Placeholder, Tokyo 000-0000 (placeholder)",
    hoursLabel: "Hours",
    hours: ["11:00–21:00 (placeholder)", "Closed: one day a week (placeholder)"],
    phoneLabel: "Phone",
    phone: "00-0000-0000 (placeholder)",
  },
  notFound: {
    heading: "Page not found",
    body: "The URL may be wrong, or this page is not ready yet.",
    back: "Back to the home page",
  },
};

export default en;
