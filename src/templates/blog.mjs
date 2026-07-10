import { newsletterBand } from "./newsletter.mjs";
import { searchBox } from "./search.mjs";

export function blogIndexPage(posts) {
  const cardsHtml = posts
    .map(
      (p) => `
    <a href="/blog/${p.slug}/" class="card reveal" style="display:block;" data-search="${(p.title + " " + p.description + " " + p.tags.join(" ")).toLowerCase()}">
      <img class="card__img" src="${p.cover}" alt="" width="800" height="500" loading="lazy">
      <span class="post-meta" style="margin-bottom:0.5rem; display:block;">${p.dateDisplay}</span>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="card__tags">${p.tags.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
    </a>`
    )
    .join("\n");

  return `
  <section class="section container">
    <span class="eyebrow">Blog</span>
    <h1>Notes on AI, automation &amp; building software</h1>
    ${searchBox({ placeholder: "Search posts by title, topic, or tag…", target: "#postsGrid" })}
    <div id="postsGrid" class="grid" style="margin-top:2rem;">${cardsHtml || "<p>No posts yet — check back soon.</p>"}</div>
    <p data-no-results class="post-meta" style="display:none; margin-top:2rem;">No posts match your search.</p>
  </section>
  <section class="section section--alt">
    <div class="container">${newsletterBand()}</div>
  </section>
  `;
}

export function blogPostPage(post, contentHtml) {
  return `
  <article class="section container">
    <div class="prose">
      <span class="eyebrow">${post.tags[0] || "Blog"}</span>
      <h1>${post.title}</h1>
      <p class="post-meta">${post.dateDisplay}${post.tags.length ? " · " + post.tags.join(", ") : ""}</p>
      ${contentHtml}
    </div>
    <div style="max-width:720px; margin: 3rem auto 0;">
      ${newsletterBand()}
    </div>
    <p style="max-width:720px; margin:2rem auto 0;"><a href="/blog/" class="btn btn--sm">← Back to all posts</a></p>
  </article>
  `;
}
