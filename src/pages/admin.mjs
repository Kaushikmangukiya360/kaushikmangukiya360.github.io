export function adminPage() {
  return `
  <section class="section container">
    <span class="eyebrow">Admin</span>
    <h1>Content Manager</h1>
    <p style="max-width:640px;">
      Create, edit, and delete blog posts and project case studies directly from the browser.
      Changes are committed straight to the <code>main</code> branch of this repo via the GitHub API,
      which automatically triggers a rebuild and redeploy.
    </p>

    <div class="card reveal" id="loginCard" style="max-width:420px; margin-bottom:2rem;">
      <h3>Log in</h3>
      <p style="margin-bottom:1rem;">
        Quick access gate for this admin page. Note: this is a convenience screen, not real security —
        the actual protection is the GitHub token you connect with below.
      </p>
      <form id="loginForm" class="form">
        <div>
          <label for="loginUsername">Username</label>
          <input id="loginUsername" type="text" autocomplete="username" required>
        </div>
        <div>
          <label for="loginPassword">Password</label>
          <input id="loginPassword" type="password" autocomplete="current-password" required>
        </div>
        <button type="submit" class="btn btn--coral">Log in</button>
        <p id="loginStatus" class="post-meta" style="margin:0;"></p>
      </form>
    </div>

    <div id="afterLogin" class="visually-hidden">
      <div class="card reveal" style="max-width:640px; margin-bottom:2rem;">
        <h3>Connect your GitHub account</h3>
        <p style="margin-bottom:1rem;">
          Paste a <strong>fine-grained Personal Access Token</strong> scoped only to this repository,
          with <strong>Contents: Read and write</strong> permission. Generate one at
          <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener" style="text-decoration:underline;">github.com/settings/personal-access-tokens/new</a>.
          The token is stored only in this browser's <code>localStorage</code> — it is never sent anywhere except
          <code>api.github.com</code>, and never committed to the repo.
        </p>
        <form id="tokenForm" class="form" style="flex-direction:row; flex-wrap:wrap; gap:0.75rem;">
          <input id="tokenInput" type="password" placeholder="github_pat_..." style="flex:1 1 260px;" autocomplete="off">
          <button type="submit" class="btn btn--coral">Connect</button>
          <button type="button" id="disconnectBtn" class="btn btn--sm">Disconnect</button>
        </form>
        <p id="authStatus" class="post-meta" style="margin-top:0.75rem; margin-bottom:0;">Not connected.</p>
        <button type="button" id="logoutBtn" class="btn btn--sm" style="margin-top:0.75rem;">Log out</button>
      </div>

      <div id="adminApp" class="visually-hidden">
      <div style="display:flex; gap:1rem; margin-bottom:2rem;">
        <button type="button" class="btn btn--sm" data-tab="posts">Blog Posts</button>
        <button type="button" class="btn btn--sm" data-tab="projects">Projects</button>
      </div>

      <div data-panel="posts">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h2 style="margin:0;">Blog posts</h2>
          <button type="button" class="btn btn--sm" data-new="post">+ New Post</button>
        </div>
        <div id="postsList" class="grid"></div>
      </div>

      <div data-panel="projects" class="visually-hidden">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h2 style="margin:0;">Projects</h2>
          <button type="button" class="btn btn--sm" data-new="project">+ New Project</button>
        </div>
        <div id="projectsList" class="grid"></div>
      </div>
      </div>
    </div>

    <div class="modal-backdrop" id="editorModal">
      <div class="modal" style="max-width:640px; max-height:85vh; overflow-y:auto;">
        <h3 id="editorTitle">New Post</h3>
        <form id="editorForm" class="form">
          <input type="hidden" id="f-path">
          <input type="hidden" id="f-sha">
          <input type="hidden" id="f-kind">
          <div>
            <label for="f-title">Title</label>
            <input id="f-title" type="text" required>
          </div>
          <div>
            <label for="f-description">Description</label>
            <textarea id="f-description" rows="2" required></textarea>
          </div>
          <div id="f-tagsRow">
            <label for="f-tags">Tags (comma-separated)</label>
            <input id="f-tags" type="text" placeholder="AI, Python">
          </div>
          <div id="f-techRow" class="visually-hidden">
            <label for="f-tech">Tech (comma-separated)</label>
            <input id="f-tech" type="text" placeholder="Python, React, AI">
          </div>
          <div id="f-roleRow" class="visually-hidden">
            <label for="f-role">Role</label>
            <input id="f-role" type="text" placeholder="Founder & Lead Developer">
          </div>
          <div>
            <label for="f-date">Date</label>
            <input id="f-date" type="date" required>
          </div>
          <div id="f-orderRow" class="visually-hidden">
            <label for="f-order">Sort order (lower = first)</label>
            <input id="f-order" type="number" value="10">
          </div>
          <div>
            <label for="f-cover">Cover image path</label>
            <input id="f-cover" type="text" value="/assets/img/content-placeholder.png">
          </div>
          <div style="display:flex; gap:1.5rem;">
            <label style="display:flex; align-items:center; gap:0.5rem; font-weight:600;">
              <input id="f-draft" type="checkbox" style="width:auto;"> Draft
            </label>
            <label id="f-featuredRow" class="visually-hidden" style="display:flex; align-items:center; gap:0.5rem; font-weight:600;">
              <input id="f-featured" type="checkbox" style="width:auto;"> Featured
            </label>
          </div>
          <div>
            <label for="f-body">Content (Markdown)</label>
            <textarea id="f-body" rows="12" required></textarea>
          </div>
          <div style="display:flex; gap:0.75rem;">
            <button type="submit" class="btn btn--coral">Save &amp; Commit</button>
            <button type="button" class="btn btn--sm" data-close-modal>Cancel</button>
            <button type="button" id="deleteBtn" class="btn btn--sm visually-hidden" style="margin-left:auto;">Delete</button>
          </div>
          <p id="editorStatus" class="post-meta" style="margin:0;"></p>
        </form>
      </div>
    </div>
  </section>
  `;
}
