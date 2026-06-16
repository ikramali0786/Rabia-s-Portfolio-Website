---
title: "7 Ways to Speed Up Your Shopify Store (and Why It Matters)"
description: "Slow stores lose sales. Here are seven proven techniques to cut load times, improve Core Web Vitals, and turn browsers into buyers."
date: "2026-03-15"
tags: ["Speed", "Performance", "Core Web Vitals", "Shopify"]
draft: false
---

A one-second delay in page load time can reduce conversions by up to 7%. For a store doing $10,000 a month, that's $700 left on the table every single month. Speed isn't a nice-to-have — it's a revenue lever.

After auditing and optimising dozens of Shopify stores, I've found the same culprits coming up time and again. Here are seven things you can do right now to make your store meaningfully faster.

## 1. Audit Your Apps — Then Delete Half of Them

Every Shopify app that loads on the storefront adds JavaScript and CSS. Most merchants accumulate apps over years without ever removing the ones they stopped using. Run a Lighthouse audit and look at the waterfall — you'll often find scripts from apps you uninstalled months ago still firing on every page.

Go to your theme code and search for `{% render %}` calls that reference apps you no longer use. Delete them. Then check your theme's `layout/theme.liquid` for leftover `<script>` and `<link>` tags.

## 2. Compress and Lazy-Load Every Image

Shopify's CDN is fast, but you still need to serve the right image at the right size. Use `image_url` with the `width` parameter to serve appropriately sized images, and always add `loading="lazy"` to images below the fold.

- Use WebP format where possible (Shopify supports it via `| image_url: format: 'webp'`)
- Set explicit `width` and `height` attributes to prevent layout shift
- Only the hero/above-the-fold image should be `loading="eager"`

## 3. Defer Non-Critical JavaScript

By default, many theme scripts block rendering. Move scripts to the bottom of `layout/theme.liquid` and add `defer` or `async` attributes. For third-party scripts like chat widgets, load them only after the page is interactive using an `IntersectionObserver` or a short timeout.

```liquid
<script src="{{ 'theme.js' | asset_url }}" defer></script>
```

## 4. Minimise Render-Blocking CSS

Inline critical CSS (the styles needed for above-the-fold content) directly in `<head>`, and load the rest asynchronously. Tools like Critical or PurgeCSS can help identify and extract what's truly critical.

## 5. Use Shopify's Built-in Speed Features

- Enable **Predictive Prefetch** via `<link rel="prefetch">` on product links
- Use **Section Rendering API** for dynamic updates instead of full page reloads
- Leverage `{% preload %}` for fonts and critical assets in Shopify 2.0 themes

## 6. Reduce Liquid Render Time

Complex Liquid logic, especially nested `for` loops hitting metafields or large collections, slows down Time to First Byte (TTFB). Cache expensive calculations in Liquid variables, reduce the number of sections that render on every page, and avoid fetching full collections when you only need a handful of products.

## 7. Monitor Continuously, Not Just Once

Speed improvements decay over time as new apps are added and themes are updated. Set up a monthly Lighthouse audit, track your Core Web Vitals in Google Search Console, and add a budget check to your CI/CD pipeline if you're on a headless stack.

Speed is an ongoing discipline, not a one-time fix. The stores that stay fast are the ones with a process for catching regressions early.

---

Need a speed audit for your Shopify store? [Get in touch](/&#35;contact) and I'll tell you exactly where you're losing time — and revenue.
