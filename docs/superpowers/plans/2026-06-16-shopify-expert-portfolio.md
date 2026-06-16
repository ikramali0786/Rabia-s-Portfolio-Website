# Rabia Shopify Expert Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium single-page scrolling portfolio for Rabia (freelance Shopify Expert) that mirrors the wecanflyagency.com aesthetic and is optimized for performance and SEO.

**Architecture:** Astro static site. All page content lives in one typed data file (`src/data/site.ts`). Each page section is an isolated `.astro` component composed in `src/pages/index.astro` under a shared `BaseLayout`. GSAP scroll animations are isolated to a single client-side island so the rest of the site ships zero JS. Contact form posts to Web3Forms. A global floating WhatsApp button and reduced-motion support are built in.

**Tech Stack:** Astro 5, Tailwind CSS (via `@tailwindcss/vite`), GSAP + ScrollTrigger, Web3Forms, TypeScript. Hosting: Netlify/Vercel static.

---

## File Structure

- `package.json`, `astro.config.mjs`, `tsconfig.json` — project config
- `src/styles/global.css` — Tailwind import + base tokens (colors, fonts, iridescent gradients)
- `src/data/site.ts` — ALL content + config constants (single source of truth)
- `src/layouts/BaseLayout.astro` — `<head>`, meta/OG/Twitter, JSON-LD, fonts, global CSS, slots
- `src/components/Nav.astro` — sticky nav + mobile menu
- `src/components/Hero.astro`
- `src/components/Marquee.astro` — trusted-by logo marquee
- `src/components/Services.astro`
- `src/components/Work.astro` — case-study cards with expandable detail
- `src/components/Stats.astro`
- `src/components/About.astro`
- `src/components/Testimonials.astro`
- `src/components/Contact.astro` — Web3Forms form
- `src/components/Footer.astro`
- `src/components/WhatsAppButton.astro` — global floating button
- `src/components/ScrollFX.astro` — GSAP island (`client:visible`)
- `src/components/Section.astro` — shared section wrapper (heading + glossy shape slot)
- `src/pages/index.astro` — composes all sections
- `public/robots.txt`, `public/favicon.svg`, `public/og-image.png`, `public/shapes/*`, `public/work/*`, `public/logos/*`, `public/avatars/*` — static assets/placeholders

---

## Task 1: Scaffold Astro + Tailwind project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `src/pages/index.astro`

- [ ] **Step 1: Initialize project files**

Create `package.json`:

```json
{
  "name": "rabia-portfolio",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install astro@^5 @astrojs/sitemap@^3 tailwindcss@^4 @tailwindcss/vite@^4 gsap@^3
```
Expected: dependencies added, `node_modules` created, no error exit code.

- [ ] **Step 3: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rabia-gul.com',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 4: Write `tsconfig.json`**

```json
{ "extends": "astro/tsconfigs/strict" }
```

- [ ] **Step 5: Write `src/styles/global.css`**

```css
@import "tailwindcss";

@theme {
  --color-ink: #050505;
  --color-ink-soft: #0d0d0f;
  --color-paper: #f5f5f7;
  --font-display: "Inter", system-ui, sans-serif;
}

:root { color-scheme: dark; }
html { scroll-behavior: smooth; }
body { background: var(--color-ink); color: var(--color-paper); }

/* iridescent reflection used on shapes/accents */
.iridescent {
  background: linear-gradient(120deg,#a78bfa,#f0abfc,#67e8f9,#fde68a,#a78bfa);
  background-size: 200% 200%;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 6: Write temporary `src/pages/index.astro`**

```astro
---
import '../styles/global.css';
---
<html lang="en">
  <head><meta charset="utf-8" /><title>Rabia — Shopify Expert</title></head>
  <body><main class="grid min-h-screen place-items-center text-4xl font-bold">It works</main></body>
</html>
```

- [ ] **Step 7: Verify build passes**

Run: `npm run build`
Expected: "Complete!" / build finishes with exit code 0, `dist/index.html` created.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro + Tailwind project"
```

---

