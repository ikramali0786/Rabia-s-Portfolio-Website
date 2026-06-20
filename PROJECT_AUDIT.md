# Project Audit — Rabia's Portfolio Website

> **Project:** `rabia-portfolio` (Astro + Tailwind CSS v4 + GSAP)  
> **Audited:** 2025-06-19  
> **Scope:** Code quality, SEO, accessibility, performance, security, content readiness, and deployment hygiene.

---

## 1. What's Missing (Must-Have Before Launch)

These are blockers — the site is **not production-ready** until they are resolved.

| # | Item | Where | Impact |
|---|------|-------|--------|
| 1.1 | **Real content** — bio, case studies, testimonials, pricing, stats | `src/data/site.ts` | Entire site is placeholder text. Visitors see "Placeholder bio", "Placeholder Case Study", "Replace with a real Fiverr review", etc. |
| 1.2 | **Real images** — profile photo, case-study images, client avatars, logos, OG image | `public/` | All visuals are generic SVG placeholders. OG image is a blank 3150-byte dark rectangle. |
| 1.3 | **Working contact form** | `site.web3formsKey` | Web3Forms key is `YOUR_WEB3FORMS_ACCESS_KEY`. Submissions will fail. |
| 1.4 | **Real booking URL** | `site.bookingUrl` | Currently `#`. "Book a call" buttons go nowhere. |
| 1.5 | **Real social links** | `site.socials` | LinkedIn and Instagram are `#`. Footer and nav link to dead anchors. |
| 1.6 | **Real Fiverr profile URL** | `site.fiverr.profileUrl` | Currently `#`. Testimonial badges link to a dead anchor. |
| 1.7 | **Branded favicon** | `public/favicon.svg` | The SVG is tiny; if generic, it hurts brand recognition. |
| 1.8 | **Image optimization pipeline** | `src/components/` | No `<Image>` component from `astro:assets` is used. All images are raw `<img>` tags with no responsive `srcset`, no WebP/AVIF conversion, and no lazy-loading above-the-fold tuning. |
| 1.9 | **Blog tag/category pages** | `src/pages/` | No taxonomy pages. Users can't browse by tag. |
| 1.10 | **Privacy policy / GDPR compliance** | — | Contact form collects PII (name, email). No privacy policy, no cookie consent, no GDPR disclosure. |
| 1.11 | **Analytics** | — | No tracking (GA4, Plausible, Fathom, etc.). You can't measure conversion or traffic. |

---

## 2. What's Wrong (Bugs & Issues)

These are **technical defects** that affect functionality, SEO, or accessibility.

### 2.1 SEO / Meta Tag Bugs

- **404 page has conflicting `robots` meta**  
  `BaseLayout.astro` prints `<meta name="robots" content="index, follow...">` **before** `<slot name="head" />`. The 404 page tries to inject `<meta name="robots" content="noindex">`, but the result is **both tags** in the `<head>`. Crawlers may read the first one (`index`) and index your 404 page.  
  **Fix:** Move the robots meta inside the Props interface so it can be overridden, or use `Astro.slots.has('head')` logic to conditionally print the default.

- **RSS link trailing-slash inconsistency**  
  `rss.xml.js` links to `/blog/${post.id}/` (trailing slash). The site links to `/blog/${post.id}` (no slash). Depending on the host, this creates duplicate content or unnecessary redirects.  
  **Fix:** Align with the host's trailing-slash behavior. Add `trailingSlash: 'always'` or `'never'` to `astro.config.mjs`.

- **Missing `twitter:site` and `twitter:creator`**  
  No Twitter handle is declared in OG tags. This limits social card attribution.

- **Missing Open Graph article metadata on blog posts**  
  No `article:published_time`, `article:modified_time`, `article:author`, or `article:tag` tags. This hurts rich-snippet eligibility.

### 2.2 Accessibility (a11y) Issues

- **Skip-to-content link doesn't work reliably**  
  The skip link targets `#main-content`, but `#main-content` has no `tabindex="-1"`. Some browsers (Safari, older Chrome) won't move focus to a non-focusable element.  
  **Fix:** Add `tabindex="-1"` to `<main id="main-content">`.

