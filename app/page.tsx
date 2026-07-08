import { Header } from "@/components/blocks/header";
import { Hero } from "@/components/blocks/hero";
import { GoogleReviewsBadge } from "@/components/blocks/google-reviews-badge";
import { ServicesGrid } from "@/components/blocks/services-grid";
import { TestimonialsSection } from "@/components/blocks/testimonials-section";
import { CTABanner } from "@/components/blocks/cta-banner";
import { FAQAccordion } from "@/components/blocks/faq-accordion";
import { ContactSection } from "@/components/blocks/contact-section";
import { Footer } from "@/components/blocks/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="flex justify-center py-10">
          <GoogleReviewsBadge />
        </div>
        <ServicesGrid />
        <TestimonialsSection />
        <CTABanner />
        <FAQAccordion />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