## Task 2: Site data + config single source of truth

**Files:**
- Create: `src/data/site.ts`

- [ ] **Step 1: Write `src/data/site.ts`**

```ts
export const site = {
  name: 'Rabia Gul',
  role: 'Shopify Expert',
  email: 'contact@rabia-gul.com',
  whatsapp: '923482351478', // wa.me intl format (PK +92)
  bookingUrl: '#',
  web3formsKey: 'YOUR_WEB3FORMS_ACCESS_KEY',
  url: 'https://rabia-gul.com',
  description:
    'Freelance Shopify Expert building high-converting, scalable Shopify and Shopify Plus stores — development, design, migration, integrations and growth.',
  socials: [
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'GitHub', href: '#' },
  ],
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    title: 'Shopify Expert for high-converting, scalable stores',
    subtitle:
      'I design, build and optimize Shopify & Shopify Plus stores that load fast, convert better and scale with your brand.',
  },
  logos: [
    // placeholder client logos
    { name: 'Brand One', src: '/logos/logo-1.svg' },
    { name: 'Brand Two', src: '/logos/logo-2.svg' },
    { name: 'Brand Three', src: '/logos/logo-3.svg' },
    { name: 'Brand Four', src: '/logos/logo-4.svg' },
    { name: 'Brand Five', src: '/logos/logo-5.svg' },
    { name: 'Brand Six', src: '/logos/logo-6.svg' },
  ],
  services: [
    { title: 'Development', shape: '/shapes/shape-1.png', points: ['Custom themes', 'Apps & extensions', 'Speed optimization', 'Headless & B2B'] },
    { title: 'Design', shape: '/shapes/shape-2.png', points: ['UX / UI', 'Conversion-led design', 'Usability audits'] },
    { title: 'Migration', shape: '/shapes/shape-3.png', points: ['WooCommerce → Shopify', 'Magento → Shopify', 'Data & SEO preservation'] },
    { title: 'Integrations', shape: '/shapes/shape-4.png', points: ['ERP / PIM / CRM', 'Payments & shipping', 'Marketplaces'] },
    { title: 'Growth / CRO', shape: '/shapes/shape-5.png', points: ['Conversion optimization', 'Email & SEO', 'Analytics & consulting'] },
  ],
  work: [
    { slug: 'case-1', title: 'Placeholder Case Study One', industry: 'Fashion', stat: '+38% conversion', image: '/work/work-1.jpg', summary: 'Replace with a real case study: the problem, what Rabia built, and the measurable result.' },
    { slug: 'case-2', title: 'Placeholder Case Study Two', industry: 'Beauty', stat: '2.1s → 0.9s LCP', image: '/work/work-2.jpg', summary: 'Replace with a real case study: the problem, what Rabia built, and the measurable result.' },
    { slug: 'case-3', title: 'Placeholder Case Study Three', industry: 'Home & Decor', stat: '+24% AOV', image: '/work/work-3.jpg', summary: 'Replace with a real case study: the problem, what Rabia built, and the measurable result.' },
  ],
  stats: [
    { value: '50+', label: 'Stores launched' },
    { value: '90%', label: 'Client satisfaction' },
    { value: '4.9/5', label: 'Average rating' },
    { value: 'Partner', label: 'Shopify Partner' },
  ],
  about: {
    photo: '/avatars/rabia.jpg',
    bio: 'Placeholder bio — replace with Rabia’s story: years of Shopify experience, specialties, the kinds of brands she works with, and what makes her approach different.',
    skills: ['Shopify Plus', 'Liquid', 'Hydrogen', 'Tailwind', 'JavaScript', 'Klaviyo', 'GA4', 'CRO'],
  },
  testimonials: [
    { quote: 'Placeholder testimonial — replace with a real client quote.', author: 'Client Name', role: 'Founder, Brand', avatar: '/avatars/client-1.jpg' },
    { quote: 'Placeholder testimonial — replace with a real client quote.', author: 'Client Name', role: 'CEO, Brand', avatar: '/avatars/client-2.jpg' },
  ],
} as const;

export type Site = typeof site;
```

