import { headMeta } from "./head-meta.mjs";
import { header } from "./header.mjs";
import { footer } from "./footer.mjs";
import { site } from "../site.config.mjs";

const THEME_INIT_SCRIPT = `
(function(){
  var saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();`;

export function baseLayout({
  path,
  title,
  description,
  image,
  type,
  jsonLd,
  body,
  extraHead = "",
  extraScripts = "",
  noindex = false,
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>${THEME_INIT_SCRIPT}</script>
${headMeta({ title, description, path, image, type, jsonLd, noindex })}
<link rel="stylesheet" href="/assets/css/site.css">
${extraHead}
</head>
<body>
${header(path)}
<main>
${body}
</main>
${footer()}
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script>(function(){ emailjs.init("${site.emailjs.initKey}"); })();</script>
<script src="/assets/js/main.js"></script>
${extraScripts}
</body>
</html>`;
}
