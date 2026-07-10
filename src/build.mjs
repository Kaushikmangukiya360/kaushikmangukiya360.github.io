import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

import { site } from "./site.config.mjs";
import { baseLayout } from "./templates/base.mjs";
import { homePage } from "./pages/home.mjs";
import { aboutPage } from "./pages/about.mjs";
import { projectsPage } from "./pages/projects.mjs";
import { contactPage } from "./pages/contact.mjs";
import { blogIndexPage, blogPostPage } from "./templates/blog.mjs";
import { caseStudyPage } from "./templates/project.mjs";
import { adminPage } from "./pages/admin.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "dist");
const POSTS_DIR = path.join(ROOT, "content/posts");
const PROJECTS_DIR = path.join(ROOT, "content/projects");

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch {
        /* fall through to default escaping */
      }
    }
    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

function write(relPath, html) {
  const dest = path.join(OUT, relPath);
  mkdirSync(path.dirname(dest), { recursive: true });
  writeFileSync(dest, html);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function loadPosts() {
  if (!existsSync(POSTS_DIR)) return [];
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.md$/, "");
      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        dateDisplay: formatDate(data.date),
        tags: data.tags || [],
        cover: data.cover || "/assets/img/og-default.png",
        draft: Boolean(data.draft),
        content,
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function loadProjects() {
  if (!existsSync(PROJECTS_DIR)) return [];
  return readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = readFileSync(path.join(PROJECTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.md$/, "");
      return {
        slug,
        title: data.title,
        description: data.description,
        tech: data.tech || [],
        role: data.role || "",
        date: data.date,
        dateDisplay: data.date ? formatDate(data.date) : "",
        cover: data.cover || "/assets/img/project-placeholder.png",
        featured: Boolean(data.featured),
        order: data.order ?? 999,
        draft: Boolean(data.draft),
        content,
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => a.order - b.order);
}

function buildStaticPages(projects) {
  const pages = [
    { path: "/", relPath: "index.html", title: null, description: site.description, body: homePage(projects),
      jsonLd: { "@context": "https://schema.org", "@type": "Person", name: site.name, url: site.url, jobTitle: "AI Developer", sameAs: Object.values(site.social) } },
    { path: "/about.html", relPath: "about.html", title: "About", description: "AI developer, founder of Vicurs, building agentic AI and full-stack platforms.", body: aboutPage() },
    { path: "/projects.html", relPath: "projects.html", title: "Projects", description: "Selected AI, automation, and full-stack projects by Kaushik Mangukiya.", body: projectsPage(projects) },
    { path: "/contact.html", relPath: "contact.html", title: "Contact", description: "Get in touch with Kaushik Mangukiya for AI, automation, and web development projects.", body: contactPage() },
  ];

  for (const p of pages) {
    write(p.relPath, baseLayout({ path: p.path, title: p.title, description: p.description, body: p.body, jsonLd: p.jsonLd }));
  }
}

function buildProjectCaseStudies(projects) {
  for (const project of projects) {
    const contentHtml = md.render(project.content);
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      creator: { "@type": "Person", name: site.name, url: site.url },
      image: new URL(project.cover, site.url).toString(),
      keywords: project.tech.join(", "),
    };
    write(
      `projects/${project.slug}/index.html`,
      baseLayout({
        path: `/projects/${project.slug}/`,
        title: `${project.title} — Case Study`,
        description: project.description,
        image: project.cover,
        type: "article",
        jsonLd,
        body: caseStudyPage(project, contentHtml),
      })
    );
  }
}

function buildBlog(posts) {
  write(
    "blog/index.html",
    baseLayout({
      path: "/blog/",
      title: "Blog",
      description: "AI, automation, and software engineering notes from Kaushik Mangukiya.",
      body: blogIndexPage(posts),
    })
  );

  for (const post of posts) {
    const contentHtml = md.render(post.content);
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: { "@type": "Person", name: site.name, url: site.url },
      image: new URL(post.cover, site.url).toString(),
    };
    write(
      `blog/${post.slug}/index.html`,
      baseLayout({
        path: `/blog/${post.slug}/`,
        title: post.title,
        description: post.description,
        image: post.cover,
        type: "article",
        jsonLd,
        body: blogPostPage(post, contentHtml),
      })
    );
  }
}

function buildSitemap(posts, projects) {
  const staticPaths = ["/", "/about.html", "/projects.html", "/blog/", "/contact.html"];
  const postPaths = posts.map((p) => `/blog/${p.slug}/`);
  const projectPaths = projects.map((p) => `/projects/${p.slug}/`);
  const urls = [...staticPaths, ...postPaths, ...projectPaths]
    .map((p) => `  <url><loc>${new URL(p, site.url).toString()}</loc></url>`)
    .join("\n");
  write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}

function buildRobots() {
  write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${site.url}/sitemap.xml\n`);
}

function buildAdmin() {
  const configScript = `<script>window.ADMIN_CONFIG = ${JSON.stringify({ ...site.repo, adminAuth: site.adminAuth })};</script>`;
  write(
    "admin/index.html",
    baseLayout({
      path: "/admin/",
      title: "Admin",
      description: "Content manager.",
      noindex: true,
      extraHead: configScript,
      extraScripts: '<script src="/assets/js/admin.js"></script>',
      body: adminPage(),
    })
  );
}

function build404() {
  write(
    "404.html",
    baseLayout({
      path: "/404.html",
      title: "Page not found",
      description: "The page you're looking for doesn't exist.",
      body: `<section class="section container text-center"><h1>404</h1><p>That page doesn't exist.</p><a href="/" class="btn btn--coral">Back home</a></section>`,
    })
  );
}

function buildManifest() {
  write(
    "site.webmanifest",
    JSON.stringify(
      {
        name: site.name,
        short_name: "Kaushik",
        start_url: "/",
        display: "standalone",
        background_color: "#fbfaf7",
        theme_color: "#ff5a3c",
      },
      null,
      2
    )
  );
}

function copyStaticAssets() {
  cpSync(path.join(ROOT, "assets"), path.join(OUT, "assets"), { recursive: true, filter: (src) => !src.endsWith(".DS_Store") });
  for (const file of ["resume.pdf", "favicon.ico"]) {
    const src = path.join(ROOT, file);
    if (existsSync(src)) cpSync(src, path.join(OUT, file));
  }
  writeFileSync(path.join(OUT, ".nojekyll"), "");
}

function main() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const posts = loadPosts();
  const projects = loadProjects();
  buildStaticPages(projects);
  buildBlog(posts);
  buildProjectCaseStudies(projects);
  buildSitemap(posts, projects);
  buildRobots();
  build404();
  buildManifest();
  buildAdmin();
  copyStaticAssets();

  console.log(
    `Built ${4 + posts.length + 1} pages (${posts.length} posts, ${projects.length} case studies) to ${path.relative(ROOT, OUT)}/`
  );
}

main();
