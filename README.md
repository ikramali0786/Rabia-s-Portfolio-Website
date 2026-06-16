# Rabia — Shopify Expert Portfolio

A premium single-page portfolio built with **Astro + Tailwind CSS v4 + GSAP**. Black/white
iridescent aesthetic, near-zero JavaScript, SEO-optimized, fully responsive and accessible.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
```

## Build & verify

```bash
npm run build    # static output to dist/
npm run smoke    # asserts every key section is present in the build
npm run preview  # serve the production build locally
```

## Editing content

**All copy, links, services, case studies, stats, testimonials, and config live in one file:**
[`src/data/site.ts`](src/data/site.ts). Edit there — you should rarely need to touch the
components. Each section is a focused component under `src/components/`.

## Replacing placeholder assets

Placeholder images live in `public/`. Drop in the real assets at the same path (or change the
path in `src/data/site.ts`):

| Asset | Path | Notes |
| --- | --- | --- |
| Client logos | `public/logos/logo-1..6.svg` | SVG or PNG; wide transparent logos look best |
| Service shapes | `public/shapes/shape-1..5.svg` | Decorative iridescent blobs |
| Case-study images | `public/work/work-1..3.svg` | ~4:3; swap to `.jpg`/`.webp` and update `site.work[].image` |
| Profile photo | `public/avatars/rabia.svg` | ~4:5 portrait; swap to `.jpg` and update `site.about.photo` |
| Testimonial avatars | `public/avatars/client-1..2.svg` | Square; update `site.testimonials[].avatar` |
| Favicon | `public/favicon.svg` | — |

## Go-live checklist

- [ ] Set a real **Web3Forms access key** in `site.web3formsKey` (free key from
      [web3forms.com](https://web3forms.com)). The contact form will not deliver email until
      this is set.
- [ ] Set the real **booking link** (`site.bookingUrl`, e.g. Calendly).
- [ ] Set the real **social URLs** (`site.socials`).
- [ ] Confirm the **WhatsApp number** (`site.whatsapp`, currently `923482351478` →
      `wa.me/923482351478`).
- [ ] Replace **`public/og-image.png`** with a real 1200×630 social share image (current file
      is a plain dark placeholder).
- [ ] Replace placeholder **case studies, photo, logos, and testimonials** (see table above).
- [ ] Update `site` URL in [`astro.config.mjs`](astro.config.mjs) and `src/data/site.ts` if the
      domain changes (affects canonical URL + sitemap).

## Deploy

Static output — deploy `dist/` anywhere. Config included for:

- **Netlify** — `netlify.toml` (build `npm run build`, publish `dist`).
- **Vercel** — `vercel.json` (same).

Both build automatically on push once the repo is connected.

## Tech notes

- Animations: GSAP + ScrollTrigger, isolated to one island ([`ScrollFX.astro`](src/components/ScrollFX.astro)).
  Respects `prefers-reduced-motion`; content is fully visible without JS.
- SEO: per-page meta/OG/Twitter tags + JSON-LD `Person` in
  [`BaseLayout.astro`](src/layouts/BaseLayout.astro), plus `sitemap-index.xml` and `robots.txt`.
