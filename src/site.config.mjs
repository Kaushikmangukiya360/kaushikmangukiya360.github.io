export const site = {
  name: "Kaushik Mangukiya",
  title: "Kaushik Mangukiya — AI Developer",
  tagline: "Building smart systems with Python, GenAI & AI automation.",
  description:
    "Kaushik Mangukiya is an AI developer and founder of Vicurs, building AI automation, GenAI solutions, and full-stack platforms for clients worldwide.",
  url: "https://kaushikmangukiya360.github.io",
  email: "kaushikmangukiya70@gmail.com",
  whatsapp: "917069017730",
  location: "Surat, Gujarat, India",
  calendly: "https://calendly.com/kaushikmangukiya/15-minute-talks",
  social: {
    github: "https://github.com/Kaushikmangukiya360",
    linkedin: "https://www.linkedin.com/in/kaushik-mangukiya/",
    twitter: "https://x.com/KaushikMangukia",
  },
  newsletter: {
    // Replace YOUR_USERNAME with the Buttondown username once the account is created.
    action: "https://buttondown.com/api/emails/embed-subscribe/YOUR_USERNAME",
  },
  emailjs: {
    initKey: "TIa7FVN7_GKXxUXxL",
    serviceId: "service_mu3ilrj",
    templateId: "template_zseybfw",
  },
  repo: {
    owner: "Kaushikmangukiya360",
    name: "kaushikmangukiya360.github.io",
    branch: "main",
    postsPath: "content/posts",
    projectsPath: "content/projects",
  },
  // Simple admin login gate — NOT real security (this is public JS, viewable by anyone).
  // Actual write-access is still protected by the GitHub token entered after login.
  // To change the username/password, compute sha256("username:password") and paste the hex below.
  // e.g. in a browser console: crypto.subtle.digest('SHA-256', new TextEncoder().encode('username:password'))
  adminAuth: {
    username: "kaushik",
    // Default password is "changeme123" — change this before relying on it.
    passwordHash: "44f3e82b64d9abba2382d6245efcc5d0f44cae8ac34c0f9845dcc0fce568d89a",
  },
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about.html", label: "About" },
  { href: "/projects.html", label: "Projects" },
  { href: "/blog/", label: "Blog" },
  { href: "/contact.html", label: "Contact" },
];
