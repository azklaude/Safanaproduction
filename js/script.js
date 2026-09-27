/* ==========================================================================
   SAFANA PRODUCTION — Main script
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     WhatsApp URL — single source of truth
     ------------------------------------------------------------------- */
  function buildWhatsAppUrl(customMessage) {
    const number = siteConfig.whatsapp.number.replace(/[^\d]/g, "");
    const message = encodeURIComponent(customMessage || siteConfig.whatsapp.message);
    return `https://wa.me/${number}?text=${message}`;
  }

  function applyWhatsAppLinks() {
    const url = buildWhatsAppUrl();
    document.querySelectorAll("[data-whatsapp-link]").forEach((el) => {
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* ---------------------------------------------------------------------
     Inject business info from config into the DOM
     ------------------------------------------------------------------- */
  function applyBusinessInfo() {
    document.querySelectorAll("[data-business-name]").forEach((el) => {
      el.textContent = siteConfig.businessName;
    });

    document.querySelectorAll("[data-address]").forEach((el) => {
      el.textContent = siteConfig.contact.address;
    });

    const addressLink = document.querySelector("[data-address-link]");
    if (addressLink && siteConfig.contact.mapsUrl) {
      addressLink.setAttribute("href", siteConfig.contact.mapsUrl);
      addressLink.setAttribute("target", "_blank");
      addressLink.setAttribute("rel", "noopener noreferrer");
    }

    const hoursList = document.querySelector("[data-hours-list]");
    if (hoursList) {
      hoursList.innerHTML = siteConfig.contact.hours
        .map(
          (row) => `
          <div class="fact-row">
            <span class="fact-label">${row.label}</span>
            <span class="fact-value">${row.value}</span>
          </div>`
        )
        .join("");
    }

    const navLists = document.querySelectorAll("[data-nav-list]");
    navLists.forEach((list) => {
      list.innerHTML = siteConfig.nav
        .map((item) => `<a href="${item.href}">${item.label}</a>`)
        .join("");
    });
  }

  /* ---------------------------------------------------------------------
     Render services dynamically
     ------------------------------------------------------------------- */
  function renderServices() {
    const grid = document.querySelector("[data-services-grid]");
    if (!grid) return;

    grid.innerHTML = services
      .map(
        (svc, i) => `
        <article class="service-card reveal" style="transition-delay:${Math.min(i, 5) * 60}ms">
          <div class="service-media">
            ${mediaOrPlaceholder(svc.image, svc.title, "service")}
          </div>
          <div class="service-body">
            <h3>${svc.title}</h3>
            <p>${svc.description}</p>
          </div>
        </article>`
      )
      .join("");
  }

  /* ---------------------------------------------------------------------
     Render benefits
     ------------------------------------------------------------------- */
  function renderBenefits() {
    const grid = document.querySelector("[data-benefits-grid]");
    if (!grid) return;

    const icons = [checkIcon(), gridIcon(), boltIcon(), chatIcon()];

    grid.innerHTML = benefits
      .map(
        (b, i) => `
        <div class="benefit-item reveal" style="transition-delay:${i * 60}ms">
          <span class="benefit-icon">${icons[i % icons.length]}</span>
          <h3>${b.title}</h3>
          <p class="body-sm">${b.description}</p>
        </div>`
      )
      .join("");
  }

  /* ---------------------------------------------------------------------
     Render portfolio — editorial rhythm based on position, not random
     ------------------------------------------------------------------- */
  function layoutClassFor(index, total) {
    // A controlled rhythm: first item featured on larger sets, then an
    // alternating tall/standard/wide pattern. Keeps things adaptive
    // from 3 to 20 items without ever producing an empty row.
    if (total >= 6 && index === 0) return "is-feature";
    const cyclePos = (index - (total >= 6 ? 1 : 0)) % 5;
    if (cyclePos === 2) return "is-wide";
    return "";
  }

  function renderPortfolio() {
    const grid = document.querySelector("[data-portfolio-grid]");
    if (!grid) return;

    const items = portfolio.slice(0, 20);

    grid.innerHTML = items
      .map((item, i) => {
        const cls = layoutClassFor(i, items.length);
        return `
        <button
          type="button"
          class="portfolio-item reveal ${cls}"
          style="transition-delay:${Math.min(i, 6) * 50}ms"
          data-index="${i}"
          aria-label="Lihat ${item.title}"
        >
          ${mediaOrPlaceholder(item.image, item.title, "portfolio")}
          <span class="portfolio-caption">
            <span class="cap-title">${item.title}</span>
            <span class="cap-category">${item.category}</span>
          </span>
        </button>`;
      })
      .join("");

    grid.querySelectorAll(".portfolio-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        openLightbox(parseInt(btn.dataset.index, 10));
      });
    });
  }

  /* ---------------------------------------------------------------------
     Placeholder media helper — used by hero/services/portfolio/about
     so a missing asset never breaks the layout.
     ------------------------------------------------------------------- */
  function mediaOrPlaceholder(src, alt, kind) {
    // We can't check file existence synchronously without a request per
    // image; instead we render the <img> with an onerror fallback that
    // swaps in a styled placeholder in place.
    const safeAlt = (alt || "").replace(/"/g, "&quot;");
    return `
      <img
        src="${src}"
        alt="${safeAlt}"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null; this.replaceWith(window.__safanaPlaceholder('${kind}'));"
      />`;
  }

  window.__safanaPlaceholder = function (kind) {
    const wrap = document.createElement("div");
    wrap.className = "placeholder-media";
    wrap.innerHTML = `
      ${imagePlaceholderIcon()}
      <span class="ph-title">Photo Placeholder</span>
      <span class="ph-sub">Replace with Safana Production asset</span>
    `;
    return wrap;
  };

  /* ---------------------------------------------------------------------
     Lightbox
     ------------------------------------------------------------------- */
  let lightboxIndex = 0;
  let lastFocusedEl = null;

  function openLightbox(index) {
    lightboxIndex = index;
    lastFocusedEl = document.activeElement;
    updateLightboxContent();
    const lb = document.querySelector("[data-lightbox]");
    lb.classList.add("is-open");
    document.body.classList.add("no-scroll");
    lb.querySelector(".lightbox-close").focus();
    document.addEventListener("keydown", onLightboxKeydown);
  }

  function closeLightbox() {
    const lb = document.querySelector("[data-lightbox]");
    lb.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    document.removeEventListener("keydown", onLightboxKeydown);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function stepLightbox(delta) {
    const total = portfolio.length;
    lightboxIndex = (lightboxIndex + delta + total) % total;
    updateLightboxContent();
  }

  function updateLightboxContent() {
    const item = portfolio[lightboxIndex];
    const img = document.querySelector("[data-lightbox-image]");
    const title = document.querySelector("[data-lightbox-title]");
    const category = document.querySelector("[data-lightbox-category]");

    img.src = item.image;
    img.alt = item.title;
    img.onerror = function () {
      this.onerror = null;
      this.style.display = "none";
      const existing = this.parentElement.querySelector(".placeholder-media");
      if (!existing) {
        const ph = window.__safanaPlaceholder("portfolio");
        ph.style.width = "60vw";
        ph.style.maxWidth = "500px";
        ph.style.aspectRatio = "4/3";
        ph.style.borderRadius = "8px";
        this.insertAdjacentElement("afterend", ph);
      }
    };
    const prevPh = img.parentElement.querySelector(".placeholder-media");
    if (prevPh) prevPh.remove();
    img.style.display = "";

    title.textContent = item.title;
    category.textContent = item.category;
  }

  function onLightboxKeydown(e) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") stepLightbox(1);
    if (e.key === "ArrowLeft") stepLightbox(-1);
  }

  function setupLightboxControls() {
    document.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
    document.querySelector("[data-lightbox-prev]").addEventListener("click", () => stepLightbox(-1));
    document.querySelector("[data-lightbox-next]").addEventListener("click", () => stepLightbox(1));

    const lb = document.querySelector("[data-lightbox]");
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });

    // Basic swipe support
    let touchStartX = 0;
    const figure = lb.querySelector(".lightbox-figure");
    figure.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );
    figure.addEventListener(
      "touchend",
      (e) => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 40) {
          stepLightbox(delta > 0 ? -1 : 1);
        }
      },
      { passive: true }
    );
  }

  /* ---------------------------------------------------------------------
     Navbar: scroll compaction + mobile menu
     ------------------------------------------------------------------- */
  function setupNavbar() {
    const navbar = document.querySelector("[data-navbar]");
    const toggle = document.querySelector("[data-navbar-toggle]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          navbar.classList.toggle("is-scrolled", window.scrollY > 8);
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function setMenuOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      mobileMenu.classList.toggle("is-open", open);
      document.body.classList.toggle("no-scroll", open);
    }

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenuOpen(false));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) setMenuOpen(false);
    });
  }

  /* ---------------------------------------------------------------------
     Sticky mobile WhatsApp CTA — hide near footer/final CTA
     ------------------------------------------------------------------- */
  function setupStickyWhatsApp() {
    const sticky = document.querySelector("[data-sticky-wa]");
    if (!sticky) return;
    const hideZone = document.querySelector("[data-hide-sticky-near]");
    if (!hideZone) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sticky.classList.toggle("is-hidden", entry.isIntersecting);
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(hideZone);
  }

  /* ---------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------- */
  function setupScrollReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach((t) => t.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((t) => observer.observe(t));
  }

  /* ---------------------------------------------------------------------
     Icons (inline SVG, no external deps)
     ------------------------------------------------------------------- */
  function checkIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12.5l5 5L20 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function gridIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>`;
  }
  function boltIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 3L5 13h5l-1 8 8-10h-5l1-8z" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function chatIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5h16v11H8l-4 4V5z" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function imagePlaceholderIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5.5-5.5a2 2 0 00-2.8 0L3 19" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  /* ---------------------------------------------------------------------
     Init
     ------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    applyBusinessInfo();
    applyWhatsAppLinks();
    renderBenefits();
    renderServices();
    renderPortfolio();
    setupLightboxControls();
    setupNavbar();
    setupStickyWhatsApp();
    setupScrollReveal();

    document.getElementById("year").textContent = new Date().getFullYear();
  });
})();
