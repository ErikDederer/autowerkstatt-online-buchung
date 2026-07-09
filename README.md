This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Verbindung zu WerkPlan

Der Buchungsassistent unter `/termin` schreibt Terminanfragen per
Supabase-Server-Client in die Tabelle `booking_requests`. WerkPlan
(`../werkplan`, die Werkstattverwaltung, die diese Anfragen live anzeigt
und annimmt/ablehnt) existiert inzwischen und teilt sich mit dieser
Seite ein Supabase-Projekt. Beide Migrationen —
`supabase/migrations/0001_booking_requests.sql` hier und
`werkplan/drizzle/0000_*.sql` dort — legen dieselbe Tabelle mit
`CREATE TABLE IF NOT EXISTS` an, sodass es egal ist, welche zuerst
gegen das gemeinsame Projekt läuft. Ändert sich das Schema auf einer
Seite, muss die andere nachgezogen werden.

**Setup:**

1. Supabase-Projekt anlegen (oder das gemeinsame Projekt verwenden,
   das WerkPlan bereits nutzt).
2. Migration `supabase/migrations/0001_booking_requests.sql` gegen
   das Projekt laufen lassen (z. B. über die Supabase SQL-Konsole oder
   die Supabase CLI) — falls WerkPlans Migration dort bereits lief,
   ist dieser Schritt ein No-op.
3. `.env.example` nach `.env.local` kopieren und `SUPABASE_URL` sowie
   `SUPABASE_SERVICE_ROLE_KEY` mit den echten Projektwerten füllen.
   `SUPABASE_URL` ist die REST-API-URL des Projekts
   (`https://xxxxx.supabase.co`, zu finden unter Project Settings ->
   API -> Project URL) — **keine** Postgres-Connection-String, die
   braucht WerkPlan separat für seine Drizzle-Verbindung. Der
   Service-Role-Key umgeht Row Level Security — er wird ausschließlich
   serverseitig in `lib/supabase/admin.ts` gelesen (importiert nur von
   `"use server"`-Dateien) und darf **nie** mit `NEXT_PUBLIC_`
   präfixiert oder in eine Client-Komponente importiert werden.

**Service-Slugs:** `service_type` verwendet dieselben IDs wie
`lib/site-config.ts` (`oelwechsel`, `inspektion`, `reifenwechsel`,
`bremsen-check`, `hu-au-vorbereitung`, `klimaservice`). WerkPlan muss
diese Slugs übernehmen.

**Rate-Limiting:** `lib/booking/rate-limit.ts` begrenzt Anfragen pro
IP auf 3 pro Stunde. Das ist ein einfacher In-Memory-Zähler ohne
gemeinsamen Zustand über mehrere Serverinstanzen hinweg — ausreichend
gegen ein naives Zuspammen des Demo-Postfachs, aber kein Ersatz für
einen echten Limiter (z. B. Upstash), falls das Formular einmal
öffentlich stärker frequentiert wird.

**Ohne gesetzte Umgebungsvariablen** schlägt die Buchung serverseitig
kontrolliert fehl (verständliche Fehlermeldung für den Nutzer, Detail
landet nur im Server-Log) — die Seite stürzt nicht ab.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
