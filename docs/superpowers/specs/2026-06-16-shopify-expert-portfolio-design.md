# Rabia — Shopify Expert Portfolio · Design Spec

**Date:** 2026-06-16
**Status:** Approved (pending final spec review)

## Goal

A premium single-page scrolling portfolio for Rabia, a freelance **Shopify Expert**, whose
purpose is to **win freelance clients**. Visual design mirrors
[wecanflyagency.com](https://wecanflyagency.com/): a black/white, iridescent, luxury-tech
agency aesthetic.

## Stack

- **Astro** — static-first, near-zero JS, excellent SEO and performance.
- **Tailwind CSS** — consistent spacing, bold typography, whitespace control.
- **GSAP + ScrollTrigger** — scroll-reveal animations, logo marquee, parallax. Loaded only
  as an Astro island so the site stays fast.
- **Image-based glossy 3D shapes** — pre-rendered iridescent blobs (WebP/AVIF) per section.
  (Real-time Three.js/Spline deferred — not needed for v1.)
- **Web3Forms** — serverless contact form (access key, free tier, no backend).
- **Hosting** — Netlify or Vercel (static deploy).

## Aesthetic / Brand

- **Palette:** Black background (`#000`/near-black), white typography, iridescent
  rainbow reflections on glossy shapes. No additional accent color — monochrome +
  iridescence, matching We Can Fly.
- Large, bold sans-serif headings; concise copy; generous whitespace.
- Smooth scroll-reveal motion; auto-scrolling client-logo marquee.
- Respects `prefers-reduced-motion`.

## Page Structure — Single-Page Scroll

Anchor-based navigation; all sections on `/`.

1. **Sticky Nav** — name/logo left; anchor links (Work, Services, About, Contact) +
   "Book a call" button right. Transparent → solid on scroll. Mobile hamburger menu.
2. **Hero** — bold headline (e.g. *"Shopify Expert for high-converting, scalable stores"*),
   subline, two CTAs (View work / Get in touch), floating iridescent shape.
3. **Trusted-by Marquee** — auto-scrolling client/brand logos.
4. **Services** — 5 cards mirroring We Can Fly: Development, Design, Migration,
   Integrations, Growth/CRO. Each with a glossy shape + bullet list.
5. **Featured Work** — 3–6 case-study cards (image, title, industry tag, result stat).
   Cards expand to detail blocks / accordions in-page (single-page constraint).
6. **Stats / Proof** — headline metrics (e.g. "50+ stores launched", "avg conversion lift",
   "Shopify Partner").
7. **About** — Rabia's photo, bio, skills/tools, certifications.
8. **Testimonials** — client quotes, optional avatars.
9. **Contact** — Web3Forms form (name, email, message) + email + "Book a call" link.
   Success/error states handled client-side.
10. **Footer** — nav links, socials, email, copyright.

## Global UI Elements

- **Floating WhatsApp button** — fixed bottom-right, visible at all scroll positions,
  opens `https://wa.me/<number>` chat. Accessible label, hover state, hidden behind a
  config constant for the phone number.

## Optimization & SEO

- Static HTML output; lazy-loaded responsive images (WebP/AVIF, `srcset`).
- GSAP isolated to an island; no render-blocking JS.
- Meta + Open Graph + Twitter tags; favicon set.
- `sitemap.xml` + `robots.txt`.
- JSON-LD structured data: `Person` and `ProfessionalService`.
- Accessibility: keyboard navigation, focus states, semantic landmarks, alt text,
  `prefers-reduced-motion` support.
- Lighthouse target: 95+ across Performance / SEO / Accessibility / Best Practices.

## Content Strategy

All sections scaffolded with clearly-marked placeholders matching Rabia's real assets
(client logos, case studies, profile photo, bio, testimonials, WhatsApp number,
Web3Forms access key). Content stored in a single editable data file
(`src/data/site.ts` or similar) so Rabia can swap copy/assets without touching markup.

## Out of Scope (v1)

- Multi-page routing, blog/CMS, real-time 3D shapes, i18n/language switching,
  analytics dashboards. (Can be added later.)

## Configuration Constants (to be supplied by Rabia)

- WhatsApp number
- Web3Forms access key
- Calendly / booking link
- Social profile URLs
- Email address