- [ ] **Step 2: Verify it type-checks via build**

Run: `npx astro check || true` then `npm run build`
Expected: build completes with exit code 0 (data file is imported in later tasks; no type errors).

- [ ] **Step 3: Commit**

```bash
git add src/data/site.ts
git commit -m "feat: add site content + config data file"
```

---

## Task 3: BaseLayout with SEO, meta, JSON-LD

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import { site } from '../data/site';
const { title = `${site.name} — ${site.role}`, description = site.description } = Astro.props;
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url,
  description: site.description,
  sameAs: site.socials.map((s) => s.href).filter((h) => h !== '#'),
};
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={site.url} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={site.url} />
    <meta property="og:image" content={`${site.url}/og-image.png`} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={`${site.url}/og-image.png`} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body class="font-display antialiased">
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Point index at the layout (temporary content)**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <main class="grid min-h-screen place-items-center text-4xl font-bold">Layout ready</main>
</BaseLayout>
```

- [ ] **Step 3: Verify build + JSON-LD present**

Run: `npm run build && grep -q 'application/ld+json' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add BaseLayout with SEO meta + JSON-LD"
```

---

## Task 4: Shared Section wrapper + placeholder assets

**Files:**
- Create: `src/components/Section.astro`, `public/robots.txt`, `public/favicon.svg`, placeholder asset files

- [ ] **Step 1: Write `src/components/Section.astro`**

```astro
---
const { id, eyebrow, title } = Astro.props;
---
<section id={id} class="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
  {eyebrow && <p class="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/50">{eyebrow}</p>}
  {title && <h2 class="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">{title}</h2>}
  <div class="mt-12"><slot /></div>
</section>
```

- [ ] **Step 2: Create `public/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://rabia-gul.com/sitemap-index.xml
```

- [ ] **Step 3: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#050505"/><text x="50%" y="56%" text-anchor="middle" dominant-baseline="middle" font-family="Inter,sans-serif" font-size="34" font-weight="800" fill="#f5f5f7">R</text></svg>
```

- [ ] **Step 4: Generate placeholder asset files**

Run (creates lightweight placeholders so `<img>` tags resolve during dev):
```bash
mkdir -p public/logos public/shapes public/work public/avatars
for i in 1 2 3 4 5 6; do printf '%s' '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 48"><rect width="160" height="48" fill="none"/><text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" fill="#777" font-family="Inter" font-size="16">Brand '"$i"'</text></svg>' > "public/logos/logo-$i.svg"; done
for i in 1 2 3 4 5; do printf '%s' '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="g" cx="35%" cy="30%"><stop offset="0%" stop-color="#f0abfc"/><stop offset="45%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#0d0d0f"/></radialGradient></defs><circle cx="100" cy="100" r="92" fill="url(#g)"/></svg>' > "public/shapes/shape-$i.png"; done
for i in 1 2 3; do printf '%s' '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#141417"/><text x="50%" y="50%" text-anchor="middle" fill="#555" font-family="Inter" font-size="32">Case Study '"$i"'</text></svg>' > "public/work/work-$i.jpg"; done
for i in 1 2; do printf '%s' '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="60" fill="#2a2a30"/></svg>' > "public/avatars/client-$i.jpg"; done
printf '%s' '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600"><rect width="480" height="600" fill="#1a1a1f"/><text x="50%" y="50%" text-anchor="middle" fill="#555" font-family="Inter" font-size="28">Rabia photo</text></svg>' > public/avatars/rabia.jpg
printf '%s' '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#050505"/><text x="50%" y="50%" text-anchor="middle" fill="#f5f5f7" font-family="Inter" font-size="64" font-weight="800">Rabia — Shopify Expert</text></svg>' > public/og-image.png
echo done
```
Expected: prints `done`; files exist under `public/`.

- [ ] **Step 5: Verify build copies public assets**

