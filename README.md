# Autowerkstatt Online-Buchung

Deutschsprachiges Portfolio-Projekt für eine Werkstatt-Website mit Online-Terminbuchung über die WerkPlan-Plattform. Die Beispielmarke **Autowerkstatt Nord** dient der Demonstration; das Projekt ist kein Nachweis eines realen Kundenauftrags.

## Funktionsumfang

- Landingpage mit Leistungen, Preisen, Öffnungszeiten, FAQ und Beispielbewertungen.
- Buchungsassistent unter `/termin`: Leistung → freier Termin → Kontakt- und Fahrzeugdaten.
- Leistungen, Preise und Öffnungszeiten kommen live aus WerkPlan (alle 5 Minuten aktualisiert, mit Rückfall auf `lib/site-config.ts`).
- Freie Termine berechnet WerkPlans Slot-Engine (Öffnungszeiten, Mechaniker-Schichten, Qualifikation, Abwesenheiten, Hebebühnen/Arbeitsplätze, Puffer). Doppelbuchungen schließt die Datenbank aus; ist ein Termin inzwischen vergeben, bietet der Assistent die nächsten freien an.
- Je nach Werkstatt-Einstellung wird sofort fest gebucht oder eine Anfrage gestellt.
- Freiwillige Einwilligungen (Terminerinnerung, HU-/Service-Erinnerungen) werden mit Zeitstempel und Textversion in WerkPlan gespeichert.
- Client- und serverseitige Formularvalidierung mit React Hook Form und Zod.
- Bestätigungsansicht und Download eines Kalendereintrags im ICS-Format (UTC-Zeiten).
- KI-Chat „Termin per Chat“ (wenn der Tarif der Werkstatt ihn enthält): erkennt das Anliegen, nennt Dauer und Preisrahmen aus dem Katalog, bietet freie Termine als Buttons an und bucht. Antwortet in der Sprache des Kunden (Arabisch/Persisch rechts-nach-links), weist sich als KI aus und übergibt im Zweifel an das Team. Das Chatfenster wird erst beim Öffnen geladen.
- **Fahrzeugschein fotografieren** (wenn der Tarif es enthält): Foto der Zulassungsbescheinigung Teil I → WerkPlan liest per KI Kennzeichen, Marke, Modell, HSN/TSN; der Kunde prüft die Felder vor dem Absenden. Halterdaten werden nicht übernommen, das Bild wird nach der Aufbewahrungsfrist gelöscht. Musterbild: `../werkplan/public/demo-media/documents/fahrzeugschein-muster.jpg`.
- **Anzahlung** für lange/teure Leistungen (z. B. Zahnriemen): im Leistungsschritt angezeigt, nach der Buchung Button „Anzahlung jetzt bezahlen“ (Stripe Checkout bzw. Testzahlung in der Demo); der Link kommt zusätzlich per E-Mail.
- **Chat-Link vom Telefonassistenten**: `/?chat=1&lang=<code>` öffnet den Chat sofort (SMS an Anrufer, deren Sprache am Telefon nicht verfügbar ist).
- Kleine lokale HSN/TSN-Beispieltabelle zur Fahrzeugauswahl.
- Gemeinsames Datenmodell für die Weiterverarbeitung in WerkPlan.

Bestätigungen, Erinnerungen, Freigabe- und Anzahlungslinks verschickt WerkPlan (Outbox, in der Sprache des Kunden). Die separate Kontaktform prüft Eingaben als Demo, speichert oder protokolliert sie nicht und versendet keine Nachricht.

## Technik

Next.js 16.2 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/Base UI · React Hook Form · Zod · WerkPlan-API

Die Website hat **keinen eigenen Datenbankzugang**. Server Actions validieren Eingaben und rufen WerkPlans öffentliche Buchungs-API auf (`lib/werkplan/client.ts`, durch `server-only` vom Client-Bundle getrennt). Der Website-Schlüssel identifiziert die Werkstatt; ein Supabase-Service-Role-Schlüssel wird nicht mehr benötigt. Marketing-Texte bleiben in `lib/site-config.ts`.

## Lokal starten

Voraussetzungen: Node.js 22 oder neuer und npm.

```bash
git clone https://github.com/ErikDederer/autowerkstatt-online-buchung.git
cd autowerkstatt-online-buchung
npm ci
cp .env.example .env.local
npm run dev
```

