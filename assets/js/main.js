(function () {
  "use strict";

  // Mobile nav toggle
  var nav = document.querySelector(".nav");
  var navToggle = document.querySelector(".nav__toggle");
  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
    nav.querySelectorAll(".nav__links a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
      });
    });
  }

  // Theme toggle (inline head script sets the initial theme before paint)
  var themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var root = document.documentElement;
      var current = root.getAttribute("data-theme");
      var isDark = current
        ? current === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = isDark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
    });
    var savedTheme =
      document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
  }

  // Scroll-reveal animations
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Schedule-meeting modal
  var modal = document.getElementById("modal");
  document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (modal) {
        modal.classList.add("is-open");
        document.body.style.overflow = "hidden";
      }
    });
  });
  document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
  }
  function closeModal() {
    if (modal) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  // Contact form (EmailJS) — honeypot + validation + status UI
  var contactForm = document.getElementById("contactForm");
  if (contactForm && window.emailjs) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var honeypot = contactForm.querySelector('input[name="company"]');
      if (honeypot && honeypot.value) return; // bot trap, silently drop

      var statusEl = document.getElementById("formMessage");
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var submitText = document.getElementById("submitText");
      var loadingText = document.getElementById("loadingText");

      submitBtn.disabled = true;
      if (submitText) submitText.classList.add("visually-hidden");
      if (loadingText) loadingText.classList.remove("visually-hidden");

      window.emailjs
        .sendForm(
          contactForm.dataset.serviceId,
          contactForm.dataset.templateId,
          contactForm
        )
        .then(function () {
          showStatus(statusEl, "Message sent — I'll get back to you soon!", true);
          contactForm.reset();
        })
        .catch(function () {
          showStatus(statusEl, "Something went wrong. Please email me directly.", false);
        })
        .finally(function () {
          submitBtn.disabled = false;
          if (submitText) submitText.classList.remove("visually-hidden");
          if (loadingText) loadingText.classList.add("visually-hidden");
        });
    });
  }

  function showStatus(el, message, ok) {
    if (!el) return;
    el.textContent = message;
    el.classList.remove("visually-hidden", "form-status--ok", "form-status--err");
    el.classList.add("form-status", ok ? "form-status--ok" : "form-status--err");
  }

  // Newsletter form — Buttondown embed submits directly; show a local status if JS is present
  var newsletterForms = document.querySelectorAll(".newsletter form");
  newsletterForms.forEach(function (form) {
    form.addEventListener("submit", function () {
      var status = form.querySelector(".newsletter-status");
      if (status) {
        status.textContent = "Thanks for subscribing!";
        status.classList.remove("visually-hidden");
      }
    });
  });

  // Client-side search filter for blog/project listing grids
  document.querySelectorAll("[data-search-input]").forEach(function (input) {
    var target = document.querySelector(input.dataset.searchTarget);
    if (!target) return;
    var noResults = target.parentElement.querySelector("[data-no-results]");
    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      var visibleCount = 0;
      Array.prototype.forEach.call(target.children, function (item) {
        var haystack = item.dataset.search || "";
        var match = !query || haystack.indexOf(query) !== -1;
        item.style.display = match ? "" : "none";
        if (match) visibleCount++;
      });
      if (noResults) noResults.style.display = visibleCount ? "none" : "";
    });
  });
})();