Run: `npm run build && test -f dist/robots.txt && test -f dist/logos/logo-1.svg && echo OK`
Expected: prints `OK`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Section wrapper, robots, favicon and placeholder assets"
```

---

## Task 5: Nav with sticky + mobile menu

**Files:**
- Create: `src/components/Nav.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Nav.astro`**

```astro
---
import { site } from '../data/site';
---
<header id="site-nav" class="fixed inset-x-0 top-0 z-50 transition-colors duration-300">
  <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
    <a href="#top" class="text-lg font-extrabold tracking-tight">{site.name}<span class="text-white/40">.</span></a>
    <div class="hidden items-center gap-8 md:flex">
      {site.nav.map((n) => <a href={n.href} class="text-sm text-white/70 transition hover:text-white">{n.label}</a>)}
      <a href={site.bookingUrl} class="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80">Book a call</a>
    </div>
    <button id="nav-toggle" aria-label="Open menu" aria-expanded="false" class="md:hidden">
      <span class="block h-0.5 w-6 bg-white"></span>
      <span class="mt-1.5 block h-0.5 w-6 bg-white"></span>
      <span class="mt-1.5 block h-0.5 w-6 bg-white"></span>
    </button>
  </nav>
  <div id="mobile-menu" class="hidden border-t border-white/10 bg-black/95 px-6 py-6 md:hidden">
    {site.nav.map((n) => <a href={n.href} class="mobile-link block py-3 text-lg">{n.label}</a>)}
    <a href={site.bookingUrl} class="mobile-link mt-2 block rounded-full bg-white px-5 py-3 text-center font-semibold text-black">Book a call</a>
  </div>
