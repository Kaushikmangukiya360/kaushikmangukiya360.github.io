import { site } from "../site.config.mjs";

export function footer() {
  const year = "2026";
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <div>
          <div class="nav__brand">Kaushik Mangukiya</div>
          <p>${site.tagline}</p>
        </div>
        <div class="footer__social">
          <a href="${site.social.github}" aria-label="GitHub" target="_blank" rel="noopener">GH</a>
          <a href="${site.social.linkedin}" aria-label="LinkedIn" target="_blank" rel="noopener">in</a>
          <a href="${site.social.twitter}" aria-label="Twitter" target="_blank" rel="noopener">X</a>
          <a href="mailto:${site.email}" aria-label="Email">@</a>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© ${year} Kaushik Mangukiya. All rights reserved.</span>
        <a href="/resume.pdf">Download Resume</a>
      </div>
    </div>
  </footer>

  <a href="https://wa.me/${site.whatsapp}?text=Hello%20Kaushik!%20I%20would%20like%20to%20discuss%20a%20project."
     class="float-btn" target="_blank" rel="noopener" title="Chat on WhatsApp" aria-label="Chat on WhatsApp">💬</a>

  <div class="modal-backdrop" id="modal">
    <div class="modal">
      <h3>Schedule a meeting</h3>
      <p>Pick your preferred way to connect.</p>
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <a href="${site.calendly}" target="_blank" rel="noopener" class="btn btn--coral">📅 Book via Calendly</a>
        <a href="/contact.html" class="btn">✉️ Send a message</a>
        <button type="button" class="btn btn--sm" data-close-modal>Close</button>
      </div>
    </div>
  </div>`;
}
