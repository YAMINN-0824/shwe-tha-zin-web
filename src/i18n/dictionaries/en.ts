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
      after: " kitchen.",
      // Between "after" and "close" (a space in English, nothing in Japanese)
      gap: " ",
      close: "Take your time.",
    },
    // The mascot of our mother (Mya), the chef
    mascot: {
      // TODO: placeholder greeting. Replace with the shop's own words (one item = one line)
      greeting: ["I'm Mya.", "Welcome to my kitchen."],
      alt: "An illustration of Mya in a chef's hat, smiling and holding a bowl of tea leaf salad",
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
    // Address for the footer. The info bar shows the Google Maps link instead
    // One item = one line
    address: ["No. 2, Pinlon Lanmadaw Road,", "Ward 2, Kalay,", "Sagaing Region, Myanmar"],
    mapUrl: "https://maps.app.goo.gl/nvb5322Lr6qkBrjL6",
    mapLink: "View on Google Maps",
    // No closed day
    hours: "Every day, 5:00 AM – 7:00 PM",
    // TODO: placeholder number. Replace with the real number
    phone: "09-0000-xxxx",
    // TODO: when the number is real, set "tel:+81..." (the number becomes a link)
    phoneHref: "",
  },
  info: {
    heading: "Shop information",
    location: "Locate us",
    newTab: "(opens in a new tab)",
    hours: "Open hours",
    reservation: "Reservation",
  },
  // Top page menu. The dishes are the popular ones in Supabase (src/lib/menu.ts)
  menu: {
    label: "Our menu",
    heading: "Everyday dishes, made for sharing",
    action: "See the full menu",
  },
  // The menu page (/en/menu). The dishes come from Supabase
  menuPage: {
    title: "Menu",
    label: "Our menu",
    heading: "From our mother's kitchen",
    // TODO: placeholder text. Replace with the shop's own words
    body: "All prices include tax.",
    taxIncluded: " (tax incl.)",
    empty: "We're getting the menu ready. Please check back soon.",
    back: "Back to the top page",
  },
  // TODO: placeholder text. Replace with the shop's own words
  offer: {
    label: "What we offer",
    heading: "More than a meal",
    // TODO: placeholder text. Replace with the shop's own words
    body: "Festival dinners, dishes for your special days, and delivery too. (placeholder)",
    items: [
      {
        icon: "events",
        title: "Events",
      },
      {
        icon: "special",
        title: "Special menus",
      },
      // TODO: confirm if delivery is really offered before going live
      // (UI only for now. There is no ordering yet)
      {
        icon: "delivery",
        title: "Delivery",
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
