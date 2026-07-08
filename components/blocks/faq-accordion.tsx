import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig, type FaqItem } from "@/lib/site-config";

export type FAQAccordionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  items?: FaqItem[];
};

export function FAQAccordion({
  id = "faq",
  eyebrow = "Häufige Fragen",
  title = "Gut zu wissen",
  items = siteConfig.faq,
}: FAQAccordionProps) {
  return (
    <section id={id} className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
      </div>

      <Accordion className="mt-10" defaultValue={[]}>
        {items.map((item, i) => (
          <AccordionItem key={item.question} value={String(i)}>
            <AccordionTrigger className="text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
