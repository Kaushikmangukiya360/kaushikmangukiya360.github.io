import { site } from "../site.config.mjs";
import { techStack, pricing } from "../data.mjs";
import { newsletterBand } from "../templates/newsletter.mjs";

export function homePage(projects) {
  const featured = projects.filter((p) => p.featured);

  const tagsHtml = `
    <span class="chip">Python</span>
    <span class="chip">GenAI</span>
    <span class="chip">AI Automation</span>
    <span class="chip">WordPress</span>
    <span class="chip">Shopify</span>`;

  const techHtml = techStack
    .map((t) => `<div class="card text-center"><div class="card__icon">${t.icon}</div><p style="font-weight:700; margin:0;">${t.label}</p></div>`)
    .join("\n");

  const projectsHtml = featured
    .map(
      (p) => `
    <a href="/projects/${p.slug}/" class="card reveal" style="display:block;">
      <img class="card__img" src="${p.cover}" alt="${p.title} preview" width="800" height="500" loading="lazy">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="card__tags">${p.tech.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
      <p style="margin-top:1rem; margin-bottom:0;"><span class="btn btn--sm">View Case Study →</span></p>
    </a>`
    )
    .join("\n");

  const pricingHtml = pricing
    .map(
      (tier) => `
    <div class="pricing-card${tier.featured ? " pricing-card--featured" : ""} reveal">
      ${tier.featured ? '<span class="pricing-card__badge">Popular</span>' : ""}
      <h3>${tier.name}</h3>
      <div class="pricing-card__price">${tier.price}</div>
      <p style="${tier.featured ? "color:#fff;" : ""}">${tier.description}</p>
      <button type="button" class="btn${tier.featured ? "" : " btn--coral"}" data-open-modal>${tier.cta}</button>
    </div>`
    )
    .join("\n");

  return `
  <section class="hero container">
    <div class="reveal">
      <span class="hero__tags">${tagsHtml}</span>
      <h1>Hello 👋 I'm <span style="color:var(--coral)">Kaushik Mangukiya</span></h1>
      <p style="font-size:1.15rem;">${site.tagline} I create automation and GenAI solutions that scale businesses.</p>
      <div class="hero__actions">
        <a href="/projects.html" class="btn btn--coral">View Projects</a>
        <button type="button" class="btn" data-open-modal>Book a Meeting</button>
      </div>
    </div>
    <div class="hero__portrait reveal">
      <img src="/assets/img/profile.png" alt="Portrait of Kaushik Mangukiya" width="380" height="475">
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <span class="eyebrow">About</span>
      <h2 class="mb-lg">Senior AI developer crafting intelligent digital products</h2>
      <p style="max-width:640px;">I'm passionate about building intelligent systems that solve real-world problems — from agentic AI workflows to full-stack platforms.</p>
      <p><a href="/about.html" class="btn btn--sm">More about me →</a></p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <span class="eyebrow">Tech Stack</span>
      <h2 class="mb-lg">Technologies I use to bring ideas to life</h2>
      <div class="grid">${techHtml}</div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <span class="eyebrow">Selected Work</span>
      <h2 class="mb-lg">Projects &amp; case studies</h2>
      <div class="grid">${projectsHtml}</div>
      <p style="margin-top:2rem;"><a href="/projects.html" class="btn">See all projects →</a></p>
    </div>
  </section>

  <section class="section section--yellow">
    <div class="container">
      <h2 class="mb-lg">Pricing plans</h2>
      <div class="grid">${pricingHtml}</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${newsletterBand()}
    </div>
  </section>

  <section class="section section--coral">
    <div class="container text-center">
      <h2>Have a project in mind?</h2>
      <p style="color:#141414;">Let's create something amazing together.</p>
      <a href="/contact.html" class="btn">Get in touch →</a>
    </div>
  </section>
  `;
}
