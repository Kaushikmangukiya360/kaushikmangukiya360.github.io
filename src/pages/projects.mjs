import { searchBox } from "../templates/search.mjs";

export function projectsPage(projects) {
  const projectsHtml = projects
    .map(
      (p) => `
    <a href="/projects/${p.slug}/" class="card reveal" style="display:block;" data-search="${(p.title + " " + p.description + " " + p.tech.join(" ")).toLowerCase()}">
      <img class="card__img" src="${p.cover}" alt="${p.title} preview" width="800" height="500" loading="lazy">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="card__tags">${p.tech.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
      <p style="margin-top:1rem; margin-bottom:0;"><span class="btn btn--sm">View Case Study →</span></p>
    </a>`
    )
    .join("\n");

  return `
  <section class="section container">
    <span class="eyebrow">Portfolio</span>
    <h1>Projects &amp; case studies</h1>
    <p style="max-width:640px; font-size:1.1rem;">A selection of work combining AI, automation, and full-stack development.</p>
    ${searchBox({ placeholder: "Search projects by name, tech, or keyword…", target: "#projectsGrid" })}
    <div id="projectsGrid" class="grid" style="margin-top:2rem;">${projectsHtml}</div>
    <p data-no-results class="post-meta" style="display:none; margin-top:2rem;">No projects match your search.</p>
  </section>

  <section class="section section--yellow">
    <div class="container text-center">
      <h2>Got a project idea?</h2>
      <a href="/contact.html" class="btn">Start the conversation →</a>
    </div>
  </section>
  `;
}