</header>
<script>
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  const onScroll = () => nav?.classList.toggle('bg-black/80', window.scrollY > 24);
  const onScrollBackdrop = () => nav?.classList.toggle('backdrop-blur', window.scrollY > 24);
  window.addEventListener('scroll', () => { onScroll(); onScrollBackdrop(); });
  toggle?.addEventListener('click', () => {
    const open = menu?.classList.toggle('hidden') === false;
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.mobile-link').forEach((l) =>
    l.addEventListener('click', () => menu?.classList.add('hidden')),
  );
</script>
```

- [ ] **Step 2: Mount nav in `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
---
<BaseLayout>
  <span id="top"></span>
  <Nav />
  <main class="grid min-h-screen place-items-center text-4xl font-bold">Nav ready</main>
</BaseLayout>
```

- [ ] **Step 3: Verify build + nav renders**

Run: `npm run build && grep -q 'site-nav' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add sticky nav with mobile menu"
```

---

## Task 6: Hero section

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Hero.astro`**

```astro
---
import { site } from '../data/site';
---
<section class="relative flex min-h-screen items-center overflow-hidden px-6 pt-28">
  <div class="pointer-events-none absolute right-[-10%] top-1/4 h-[60vh] w-[60vh] rounded-full blur-3xl opacity-40 iridescent"></div>
  <div class="relative mx-auto w-full max-w-7xl">
    <p class="reveal mb-5 text-sm font-medium uppercase tracking-[0.25em] text-white/50">{site.role}</p>
    <h1 class="reveal max-w-4xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">{site.hero.title}</h1>
    <p class="reveal mt-6 max-w-2xl text-lg text-white/70 md:text-xl">{site.hero.subtitle}</p>
    <div class="reveal mt-10 flex flex-wrap gap-4">
      <a href="#work" class="rounded-full bg-white px-7 py-3 font-semibold text-black transition hover:bg-white/80">View work</a>
      <a href="#contact" class="rounded-full border border-white/20 px-7 py-3 font-semibold transition hover:border-white/60">Get in touch</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Mount Hero (replace placeholder main)**

In `src/pages/index.astro` add `import Hero from '../components/Hero.astro';` and replace the `<main>...</main>` with:
```astro
<main><Hero /></main>
```

- [ ] **Step 3: Verify build**

Run: `npm run build && grep -q 'View work' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add hero section"
```

---

## Task 7: Marquee (trusted-by logos)

**Files:**
- Create: `src/components/Marquee.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Marquee.astro`**

```astro
---
import { site } from '../data/site';
const row = [...site.logos, ...site.logos];
---
<section class="border-y border-white/10 py-10">
  <p class="mb-8 text-center text-xs uppercase tracking-[0.25em] text-white/40">Trusted by brands</p>
  <div class="group relative overflow-hidden">
    <div class="flex w-max animate-[marquee_30s_linear_infinite] gap-16 group-hover:[animation-play-state:paused]">
      {row.map((l) => <img src={l.src} alt={l.name} width="160" height="48" loading="lazy" class="h-8 w-auto opacity-60 transition hover:opacity-100" />)}
    </div>
  </div>
</section>
<style>
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @media (prefers-reduced-motion: reduce) { .animate-\[marquee_30s_linear_infinite\] { animation: none; } }
</style>
```

- [ ] **Step 2: Mount in index after Hero**

Add `import Marquee from '../components/Marquee.astro';` and place `<Marquee />` right after `<Hero />` inside `<main>`.

- [ ] **Step 3: Verify build**

Run: `npm run build && grep -q 'Trusted by brands' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add trusted-by logo marquee"
```

---

## Task 8: Services section

**Files:**
- Create: `src/components/Services.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Services.astro`**

```astro
---
import Section from './Section.astro';
import { site } from '../data/site';
---
<Section id="services" eyebrow="What I do" title="Services that scale your Shopify store">
  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {site.services.map((s) => (
      <article class="reveal group rounded-3xl border border-white/10 bg-[--color-ink-soft] p-8 transition hover:border-white/30">
        <img src={s.shape} alt="" width="96" height="96" loading="lazy" class="mb-6 h-20 w-20 object-contain" />
        <h3 class="text-2xl font-bold">{s.title}</h3>
        <ul class="mt-4 space-y-2 text-white/65">
          {s.points.map((p) => <li class="flex gap-2"><span class="text-white/40">—</span>{p}</li>)}
        </ul>
      </article>
    ))}
  </div>
</Section>
```

- [ ] **Step 2: Mount in index after Marquee**

Add `import Services from '../components/Services.astro';` and place `<Services />` after `<Marquee />`.

- [ ] **Step 3: Verify build**

Run: `npm run build && grep -q 'id="services"' dist/index.html && grep -q 'Migration' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add services section"
```

---

## Task 9: Featured Work with expandable detail

**Files:**
- Create: `src/components/Work.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Work.astro`**

```astro
---
import Section from './Section.astro';
import { site } from '../data/site';
---
<Section id="work" eyebrow="Selected work" title="Case studies & results">
  <div class="grid gap-8 md:grid-cols-2">
    {site.work.map((w) => (
      <article class="reveal overflow-hidden rounded-3xl border border-white/10 bg-[--color-ink-soft]">
        <img src={w.image} alt={w.title} width="800" height="600" loading="lazy" class="aspect-[4/3] w-full object-cover" />
        <div class="p-7">
          <div class="flex items-center justify-between gap-4">
            <span class="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-white/60">{w.industry}</span>
            <span class="text-sm font-semibold text-white/80">{w.stat}</span>
          </div>
          <h3 class="mt-4 text-2xl font-bold">{w.title}</h3>
          <details class="group mt-3">
            <summary class="cursor-pointer list-none text-sm text-white/60 transition hover:text-white">Read case study <span class="group-open:hidden">→</span><span class="hidden group-open:inline">↓</span></summary>
            <p class="mt-3 text-white/70">{w.summary}</p>
          </details>
        </div>
      </article>
    ))}
  </div>
</Section>
```

- [ ] **Step 2: Mount in index after Services**

Add `import Work from '../components/Work.astro';` and place `<Work />` after `<Services />`.

- [ ] **Step 3: Verify build**

Run: `npm run build && grep -q 'id="work"' dist/index.html && grep -q 'Read case study' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add featured work case studies"
```

---

## Task 10: Stats / proof section

**Files:**
- Create: `src/components/Stats.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Stats.astro`**

```astro
---
import { site } from '../data/site';
---
<section class="border-y border-white/10 bg-[--color-ink-soft]">
  <div class="mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4">
    {site.stats.map((s) => (
      <div class="reveal px-6 py-14 text-center">
        <div class="text-4xl font-black md:text-5xl">{s.value}</div>
        <div class="mt-2 text-sm uppercase tracking-wide text-white/50">{s.label}</div>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Mount in index after Work**

Add `import Stats from '../components/Stats.astro';` and place `<Stats />` after `<Work />`.

- [ ] **Step 3: Verify build**

Run: `npm run build && grep -q 'Stores launched' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add stats/proof section"
```

---

## Task 11: About section

**Files:**
- Create: `src/components/About.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/About.astro`**

```astro
---
import Section from './Section.astro';
import { site } from '../data/site';
---
<Section id="about" eyebrow="About" title="Hi, I’m Rabia">
  <div class="grid items-center gap-12 md:grid-cols-[2fr_3fr]">
    <img src={site.about.photo} alt={`${site.name}, ${site.role}`} width="480" height="600" loading="lazy" class="w-full rounded-3xl border border-white/10 object-cover" />
    <div>
      <p class="text-lg text-white/75">{site.about.bio}</p>
      <div class="mt-8 flex flex-wrap gap-3">
        {site.about.skills.map((s) => <span class="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70">{s}</span>)}
      </div>
    </div>
  </div>
</Section>
```

- [ ] **Step 2: Mount in index after Stats**

Add `import About from '../components/About.astro';` and place `<About />` after `<Stats />`.

- [ ] **Step 3: Verify build**

Run: `npm run build && grep -q 'id="about"' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add about section"
```

---

## Task 12: Testimonials section

**Files:**
- Create: `src/components/Testimonials.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Testimonials.astro`**

```astro
---
import Section from './Section.astro';
import { site } from '../data/site';
---
<Section id="testimonials" eyebrow="Testimonials" title="What clients say">
  <div class="grid gap-6 md:grid-cols-2">
    {site.testimonials.map((t) => (
      <figure class="reveal rounded-3xl border border-white/10 bg-[--color-ink-soft] p-8">
        <blockquote class="text-xl leading-relaxed text-white/85">“{t.quote}”</blockquote>
        <figcaption class="mt-6 flex items-center gap-4">
          <img src={t.avatar} alt={t.author} width="56" height="56" loading="lazy" class="h-14 w-14 rounded-full object-cover" />
          <div><div class="font-semibold">{t.author}</div><div class="text-sm text-white/50">{t.role}</div></div>
        </figcaption>
      </figure>
    ))}
  </div>
</Section>
```

- [ ] **Step 2: Mount in index after About**

Add `import Testimonials from '../components/Testimonials.astro';` and place `<Testimonials />` after `<About />`.

- [ ] **Step 3: Verify build**

Run: `npm run build && grep -q 'id="testimonials"' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add testimonials section"
```

---

## Task 13: Contact section with Web3Forms

**Files:**
- Create: `src/components/Contact.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Contact.astro`**

```astro
---
import Section from './Section.astro';
import { site } from '../data/site';
---
<Section id="contact" eyebrow="Contact" title="Let’s build your store">
  <div class="grid gap-12 md:grid-cols-2">
    <div>
      <p class="text-lg text-white/70">Tell me about your project and I’ll get back to you within 24 hours.</p>
      <div class="mt-8 space-y-3 text-white/80">
        <a href={`mailto:${site.email}`} class="block hover:text-white">{site.email}</a>
        <a href={`https://wa.me/${site.whatsapp}`} class="block hover:text-white">WhatsApp →</a>
        <a href={site.bookingUrl} class="block hover:text-white">Book a call →</a>
      </div>
    </div>
    <form id="contact-form" class="space-y-4">
      <input type="hidden" name="access_key" value={site.web3formsKey} />
      <input type="hidden" name="subject" value="New inquiry from portfolio" />
      <input type="checkbox" name="botcheck" class="hidden" style="display:none" tabindex="-1" autocomplete="off" />
      <input name="name" required placeholder="Your name" class="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 outline-none focus:border-white/50" />
      <input name="email" type="email" required placeholder="Email" class="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 outline-none focus:border-white/50" />
      <textarea name="message" required rows="5" placeholder="Your message" class="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 outline-none focus:border-white/50"></textarea>
      <button type="submit" class="w-full rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/80">Send message</button>
      <p id="form-status" class="text-sm text-white/60" role="status" aria-live="polite"></p>
    </form>
  </div>
</Section>
<script>
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const status = document.getElementById('form-status');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form || !status) return;
    status.textContent = 'Sending…';
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const data = await res.json();
      if (data.success) { status.textContent = 'Thanks! Your message was sent.'; form.reset(); }
      else { status.textContent = 'Something went wrong. Please email me directly.'; }
    } catch {
      status.textContent = 'Network error. Please email me directly.';
    }
  });