Öffne [localhost:3000](http://localhost:3000) für die Website und [localhost:3000/termin](http://localhost:3000/termin) für den Assistenten.

## Verfügbarkeit der Demo

`GET /api/health` prüft die Datenbank mit einer schreibgeschützten HEAD-Abfrage
auf `booking_requests`. Die Antwort enthält ausschließlich den Verbindungsstatus,
keine Datensätze, Anzahl der Anfragen oder Schlüssel. Bei Fehlern antwortet der
Endpoint mit HTTP 503; Antworten werden nicht gecacht. Das zentrale Workflow
`Portfolio demo health` im Repository `ErikDederer/lunar-carsharing-app` prüft
diesen Endpoint und die Carsharing-API alle 10 Minuten (Best Effort).

Ohne WerkPlan-Konfiguration lassen sich die Seiten mit statischen Inhalten ansehen; `/termin` verweist dann auf die Telefonnummer.

## Verbindung zu WerkPlan

WerkPlan ([../werkplan](../werkplan)) ist das Backend der Plattform. Die Website nutzt drei Endpunkte:

| Endpunkt | Zweck |
| --- | --- |
| `GET /api/public/v1/workshop` | Kontakt, Öffnungszeiten, buchbarer Leistungskatalog, Buchungsregeln |
| `GET /api/public/v1/slots` | freie Startzeiten für die gewählte Leistung |
| `POST /api/public/v1/bookings` | Buchung bzw. Anfrage; `409` mit Alternativen, wenn der Termin vergeben ist |
| `POST/GET /api/public/v1/chat` | KI-Assistent: Nachricht senden bzw. Verlauf wiederherstellen (über den Proxy `/api/chat`) |
| `POST /api/public/v1/document-scans` | Foto des Fahrzeugscheins → ausgelesene Felder + `scanId` (multipart, über die Server Action `scanVehicleDocument`) |

`GET /workshop` liefert zusätzlich `documentScanEnabled` und je Leistung `depositCents`; `POST /bookings` nimmt optional `documentScanId` und antwortet bei Anzahlungspflicht mit `deposit: { amountCents, payUrl }`.

**Tarif „Nur Website“:** Dieselbe Website funktioniert für eine Werkstatt ohne WerkPlan-Oberfläche – nur der Website-Schlüssel ist ein anderer. Buchungen landen per Kalender-Abo oder E-Mail mit .ics im System der Werkstatt (siehe WerkPlan → Kalender-Anbindung). Zum Ausprobieren: in WerkPlan `npx tsx scripts/rotate-site-key.ts kfz-service-ostend` und den Schlüssel in einer zweiten Instanz dieser Website als `WERKPLAN_API_KEY` setzen.

In `.env.local`:

| Variable | Bedeutung |
| --- | --- |
| `WERKPLAN_API_URL` | Basis-URL der WerkPlan-Instanz, lokal `http://localhost:3000` |
| `WERKPLAN_API_KEY` | Website-Schlüssel der Werkstatt (`wp_live_…`), erzeugt in WerkPlan mit `npx tsx scripts/rotate-site-key.ts <slug>` |

Den Schlüssel niemals mit `NEXT_PUBLIC_` veröffentlichen. Lokal laufen WerkPlan auf Port 3000 und die Website z. B. mit `npx next dev -p 3001`. Ohne erreichbare API zeigen die Seiten die statischen Inhalte aus `lib/site-config.ts`, und `/termin` verweist auf die Telefonnummer.

Das Datenbankschema gehört WerkPlan (`werkplan/supabase/migrations`). Die Dateien unter `supabase/migrations` hier sind historisch und werden nicht mehr gepflegt.

## Projektstruktur

```text
app/                   Seiten, Layout und Metadaten
components/blocks/     Bausteine der Landingpage
components/booking/    Buchungsassistent und Formschritte
components/ui/         UI-Komponenten
lib/actions/           Server Actions für Anfrage und Kontakt
lib/booking/           Datumshilfen, HSN/TSN, ICS, Rate-Limit
lib/validations/       Zod-Schemas
lib/werkplan/          Server-Client für WerkPlans Buchungs- und Chat-API, Katalog-Mapping
components/chat/       KI-Chat-Widget (Launcher + nachgeladenes Panel)
lib/site-config.ts     Beispielbetrieb, Leistungen und Texte
supabase/migrations/   historisch — Schema liegt jetzt in WerkPlan
```

## Prüfungen

```bash
npm run lint
npx tsc --noEmit
npm run build
```

`npm run build` ersetzt die separate Lint-Prüfung nicht. Der Build lädt die verwendeten Google Fonts über `next/font` und benötigt dafür Netzwerkzugriff. Ein automatisiertes Testskript ist derzeit nicht eingerichtet.

## Demo (2 Minuten, Website-Teil)

1. `/termin` → „Zahnriemenwechsel inkl. Wasserpumpe“ (Anzahlung 100 € ist angezeigt) → Termin wählen.
2. Bei den Fahrzeugdaten „Fahrzeugschein fotografieren“ → Einwilligung anhaken → Musterbild wählen → Felder werden ausgefüllt.
3. Buchen → Bestätigung mit „Anzahlung jetzt bezahlen“ → Testzahlung bestätigen → „Anzahlung eingegangen“.
4. Chat-Button → auf Türkisch fragen → Antwort auf Türkisch mit Katalogpreisen.
5. `/?chat=1&lang=ku` öffnet den Chat direkt (so kommt der SMS-Link nach einem Anruf an).

## Grenzen und nächste Schritte

- Die Datenbank sperrt direkte Browser-Zugriffe; vor realer Nutzung die geschützte WerkPlan-Version ausrollen und alte öffentliche Deployments sperren.
- Die Kontaktform bleibt eine ausdrücklich gekennzeichnete Demo ohne Speicherung, Protokollierung oder Versand.
- Rate-Limiting erfolgt nur im Arbeitsspeicher einer Instanz (3 Anfragen je IP und Stunde); es ist nicht zwischen Instanzen geteilt.
- Geschäftsdaten, Bewertungen und Rechtstexte sind Beispielinhalte und keine veröffentlichungsfertigen Angaben.
- Die konfigurierte Social-Preview-Datei `/og-image.jpg` fehlt; die Basis-URL ist ein Platzhalter.
- Die Demo ist absichtlich auf `noindex` gesetzt. Das ersetzt keine Zugriffskontrolle.

Der Stand der ersten Quellcodeprüfung ist in [docs/portfolio-readiness.md](docs/portfolio-readiness.md) dokumentiert.
