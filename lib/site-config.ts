/**
 * Single source of truth for a forked demo site.
 * Edit this file to adapt the template to a new business — most blocks
 * read exclusively from here, so a fork rarely needs to touch component code.
 * See THEME.md for how to change the color palette and font pairing.
 */

export type NavLink = {
  label: string;
  href: string;
};

export type OpeningHoursRow = {
  days: string;
  hours: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
};

export type Service = {
  id: string;
  icon: string;
  title: string;
  text: string;
  /** Numeric starting price in EUR, or null for a flat "kostenlos" service. */
  priceFrom: number | null;
  /** Human-readable price shown on cards, e.g. "ab 89 €" or "kostenlos". */
  priceLabel: string;
  /** Used to size slots in the online booking flow. */
  durationMinutes: number;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const siteConfig = {
  business: {
    name: "Autowerkstatt Nord",
    tagline: "Ihre KFZ-Werkstatt in Braunschweig – ehrlich, schnell, zuverlässig",
    legalName: "Autowerkstatt Nord GmbH",
    // Set to null to hide the click-to-call button in the header.
    phone: "+495312345670",
    phoneDisplay: "0531 234567-0",
    email: "info@autowerkstatt-nord-bs.de",
    address: {
      street: "Broitzemer Straße 200",
      zip: "38102",
      city: "Braunschweig",
    },
    social: {
      instagram: null as string | null,
      facebook: null as string | null,
    },
  },

  seo: {
    baseUrl: "https://autowerkstatt-nord-demo.example",
    defaultTitle: "Autowerkstatt Nord – KFZ-Werkstatt in Braunschweig",
    defaultDescription:
      "Ölwechsel, Inspektion, Reifenwechsel und mehr: Ihre Autowerkstatt in Braunschweig. Termin in wenigen Klicks online buchen – transparente Preise, geprüfte Qualität.",
    ogImage: "/og-image.jpg",
  },

  nav: [
    { label: "Leistungen", href: "/#leistungen" },
    { label: "Bewertungen", href: "/#bewertungen" },
    { label: "Kontakt", href: "/#kontakt" },
  ] satisfies NavLink[],

  booking: {
    label: "Termin buchen",
    href: "/termin",
  },

  hero: {
    headline: "Ihr Auto in guten Händen – mitten in Braunschweig",
    subline:
      "Ölwechsel, Inspektion, Reifenwechsel und mehr: Wir kümmern uns um Ihr Fahrzeug — transparente Preise, ehrliche Beratung und ein eingespieltes Werkstatt-Team mit über 20 Jahren Erfahrung.",
    ctaLabel: "Termin online buchen",
    ctaHref: "/termin",
    secondaryCtaLabel: "Leistungen ansehen",
    secondaryCtaHref: "/#leistungen",
    // No stock photo fits an authentic Kfz-Werkstatt — the homepage renders
    // a HeroVisual stats panel instead (see app/page.tsx).
    image: null as { src: string; alt: string } | null,
  },

  brands: [
    "VW",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Opel",
    "Ford",
    "Škoda",
    "Renault",
  ],

  services: [
    {
      id: "oelwechsel",
      icon: "Droplets",
      title: "Ölwechsel",
      text: "Motoröl und Filter nach Herstellervorgabe – inklusive Sichtprüfung der wichtigsten Verschleißteile.",
      priceFrom: 89,
      priceLabel: "ab 89 €",
      durationMinutes: 30,
    },
    {
      id: "inspektion",
      icon: "ClipboardCheck",
      title: "Inspektion",
      text: "Vollständiger Check nach Herstellerplan – alle Prüfpunkte dokumentiert, damit Ihre Garantie erhalten bleibt.",
      priceFrom: 149,
      priceLabel: "ab 149 €",
      durationMinutes: 90,
    },
    {
      id: "reifenwechsel",
      icon: "CircleDot",
      title: "Reifenwechsel",
      text: "Sommer- auf Winterreifen und zurück, inklusive Wuchten und Einlagerung auf Wunsch.",
      priceFrom: 39,
      priceLabel: "ab 39 €",
      durationMinutes: 30,
    },
    {
      id: "bremsen-check",
      icon: "Disc",
      title: "Bremsen-Check",
      text: "Kostenlose Sichtprüfung von Bremsbelägen, -scheiben und Bremsflüssigkeit – für Ihre Sicherheit.",
      priceFrom: 0,
      priceLabel: "kostenlos",
      durationMinutes: 20,
    },
    {
      id: "hu-au-vorbereitung",
      icon: "ShieldCheck",
      title: "HU/AU-Vorbereitung",
      text: "Wir prüfen Ihr Fahrzeug vorab, beheben Mängel und machen es fit für den TÜV-Termin.",
      priceFrom: 49,
      priceLabel: "ab 49 €",
      durationMinutes: 60,
    },
    {
      id: "klimaservice",
      icon: "Snowflake",
      title: "Klimaservice",
      text: "Klimaanlage prüfen, befüllen und Innenraumfilter wechseln – für ein gesundes Raumklima.",
      priceFrom: 69,
      priceLabel: "ab 69 €",
      durationMinutes: 45,
    },
  ] satisfies Service[],

  testimonials: [
    {
      name: "Thomas Bergmann",
      role: "Privatkunde, Braunschweig-Weststadt",
      quote:
        "Endlich eine Werkstatt, die ehrlich sagt, was wirklich nötig ist. Der Ölwechsel war günstiger als beim Vertragshändler und trotzdem top ausgeführt.",
      rating: 5,
    },
    {
      name: "Nicole Sander",
      role: "Kundin, Braunschweig",
      quote:
        "Termin online gebucht, zwei Tage später Reifen gewechselt – ohne Wartezeit an der Rezeption. Genau so stelle ich mir das vor.",
      rating: 5,
    },
    {
      name: "Frank Kowalski",
      role: "Inhaber, Kowalski Spedition",
      quote:
        "Wir lassen unseren gesamten Fuhrpark hier warten. Zuverlässige Termine, faire Preise und immer ein Ansprechpartner am Telefon.",
      rating: 4,
    },
  ] satisfies Testimonial[],

  googleReviews: {
    rating: 4.8,
    reviewCount: 216,
    profileUrl: "#",
  },

  faq: [
    {
      question: "Wie funktioniert die Online-Terminbuchung?",
      answer:
        "Wählen Sie Ihren Service, dann ein freies Datum und eine Uhrzeit aus den nächsten zwei Wochen, und hinterlassen Sie Ihre Kontaktdaten. Sie erhalten sofort eine Bestätigung mit Kalendereintrag zum Download.",
    },
    {
      question: "Muss ich zum Termin etwas mitbringen?",
      answer:
        "Bitte bringen Sie den Fahrzeugschein (Zulassungsbescheinigung Teil I) und, falls vorhanden, das Serviceheft mit.",
    },
    {
      question: "Was passiert, wenn während der Arbeiten weitere Mängel auffallen?",
      answer:
        "Wir rufen Sie an, bevor wir zusätzliche Arbeiten durchführen, und nennen Ihnen die Kosten. Es wird nichts ohne Ihre Zustimmung erledigt.",
    },
    {
      question: "Kann ich einen gebuchten Termin ändern oder stornieren?",
      answer:
        "Ja, rufen Sie uns einfach an oder schreiben Sie uns eine E-Mail – Änderungen sind bis 24 Stunden vor dem Termin problemlos möglich.",
    },
  ] satisfies FaqItem[],

  openingHours: [
    { days: "Montag – Freitag", hours: "08:00 – 17:00 Uhr" },
    { days: "Mittagspause", hours: "12:00 – 13:00 Uhr" },
    { days: "Samstag / Sonntag", hours: "geschlossen" },
  ] satisfies OpeningHoursRow[],

  ctaBanner: {
    headline: "Kein Anruf, keine Warteschleife",
    text: "Wählen Sie Service, Datum und Uhrzeit in wenigen Klicks. Sie erhalten sofort eine Bestätigung mit Kalendereintrag.",
    ctaLabel: "Termin buchen",
    ctaHref: "/termin",
  },

  legal: {
    representative: "[Vorname Nachname]",
    street: "[Straße Nr.]",
    zipCity: "[PLZ Ort]",
    registerCourt: "Amtsgericht Braunschweig",
    registerNumber: "[Registernummer]",
    vatId: "[USt-IdNr.]",
    responsibleForContent: "[Vorname Nachname]",
  },
} as const;

export type SiteConfig = typeof siteConfig;
