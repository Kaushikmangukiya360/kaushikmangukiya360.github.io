import { aboutStats, timeline } from "../data.mjs";

export function aboutPage() {
  const statsHtml = aboutStats
    .map(
      (s) => `
    <div class="card text-center reveal">
      <div class="card__icon">${s.icon}</div>
      <h3 style="font-size:1rem;">${s.label}</h3>
      <p style="margin:0;">${s.value}</p>
    </div>`
    )
    .join("\n");

  const timelineHtml = timeline
    .map(
      (t) => `
    <div class="timeline-item reveal">
      <div class="timeline-item__badge">${t.range}</div>
      <div class="timeline-item__card">
        <h3>${t.icon} ${t.title}</h3>
        <p>${t.description}</p>
        <div class="card__tags">${t.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}</div>
      </div>
    </div>`
    )
    .join("\n");

  return `
  <section class="section container">
    <span class="eyebrow">About Me</span>
    <h1>Building intelligent systems that solve real problems</h1>
    <p style="max-width:640px; font-size:1.1rem;">I'm a senior AI developer crafting intuitive, impactful digital products — passionate about agentic AI, automation, and full-stack platforms that scale businesses.</p>
    <div class="grid" style="margin-top:2.5rem;">${statsHtml}</div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <span class="eyebrow">Journey</span>
      <h2 class="mb-lg">Experience timeline</h2>
      <div class="timeline">${timelineHtml}</div>
    </div>
  </section>

  <section class="section section--blue">
    <div class="container text-center">
      <h2>Want to work together?</h2>
      <a href="/contact.html" class="btn btn--yellow">Let's talk →</a>
    </div>
  </section>
  `;
}
