"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NavLink } from "@/lib/site-config";

export function HeaderMobileNav({
  nav,
  callToAction,
}: {
  nav: NavLink[];
  callToAction?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full z-40 border-b bg-background px-4 pb-6 pt-2 shadow-lg"
        >
          <nav aria-label="Mobile Navigation">
            <ul className="flex flex-col gap-1">
              {nav.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-secondary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {callToAction && <div className="mt-4">{callToAction}</div>}
        </div>
      )}
    </div>
  );
}
