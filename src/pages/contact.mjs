import { site } from "../site.config.mjs";

export function contactPage() {
  return `
  <section class="section container">
    <span class="eyebrow">Contact</span>
    <h1>Let's build something together</h1>
    <p style="max-width:640px; font-size:1.1rem;">Have a project in mind or want to collaborate? Send a message or reach out directly.</p>

    <div class="grid grid--contact">
      <div class="card reveal">
        <h3>Send a message</h3>
        <form id="contactForm" class="form" data-service-id="${site.emailjs.serviceId}" data-template-id="${site.emailjs.templateId}">
          <div>
            <label for="from_name">Your name</label>
            <input id="from_name" type="text" name="from_name" placeholder="John Doe" required>
          </div>
          <div>
            <label for="reply_to">Your email</label>
            <input id="reply_to" type="email" name="reply_to" placeholder="john@example.com" required>
          </div>
          <div>
            <label for="message">Your message</label>
            <textarea id="message" name="message" rows="5" placeholder="Tell me about your project..." required></textarea>
          </div>
          <!-- honeypot field, hidden from real users -->
          <div class="visually-hidden" aria-hidden="true">
            <label for="company">Company</label>
            <input id="company" type="text" name="company" tabindex="-1" autocomplete="off">
          </div>
          <button type="submit" class="btn btn--coral">
            <span id="submitText">Send Message</span>
            <span id="loadingText" class="visually-hidden">Sending…</span>
          </button>
          <p id="formMessage" class="visually-hidden" role="status"></p>
        </form>
      </div>

      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        <div class="card reveal">
          <h3>Contact info</h3>
          <p><strong>Email</strong><br>${site.email}</p>
          <p><strong>WhatsApp</strong><br>+91 70690 17730</p>
          <p style="margin:0;"><strong>Location</strong><br>${site.location}</p>
        </div>
        <div class="card reveal">
          <h3>Connect</h3>
          <div style="display:flex; gap:0.75rem;">
            <a href="${site.social.github}" class="btn btn--sm" target="_blank" rel="noopener">GitHub</a>
            <a href="${site.social.linkedin}" class="btn btn--sm" target="_blank" rel="noopener">LinkedIn</a>
            <a href="${site.social.twitter}" class="btn btn--sm" target="_blank" rel="noopener">Twitter</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}