- **Mobile drawer is not a modal dialog**  
  It lacks `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and a **focus trap**. Keyboard users can tab out of the drawer into the background page. Also, focus is only returned to the toggle button on `Escape`, not when clicking the overlay or close button.  
  **Fix:** Add a focus-trap library (or a small custom trap) and proper ARIA roles.

- **No `aria-current="page"` on active nav links**  
  Screen-reader users can't tell which page they're on.

- **Contact form lacks accessible validation**  
  No `aria-invalid`, `aria-describedby`, or per-field error messages. The success/failure message is plain text in a `<p>` with `role="status"` — good start, but not linked to inputs.

- **Preloader runs on 404 page**  
  The 404 page shows the full preloader. This is poor UX for an error page. The preloader should be scoped to the home page or excluded from 404.

### 2.3 Build & Code Issues

- **Committed files that should be ignored**  
  `.DS_Store` files are in `src/`, `public/`, `docs/`, and `.git/`. `.astro/` cache is committed. `.claude/launch.json` is committed. These bloat the repo and cause cross-platform noise.  
  **Fix:** `git rm --cached` them and ensure `.gitignore` is already correct (it is).

- **No explicit `output: 'static'` in Astro config**  
  Astro defaults to static, but if an integration changes this later, the site could break silently.  
  **Fix:** Add `output: 'static'` to `astro.config.mjs`.

- **No `astro check` or linting in CI**  
  There is no ESLint, Prettier, or `astro check` in `package.json` scripts. Type errors could slip into production.

- **Nav script bundled order is non-deterministic**  
  Both `Nav.astro` and `ScrollFX.astro` use default `<script>` tags (hoisted & bundled by Astro). `Nav` accesses `window.__lenis`, which is set by `ScrollFX`. If the bundle runs `Nav` before `ScrollFX`, `lenis()?.stop()` is undefined on the first mobile-menu open. In practice, event handlers defer this, but it's fragile.  
  **Fix:** Either use `is:inline` for the Nav script or check `window.__lenis` existence before calling methods.

### 2.4 Form Issues

- **Missing `replyto` / `from_name` fields**  
  Web3Forms supports `replyto` so replies go to the sender's email. Without it, you have to copy/paste the email from the message body.  
  **Fix:** Add `<input type="hidden" name="replyto" value={form.email.value}>` (set dynamically via JS before submit) or include `from_name`.

- **Honeypot field exists but isn't validated client-side**  
  The `botcheck` checkbox is hidden, but there's no client-side check. If a bot fills it, the server will reject it, but the user gets a generic error. Not critical, but worth noting.

### 2.5 Content Bugs

- **Blog post link uses `&#35;` instead of `#`**  
  `headless-vs-liquid.md` contains `Book a free discovery call](/&#35;contact)`. This URL-encodes the hash and may not work correctly in all Markdown renderers.  
  **Fix:** Use `/#contact`.

- **Case-study images are SVGs with `object-cover`**  
  `work-1.svg` etc. are SVGs, yet they are rendered with `width="800" height="600"` and `object-cover`. SVG scaling with `object-cover` is inconsistent across browsers and can cause layout shifts or visual glitches.  
  **Fix:** Replace with raster images (JPG/PNG/WebP) or use proper SVG `viewBox` and `preserveAspectRatio`.

---

## 3. What Can Be Improved (Enhancements)

These are **not blockers** but will significantly improve UX, performance, and professionalism.

### 3.1 Performance

| Priority | Improvement | How |
|----------|-------------|-----|
| High | Use Astro's `<Image>` component | Replace raw `<img>` tags with `import { Image } from 'astro:assets'` to get automatic WebP/AVIF, responsive `srcset`, and blur-up placeholders. |
| High | Add `fetchpriority="high"` to hero / above-fold images | The `About` photo and any hero imagery should load first. |
| High | Add `decoding="async"` to all images | Currently missing. Helps main-thread responsiveness. |
| Medium | Preconnect to `api.web3forms.com` | Add `<link rel="preconnect" href="https://api.web3forms.com">` in `BaseLayout` to speed up form submission. |
| Medium | Self-host fonts or use `font-display: swap` | Already uses `display=swap` in Google Fonts URL — good. Consider self-hosting for zero third-party dependency. |
| Low | Add `astro-compress` or `@playform/compress` | Gzip/Brotli HTML/CSS/JS in the build. Most hosts do this automatically, but explicit is safer. |

### 3.2 Security & Deployment

| Priority | Improvement | How |
|----------|-------------|-----|
| High | Add security headers in `netlify.toml` | `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security` (HSTS). |
| High | Add `rel="noopener noreferrer"` to all external links consistently | Some external links have it, some don't (e.g., Fiverr chip in Testimonials). Audit all `<a target="_blank">`. |
| Medium | Add `integrity` or Subresource Integrity (SRI) for third-party scripts | Currently only Google Fonts and Simple Icons are third-party. Self-hosting removes this risk entirely. |

### 3.3 UX / Polish

