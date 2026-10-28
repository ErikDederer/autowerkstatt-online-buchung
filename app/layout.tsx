import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Oswald } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import { getSiteCatalog } from "@/lib/werkplan/catalog";
import { AssistantLauncher } from "@/components/chat/assistant-launcher";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.seo.baseUrl),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: `%s – ${siteConfig.business.name}`,
  },
  description: siteConfig.seo.defaultDescription,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: siteConfig.business.name,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [{ url: siteConfig.seo.ogImage }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Cached for 5 minutes with the catalog; the launcher only appears when
  // the workshop's plan includes the AI assistant.
  const { assistantEnabled } = await getSiteCatalog();

  return (
    <html
      lang="de"
      className={`${plexSans.variable} ${plexMono.variable} ${oswald.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {assistantEnabled && <AssistantLauncher workshopName={siteConfig.business.name} />}
      </body>
    </html>
  );
}
