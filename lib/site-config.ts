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
  icon: string;
  title: string;
  text: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const siteConfig = {
  business: {
    name: "Schreinerei Holzwerk",
    tagline: "Handwerk aus Meisterhand seit 1998",
    legalName: "Holzwerk Schreinerei GmbH",
    // Set to null to hide the click-to-call button in the header.
    phone: "+49 30 1234567",
    phoneDisplay: "030 123 4567",
    email: "info@schreinerei-holzwerk.de",
    address: {
      street: "Musterstraße 12",
      zip: "10115",
      city: "Berlin",
    },
    social: {
      instagram: null as string | null,
      facebook: null as string | null,
    },
  },

  seo: {
    baseUrl: "https://schreinerei-holzwerk-demo.example",
    defaultTitle: "Schreinerei Holzwerk – Tischlerei in Berlin",
    defaultDescription:
      "Individuelle Möbel, Einbauküchen und Innenausbau vom Meisterbetrieb in Berlin. Persönliche Beratung, faire Preise, über 25 Jahre Erfahrung.",
    ogImage: "/og-image.jpg",
  },

  nav: [
    { label: "Leistungen", href: "/#leistungen" },
    { label: "Über uns", href: "/#ueber-uns" },
    { label: "Bewertungen", href: "/#bewertungen" },
    { label: "Kontakt", href: "/#kontakt" },
  ] satisfies NavLink[],

  hero: {
    headline: "Möbel, die Generationen überdauern",
    subline:
      "Von der Einbauküche bis zum Massivholztisch: Wir fertigen individuelle Schreinerarbeiten mit Liebe zum Detail — persönlich beraten, präzise gefertigt, termintreu geliefert.",
    ctaLabel: "Kostenlose Beratung anfragen",
    ctaHref: "/#kontakt",
    secondaryCtaLabel: "Leistungen ansehen",
    secondaryCtaHref: "/#leistungen",
    image: {
      src: "https://picsum.photos/seed/schreinerei-hero/1200/900",
      alt: "Handwerker bei der Arbeit an einem Massivholztisch in der Werkstatt",
    },
  },

  services: [
    {
      icon: "Hammer",
      title: "Möbelbau nach Maß",
      text: "Individuelle Möbelstücke aus Massivholz, exakt auf Ihren Raum und Geschmack zugeschnitten.",
    },
    {
      icon: "ChefHat",
      title: "Einbauküchen",
      text: "Planung und Fertigung hochwertiger Küchen — von der ersten Skizze bis zur Montage.",
    },
    {
      icon: "DoorOpen",
      title: "Innenausbau",
      text: "Türen, Treppen, Wandverkleidungen: Wir gestalten Innenräume mit hochwertigem Holz.",
    },
    {
      icon: "Wrench",
      title: "Restaurierung",
      text: "Antike und geerbte Möbelstücke fachgerecht aufarbeiten und für die Zukunft bewahren.",
    },
    {
      icon: "Ruler",
      title: "Beratung & Planung",
      text: "Persönliche Vor-Ort-Beratung inklusive 3D-Planung, damit Sie Ihr Ergebnis vorab sehen.",
    },
    {
      icon: "Truck",
      title: "Lieferung & Montage",
      text: "Zuverlässige Lieferung und fachgerechte Montage im gesamten Berliner Raum.",
    },
  ] satisfies Service[],

  testimonials: [
    {
      name: "Sabine Krüger",
      role: "Privatkundin, Berlin-Charlottenburg",
      quote:
        "Unsere neue Einbauküche ist ein Traum. Von der Beratung bis zur Montage war alles termintreu und sehr professionell.",
      rating: 5,
    },
    {
      name: "Markus Feldmann",
      role: "Inhaber, Café Feldmann",
      quote:
        "Der Innenausbau unseres Cafés wurde exakt nach unseren Vorstellungen umgesetzt. Absolute Empfehlung für jeden Gewerbekunden.",
      rating: 5,
    },
    {
      name: "Julia Ahrens",
      role: "Privatkundin, Berlin-Pankow",
      quote:
        "Sehr freundliche Beratung und ein handwerklich makelloses Ergebnis. Unser Massivholztisch wird sicher Generationen überdauern.",
      rating: 4,
    },
  ] satisfies Testimonial[],

  googleReviews: {
    rating: 4.9,
    reviewCount: 127,
    profileUrl: "#",
  },

  faq: [
    {
      question: "Wie läuft eine typische Beauftragung ab?",
      answer:
        "Nach einem unverbindlichen Erstgespräch besuchen wir Sie vor Ort, nehmen Maß und erstellen einen detaillierten Kostenvoranschlag. Nach Ihrer Freigabe fertigen wir in unserer Werkstatt und liefern termingerecht.",
    },
    {
      question: "Wie lange dauert die Fertigung im Durchschnitt?",
      answer:
        "Je nach Umfang zwischen zwei und acht Wochen. Bei der Erstberatung nennen wir Ihnen einen verbindlichen Liefertermin.",
    },
    {
      question: "Bieten Sie auch Restaurierungen an?",
      answer:
        "Ja, wir arbeiten antike und geerbte Möbelstücke fachgerecht auf und passen sie bei Bedarf an moderne Ansprüche an.",
    },
    {
      question: "In welchen Regionen sind Sie tätig?",
      answer:
        "Wir sind hauptsächlich in Berlin und dem Berliner Umland tätig, größere Projekte realisieren wir auch überregional.",
    },
  ] satisfies FaqItem[],

  openingHours: [
    { days: "Montag – Freitag", hours: "08:00 – 17:00 Uhr" },
    { days: "Samstag", hours: "09:00 – 13:00 Uhr" },
    { days: "Sonntag", hours: "geschlossen" },
  ] satisfies OpeningHoursRow[],

  ctaBanner: {
    headline: "Bereit für Ihr nächstes Projekt?",
    text: "Vereinbaren Sie jetzt ein unverbindliches Beratungsgespräch mit unserem Meisterteam.",
    ctaLabel: "Jetzt Kontakt aufnehmen",
    ctaHref: "/#kontakt",
  },

  legal: {
    representative: "[Vorname Nachname]",
    street: "[Straße Nr.]",
    zipCity: "[PLZ Ort]",
    registerCourt: "[Registergericht]",
    registerNumber: "[Registernummer]",
    vatId: "[USt-IdNr.]",
    responsibleForContent: "[Vorname Nachname]",
  },
} as const;

export type SiteConfig = typeof siteConfig;