| Priority | Improvement | How |
|----------|-------------|-----|
| High | Form success state styling | Use a toast/notification component instead of plain text. Add a checkmark icon and a "Send another message" reset button. |
| High | Add a "Copy email to clipboard" button | Next to the email address in Contact and Footer. |
| Medium | Add `loading="eager"` to the About photo | It's likely above the fold on most viewports. |
| Medium | Add a hover lift to service cards | Currently only border color changes. A subtle `translateY(-4px)` or shadow increase would feel more premium. |
| Medium | Add `aria-label` to the logo link when on a sub-page | The logo is always "Rabia Gul." — on the blog, it should say "Rabia Gul — back to home". |
| Low | Add a subtle page-transition for internal navigation | Currently Astro does a full page reload. A tiny fade-in on `astro:after-swap` (or `View Transitions` if upgrading to Astro's native transitions) would feel smoother. |
| Low | Add keyboard shortcut hint | e.g., Press `?` to show a help modal with shortcuts. Not critical for a portfolio. |

### 3.4 SEO & Structured Data

| Priority | Improvement | How |
|----------|-------------|-----|
| High | Add `image` to `Person` JSON-LD | Use the real profile photo URL. |
| High | Add `aggregateRating` to `ProfessionalService` JSON-LD | Use the Fiverr rating/review count. |
| Medium | Add `potentialAction` (SearchAction) to `WebSite` JSON-LD | Enables Google Sitelinks search box. |
| Medium | Add `contactPoint` JSON-LD | Email, WhatsApp, and booking URL as `ContactPoint`. |
| Medium | Add `hasOfferCatalog` for pricing tiers | Structured data for the three packages. |
| Low | Add `publisher` and `logo` to `BlogPosting` JSON-LD | Reinforces authorship. |

### 3.5 Blog Enhancements

| Priority | Improvement | How |
|----------|-------------|-----|
| High | Reading time estimate | Add a `readingTime` helper and display it on blog cards and post headers. |
| High | Previous / Next post navigation | Add links at the bottom of each post to keep readers engaged. |
| Medium | Table of contents (TOC) | Auto-generated from `h2`/`h3` tags on long posts. |
| Medium | Related posts | Match by tags or date. |
| Medium | Tag filter on `/blog` | A simple client-side filter or dedicated tag pages. |
| Low | RSS `<enclosure>` or `<media:content>` for cover images | If blog posts get cover images later. |

### 3.6 Analytics & Tracking

| Priority | Tool | Notes |
|----------|------|-------|
| High | Google Analytics 4 or Plausible | You need to know if the site is converting. Plausible is privacy-friendly and lightweight. |
| Medium | Google Search Console | Verify the domain and submit the sitemap. |
| Medium | UTM parameter tracking on Fiverr link | Use `?utm_source=portfolio&utm_medium=website&utm_campaign=testimonials` to track referral traffic. |

### 3.7 Content Strategy

| Priority | Suggestion | Notes |
|----------|------------|-------|
| High | Add a "Process" or "How I work" section | Clients want to know what working with you looks like (discovery → build → launch → support). |
| Medium | Add a "Tools & Stack" section | Logos of Shopify, Klaviyo, GA4, etc. build trust. |
| Medium | Add client logos to the hero or a dedicated trust bar | Currently logos are in a small trust bar under the hero. Consider making them more prominent. |
| Low | Add a FAQ section | Addresses common objections ("How long does a migration take?", "Do you offer ongoing support?"). |

---

## 4. Quick-Win Action Plan (Priority Order)

### Phase 1 — Launch Blockers (Do First)
1. Replace all placeholder content in `src/data/site.ts`.
2. Replace all placeholder images in `public/`.
3. Set a real `web3formsKey`.
4. Set real `bookingUrl`, `socials`, and `fiverr.profileUrl`.
5. Fix the 404 `robots` meta conflict in `BaseLayout.astro`.
6. Add `tabindex="-1"` to `<main id="main-content">` in `BaseLayout.astro`.
7. Remove committed `.DS_Store`, `.astro`, and `.claude` files from git.
8. Add `output: 'static'` to `astro.config.mjs`.

### Phase 2 — Quality & Polish (Do Before Marketing)
9. Fix RSS trailing-slash consistency (`trailingSlash` config).
10. Add security headers to `netlify.toml` (or `vercel.json`).
11. Improve mobile drawer ARIA (`role="dialog"`, `aria-modal`, focus trap).
12. Add `replyto` logic to the contact form.
13. Add reading time and prev/next navigation to blog posts.
14. Use Astro `<Image>` for at least the case-study and about photos.
15. Add `astro check` and a basic lint script to `package.json`.

### Phase 3 — Growth & Optimization (Do After Launch)
16. Add analytics (Plausible or GA4).
17. Add Google Search Console verification.
18. Implement blog tag pages and a search index.
19. Add JSON-LD enhancements (`image`, `aggregateRating`, `contactPoint`, `potentialAction`).
20. Run Lighthouse and fix any remaining issues (CLS, LCP, TBT).

---

## 5. Summary Score

| Category | Score | Notes |
|----------|-------|-------|
| **Content Readiness** | 2/10 | 100% placeholder content. |
| **Code Quality** | 7/10 | Clean Astro + Tailwind. Good component isolation. Missing linting & image pipeline. |
| **SEO** | 5/10 | Good foundation (JSON-LD, sitemap, OG tags) but has a robots-tag bug and missing article metadata. |
| **Accessibility** | 6/10 | Skip link, focus-visible, reduced-motion support, SR-only labels. Missing focus trap and skip-link target. |
| **Performance** | 5/10 | Lenis + GSAP are well-integrated, but no image optimization, no preconnect hints, and no Astro Image. |
| **Security** | 4/10 | No CSP, no security headers, form relies on third-party endpoint without validation. |
| **Deployment** | 7/10 | Netlify + Vercel configs present. Build works. Missing redirect/security headers. |

**Overall:** A solid technical foundation with a premium aesthetic and good animation engineering, but **not launch-ready** due to placeholder content and a few meta-tag / accessibility bugs.

---

*End of audit.*
