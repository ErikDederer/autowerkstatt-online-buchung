import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { siteConfig, type NavLink } from "@/lib/site-config";

export type FooterProps = {
  nav?: NavLink[];
};

export function Footer({ nav = siteConfig.nav }: FooterProps) {
  const { name, phone, phoneDisplay, email, address } = siteConfig.business;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-heading text-lg font-semibold">{name}</p>
            <address className="mt-3 space-y-1 text-sm not-italic text-muted-foreground">
              <p>{address.street}</p>
              <p>
                {address.zip} {address.city}
              </p>
            </address>
          </div>

          <div>
            <p className="text-sm font-semibold">Navigation</p>
            <ul className="mt-3 space-y-2 text-sm">
              {nav.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Kontakt</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {phone && (
                <li>
                  <a href={`tel:${phone}`} className="hover:text-foreground">
                    {phoneDisplay}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${email}`} className="hover:text-foreground">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center gap-4 border-t pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} {name}. Alle Rechte vorbehalten.
          </p>

          <div className="flex items-center gap-4">
            <nav aria-label="Rechtliches" className="flex gap-4 text-xs">
              <Link href="/impressum" className="text-muted-foreground hover:text-foreground">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-muted-foreground hover:text-foreground">
                Datenschutz
              </Link>
            </nav>
            <Badge variant="secondary" className="whitespace-nowrap">
              Konzeptprojekt
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}
