# Theming a fork

Every fork of this starter should get its own distinct palette and font
pairing — never ship two demo sites that look identical. This file explains
where to make those changes. In almost all cases you only need to touch
`app/globals.css` (colors), `app/layout.tsx` (fonts), and
`lib/site-config.ts` (content).

## 1. Color palette

All colors are defined as CSS variables in `app/globals.css`, using the
OKLCH color space (`oklch(lightness chroma hue)`). There are two blocks:
`:root` (light mode) and `.dark` (dark mode).

The tokens that matter most for a fork's identity:

| Variable | Used for |
| --- | --- |
| `--primary` / `--primary-foreground` | Buttons, links, icon backgrounds, CTA banner background |
| `--accent` / `--accent-foreground` | Star ratings, small highlight details |
| `--background` / `--foreground` | Page background and body text |
| `--secondary` / `--muted` | Section backgrounds (alternating light bands), muted text |

To re-theme a fork:

1. Pick a primary hue that fits the business (e.g. warm terracotta for a
   bakery, deep green for a gardener, navy for a law office). Keep
   `--primary`'s lightness low enough (≤ 0.45) that white text on it passes
   WCAG AA contrast, since it's used as a solid CTA banner background.
2. Update `--primary`, `--primary-foreground`, `--ring`,
   `--sidebar-primary` and `--sidebar-ring` together — they should share the
   same hue.
3. Update `--accent` / `--accent-foreground` to a complementary or warm
   accent (used sparingly, e.g. filled stars).
4. Repeat the same hue choices in the `.dark` block, but raise the
   lightness of `--primary` (dark-mode primaries need to be lighter to stay
   legible on a dark background) and darken `--background`/`--card`.
5. Avoid generic "AI-purple" gradients or glassmorphism — pick a single
   confident hue instead of a gradient.

A quick way to iterate: change `--primary` and `--accent` first, run
`npm run dev`, and look at the Hero buttons, CTABanner, and star ratings —
those three spots make a palette change obvious immediately.

## 2. Font pairing

Fonts are loaded via `next/font/google` in `app/layout.tsx` and exposed as
CSS variables consumed by `app/globals.css`'s `@theme inline` block:

- `--font-sans` → body text (`font-sans`, applied to `html` by default)
- `--font-heading` → headings (`font-heading`, used explicitly on every
  `h1`–`h3` and `CardTitle` in the blocks)
- `--font-mono` → rarely used, kept for code/table alignment if needed

The starter pairs **Geist Sans** (body) with **Fraunces** (headings), a
serif with enough personality to avoid the generic SaaS look while staying
readable and trustworthy.

To swap the pairing:

1. Import a different pair from `next/font/google` in `app/layout.tsx`
   (e.g. `Source_Serif_4`, `Libre_Caslon_Text`, `Fraunces`, `Newsreader` for
   headings; `Inter`, `Geist`, `Public_Sans` for body text).
2. Give the new font a `variable` (e.g. `--font-my-heading`).
3. Add the font's `variable` class to the `<html>` `className` in
   `app/layout.tsx`.
4. Point `--font-heading` (or `--font-sans`) at the new variable in
   `app/globals.css`'s `@theme inline` block.

Keep body text on a well-hinted sans-serif for legibility at small sizes —
reserve character for the heading font.

## 3. Everything else lives in `lib/site-config.ts`

Business name, tagline, phone, address, nav links, hero copy, services,
testimonials, FAQ, opening hours, and legal placeholder data are all in one
object. Editing that file (plus the two steps above) is enough to turn this
into a new fork — no component code should need to change for a typical
demo site.

## 4. Radius and spacing

`--radius` in `app/globals.css` controls corner rounding globally (cards,
buttons, inputs derive `--radius-sm/md/lg/xl` from it). Lower it (e.g.
`0.25rem`) for a sharper, more "Mittelstand/corporate" feel, or raise it
(e.g. `0.75rem`) for a softer, more approachable feel.
