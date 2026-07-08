import { siteConfig } from "@/lib/site-config";

export type BrandStripProps = {
  label?: string;
  brands?: readonly string[];
};

export function BrandStrip({
  label = "Wir warten und reparieren alle gängigen Marken, u. a.:",
  brands = siteConfig.brands,
}: BrandStripProps) {
  return (
    <section className="border-y bg-secondary/40 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {brands.map((brand) => (
            <li
              key={brand}
              className="font-heading text-lg font-semibold uppercase tracking-wide text-muted-foreground/70"
            >
              {brand}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
