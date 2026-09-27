# Autowerkstatt Online-Buchung

Deutschsprachiges Portfolio-Projekt für eine Werkstatt-Website mit mehrstufiger Terminanfrage und Supabase-Anbindung. Die Beispielmarke **Autowerkstatt Nord** dient der Demonstration; das Projekt ist kein Nachweis eines realen Kundenauftrags.

## Funktionsumfang

- Landingpage mit Leistungen, Preisen, Öffnungszeiten, FAQ und Beispielbewertungen.
- Buchungsassistent unter `/termin`: Leistung → Wunschtermin → Kontakt- und Fahrzeugdaten.
- Client- und serverseitige Formularvalidierung mit React Hook Form und Zod.
- Speicherung von Terminanfragen in Supabase (`booking_requests`).
- Bestätigungsansicht und Download eines Kalendereintrags im ICS-Format.
- Kleine lokale HSN/TSN-Beispieltabelle zur Fahrzeugauswahl.
- Gemeinsames Datenmodell für die Weiterverarbeitung in WerkPlan.

**Eine Terminanfrage ist keine verbindliche Buchung.** Die angezeigten Zeitfenster werden lokal simuliert und berücksichtigen keine bestehenden Werkstatttermine. E-Mail-Versand und SMS-Erinnerungen sind nicht implementiert. Die separate Kontaktform protokolliert Eingaben nur im Server-Log und versendet keine Nachricht.

## Technik

Next.js 16.2 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/Base UI · React Hook Form · Zod · Supabase

Server Actions übernehmen die Validierung und Speicherung. Der Supabase-Service-Role-Client liegt in `lib/supabase/admin.ts` und ist durch `server-only` vom Client-Bundle getrennt. Inhalte und Leistungsdefinitionen werden zentral in `lib/site-config.ts` gepflegt.

## Lokal starten

Voraussetzungen: Node.js 22 oder neuer und npm.

```bash
git clone https://github.com/ErikDederer/autowerkstatt-online-buchung.git
cd autowerkstatt-online-buchung
npm ci
cp .env.example .env.local
npm run dev
```

Öffne [localhost:3000](http://localhost:3000) für die Website und [localhost:3000/termin](http://localhost:3000/termin) für den Assistenten. Solange das Repository privat ist, benötigt das Klonen entsprechenden GitHub-Zugriff.

Ohne Supabase-Konfiguration lassen sich die Seiten ansehen; das Absenden einer Terminanfrage endet mit einer kontrollierten Fehlermeldung.

## Verbindung zu WerkPlan

Die Website schreibt Anfragen in `booking_requests`; WerkPlan ist die zugehörige Verwaltungsanwendung. Beide Projekte müssen dieselben Spalten, Statuswerte und Service-IDs verwenden. Diese Website setzt `status = neu` und `source = website`.

### Demo-Datenbank konfigurieren

**Nur eine isolierte Demo-Datenbank mit erfundenen Daten verwenden.** Die vorhandene Migration erlaubt der Rolle `anon` das Lesen aller Buchungsanfragen für WerkPlans Demo-Realtime-Anbindung. Damit schützt diese Richtlinie die Kundendaten nicht vor anonymem Zugriff. Vor Verwendung realer Daten muss der Lesezugriff in beiden Anwendungen auf berechtigte Werkstattmitarbeiter beschränkt werden.

1. Eine isolierte Supabase-Demo-Datenbank bereitstellen.
2. `supabase/migrations/0001_booking_requests.sql` prüfen und dort ausführen. `CREATE TABLE IF NOT EXISTS` gleicht eine bereits vorhandene Tabelle nicht automatisch an: bei Nutzung mit WerkPlan das tatsächliche Schema separat vergleichen.
3. In `.env.local` die beiden Server-Variablen setzen:

| Variable | Bedeutung |
| --- | --- |
| `SUPABASE_URL` | Projekt-API-URL im Format `https://<project-ref>.supabase.co`, keine PostgreSQL-Verbindungszeichenfolge |
| `SUPABASE_SERVICE_ROLE_KEY` | Geheimer Server-Schlüssel; umgeht Row Level Security |

Den Service-Role-Schlüssel niemals mit `NEXT_PUBLIC_` veröffentlichen, in Client-Komponenten verwenden oder einchecken. `.env.example` enthält ausschließlich Platzhalter.

Gemeinsame Service-IDs: `oelwechsel`, `inspektion`, `reifenwechsel`, `bremsen-check`, `hu-au-vorbereitung`, `klimaservice`.

## Projektstruktur

```text
app/                   Seiten, Layout und Metadaten
components/blocks/     Bausteine der Landingpage
components/booking/    Buchungsassistent und Formschritte
components/ui/         UI-Komponenten
lib/actions/           Server Actions für Anfrage und Kontakt
lib/booking/           Demo-Zeitfenster, HSN/TSN und ICS
lib/validations/       Zod-Schemas
lib/supabase/          Ausschließlich serverseitiger Datenbankzugriff
lib/site-config.ts     Beispielbetrieb, Leistungen und Texte
supabase/migrations/   Datenbankschema und Zugriffsrichtlinien
```

## Prüfungen

```bash
npm run lint
npx tsc --noEmit
npm run build
```

`npm run build` ersetzt die separate Lint-Prüfung nicht. Der Build lädt die verwendeten Google Fonts über `next/font` und benötigt dafür Netzwerkzugriff. Ein automatisiertes Testskript ist derzeit nicht eingerichtet.

## Grenzen und nächste Schritte

- Anonymer Datenbank-Lesezugriff muss vor realer Nutzung entfernt und durch berechtigungsgebundenen Zugriff ersetzt werden.
- Die Kontaktform schreibt personenbezogene Eingaben ins Server-Log; für eine öffentliche Demo sind ein klarer Demohinweis und ein Umgang ohne solche Logs erforderlich.
- Rate-Limiting erfolgt nur im Arbeitsspeicher einer Instanz (3 Anfragen je IP und Stunde); es ist nicht zwischen Instanzen geteilt.
- Datum und Uhrzeit brauchen zusätzliche serverseitige Prüfung gegen erlaubte Termine; es gibt keine echte Kapazitätsreservierung.
- Geschäftsdaten, Bewertungen und Rechtstexte sind Beispielinhalte und keine veröffentlichungsfertigen Angaben.
- Die konfigurierte Social-Preview-Datei `/og-image.jpg` fehlt; die Basis-URL ist ein Platzhalter.
- Die Demo ist absichtlich auf `noindex` gesetzt. Das ersetzt keine Zugriffskontrolle.

Der Stand der ersten Quellcodeprüfung ist in [docs/portfolio-readiness.md](docs/portfolio-readiness.md) dokumentiert.
