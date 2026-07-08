import Link from "next/link";
import { ArrowRight, CalendarClock, Star, Wrench } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const stats = [
  { label: "Jahre Erfahrung", value: "20+" },
  { label: "Google-Bewertung", value: "4,8★" },
  { label: "Termin gebucht in", value: "2 Min." },
];

export function HeroVisual() {
  return (
    <div className="relative w-full rounded-2xl border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wrench className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-wide">
            {siteConfig.business.name}
          </p>
          <p className="text-xs text-muted-foreground">Meisterbetrieb in Braunschweig</p>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-3 border-y py-6">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="sr-only">{stat.label}</dt>
            <dd className="font-mono text-xl font-semibold text-primary sm:text-2xl">
              {stat.value}
            </dd>
            <dd className="mt-1 text-xs leading-snug text-muted-foreground">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex items-center gap-1 text-sm" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-4 fill-accent text-accent" />
        ))}
        <span className="ml-1 text-muted-foreground">
          {siteConfig.googleReviews.reviewCount} Bewertungen
        </span>
      </div>

      <Link
        href={siteConfig.booking.href}
        className="mt-6 flex items-center gap-3 rounded-xl bg-secondary p-4 text-left transition-colors hover:bg-secondary/70"
      >
        <CalendarClock className="size-5 shrink-0 text-primary" aria-hidden="true" />
        <span className="flex-1">
          <span className="block text-sm font-semibold">Nächster freier Termin: morgen, 09:00 Uhr</span>
          <span className="text-xs text-muted-foreground">Jetzt in 3 Schritten online buchen</span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </Link>
    </div>
  );
}
