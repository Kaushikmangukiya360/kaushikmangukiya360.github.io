import { nav } from "../site.config.mjs";

export function header(currentPath) {
  const links = nav
    .map((item) => {
      const isCurrent =
        item.href === currentPath ||
        (item.href === "/blog/" && currentPath.startsWith("/blog/"));
      return `<a href="${item.href}"${isCurrent ? ' aria-current="page"' : ""}>${item.label}</a>`;
    })
    .join("\n");

  return `
  <header class="nav">
    <div class="nav__inner">
      <a href="/" class="nav__brand">Kaushik Mangukiya</a>
      <nav class="nav__links" aria-label="Primary">
        ${links}
      </nav>
      <div class="nav__actions">
        <button class="theme-toggle" type="button" aria-label="Toggle dark mode">🌙</button>
        <button class="nav__toggle" type="button" aria-label="Toggle menu">☰</button>
      </div>
    </div>
  </header>`;
}