</script>
```

- [ ] **Step 2: Mount in index after Testimonials**

Add `import Contact from '../components/Contact.astro';` and place `<Contact />` after `<Testimonials />`.

- [ ] **Step 3: Verify build**

Run: `npm run build && grep -q 'id="contact-form"' dist/index.html && grep -q 'api.web3forms.com' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add contact section with Web3Forms"
```

---

## Task 14: Footer

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Footer.astro`**

```astro
---
import { site } from '../data/site';
const year = new Date().getFullYear();
---
<footer class="border-t border-white/10 px-6 py-14">
  <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
    <div class="text-lg font-extrabold">{site.name}<span class="text-white/40">.</span></div>
    <nav class="flex flex-wrap items-center gap-6 text-sm text-white/60">
      {site.nav.map((n) => <a href={n.href} class="hover:text-white">{n.label}</a>)}
      {site.socials.map((s) => <a href={s.href} class="hover:text-white">{s.label}</a>)}
    </nav>
    <p class="text-sm text-white/40">© {year} {site.name}</p>
  </div>
</footer>
```

- [ ] **Step 2: Mount in index after `</main>`**

Add `import Footer from '../components/Footer.astro';` and place `<Footer />` after the closing `</main>` tag.

- [ ] **Step 3: Verify build**

