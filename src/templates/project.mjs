export function caseStudyPage(project, contentHtml) {
  return `
  <article class="section container">
    <div class="prose">
      <span class="eyebrow">Case Study</span>
      <h1>${project.title}</h1>
      <p class="post-meta">${project.role}${project.dateDisplay ? " · " + project.dateDisplay : ""}</p>
      <div class="card__tags" style="margin-bottom:2rem;">${project.tech.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
      ${contentHtml}
    </div>
    <p style="max-width:720px; margin:2rem auto 0;"><a href="/projects.html" class="btn btn--sm">← Back to all projects</a></p>
  </article>
  `;
}
