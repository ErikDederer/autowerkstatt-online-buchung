# Portfolio readiness review

Reviewed: 2026-09-27  
Repository: ErikDederer/autowerkstatt-online-buchung  
Base commit: `666e98a322de1924b1b59fb01bc925acf506d2e4`

## Scope and evidence

Reviewed the 13 commits reachable from the observed `main` branch, from the initial commit through the base above. Inspected their complete recursive file trees and pattern-scanned 97 distinct text-file versions for common GitHub token, AWS access-key ID, Stripe live-key, Supabase secret-key, JWT, private-key and credential-bearing PostgreSQL URL formats. No matches were found. The tracked environment examples contain placeholders; local environment files are ignored.

This is a limited pattern scan, not proof that no secrets exist. Binary content, deleted/unreachable refs, tags, deployment settings, logs, actual database policies and database records were not audited. Only `main` was returned by the branch listing. No production requests or database writes were made.

## Findings before real-data use

1. **Anonymous read access to booking data.** `supabase/migrations/0001_booking_requests.sql` creates a SELECT policy for `anon` with `using (true)`. The table contains names, phone numbers, email addresses, vehicle details and registration plates. If this policy is deployed, anonymous API access can expose these records. Coordinate staff authentication and restrictive RLS with WerkPlan, then test that anonymous reads fail and authorized staff can access only their permitted records. Do not simply assume enabling RLS makes this policy private.
2. **Contact form logs personal data.** `lib/actions/contact.ts` logs the submitted name, email, phone and message while reporting success without a delivery integration. Remove personal-data logging and make demo behavior explicit.
3. **Simulated availability and weak date/time validation.** `lib/booking/slots.ts` generates deterministic demo slots. The server schema checks date/time only as nonempty strings and the action does not validate against bookable slots. Add strict format/range checks before real use; real reservations also need shared capacity and concurrency handling.
4. **Per-instance rate limiting.** The in-memory limiter is not shared across instances. Client-IP handling depends on trusted proxy header behavior.

## Portfolio presentation

- Replace the starter README with a project-specific description and reproducible setup.
- Rename the npm package; declare Zod directly because application code imports it, using the already locked version.
- Clearly distinguish persisted requests from simulated scheduling, local vehicle lookup and unimplemented email/SMS.
- Supply a real preview image before using the configured `/og-image.jpg`.
- Replace or clearly label example business contact details and ratings; keep legal placeholders out of any real business launch.
- Reconcile the portfolio site's project description: it currently mentions SMS reminders, which this source does not implement.
- Repository visibility is a separate decision and remains private.

## Verification of this preparation

The package and lockfile JSON are parsed and checked for matching package names and direct dependencies. Zod uses the existing locked version; no dependency upgrade is proposed. README paths and feature statements were checked against this source snapshot.

A fresh install, lint, type check, production build and browser booking test are still required. The local GitHub CLI authentication was invalid during the review, so repository reads were performed through the connected GitHub tools. No build or runtime pass is claimed.

## Suggested GitHub metadata

Description: German workshop booking demo with Next.js, TypeScript and Supabase; companion frontend for WerkPlan.

Topics: `nextjs`, `typescript`, `react`, `tailwindcss`, `supabase`, `booking`, `portfolio`

These are suggestions only; repository settings were not changed.

## Access-control remediation (2026-09-29)

The findings above describe the original reviewed commit. Migration `0002_server_only_access.sql` now denies direct browser/API access to all existing shared work tables, including older mobile-demo policies. The same lockdown was applied to the shared Supabase database and table privileges were verified; service_role insertion was tested in a rolled-back transaction. The contact action no longer logs submitted personal data and explicitly reports demo-only behavior.

Database restrictions alone do not secure the old WerkPlan server: deploy its staff-authentication changes and restrict historical public deployments. Staff login setup and live application verification remain separate deployment steps.
