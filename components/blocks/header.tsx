import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderMobileNav } from "@/components/blocks/header-mobile-nav";
import { siteConfig, type NavLink } from "@/lib/site-config";

export type HeaderProps = {
  /** Custom logo/wordmark. Defaults to the business name in the heading font. */
  logo?: React.ReactNode;
  businessName?: string;
  nav?: NavLink[];
  /** E.164-ish phone number used for the tel: link. Set to null to hide the call button. */
  phone?: string | null;
  phoneDisplay?: string;
};

export function Header({
  logo,
  businessName = siteConfig.business.name,
  nav = siteConfig.nav,
  phone = siteConfig.business.phone,
  phoneDisplay = siteConfig.business.phoneDisplay,
}: HeaderProps) {
  const callButton = phone ? (
    <Button
      size="lg"
      className="w-full gap-2 sm:w-auto"
      nativeButton={false}
      render={
        <a href={`tel:${phone}`}>
          <Phone className="size-4" />
          {phoneDisplay}
        </a>
      }
    />
  ) : null;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0 font-heading text-xl font-semibold tracking-tight">
          {logo ?? businessName}
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {nav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">{callButton}</div>

        <HeaderMobileNav nav={nav} callToAction={callButton} />
      </div>
    </header>
  );
}
