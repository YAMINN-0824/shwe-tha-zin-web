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
  // TODO: placeholder details. Replace with the shop's real details
  shop: {
    address: ["0-0-0 Placeholder, Osaka", "530-0000 (placeholder)"],
    // One short line for the info bar
    addressShort: "0-0-0 Placeholder, Osaka (placeholder)",
    hours: "11:00–21:00 (placeholder)",
    closed: "Closed: one day a week (placeholder)",
    phone: "00-0000-0000 (placeholder)",
  },
  info: {
    heading: "Shop information",
    location: "Locate us",
    hours: "Open hours",
    reservation: "Reservation",
  },
  // TODO: placeholder dish names and descriptions. Replace with the shop's own words
  menu: {
    label: "Our menu",
    heading: "Everyday dishes, made for sharing",
    action: "See the full menu",
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
  // TODO: placeholder text. Replace with the shop's own words
  offer: {
    label: "What we offer",
    heading: "More than a meal",
    items: [
      {
        icon: "events",
        title: "Events",
        body: "Special dinners on the days of Myanmar's festivals.",
      },
      {
        icon: "special",
        title: "Special menus",
        body: "Ask us about dishes for celebrations and the seasons.",
      },
      // TODO: confirm if delivery is really offered before going live
      // (UI only for now. There is no ordering yet)
      {
        icon: "delivery",
        title: "Delivery",
        body: "Our home cooking, at your home too.",
      },
    ],
  },
  event: {
    label: "Event",
    heading: "Thadingyut Festival",
    subheading: "Festival of Lights",
    offer: "During the festival, our tea leaf salad (laphet) is free.",
    body: "On the full moon night, homes and streets in Myanmar are lit with lamps, and people thank their parents and elders.",
    // TODO: the start date and conditions are placeholders. Confirm with the shop
    periodLabel: "Dates",
    period: "From (placeholder) until November 1",
    conditionsLabel: "Conditions",
    conditions: "For dine-in guests, one plate per person (placeholder)",
    alt: "Tea leaf salad (laphet) on a red lacquer tray",
  },
  reserve: {
    label: "Reservations",
    heading: "We will have a table ready for you",
    body: "Choose a date and the number of guests, then send a request. We will contact you to confirm.",
    form: {
      name: "Name",
      phone: "Phone",
      email: "Email",
      optional: "optional",
      partySize: "Number of people",
      partySizeSuffix: "",
      partySizeSummary: "Party of {count}",
      date: "Date",
      time: "Time",
      choose: "Choose",
      note: "Requests",
      notePlaceholder: "Allergies, a celebration, and so on",
      honeypot: "Leave this field empty",
      submit: "Request a reservation",
      submitting: "Sending…",
      errors: {
        name: "Enter your name (up to 100 characters)",
        phone: "Enter your phone number using digits",
        email: "This email address doesn't look right",
        partySize: "Choose the number of people",
        date: "Choose a date",
        time: "Choose a time",
        past: "Choose a date and time in the future",
        note: "Keep your requests to 500 characters or less",
        failed:
          "We couldn't send your request. Please try again in a little while, or call us if it's urgent.",
      },
      success: {
        heading: "We received your request",
        body: "We will contact you to confirm. Your reservation is not final until we do.",
        again: "Request another reservation",
      },
    },
  },
  footer: {
    addressLabel: "Address",
    hoursLabel: "Hours",
    phoneLabel: "Phone",
  },
  notFound: {
    heading: "Page not found",
    body: "The URL may be wrong, or this page is not ready yet.",
    back: "Back to the home page",
  },
};

export default en;
