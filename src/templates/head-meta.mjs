import { site } from "../site.config.mjs";

export function headMeta({
  title,
  description,
  path = "/",
  image = "/assets/img/og-default.png",
  type = "website",
  jsonLd = null,
  noindex = false,
}) {
  const url = new URL(path, site.url).toString();
  const imageUrl = new URL(image, site.url).toString();
  const fullTitle = title ? `${title} — ${site.name}` : site.title;

  return `
    <title>${fullTitle}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">
    ${noindex ? '<meta name="robots" content="noindex, nofollow">' : ""}

    <meta property="og:type" content="${type}">
    <meta property="og:title" content="${fullTitle}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:site_name" content="${site.name}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${fullTitle}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">

    <meta name="theme-color" content="#ff5a3c">
    <link rel="icon" href="/favicon.ico">
    <link rel="manifest" href="/site.webmanifest">
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
  `;
}
