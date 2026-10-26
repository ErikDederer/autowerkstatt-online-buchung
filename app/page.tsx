import { Header } from "@/components/blocks/header";
import { Hero } from "@/components/blocks/hero";
import { HeroVisual } from "@/components/blocks/hero-visual";
import { BrandStrip } from "@/components/blocks/brand-strip";
import { GoogleReviewsBadge } from "@/components/blocks/google-reviews-badge";
import { ServicesGrid } from "@/components/blocks/services-grid";
import { TestimonialsSection } from "@/components/blocks/testimonials-section";
import { CTABanner } from "@/components/blocks/cta-banner";
import { FAQAccordion } from "@/components/blocks/faq-accordion";
import { ContactSection } from "@/components/blocks/contact-section";
import { Footer } from "@/components/blocks/footer";
import { getSiteCatalog } from "@/lib/werkplan/catalog";

// Catalog, prices and hours come from WerkPlan; refreshed every 5 minutes.
export const revalidate = 300;

/** The six most-booked services on the homepage; the full list is in /termin. */
const FEATURED = ["oelwechsel", "inspektion", "reifenwechsel", "bremsen-check", "hu-au-vorbereitung", "klimaservice"];

export default async function Home() {
  const catalog = await getSiteCatalog();
  const featured = FEATURED.map((slug) => catalog.services.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => !!s
  );
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero visual={<HeroVisual />} />
        <BrandStrip />
        <div className="flex justify-center py-10">
          <GoogleReviewsBadge />
        </div>
        <ServicesGrid services={featured.length ? featured : catalog.services.slice(0, 6)} />
        <TestimonialsSection />
        <CTABanner />
        <FAQAccordion />
        <ContactSection openingHours={catalog.openingHours} />
      </main>
      <Footer />
    </>
  );
}
