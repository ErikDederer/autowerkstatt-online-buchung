import Image from "next/image";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export type HeroProps = {
  headline?: string;
  subline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  image?: { src: string; alt: string } | null;
};

export function Hero({
  headline = siteConfig.hero.headline,
  subline = siteConfig.hero.subline,
  ctaLabel = siteConfig.hero.ctaLabel,
  ctaHref = siteConfig.hero.ctaHref,
  secondaryCtaLabel = siteConfig.hero.secondaryCtaLabel,
  secondaryCtaHref = siteConfig.hero.secondaryCtaHref,
  image = siteConfig.hero.image,
}: HeroProps) {
  return (
    <section className="border-b bg-secondary/40">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="max-w-xl">
          <h1 className="text-balance font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {headline}
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground">
            {subline}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={<a href={ctaHref}>{ctaLabel}</a>}
            />
            {secondaryCtaLabel && secondaryCtaHref && (
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<a href={secondaryCtaHref}>{secondaryCtaLabel}</a>}
              />
            )}
          </div>
        </div>

        {image && (
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl lg:aspect-square">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
