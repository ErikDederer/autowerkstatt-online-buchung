import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { siteConfig, type Service } from "@/lib/site-config";

export type ServicesGridProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  services?: Service[];
};

export function ServicesGrid({
  id = "leistungen",
  eyebrow = "Unsere Leistungen",
  title = "Service, auf den Sie sich verlassen können",
  services = siteConfig.services,
}: ServicesGridProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = getIcon(service.icon);
          return (
            <Card key={service.id} className="h-full">
              <CardContent className="flex h-full flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-primary px-2.5 py-1 font-mono text-xs font-semibold text-primary-foreground">
                    {service.priceLabel}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold uppercase tracking-wide">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {service.text}
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  ca. {service.durationMinutes} Min.
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
