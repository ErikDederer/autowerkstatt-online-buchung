# Project conventions

## Stack
- Next.js 15+ (App Router), TypeScript strict, Tailwind CSS v4
- UI: shadcn/ui components, lucide-react icons
- Forms: react-hook-form + zod
- Content language: GERMAN (de-DE). All UI text, headings, placeholders in German.

## Non-negotiable rules
- Every page: proper metadata (title, description) in German
- robots: noindex, nofollow on ALL pages (these are demo projects)
- Footer on every page: links to /impressum and /datenschutz + small badge "Konzeptprojekt"
- Mobile-first. Test every view at 375px width first.
- Lighthouse performance target: 95+. No heavy client JS where server components work.
- Accessibility: semantic HTML, alt texts, visible focus states, contrast AA (BFSG matters in DE)
- No lorem ipsum: realistic German demo content (invented but plausible business data)
- Images: next/image, use https://picsum.photos or generated placeholders, never hotlink real businesses

## Legal pages
- /impressum and /datenschutz: realistic STRUCTURE, placeholder data marked as
  [Vorname Nachname], [Straße Nr.], [PLZ Ort] — I will fill my real data before deploy
- Cookie banner only if the project actually sets non-essential cookies (most don't)

## Design
- No generic "AI look": avoid purple gradients, glassmorphism everywhere, emoji headers
- Each project gets its own distinct palette + font pairing (defined in the project prompt)
- Whitespace generous, typography-driven, German Mittelstand aesthetic: trustworthy > trendy

## Autonomy
- Work autonomously: state your plan in 3-5 bullets, then execute without
  waiting for approval. Do not stop to ask for confirmation between steps.
- Only stop and ask if a decision is truly ambiguous AND hard to reverse
  (e.g. data model choices in the SaaS demos). Everything else: decide,
  note the decision in the commit message, move on.
- After finishing a stage: run the dev build, fix errors yourself, then report.

## Git workflow
- One feature branch per stage: feat/<short-name> (e.g. feat/booking-flow,
  feat/hero-section). Never commit work-in-progress directly to main.
- Commit OFTEN: after every completed component or working state, not one
  giant commit per session. Small commits = easy rollback.
- Conventional commits: feat:, fix:, style:, refactor: + concise message
  in English describing WHAT changed.
- NEVER add a Co-Authored-By trailer or any Claude/AI attribution to
  commit messages. Plain commits only.
- Merge the branch to main when the stage works and builds cleanly.