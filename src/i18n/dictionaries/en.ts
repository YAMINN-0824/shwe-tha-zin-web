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
    meaning:
      "Shwe means gold. Thazin is a rare orchid from Myanmar that blooms only once a year.",
    // The word in mark gets the gold hand-drawn circle. close never breaks across lines
    lead: {
      before: "Home cooking from our ",
      mark: "mother's",
      after: " kitchen. ",
      close: "Take your time.",
    },
    signature: {
      label: "Most popular",
      name: "Tea leaf salad",
      // TODO: placeholder description. Replace with the shop's own words
      description: "Fermented tea leaves, mixed with crunchy beans and nuts.",
      alt: "A red lacquer tray with tea leaves, beans, nuts, tomato, chili and garlic in separate sections",
    },
  },
  // TODO: placeholder dish names and descriptions. Replace with the shop's own words
  featured: {
    label: "From our kitchen",
    heading: "Everyday dishes, made for sharing",
    items: [
      {
        image: "rice-set",
        name: "Burmese rice set",
        description: "Rice with a spread of small side dishes, a little of everything.",
        alt: "A woven tray with rice and many small bowls of curry, soup and vegetable dishes",
      },
      {
        image: "fritters",
        name: "Burmese fritters platter",
        description: "Crisp vegetable and bean fritters with a tangy dipping sauce.",
        alt: "A woven tray of bean and vegetable fritters with lettuce, cabbage and a green sauce",
      },
    ],
  },
  // TODO: placeholder text. Replace with the shop's real story
  about: {
    label: "About us",
    heading: "From our mother's hometown",
    body: [
      "We serve the dishes a mother has always cooked for her family, just as they are.",
      "There is no need to hurry. Enjoy a warm meal and a quiet moment.",
    ],
    photoAlt: "A large red and gold gate over a straight road lined with trees",
    photoCaption: "The gate at the entrance to our mother's hometown",
  },
  reserve: {
    label: "Reservations",
    heading: "We will have a table ready for you",
    body: "Choose a date and the number of guests, then send a request. We will contact you to confirm.",
  },
  actions: {
    menu: "See the menu",
    reserve: "Reserve a table",
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
