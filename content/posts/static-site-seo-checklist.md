---
title: The SEO Checklist I Use for Every Static Site
description: A practical SEO checklist for static HTML/CSS/JS sites — meta tags, structured data, sitemaps, and performance basics that actually move rankings.
date: 2026-05-15
tags: [SEO, Web]
cover: /assets/img/content-placeholder.png
---

Static sites can rank just as well as anything running a full CMS — the difference is almost entirely in the details. Here's the checklist I run through on every project.

## Per-page basics

- Unique `<title>` and `<meta name="description">` for every page — no duplicated defaults.
- A `<link rel="canonical">` on every page, even ones that look obviously unique.
- Open Graph and Twitter Card tags so links look right when shared.

## Structured data

Adding JSON-LD for `Person`, `WebSite`, and `BlogPosting` costs a few minutes and gives crawlers unambiguous signals about what the page is and who wrote it.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post title",
  "datePublished": "2026-05-15"
}
</script>
```

## Sitemap and robots.txt

A generated `sitemap.xml` and a `robots.txt` pointing at it are non-negotiable — don't hand-maintain either one, generate them from the same data that builds your pages so they can't drift out of sync.

## Performance is an SEO lever too

Self-host your fonts with `font-display: swap`, size your images, and avoid render-blocking third-party scripts in the `<head>`. Core Web Vitals are a ranking factor, not just a nice-to-have.