Run: `npm run build && grep -q '©' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add footer"
```

---

## Task 15: Floating WhatsApp button

**Files:**
- Create: `src/components/WhatsAppButton.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/WhatsAppButton.astro`**

```astro
---
import { site } from '../data/site';
---
<a
  href={`https://wa.me/${site.whatsapp}`}
  target="_blank"
  rel="noopener"
  aria-label="Chat on WhatsApp"
  class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/40 transition hover:scale-105"
>
  <svg viewBox="0 0 32 32" width="28" height="28" fill="#fff" aria-hidden="true">
    <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.1 1.6 5.9L4 29l8.3-1.6C14 28.4 15 28.6 16 28.6 22.6 28.6 28 23.2 28 16.6S22.6 3 16 3zm0 23c-1 0-2-.2-2.9-.6l-.4-.2-4.9 1 1-4.8-.3-.5C7.6 19 7.2 17 7.2 15 7.2 10.1 11.1 6.2 16 6.2S24.8 10.1 24.8 15 20.9 26 16 26zm5.1-7.6c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.7 3 .6.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.2-.6-.3z"/>
  </svg>
</a>
```

- [ ] **Step 2: Mount in index (after Footer, inside BaseLayout)**

Add `import WhatsAppButton from '../components/WhatsAppButton.astro';` and place `<WhatsAppButton />` after `<Footer />`.

- [ ] **Step 3: Verify build**

Run: `npm run build && grep -q 'Chat on WhatsApp' dist/index.html && grep -q 'wa.me/923482351478' dist/index.html && echo OK`
Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add floating WhatsApp button"
```

---

## Task 16: GSAP scroll-reveal island

**Files:**
- Create: `src/components/ScrollFX.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/ScrollFX.astro`**

```astro
<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.reveal').forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });
  } else {
    document.querySelectorAll('.reveal').forEach((el) => ((el as HTMLElement).style.opacity = '1'));
  }
</script>
```

