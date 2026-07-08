import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig, type Testimonial } from "@/lib/site-config";

export type TestimonialsSectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  testimonials?: Testimonial[];
};

function StarRating({ rating }: { rating: Testimonial["rating"] }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={
            i < rating
              ? "size-4 fill-accent text-accent"
              : "size-4 text-muted-foreground/30"
          }
        />
      ))}
    </div>
  );
}

export function TestimonialsSection({
  id = "bewertungen",
  eyebrow = "Kundenstimmen",
  title = "Was unsere Kunden sagen",
  testimonials = siteConfig.testimonials,
}: TestimonialsSectionProps) {
  return (
    <section id={id} className="bg-secondary/40 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name}>
              <CardContent className="flex h-full flex-col gap-4">
                <StarRating rating={t.rating} />
                <p className="text-pretty text-sm text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-auto pt-2">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
