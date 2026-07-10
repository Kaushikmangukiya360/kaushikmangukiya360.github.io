import { site } from "../site.config.mjs";

export function newsletterBand() {
  return `
  <div class="newsletter reveal">
    <div>
      <h3 style="margin-bottom:0.25rem;">Get new posts in your inbox</h3>
      <p style="color:#141414; margin:0;">No spam — just AI/dev notes, occasionally.</p>
    </div>
    <form action="${site.newsletter.action}" method="post" target="popupwindow"
          onsubmit="window.open('${site.newsletter.action}', 'popupwindow')">
      <label class="visually-hidden" for="bd-email">Email address</label>
      <input id="bd-email" type="email" name="email" placeholder="you@example.com" required>
      <button type="submit" class="btn btn--blue">Subscribe</button>
    </form>
    <p class="newsletter-status visually-hidden" role="status"></p>
  </div>`;
}