- [ ] **Step 2: Mount in index (inside BaseLayout, after WhatsAppButton)**

Add `import ScrollFX from '../components/ScrollFX.astro';` and place `<ScrollFX />` after `<WhatsAppButton />`.

- [ ] **Step 3: Verify build bundles gsap without error**

Run: `npm run build && echo OK`
Expected: build completes, prints `OK`. (GSAP is bundled into a hashed JS asset under `dist/_astro/`.)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add GSAP scroll-reveal animations"
```

---

## Task 17: Smoke test, accessibility & performance verification

**Files:**
- Create: `scripts/smoke.mjs`

- [ ] **Step 1: Write `scripts/smoke.mjs`**

```js
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const checks = [
  ['JSON-LD', 'application/ld+json'],
  ['title', 'Shopify Expert'],
  ['hero CTA', 'View work'],
  ['services', 'id="services"'],
  ['work', 'id="work"'],
  ['contact form', 'id="contact-form"'],
  ['web3forms', 'api.web3forms.com'],
  ['whatsapp', 'wa.me/923482351478'],
  ['footer', '©'],
  ['og image', 'og:image'],
];
let failed = 0;
for (const [name, needle] of checks) {
  if (!html.includes(needle)) { console.error('MISSING:', name); failed++; }
}
if (failed) { console.error(`${failed} check(s) failed`); process.exit(1); }
console.log('All smoke checks passed');
```

- [ ] **Step 2: Add script to `package.json`**

Add to `"scripts"`: `"smoke": "node scripts/smoke.mjs"`.

- [ ] **Step 3: Run build + smoke**

Run: `npm run build && npm run smoke`
Expected: prints `All smoke checks passed` with exit code 0.

- [ ] **Step 4: Manual visual + Lighthouse check**

Run: `npm run preview` and open the local URL.
Verify by eye: black theme, hero shape, marquee scrolls, sections reveal on scroll, mobile menu toggles, WhatsApp button floats, form shows status on submit.
Run Lighthouse (Chrome DevTools or `npx lighthouse <url> --view`).
Expected: Performance, SEO, Accessibility, Best Practices each ≥ 95. Fix any flagged issue (alt text, contrast, labels) before commit.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: add build smoke test + verification"
```

---

## Task 18: Deployment config + README

**Files:**
- Create: `netlify.toml`, `README.md`

- [ ] **Step 1: Write `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

- [ ] **Step 2: Write `README.md`**

````markdown
# Rabia — Shopify Expert Portfolio

Astro + Tailwind + GSAP single-page portfolio.

## Develop
```bash
npm install
npm run dev
```

## Build & verify
```bash
npm run build && npm run smoke
```

## Edit content
All copy, links and assets live in `src/data/site.ts`.

## Before going live
- Set `web3formsKey` in `src/data/site.ts` to a real Web3Forms access key.
- Set real `bookingUrl` and social URLs.
- Replace placeholder assets in `public/logos`, `public/shapes`, `public/work`, `public/avatars`, and `public/og-image.png`.

## Deploy
Netlify/Vercel: build `npm run build`, publish `dist`.
````

- [ ] **Step 3: Verify build still green**

Run: `npm run build && npm run smoke && echo OK`
Expected: prints `All smoke checks passed` then `OK`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: add deploy config + README"
```

---

## Self-Review Notes

- **Spec coverage:** stack (T1), data/config incl. WhatsApp+email+web3forms placeholder (T2), SEO meta/JSON-LD/sitemap/robots (T1,T3,T4), all 10 sections (T5–T14), WhatsApp button (T15), GSAP island + reduced-motion (T16, global.css T1), optimization/lazy images (each section uses `loading="lazy"`), verification incl. Lighthouse (T17), deploy (T18). All spec sections mapped.
- **Placeholders:** content placeholders are intentional and clearly labeled per the spec; no plan-step placeholders (every code step shows full code).
- **Type consistency:** `site` shape defined once in T2 and consumed unchanged; class `.reveal` defined in components and consumed by `ScrollFX`; `#contact-form`/`#form-status` ids consistent between T13 markup and script.
