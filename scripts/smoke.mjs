import { readFileSync } from 'node:fs';
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
];
let failed = 0;
for (const [name, needle] of checks) {
  if (!html.includes(needle)) { console.error('MISSING:', name); failed++; }
}
if (failed) { console.error(`${failed} check(s) failed`); process.exit(1); }
console.log(`All ${checks.length} smoke checks passed`);
