import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const checks = [
  ['JSON-LD', 'application/ld+json'],
  ['title', 'Shopify Expert'],
  ['skip link', 'Skip to content'],
  ['hero CTA', 'View work'],
  ['marquee', 'aria-label="Expertise"'],
  ['services', 'id="services"'],
  ['work', 'id="work"'],
  ['stats', 'Stores launched'],
  ['about', 'id="about"'],
  ['testimonials', 'id="testimonials"'],
  ['pricing', 'id="pricing"'],
  ['testimonial card', '<figure'],
  ['testimonial quote', '<blockquote'],
  ['contact form', 'id="contact-form"'],
  ['web3forms', 'api.web3forms.com'],
  ['form labels', 'for="field-email"'],
  ['whatsapp', 'wa.me/923482351478'],
  ['footer', '©'],
  ['og image', 'og:image'],
  ['blog section', 'id="blog"'],
  ['manifest', 'site.webmanifest'],
  ['robots meta', 'max-image-preview'],
];
let failed = 0;
for (const [name, needle] of checks) {
  if (!html.includes(needle)) { console.error('MISSING:', name); failed++; }
}

// File existence checks
const distFiles = [
  ['dist/rss.xml', new URL('../dist/rss.xml', import.meta.url)],
  ['dist/404.html', new URL('../dist/404.html', import.meta.url)],
  ['dist/site.webmanifest', new URL('../dist/site.webmanifest', import.meta.url)],
  ['dist/sitemap-index.xml', new URL('../dist/sitemap-index.xml', import.meta.url)],
];
for (const [name, url] of distFiles) {
  if (!existsSync(url)) { console.error('MISSING FILE:', name); failed++; }
}

if (failed) { console.error(`${failed} check(s) failed`); process.exit(1); }
console.log(`All ${checks.length} smoke checks + ${distFiles.length} file checks passed`);
