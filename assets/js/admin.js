(function () {
  "use strict";

  var CFG = window.ADMIN_CONFIG;
  var API = "https://api.github.com";
  var TOKEN_KEY = "gh_admin_token";
  var LOGIN_KEY = "admin_logged_in";

  // ---------- login gate (convenience only — NOT real security; see admin.mjs note) ----------
  function sha256Hex(str) {
    var bytes = new TextEncoder().encode(str);
    return crypto.subtle.digest("SHA-256", bytes).then(function (buf) {
      return Array.prototype.map
        .call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, "0"); })
        .join("");
    });
  }

  var loginCard = document.getElementById("loginCard");
  var afterLogin = document.getElementById("afterLogin");
  var loginForm = document.getElementById("loginForm");
  var loginStatus = document.getElementById("loginStatus");
  var logoutBtn = document.getElementById("logoutBtn");

  function showLoggedIn(loggedIn) {
    loginCard.classList.toggle("visually-hidden", loggedIn);
    afterLogin.classList.toggle("visually-hidden", !loggedIn);
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var username = document.getElementById("loginUsername").value.trim();
    var password = document.getElementById("loginPassword").value;
    sha256Hex(username + ":" + password).then(function (hash) {
      if (username === CFG.adminAuth.username && hash === CFG.adminAuth.passwordHash) {
        sessionStorage.setItem(LOGIN_KEY, "1");
        loginStatus.textContent = "";
        showLoggedIn(true);
      } else {
        loginStatus.textContent = "Incorrect username or password.";
      }
    });
  });

  logoutBtn.addEventListener("click", function () {
    sessionStorage.removeItem(LOGIN_KEY);
    showLoggedIn(false);
  });

  showLoggedIn(sessionStorage.getItem(LOGIN_KEY) === "1");

  // ---------- utf8-safe base64 ----------
  function toBase64(str) {
    var bytes = new TextEncoder().encode(str);
    var binary = "";
    bytes.forEach(function (b) { binary += String.fromCharCode(b); });
    return btoa(binary);
  }
  function fromBase64(b64) {
    var binary = atob(b64.replace(/\n/g, ""));
    var bytes = Uint8Array.from(binary, function (c) { return c.charCodeAt(0); });
    return new TextDecoder().decode(bytes);
  }

  // ---------- minimal frontmatter parse/build (matches this site's generator) ----------
  function yamlStr(v) {
    return '"' + String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
  }
  function parseScalar(raw) {
    raw = raw.trim();
    if (raw.startsWith('"') && raw.endsWith('"')) {
      return raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }
    return raw;
  }
  function parseArray(raw) {
    raw = raw.trim().replace(/^\[/, "").replace(/\]$/, "");
    if (!raw.trim()) return [];
    return raw.split(",").map(function (s) { return parseScalar(s.trim()); });
  }
  function parseFrontmatter(raw) {
    var match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
    if (!match) return { data: {}, body: raw };
    var data = {};
    match[1].split(/\r?\n/).forEach(function (line) {
      var i = line.indexOf(":");
      if (i === -1) return;
      var key = line.slice(0, i).trim();
      var val = line.slice(i + 1).trim();
      if (val.startsWith("[")) data[key] = parseArray(val);
      else if (val === "true" || val === "false") data[key] = val === "true";
      else if (/^-?\d+$/.test(val)) data[key] = Number(val);
      else data[key] = parseScalar(val);
    });
    return { data: data, body: match[2] };
  }
  function buildFrontmatter(data) {
    var lines = ["---"];
    Object.keys(data).forEach(function (key) {
      var val = data[key];
      if (Array.isArray(val)) {
        lines.push(key + ": [" + val.map(yamlStr).join(", ") + "]");
      } else if (typeof val === "boolean" || typeof val === "number") {
        lines.push(key + ": " + val);
      } else {
        lines.push(key + ": " + yamlStr(val));
      }
    });
    lines.push("---");
    return lines.join("\n");
  }

  // ---------- GitHub API ----------
  function ghRequest(method, path, body) {
    var token = localStorage.getItem(TOKEN_KEY);
    return fetch(API + "/repos/" + CFG.owner + "/" + CFG.name + path, {
      method: method,
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (err) {
          throw new Error((err && err.message) || ("GitHub API error " + res.status));
        });
      }
      return res.status === 204 ? null : res.json();
    });
  }

  function listDir(dirPath) {
    return ghRequest("GET", "/contents/" + dirPath + "?ref=" + CFG.branch).catch(function (err) {
      if (String(err.message).indexOf("404") !== -1) return [];
      throw err;
    });
  }
  function getFile(filePath) {
    return ghRequest("GET", "/contents/" + filePath + "?ref=" + CFG.branch);
  }
  function putFile(filePath, content, message, sha) {
    return ghRequest("PUT", "/contents/" + filePath, {
      message: message,
      content: toBase64(content),
      branch: CFG.branch,
      sha: sha || undefined,
    });
  }
  function deleteFile(filePath, message, sha) {
    return ghRequest("DELETE", "/contents/" + filePath, {
      message: message,
      sha: sha,
      branch: CFG.branch,
    });
  }

  // ---------- UI wiring ----------
  var authStatus = document.getElementById("authStatus");
  var adminApp = document.getElementById("adminApp");
  var tokenForm = document.getElementById("tokenForm");
  var tokenInput = document.getElementById("tokenInput");
  var disconnectBtn = document.getElementById("disconnectBtn");

  function setConnected(connected) {
    if (connected) {
      authStatus.textContent = "Connected. Token stored locally in this browser only.";
      adminApp.classList.remove("visually-hidden");
    } else {
      authStatus.textContent = "Not connected.";
      adminApp.classList.add("visually-hidden");
    }
  }

  function slugify(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  // ---------- list rendering ----------
  function renderList(container, items, kind) {
    container.innerHTML = "";
    if (!items.length) {
      container.innerHTML = "<p>No " + kind + "s yet.</p>";
      return;
    }
    items.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        "<h3>" + item.data.title + "</h3>" +
        "<p>" + (item.data.description || "") + "</p>" +
        '<button type="button" class="btn btn--sm" data-edit>Edit</button>';
      card.querySelector("[data-edit]").addEventListener("click", function () {
        openEditor(kind, item);
      });
      container.appendChild(card);
    });
  }

  function loadPosts() {
    return listDir(CFG.postsPath).then(function (files) {
      return Promise.all(
        (files || [])
          .filter(function (f) { return f.name.endsWith(".md"); })
          .map(function (f) {
            return getFile(f.path).then(function (file) {
              var parsed = parseFrontmatter(fromBase64(file.content));
              return { path: f.path, sha: file.sha, data: parsed.data, body: parsed.body.trim() };
            });
          })
      );
    });
  }

  function loadProjects() {
    return listDir(CFG.projectsPath).then(function (files) {
      return Promise.all(
        (files || [])
          .filter(function (f) { return f.name.endsWith(".md"); })
          .map(function (f) {
            return getFile(f.path).then(function (file) {
              var parsed = parseFrontmatter(fromBase64(file.content));
              return { path: f.path, sha: file.sha, data: parsed.data, body: parsed.body.trim() };
            });
          })
      );
    });
  }

  function refreshLists() {
    loadPosts()
      .then(function (items) { renderList(document.getElementById("postsList"), items, "post"); })
      .catch(function (err) { alert("Failed to load posts: " + err.message); });
    loadProjects()
      .then(function (items) { renderList(document.getElementById("projectsList"), items, "project"); })
      .catch(function (err) { alert("Failed to load projects: " + err.message); });
  }

  // ---------- tabs ----------
  document.querySelectorAll("[data-tab]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-panel]").forEach(function (panel) {
        panel.classList.toggle("visually-hidden", panel.dataset.panel !== btn.dataset.tab);
      });
    });
  });

  // ---------- editor modal ----------
  var editorModal = document.getElementById("editorModal");
  var editorForm = document.getElementById("editorForm");
  var editorTitle = document.getElementById("editorTitle");
  var editorStatus = document.getElementById("editorStatus");
  var deleteBtn = document.getElementById("deleteBtn");
  var fields = ["path", "sha", "kind", "title", "description", "tags", "tech", "role", "date", "order", "cover", "draft", "featured", "body"];

  function field(name) {
    return document.getElementById("f-" + name);
  }

  function openEditor(kind, item) {
    editorForm.reset();
    field("kind").value = kind;
    field("path").value = item ? item.path : "";
    field("sha").value = item ? item.sha : "";
    editorTitle.textContent = (item ? "Edit " : "New ") + (kind === "post" ? "Post" : "Project");
    editorStatus.textContent = "";
    deleteBtn.classList.toggle("visually-hidden", !item);

    document.getElementById("f-tagsRow").classList.toggle("visually-hidden", kind !== "post");
    document.getElementById("f-techRow").classList.toggle("visually-hidden", kind !== "project");
    document.getElementById("f-roleRow").classList.toggle("visually-hidden", kind !== "project");
    document.getElementById("f-orderRow").classList.toggle("visually-hidden", kind !== "project");
    document.getElementById("f-featuredRow").classList.toggle("visually-hidden", kind !== "project");

    var data = item ? item.data : {};
    field("title").value = data.title || "";
    field("description").value = data.description || "";
    field("tags").value = (data.tags || []).join(", ");
    field("tech").value = (data.tech || []).join(", ");
    field("role").value = data.role || "";
    field("date").value = data.date || todayISO();
    field("order").value = data.order != null ? data.order : 10;
    field("cover").value = data.cover || "/assets/img/content-placeholder.png";
    field("draft").checked = Boolean(data.draft);
    field("featured").checked = Boolean(data.featured);
    field("body").value = item ? item.body : "";

    editorModal.classList.add("is-open");
  }

  document.querySelectorAll('[data-new]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      openEditor(btn.dataset.new, null);
    });
  });

  editorForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var kind = field("kind").value;
    var isPost = kind === "post";
    var dirPath = isPost ? CFG.postsPath : CFG.projectsPath;
    var title = field("title").value.trim();
    var existingPath = field("path").value;
    var slug = existingPath ? existingPath.split("/").pop().replace(/\.md$/, "") : slugify(title);
    var filePath = dirPath + "/" + slug + ".md";

    var data = isPost
      ? {
          title: title,
          description: field("description").value.trim(),
          date: field("date").value,
          tags: field("tags").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean),
          cover: field("cover").value.trim(),
          draft: field("draft").checked,
        }
      : {
          title: title,
          description: field("description").value.trim(),
          tech: field("tech").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean),
          role: field("role").value.trim(),
          date: field("date").value,
          cover: field("cover").value.trim(),
          featured: field("featured").checked,
          order: Number(field("order").value) || 10,
        };

    var content = buildFrontmatter(data) + "\n\n" + field("body").value.trim() + "\n";
    var message = (existingPath ? "Update " : "Add ") + (isPost ? "post" : "project") + ": " + title;

    editorStatus.textContent = "Saving…";
    putFile(filePath, content, message, field("sha").value || undefined)
      .then(function () {
        editorStatus.textContent = "Saved. The site will rebuild automatically in a minute or two.";
        refreshLists();
        setTimeout(function () { editorModal.classList.remove("is-open"); }, 1200);
      })
      .catch(function (err) {
        editorStatus.textContent = "Error: " + err.message;
      });
  });

  deleteBtn.addEventListener("click", function () {
    var path = field("path").value;
    var sha = field("sha").value;
    if (!path || !confirm("Delete " + path + "? This commits a deletion to main.")) return;
    editorStatus.textContent = "Deleting…";
    deleteFile(path, "Delete " + path, sha)
      .then(function () {
        editorStatus.textContent = "Deleted.";
        refreshLists();
        setTimeout(function () { editorModal.classList.remove("is-open"); }, 800);
      })
      .catch(function (err) {
        editorStatus.textContent = "Error: " + err.message;
      });
  });

  // ---------- auth wiring ----------
  tokenForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var token = tokenInput.value.trim();
    if (!token) return;
    localStorage.setItem(TOKEN_KEY, token);
    tokenInput.value = "";
    setConnected(true);
    refreshLists();
  });

  disconnectBtn.addEventListener("click", function () {
    localStorage.removeItem(TOKEN_KEY);
    setConnected(false);
  });

  setConnected(Boolean(localStorage.getItem(TOKEN_KEY)));
  if (localStorage.getItem(TOKEN_KEY)) refreshLists();
})();
