import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export type CTABannerProps = {
  headline?: string;
  text?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function CTABanner({
  headline = siteConfig.ctaBanner.headline,
  text = siteConfig.ctaBanner.text,
  ctaLabel = siteConfig.ctaBanner.ctaLabel,
  ctaHref = siteConfig.ctaBanner.ctaHref,
}: CTABannerProps) {
  return (
    <section className="bg-primary py-16 text-primary-foreground sm:py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <h2 className="text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {headline}
        </h2>
        <p className="text-pretty text-primary-foreground/80">{text}</p>
        <Button
          size="lg"
          variant="secondary"
          nativeButton={false}
          render={<a href={ctaHref}>{ctaLabel}</a>}
        />
      </div>
    </section>
  );
}
