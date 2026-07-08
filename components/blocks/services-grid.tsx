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
  title = "Handwerk, auf das Sie sich verlassen können",
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
            <Card key={service.title} className="h-full">
              <CardContent className="flex h-full flex-col gap-4">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {service.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
