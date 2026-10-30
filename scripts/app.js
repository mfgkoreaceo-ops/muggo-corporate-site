// ==========================================================================
// MUGGO · JAKARTA CORPORATE SITE - MAIN APPLICATION
// UI/UX unified with https://mokgo-hr-staging.vercel.app/
// 30 Brands & 300 Menus synced with https://kind-euclid.vercel.app/
// Complete Trilingual Switching: ID (Bahasa Indonesia) | EN (English) | KO (한국어)
// ==========================================================================

(function () {
  const STORAGE_KEY = "muggo_corporate_cms_v2";
  const LANG_KEY = "mokgo-language";
  const THEME_KEY = "muggo-theme";

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...window.DEFAULT_SITE_DATA,
          ...parsed,
          config: { ...window.DEFAULT_SITE_DATA.config, ...(parsed.config || {}) }
        };
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(window.DEFAULT_SITE_DATA));
  }

  let state = loadState();

  // Sync saved language preference ('id' | 'en' | 'ko')
  try {
    const savedLang = localStorage.getItem(LANG_KEY);
    if (["id", "en", "ko"].includes(savedLang)) {
      state.config.currentLang = savedLang;
    }
  } catch (e) {}

  let currentRoute = "home";
  let currentArticleId = null;
  let selectedBrandCategory = "all";
  let brandSearchQuery = "";
  let expandedBrands = {};
  let adminRole = "super"; // 'super' | 'hr'
  let adminTab = "general";

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
    renderAll();
  }

  function lang() {
    return ["id", "en", "ko"].includes(state.config.currentLang) ? state.config.currentLang : "id";
  }

  function t() {
    return window.I18N_DICT[lang()] || window.I18N_DICT.id;
  }

  function loc(obj, prefix) {
    const l = lang();
    const suffix = l === "id" ? "Id" : l === "en" ? "En" : "Ko";
    return obj[prefix + suffix] || obj[prefix + "Id"] || obj[prefix + "Ko"] || "";
  }

  function locBrand(obj, field) {
    const l = lang();
    return obj[`${field}_${l}`] || obj[`${field}_en`] || obj[`${field}_ko`] || "";
  }

  function formatIdr(amount) {
    const locale = { id: "id-ID", en: "en-ID", ko: "ko-KR" }[lang()] || "id-ID";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Clean Lucide SVG stroke icons (matching mokgo-hr-staging.vercel.app)
  function svgIcon(name, size = 20) {
    const paths = {
      sun: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>`,
      moon: `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`,
      menu: `<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>`,
      store: `<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/>`,
      utensils: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>`,
      smartphone: `<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>`,
      users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
      briefcase: `<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
      globe: `<circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
      check: `<polyline points="20 6 9 17 4 12"/>`,
      arrowRight: `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.store}</svg>`;
  }

  // Theme management (matching mokgo-hr-staging.vercel.app theme.mjs)
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  window.toggleTheme = function () {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#0F1514" : "#4CDBBE");
    renderChrome();
  };

  // Language management ('id' | 'en' | 'ko')
  window.setSiteLang = function (newLang) {
    if (!["id", "en", "ko"].includes(newLang)) return;
    state.config.currentLang = newLang;
    document.documentElement.lang = newLang;
    try {
      localStorage.setItem(LANG_KEY, newLang);
    } catch (e) {}
    saveState();
    updateSeoMeta();
  };

  // SNS Deep-link opener
  window.openSnsChannel = function (event, platform) {
    if (event) event.preventDefault();
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (platform === "instagram") {
      const url = state.config.instagramUrl || "https://www.instagram.com/muggo.indonesia";
      const username = (state.config.instagramHandle || "@muggo.indonesia").replace("@", "");
      if (isMobile) {
        const start = Date.now();
        window.location.href = `instagram://user?username=${encodeURIComponent(username)}`;
        setTimeout(() => {
          if (Date.now() - start < 1500) window.open(url, "_blank", "noopener,noreferrer");
        }, 700);
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (platform === "tiktok") {
      const url = state.config.tiktokUrl || "https://www.tiktok.com/@muggo1";
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Navigation
  window.navigateTo = function (route, param) {
    currentRoute = route;
    if (route === "article-detail" && param) {
      currentArticleId = param;
    }
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) drawer.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
    updateSeoMeta();
    renderAll();
  };

  window.toggleMobileDrawer = function () {
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) drawer.classList.toggle("open");
  };

  function hasContactInfo() {
    return Boolean(
      (state.config.whatsappNumber && state.config.whatsappNumber.trim() !== "") ||
      (state.config.contactEmail && state.config.contactEmail.trim() !== "")
    );
  }

  function updateSeoMeta() {
    const dict = t();
    const company = state.config.companyName;
    const navMap = {
      home: dict.nav.home,
      brands: dict.nav.brands,
      "food-rnd": dict.nav.foodRnd,
      platform: dict.nav.platform,
      people: dict.nav.people,
      careers: dict.nav.careers,
      contact: dict.nav.contact
    };
    const pageTitle = `${navMap[currentRoute] || dict.nav.home} · ${company}`;
    document.title = pageTitle;
    const skip = document.getElementById("skip-link");
    if (skip) skip.textContent = dict.skipToContent;
  }

  // ==========================================================================
  // RENDER HEADER, FOOTER, MOBILE STICKY BAR
  // ==========================================================================
  function renderChrome() {
    const dict = t();
    const cfg = state.config;
    const l = lang();
    const isDark = currentTheme() === "dark";
    const contactVisible = hasContactInfo();

    // ① Header
    const header = document.getElementById("site-header");
    if (header) {
      const navItems = [
        { id: "home", label: dict.nav.home },
        { id: "brands", label: dict.nav.brands },
        { id: "food-rnd", label: dict.nav.foodRnd },
        { id: "platform", label: dict.nav.platform },
        { id: "people", label: dict.nav.people },
        { id: "careers", label: dict.nav.careers }
      ];
      if (contactVisible) {
        navItems.push({ id: "contact", label: dict.nav.contact });
      }

      const navButtonsHtml = navItems
        .map(
          (item) =>
            `<button type="button" class="nav-btn" ${currentRoute === item.id ? 'aria-current="page"' : ""} onclick="navigateTo('${item.id}')">${item.label}</button>`
        )
        .join("");

      const themeTitle = dict.themeLabel[isDark ? 1 : 0];

      header.innerHTML = `
        <div class="header-inner">
          <a class="brand" href="#home" onclick="navigateTo('home'); return false;">
            <span class="brand-mark">MUGGO</span>
            <span class="brand-text">
              <strong>먹고</strong>
              <span>MUGGO / JAKARTA</span>
            </span>
          </a>

          <nav class="desktop-nav" aria-label="Main Navigation">
            ${navButtonsHtml}
          </nav>

          <div class="header-tools">
            <button id="themeToggle" type="button" class="icon-btn" onclick="toggleTheme()" aria-label="${themeTitle}" title="${themeTitle}">
              ${svgIcon(isDark ? "sun" : "moon", 18)}
            </button>

            <div class="lang-segmented" role="group" aria-label="Bahasa / Language / 언어">
              <button type="button" class="lang-seg-btn ${l === "id" ? "active" : ""}" onclick="setSiteLang('id')" title="Bahasa Indonesia">ID</button>
              <button type="button" class="lang-seg-btn ${l === "en" ? "active" : ""}" onclick="setSiteLang('en')" title="English">EN</button>
              <button type="button" class="lang-seg-btn ${l === "ko" ? "active" : ""}" onclick="setSiteLang('ko')" title="한국어">KO</button>
            </div>

            <button type="button" class="icon-btn mobile-menu-toggle" onclick="toggleMobileDrawer()" aria-label="Menu">
              ${svgIcon("menu", 20)}
            </button>
          </div>
        </div>

        <nav id="mobile-drawer" class="mobile-drawer" aria-label="Mobile Navigation">
          ${navButtonsHtml}
        </nav>
      `;
    }

    // ⑨ Footer
    const footer = document.getElementById("site-footer");
    if (footer) {
      const cleanWa = (cfg.whatsappNumber || "").replace(/[^0-9]/g, "");
      const contactHtml = contactVisible
        ? `<div style="margin-top:10px; line-height:1.7;">
            ${cfg.whatsappNumber ? `<div>WhatsApp: <a href="https://wa.me/${cleanWa}" target="_blank" rel="noopener">${cfg.whatsappNumber}</a></div>` : ""}
            ${cfg.contactEmail ? `<div>Email: <a href="mailto:${cfg.contactEmail}">${cfg.contactEmail}</a></div>` : ""}
           </div>`
        : "";

      const koreaHqLinkHtml = cfg.showKoreaHq
        ? `<li><a href="${cfg.koreaHqUrl}" target="_blank" rel="noopener noreferrer">${dict.koreaHq.linkText}</a></li>`
        : "";

      footer.innerHTML = `
        <div class="footer-grid">
          <div>
            <div class="brand" style="margin-bottom:10px;">
              <span class="brand-mark">MUGGO</span>
              <span class="brand-text">
                <strong>먹고</strong>
                <span>MUGGO / JAKARTA</span>
              </span>
            </div>
            <p style="max-width:440px; line-height:1.65;">${dict.footer.desc}</p>
            <p style="margin-top:6px;">${cfg.officeAddress}</p>
            ${contactHtml}
          </div>

          <div>
            <p class="eyebrow" style="margin-bottom:10px;">NAVIGATION</p>
            <ul class="footer-nav-links">
              <li><button type="button" onclick="navigateTo('home')">${dict.nav.home}</button></li>
              <li><button type="button" onclick="navigateTo('brands')">${dict.nav.brands}</button></li>
              <li><button type="button" onclick="navigateTo('food-rnd')">${dict.nav.foodRnd}</button></li>
              <li><button type="button" onclick="navigateTo('platform')">${dict.nav.platform}</button></li>
              <li><button type="button" onclick="navigateTo('people')">${dict.nav.people}</button></li>
              <li><button type="button" onclick="navigateTo('careers')">${dict.nav.careers}</button></li>
              ${contactVisible ? `<li><button type="button" onclick="navigateTo('contact')">${dict.nav.contact}</button></li>` : ""}
              ${koreaHqLinkHtml}
            </ul>
          </div>

          <div>
            <p class="eyebrow" style="margin-bottom:10px;">SOCIAL & CHANNELS</p>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              <a href="${cfg.instagramUrl}" onclick="openSnsChannel(event, 'instagram')" class="btn btn-secondary" style="padding:8px 14px; min-height:36px; font-size:13px;">
                Instagram (${cfg.instagramHandle})
              </a>
              <a href="${cfg.tiktokUrl}" onclick="openSnsChannel(event, 'tiktok')" class="btn btn-secondary" style="padding:8px 14px; min-height:36px; font-size:13px;">
                TikTok (${cfg.tiktokHandle})
              </a>
            </div>
          </div>
        </div>

        <div style="padding-top:18px; border-top:1px solid var(--portal-line); display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px;">
          <div>© 2026 ${cfg.companyName}. All rights reserved.</div>
          <ul class="footer-nav-links">
            <li><button type="button" onclick="navigateTo('privacy')">${dict.footer.privacy}</button></li>
            <li><button type="button" onclick="navigateTo('terms')">${dict.footer.terms}</button></li>
            <li><button type="button" onclick="openSpecModal()">${dict.footer.specLink}</button></li>
            <li><button type="button" onclick="openAdminModal('super')">${dict.footer.adminLink}</button></li>
          </ul>
        </div>
      `;
    }

    // Mobile Sticky Bottom Action Bar
    const stickyBar = document.getElementById("mobile-sticky-bar");
    if (stickyBar) {
      const cleanWa = (cfg.whatsappNumber || "").replace(/[^0-9]/g, "");
      const waBtn =
        cfg.whatsappNumber && cfg.whatsappNumber.trim() !== ""
          ? `<a href="https://wa.me/${cleanWa}" target="_blank" rel="noopener" class="sticky-btn">${dict.sticky.whatsapp}</a>`
          : "";

      stickyBar.innerHTML = `
        <div class="sticky-inner">
          <a href="${cfg.instagramUrl}" onclick="openSnsChannel(event, 'instagram')" class="sticky-btn">
            ${dict.sticky.instagram}
          </a>
          <a href="${cfg.tiktokUrl}" onclick="openSnsChannel(event, 'tiktok')" class="sticky-btn">
            ${dict.sticky.tiktok}
          </a>
          ${waBtn}
          <button type="button" class="sticky-btn primary" onclick="navigateTo('careers')">
            ${dict.sticky.careers}
          </button>
        </div>
      `;
    }
  }

  // ==========================================================================
  // RENDER MAIN VIEWS
  // ==========================================================================
  function renderMain() {
    const main = document.getElementById("main-content");
    if (!main) return;

    switch (currentRoute) {
      case "home":
        main.innerHTML = renderHomeView();
        break;
      case "brands":
        main.innerHTML = renderBrandsView();
        break;
      case "food-rnd":
        main.innerHTML = renderFoodRndView();
        break;
      case "platform":
        main.innerHTML = renderPlatformView();
        break;
      case "people":
        main.innerHTML = renderPeopleView();
        break;
      case "careers":
        main.innerHTML = renderCareersView();
        break;
      case "contact":
        main.innerHTML = renderContactView();
        break;
      case "article-detail":
        main.innerHTML = renderArticleDetailView();
        break;
      case "privacy":
        main.innerHTML = renderPolicyView("privacy");
        break;
      case "terms":
        main.innerHTML = renderPolicyView("terms");
        break;
      default:
        main.innerHTML = renderHomeView();
    }
  }

  // --------------------------------------------------------------------------
  // HOME VIEW (Sections ② ~ ⑧)
  // --------------------------------------------------------------------------
  function renderHomeView() {
    const dict = t();
    const cfg = state.config;
    const headline = cfg.showKoreaHq ? dict.hero.headlineA : dict.hero.headlineB;
    const subcopy = cfg.showKoreaHq ? dict.hero.subcopyA : dict.hero.subcopyB;

    let appButtonHtml = "";
    if (cfg.deliveryAppMode === "coming_soon") {
      appButtonHtml = `<span class="btn btn-secondary" style="cursor:default;">${dict.hero.appComingSoon}</span>`;
    } else if (cfg.deliveryAppMode === "active" && cfg.deliveryAppUrl) {
      appButtonHtml = `<a href="${cfg.deliveryAppUrl}" target="_blank" rel="noopener" class="btn btn-secondary">${dict.hero.appDownload} ↗</a>`;
    }

    // ③ Our Pillars (4 cards)
    const pillarsHtml = dict.pillars.items
      .map(
        (p) => `
        <button type="button" class="service-card" onclick="navigateTo('${p.route}')">
          <i class="service-icon">${svgIcon(p.icon, 20)}</i>
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <span class="card-action">${p.action}</span>
        </button>
      `
      )
      .join("");

    // Featured Brands Preview from the 30 Official Brands (SOTDAK, SEONGSU DAK, JUMOK, PANTRY 12, SALAD PICK, BING HA)
    const featuredIds = ["sotdak", "seongsu-dak", "bap-club", "pantry12", "salad-pick", "bing-ha"];
    const featuredBrands = (window.MUGGO_CATALOG || []).filter((b) => featuredIds.includes(b.id));
    const featuredBrandsHtml = featuredBrands
      .map(
        (b) => `
        <div class="brand-card" onclick="navigateTo('brands')" style="cursor:pointer;">
          <div class="brand-card-header">
            <img src="${b.logo}" alt="${locBrand(b, "name")}" class="brand-thumb" loading="lazy" />
            <div>
              <span class="roster-badge">${b.category}</span>
              <h3 style="margin-top:4px; font-size:16px;">${locBrand(b, "name")}</h3>
            </div>
          </div>
          <p class="hint" style="margin-bottom:10px;">${locBrand(b, "desc")}</p>
          <div style="font-size:12.5px; color:var(--ui-link); font-weight:700;">
            ${b.menus
              .slice(0, 2)
              .map((m) => locBrand(m, "name"))
              .join(" · ")} →
          </div>
        </div>
      `
      )
      .join("");

    // Korea HQ Section (Conditional ON/OFF)
    const koreaHqHtml = cfg.showKoreaHq
      ? `
        <section class="card section-block">
          <p class="eyebrow">${dict.koreaHq.eyebrow}</p>
          <h2>${dict.koreaHq.title}</h2>
          <p class="intro" style="margin-bottom:16px;">${dict.koreaHq.desc}</p>
          <a href="${cfg.koreaHqUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            ${dict.koreaHq.linkText}
          </a>
        </section>
      `
      : "";

    // ⑤ Metrics (6 planned indicators)
    const metricsHtml = state.metrics
      .map(
        (m) => `
        <article class="metric-article">
          <div class="metric-top">
            <small>${loc(m, "label")}</small>
            <span class="roster-badge">${loc(m, "badge")}</span>
          </div>
          <strong>${loc(m, "number")}</strong>
          <p>${loc(m, "desc")}</p>
        </article>
      `
      )
      .join("");

    const roadmapHtml = cfg.showRegionalRoadmap
      ? `
        <div style="margin-top:18px;">
          <h3 style="font-size:15px; margin-bottom:10px;">${dict.impact.roadmapTitle}</h3>
          <ol class="workflow">
            ${dict.impact.roadmapSteps.map((step) => `<li>${step}</li>`).join("")}
          </ol>
        </div>
      `
      : "";

    // ⑦ Related Articles (Auto-hidden if 0 items)
    let articlesHtml = "";
    if (state.articles && state.articles.length > 0) {
      articlesHtml = `
        <section class="section-block">
          <div class="workspace-heading">
            <div>
              <p class="eyebrow">${dict.articles.eyebrow}</p>
              <h2>${dict.articles.title}</h2>
            </div>
          </div>
          <div class="metrics-grid">
            ${state.articles
              .map(
                (art) => `
              <article class="service-card" onclick="navigateTo('article-detail', '${art.id}')">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
                  <span class="roster-badge">${loc(art, "category")}</span>
                  <small class="hint">${art.date}</small>
                </div>
                <h3>${loc(art, "title")}</h3>
                <p>${loc(art, "summary")}</p>
                <span class="card-action">${dict.articles.readMore}</span>
              </article>
            `
              )
              .join("")}
          </div>
        </section>
      `;
    }

    // ⑧ Footnotes Accordion
    const footnotesHtml = state.footnotes
      .map(
        (fn) => `
        <div>
          <strong style="display:block; font-size:13.5px; margin-bottom:3px;">${loc(fn, "title")}</strong>
          <p class="hint">${loc(fn, "desc")}</p>
        </div>
      `
      )
      .join("");

    return `
      <!-- ② Hero Section -->
      <section class="hero-card">
        <div>
          <p class="eyebrow">${dict.hero.eyebrow}</p>
          <h1>${headline}</h1>
          <p class="intro" style="margin-bottom:22px;">${subcopy}</p>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            <button type="button" class="btn btn-primary" onclick="navigateTo('careers')">
              ${dict.hero.careerBtn}
            </button>
            <button type="button" class="btn btn-secondary" onclick="navigateTo('brands')">
              ${dict.hero.brandBtn}
            </button>
            ${appButtonHtml}
          </div>
        </div>
        <div class="hero-visual">
          <img src="assets/muggo-brand-hero.jpg" alt="MUGGO - The Home of Every Craving" />
        </div>
      </section>

      <!-- ③ Our Pillars -->
      <section class="section-block">
        <div class="workspace-heading">
          <div>
            <p class="eyebrow">${dict.pillars.eyebrow}</p>
            <h2>${dict.pillars.title}</h2>
            <p class="intro">${dict.pillars.intro}</p>
          </div>
        </div>
        <div class="service-grid">
          ${pillarsHtml}
        </div>
        <div class="brand-catalog-grid">
          ${featuredBrandsHtml}
        </div>
      </section>

      ${koreaHqHtml}

      <!-- ④ CEO Message (2 Paragraphs) -->
      <section class="card section-block">
        <p class="eyebrow">${dict.ceo.eyebrow}</p>
        <h2>${dict.ceo.titlePrefix} · ${cfg.ceoName}</h2>
        <div class="columns" style="margin-top:16px;">
          <aside class="callout" style="margin:0;">
            <strong style="display:block; font-size:13px; color:var(--ui-link); margin-bottom:6px;">01 · ${dict.ceo.p1Title}</strong>
            <p>${dict.ceo.p1}</p>
          </aside>
          <aside class="callout" style="margin:0;">
            <strong style="display:block; font-size:13px; color:var(--ui-link); margin-bottom:6px;">02 · ${dict.ceo.p2Title}</strong>
            <p>${dict.ceo.p2}</p>
          </aside>
        </div>
        <div style="margin-top:16px; padding-top:14px; border-top:1px solid var(--portal-line); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
          <span class="hint">${cfg.companyName}</span>
          <strong>${dict.ceo.signRole} · ${cfg.ceoName}</strong>
        </div>
      </section>

      <!-- ⑤ Impact / Target Metrics -->
      <section class="section-block">
        <div class="workspace-heading">
          <div>
            <p class="eyebrow">${dict.impact.eyebrow}</p>
            <h2>${dict.impact.title}</h2>
            <p class="hint">${dict.impact.notice}</p>
          </div>
        </div>
        <div class="metrics-grid">
          ${metricsHtml}
        </div>
        ${roadmapHtml}
      </section>

      <!-- ⑥ Our Culture -->
      <section class="card section-block">
        <p class="eyebrow">${dict.culture.eyebrow}</p>
        <h2>${dict.culture.title}</h2>
        <aside class="callout">
          <strong style="font-size:17px; line-height:1.55; display:block;">${dict.culture.quote}</strong>
        </aside>
        <p class="intro" style="margin-bottom:18px;">${dict.culture.desc}</p>
        <div style="display:flex; flex-wrap:wrap; gap:10px;">
          <button type="button" class="btn btn-primary" onclick="navigateTo('people')">${dict.culture.peopleBtn}</button>
          <button type="button" class="btn btn-secondary" onclick="navigateTo('careers')">${dict.culture.careerBtn}</button>
        </div>
      </section>

      <!-- ⑦ Related Articles -->
      ${articlesHtml}

      <!-- ⑧ Footnotes Accordion -->
      <section class="section-block" style="margin-bottom:0;">
        <details class="footnote-details">
          <summary>
            <span>${dict.footnotes.summary}</span>
            <span class="roster-badge">4</span>
          </summary>
          <div class="footnote-list">
            ${footnotesHtml}
          </div>
        </details>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // BRANDS & 300 MENUS VIEW (All 30 Official Brands from kind-euclid.vercel.app)
  // --------------------------------------------------------------------------
  window.setBrandCatFilter = function (cat) {
    selectedBrandCategory = cat;
    renderMain();
  };

  window.handleBrandSearch = function (val) {
    brandSearchQuery = val || "";
    renderBrandCardsDOM();
  };

  window.toggleBrandMenus = function (brandId) {
    expandedBrands[brandId] = !expandedBrands[brandId];
    renderBrandCardsDOM();
  };

  function getFilteredCatalog() {
    const allBrands = window.MUGGO_CATALOG || [];
    const q = brandSearchQuery.trim().toLowerCase();
    return allBrands.filter((b) => {
      if (selectedBrandCategory !== "all" && b.category !== selectedBrandCategory) {
        return false;
      }
      if (!q) return true;
      const matchBrand =
        (b.name_ko || "").toLowerCase().includes(q) ||
        (b.name_en || "").toLowerCase().includes(q) ||
        (b.name_id || "").toLowerCase().includes(q) ||
        (b.desc_ko || "").toLowerCase().includes(q) ||
        (b.desc_en || "").toLowerCase().includes(q) ||
        (b.desc_id || "").toLowerCase().includes(q);
      const matchMenu = (b.menus || []).some(
        (m) =>
          (m.name_ko || "").toLowerCase().includes(q) ||
          (m.name_en || "").toLowerCase().includes(q) ||
          (m.name_id || "").toLowerCase().includes(q)
      );
      return matchBrand || matchMenu;
    });
  }

  function renderBrandCardsDOM() {
    const container = document.getElementById("brands-catalog-container");
    if (!container) return;
    const dict = t().brandsPage;
    const brands = getFilteredCatalog();

    container.innerHTML = brands
      .map((b) => {
        const isExpanded = !!expandedBrands[b.id] || brandSearchQuery.trim().length > 0;
        const visibleMenus = isExpanded ? b.menus : b.menus.slice(0, 4);
        const catLabel = dict.catNames[b.category] || b.category;

        return `
          <article class="brand-card">
            <div>
              <div class="brand-card-header">
                <img src="${b.logo}" alt="${locBrand(b, "name")}" class="brand-thumb" loading="lazy" />
                <div style="min-width:0;">
                  <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                    <span class="roster-badge">#${b.no}</span>
                    <small class="hint">${catLabel}</small>
                  </div>
                  <h3 style="margin-top:4px;">${locBrand(b, "name")}</h3>
                </div>
              </div>
              <p class="hint">${locBrand(b, "desc")}</p>

              <ul class="menu-preview-list">
                ${visibleMenus
                  .map(
                    (m) => `
                  <li class="menu-preview-item">
                    <span>${locBrand(m, "name")}</span>
                    <strong style="color:var(--ui-link); font-size:12px; white-space:nowrap;">${formatIdr(m.price)}</strong>
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>

            <div style="margin-top:12px; padding-top:10px; border-top:1px solid var(--portal-line); display:flex; justify-content:space-between; align-items:center;">
              <small class="hint">${dict.menusCount}</small>
              <button type="button" class="nav-btn" style="padding:5px 10px; min-height:30px; font-size:12.5px; color:var(--ui-link); font-weight:700;" onclick="toggleBrandMenus('${b.id}')">
                ${isExpanded ? dict.hideMenus : `${dict.viewAllMenus} (${b.menus.length})`}
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderBrandsView() {
    const dict = t().brandsPage;
    const cats = ["Chicken", "Korean", "Western", "Salad", "Dessert"];

    const html = `
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">${dict.eyebrow}</p>
          <h1>${dict.title}</h1>
          <p class="intro">${dict.intro}</p>
        </div>
      </div>

      <div class="card" style="padding:18px;">
        <div class="filter-pills">
          <button type="button" class="filter-pill ${selectedBrandCategory === "all" ? "active" : ""}" onclick="setBrandCatFilter('all')">
            ${dict.allTab}
          </button>
          ${cats
            .map(
              (c) => `
            <button type="button" class="filter-pill ${selectedBrandCategory === c ? "active" : ""}" onclick="setBrandCatFilter('${c}')">
              ${dict.catNames[c]}
            </button>
          `
            )
            .join("")}
        </div>
        <div class="form-field" style="margin:0;">
          <input type="text" value="${brandSearchQuery}" oninput="handleBrandSearch(this.value)" placeholder="${dict.searchPlaceholder}" />
        </div>
      </div>

      <div id="brands-catalog-container" class="brand-catalog-grid"></div>
    `;

    setTimeout(renderBrandCardsDOM, 0);
    return html;
  }

  // --------------------------------------------------------------------------
  // FOOD & R&D VIEW (5 Culinary Genres & 6 Kitchen Stations)
  // --------------------------------------------------------------------------
  function renderFoodRndView() {
    const dict = t().foodRndPage;
    return `
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">${dict.eyebrow}</p>
          <h1>${dict.title}</h1>
          <p class="intro">${dict.intro}</p>
        </div>
      </div>

      <aside class="callout">${dict.halalCallout}</aside>

      <section class="section-block" style="margin-top:24px;">
        <h2>${dict.genresTitle}</h2>
        <div class="metrics-grid">
          ${dict.genres
            .map(
              (g) => `
            <article class="card" style="margin:0;">
              <h3>${g.title}</h3>
              <p class="hint" style="margin-top:8px;">${g.desc}</p>
            </article>
          `
            )
            .join("")}
        </div>
      </section>

      <section class="card section-block">
        <h2>${dict.stationsTitle}</h2>
        <ol class="workflow" style="margin-bottom:0;">
          ${dict.stations.map((st) => `<li>${st}</li>`).join("")}
        </ol>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // PLATFORM VIEW (Online Food Court Mall & Delivery App)
  // --------------------------------------------------------------------------
  function renderPlatformView() {
    const dict = t().platformPage;
    const heroDict = t().hero;
    const cfg = state.config;

    let appAction = "";
    if (cfg.deliveryAppMode === "coming_soon") {
      appAction = `<span class="btn btn-secondary" style="cursor:default;">${heroDict.appComingSoon}</span>`;
    } else if (cfg.deliveryAppMode === "active" && cfg.deliveryAppUrl) {
      appAction = `<a href="${cfg.deliveryAppUrl}" target="_blank" rel="noopener" class="btn btn-primary">${heroDict.appDownload} ↗</a>`;
    }

    return `
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">${dict.eyebrow}</p>
          <h1>${dict.title}</h1>
          <p class="intro">${dict.intro}</p>
        </div>
      </div>

      <div class="metrics-grid">
        ${dict.features
          .map(
            (f) => `
          <article class="card" style="margin:0;">
            <h3>${f.title}</h3>
            <p class="hint" style="margin-top:8px;">${f.desc}</p>
          </article>
        `
          )
          .join("")}
      </div>

      <section class="card" style="margin-top:24px;">
        <h2>${dict.appBoxTitle}</h2>
        <p class="intro" style="margin-bottom:18px;">${dict.appBoxDesc}</p>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          ${appAction}
          <button type="button" class="btn btn-secondary" onclick="navigateTo('brands')">
            ${heroDict.brandBtn}
          </button>
        </div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // PEOPLE & CULTURE VIEW
  // --------------------------------------------------------------------------
  function renderPeopleView() {
    const dict = t().peoplePage;
    const cultureDict = t().culture;
    return `
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">${dict.eyebrow}</p>
          <h1>${dict.title}</h1>
        </div>
      </div>

      <aside class="callout">
        <strong style="font-size:18px; line-height:1.55;">${dict.intro}</strong>
      </aside>

      <div class="metrics-grid" style="margin-top:24px;">
        ${dict.values
          .map(
            (v) => `
          <article class="card" style="margin:0;">
            <h3>${v.title}</h3>
            <p class="hint" style="margin-top:8px;">${v.desc}</p>
          </article>
        `
          )
          .join("")}
      </div>

      <div style="margin-top:24px;">
        <button type="button" class="btn btn-primary" onclick="navigateTo('careers')">
          ${cultureDict.careerBtn}
        </button>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // CAREERS VIEW (11 Open Job Categories, Benefits, How to Apply)
  // --------------------------------------------------------------------------
  function renderCareersView() {
    const dict = t().careersPage;
    const cfg = state.config;

    const jobsHtml = state.jobs
      .map(
        (j) => `
        <div class="checklist-row">
          <div style="flex:1; min-width:240px;">
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:6px;">
              <span class="roster-badge">${loc(j, "dept")}</span>
              <small class="hint">${loc(j, "type")} · ${j.location}</small>
            </div>
            <h3>${loc(j, "title")}</h3>
            <p class="hint" style="margin-top:4px;">${loc(j, "desc")}</p>
          </div>
          <div>
            ${
              cfg.enableCareerForm
                ? `<button type="button" class="btn btn-primary" onclick="openApplyModal('${loc(j, "title").replace(/'/g, "")}')">${dict.formBtn}</button>`
                : `<a href="mailto:${cfg.careerEmail}?subject=${encodeURIComponent("[MUGGO Recruitment] " + loc(j, "title"))}" class="btn btn-primary">${dict.emailBtn}</a>`
            }
          </div>
        </div>
      `
      )
      .join("");

    return `
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">${dict.eyebrow}</p>
          <h1>${dict.title}</h1>
          <p class="intro">${dict.intro}</p>
        </div>
      </div>

      <section class="card">
        <h2>${dict.applyBoxTitle}</h2>
        <p class="hint" style="margin-bottom:14px;">${dict.applyBoxDesc}</p>
        <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
          <a href="mailto:${cfg.careerEmail}?subject=${encodeURIComponent("[MUGGO Indonesia] Job Application")}" class="btn btn-primary">
            ${dict.emailBtn} (${cfg.careerEmail})
          </a>
          <button type="button" class="btn btn-secondary" onclick="openApplyModal('MUGGO Open Application')">
            ${dict.formBtn}
          </button>
        </div>
      </section>

      <section class="section-block">
        <h2>${dict.benefitsTitle}</h2>
        <div class="columns">
          ${dict.benefits
            .map(
              (b) => `
            <article class="card" style="margin:0;">
              <h3>${b.title}</h3>
              <p class="hint" style="margin-top:6px;">${b.desc}</p>
            </article>
          `
            )
            .join("")}
        </div>
      </section>

      <section class="card">
        <h2>${dict.positionsTitle} (${state.jobs.length})</h2>
        <div>${jobsHtml}</div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // CONTACT VIEW
  // --------------------------------------------------------------------------
  function renderContactView() {
    const dict = t().contactPage;
    const cfg = state.config;
    const cleanWa = (cfg.whatsappNumber || "").replace(/[^0-9]/g, "");

    return `
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">${dict.eyebrow}</p>
          <h1>${dict.title}</h1>
          <p class="intro">${dict.intro}</p>
        </div>
      </div>

      <section class="card">
        <h3>${dict.addressLabel}</h3>
        <p style="margin-bottom:16px;">${cfg.officeAddress}</p>
        ${
          hasContactInfo()
            ? `<div style="display:grid; gap:10px;">
                ${cfg.whatsappNumber ? `<div><strong>WhatsApp:</strong> <a href="https://wa.me/${cleanWa}" target="_blank" rel="noopener">${cfg.whatsappNumber}</a></div>` : ""}
                ${cfg.contactEmail ? `<div><strong>Email:</strong> <a href="mailto:${cfg.contactEmail}">${cfg.contactEmail}</a></div>` : ""}
               </div>`
            : `<p class="hint">${dict.pendingNotice}</p>`
        }
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // ARTICLE DETAIL VIEW
  // --------------------------------------------------------------------------
  function renderArticleDetailView() {
    const dict = t().articles;
    const art = state.articles.find((a) => a.id === currentArticleId) || state.articles[0];
    if (!art) return "";
    const paragraphs = (loc(art, "content") || "")
      .split("\n\n")
      .map((p) => `<p style="margin-bottom:16px; line-height:1.8;">${p}</p>`)
      .join("");

    return `
      <div style="margin-bottom:16px;">
        <button type="button" class="btn btn-secondary" onclick="navigateTo('home')">${dict.backBtn}</button>
      </div>
      <article class="card">
        <div style="display:flex; gap:8px; align-items:center; margin-bottom:10px;">
          <span class="roster-badge">${loc(art, "category")}</span>
          <small class="hint">${art.date}</small>
        </div>
        <h1>${loc(art, "title")}</h1>
        <div style="margin-top:20px; padding-top:20px; border-top:1px solid var(--portal-line);">
          ${paragraphs}
        </div>
      </article>
    `;
  }

  // --------------------------------------------------------------------------
  // PRIVACY & TERMS VIEW (Trilingual)
  // --------------------------------------------------------------------------
  function renderPolicyView(type) {
    const cfg = state.config;
    const l = lang();
    const isPrivacy = type === "privacy";

    const copy = {
      id: {
        title: isPrivacy ? "Kebijakan Privasi (Privacy Policy)" : "Syarat & Ketentuan (Terms of Use)",
        body: isPrivacy
          ? `<p style="margin-bottom:14px;">${cfg.companyName} menghormati privasi pelamar kerja, pelanggan, dan mitra kami sesuai dengan Undang-Undang Pelindungan Data Pribadi (UU PDP) Indonesia.</p>
             <p style="margin-bottom:14px;">Data yang dikirimkan melalui saluran rekrutmen (${cfg.careerEmail}) hanya digunakan untuk proses seleksi dan administrasi SDM internal.</p>`
          : `<p style="margin-bottom:14px;">Situs web ini dioperasikan oleh ${cfg.companyName} untuk menyajikan informasi umum mengenai visi korporat, 30 brand kuliner, dan peluang karir.</p>
             <p>Seluruh angka target bisnis dan rencana pembukaan gerai merupakan target rencana usaha yang dapat disesuaikan mengikuti perkembangan operasional.</p>`
      },
      en: {
        title: isPrivacy ? "Privacy Policy" : "Terms of Use",
        body: isPrivacy
          ? `<p style="margin-bottom:14px;">${cfg.companyName} respects the privacy of job applicants, customers, and partners in compliance with Indonesian Personal Data Protection laws (UU PDP).</p>
             <p style="margin-bottom:14px;">Information submitted to our recruitment channel (${cfg.careerEmail}) is used strictly for hiring evaluation and HR administration.</p>`
          : `<p style="margin-bottom:14px;">This website is operated by ${cfg.companyName} to provide general corporate information regarding our vision, 30 culinary brands, and career opportunities.</p>
             <p>All business plan metrics and store expansion targets represent planned milestones subject to operational adjustments.</p>`
      },
      ko: {
        title: isPrivacy ? "개인정보처리방침" : "이용약관",
        body: isPrivacy
          ? `<p style="margin-bottom:14px;">${cfg.companyName}은 인도네시아 개인정보보호법(UU PDP) 및 관련 법령을 준수하며, 채용 지원(${cfg.careerEmail}) 및 문의를 위해 제공된 개인정보를 목적 범위 내에서만 안전하게 처리합니다.</p>`
          : `<p style="margin-bottom:14px;">본 사이트는 ${cfg.companyName}의 비전, 30개 브랜드, 채용에 관한 일반 정보를 제공할 목적으로 운영됩니다.</p>
             <p>사이트 내 기재된 브랜드 수, 확장 목표 지점 수 등 모든 수치는 사업 계획상 목표 기준이며 향후 변동될 수 있습니다.</p>`
      }
    }[l];

    return `
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">${cfg.companyName}</p>
          <h1>${copy.title}</h1>
        </div>
      </div>
      <section class="card">${copy.body}</section>
    `;
  }

  // ==========================================================================
  // ADMIN CMS MODAL (Role-Based: Super Admin vs HR Manager)
  // ==========================================================================
  window.openAdminModal = function (role, tab) {
    if (role) adminRole = role;
    if (adminRole === "hr" && tab !== "articles" && tab !== "careers") {
      adminTab = "articles";
    } else if (tab) {
      adminTab = tab;
    }
    const modal = document.getElementById("admin-modal");
    if (modal) {
      modal.classList.add("open");
      renderAdminModal();
    }
  };

  window.closeAdminModal = function () {
    const modal = document.getElementById("admin-modal");
    if (modal) modal.classList.remove("open");
  };

  window.switchAdminRole = function (role) {
    adminRole = role;
    if (role === "hr" && adminTab !== "articles" && adminTab !== "careers") {
      adminTab = "articles";
    }
    renderAdminModal();
  };

  window.switchAdminTab = function (tab) {
    if (adminRole === "hr" && tab !== "articles" && tab !== "careers") {
      alert("HR Manager (인사 담당자) 계정은 소식(Articles)과 채용 공고(Careers)만 수정할 수 있습니다.");
      return;
    }
    adminTab = tab;
    renderAdminModal();
  };

  function renderAdminModal() {
    const box = document.getElementById("admin-modal-content");
    if (!box) return;
    const cfg = state.config;
    const isHr = adminRole === "hr";

    let bodyHtml = "";
    if (adminTab === "general" && !isHr) {
      bodyHtml = `
        <div class="columns">
          <div class="form-field">
            <label>법인명 (Company Name)</label>
            <input type="text" id="adm-companyName" value="${cfg.companyName}" />
          </div>
          <div class="form-field">
            <label>대표자명 (CEO Name)</label>
            <input type="text" id="adm-ceoName" value="${cfg.ceoName}" />
          </div>
        </div>
        <div class="card" style="padding:16px; margin-bottom:16px;">
          <label style="display:flex; align-items:center; gap:10px; font-weight:700; cursor:pointer; margin-bottom:12px;">
            <input type="checkbox" id="adm-showKoreaHq" ${cfg.showKoreaHq ? "checked" : ""} />
            <span>한국 본사 관계 표시 켜기 (ON: 히어로 문구 A + 본사 섹션 + 푸터 링크 노출 / OFF: 문구 B + 본사 숨김)</span>
          </label>
          <div class="columns">
            <div class="form-field" style="margin:0;">
              <label>한국 본사명</label>
              <input type="text" id="adm-koreaHqName" value="${cfg.koreaHqName}" />
            </div>
            <div class="form-field" style="margin:0;">
              <label>한국 본사 링크 URL</label>
              <input type="text" id="adm-koreaHqUrl" value="${cfg.koreaHqUrl}" />
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-primary" onclick="saveGeneralAdmin()">저장 및 반영</button>
      `;
    } else if (adminTab === "sns_contact" && !isHr) {
      bodyHtml = `
        <div class="columns">
          <div class="form-field">
            <label>Instagram (@muggo.indonesia)</label>
            <input type="text" id="adm-igUrl" value="${cfg.instagramUrl}" />
          </div>
          <div class="form-field">
            <label>TikTok (@muggo1)</label>
            <input type="text" id="adm-ttUrl" value="${cfg.tiktokUrl}" />
          </div>
          <div class="form-field">
            <label>WhatsApp 번호 (비워두면 자동 숨김)</label>
            <input type="text" id="adm-wa" value="${cfg.whatsappNumber}" placeholder="+62 812-..." />
          </div>
          <div class="form-field">
            <label>문의 이메일 (비워두면 자동 숨김)</label>
            <input type="text" id="adm-email" value="${cfg.contactEmail}" placeholder="contact@muggo.co.id" />
          </div>
          <div class="form-field">
            <label>자체 배달 앱 버튼 상태</label>
            <select id="adm-appMode">
              <option value="coming_soon" ${cfg.deliveryAppMode === "coming_soon" ? "selected" : ""}>오픈 예정 표시</option>
              <option value="hidden" ${cfg.deliveryAppMode === "hidden" ? "selected" : ""}>숨김</option>
              <option value="active" ${cfg.deliveryAppMode === "active" ? "selected" : ""}>링크 활성화</option>
            </select>
          </div>
          <div class="form-field">
            <label>배달 앱 링크 URL</label>
            <input type="text" id="adm-appUrl" value="${cfg.deliveryAppUrl}" placeholder="https://..." />
          </div>
        </div>
        <button type="button" class="btn btn-primary" onclick="saveSnsContactAdmin()">저장 및 반영</button>
      `;
    } else if (adminTab === "articles") {
      bodyHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
          <p class="hint">등록된 소식 항목이 0개가 되면 홈 화면에서 소식 섹션이 자동으로 숨겨집니다.</p>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn btn-secondary" onclick="clearArticlesAdmin()">전체 비우기 (자동 숨김 테스트)</button>
            <button type="button" class="btn btn-primary" onclick="addArticleAdmin()">+ 소식 추가</button>
          </div>
        </div>
        ${state.articles
          .map(
            (art, idx) => `
          <div class="card" style="padding:14px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <strong>#${idx + 1} (${art.date})</strong>
              <button type="button" class="nav-btn" style="color:var(--ui-danger);" onclick="deleteArticleAdmin('${art.id}')">삭제</button>
            </div>
            <div class="form-field" style="margin-bottom:8px;">
              <label>Judul (ID)</label>
              <input type="text" id="adm-art-id-${idx}" value="${art.titleId}" />
            </div>
            <div class="form-field" style="margin-bottom:8px;">
              <label>Title (EN)</label>
              <input type="text" id="adm-art-en-${idx}" value="${art.titleEn}" />
            </div>
            <div class="form-field" style="margin:0;">
              <label>제목 (KO)</label>
              <input type="text" id="adm-art-ko-${idx}" value="${art.titleKo}" />
            </div>
          </div>
        `
          )
          .join("")}
        ${state.articles.length > 0 ? `<button type="button" class="btn btn-primary" onclick="saveArticlesAdmin()">소식 저장</button>` : ""}
      `;
    } else if (adminTab === "careers") {
      bodyHtml = `
        <div class="form-field">
          <label>채용 접수 이메일</label>
          <input type="text" id="adm-careerEmail" value="${cfg.careerEmail}" />
        </div>
        <button type="button" class="btn btn-primary" onclick="saveCareersAdmin()">저장</button>
      `;
    }

    box.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:10px; margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--portal-line);">
        <div class="filter-pills" style="margin:0;">
          <button type="button" class="filter-pill ${!isHr ? "active" : ""}" onclick="switchAdminRole('super')">Super Admin (전체 권한)</button>
          <button type="button" class="filter-pill ${isHr ? "active" : ""}" onclick="switchAdminRole('hr')">HR Manager (stg_hr_20261022 · 소식/채용 전용)</button>
        </div>
      </div>

      <div class="filter-pills">
        <button type="button" class="filter-pill ${adminTab === "general" ? "active" : ""}" onclick="switchAdminTab('general')" style="${isHr ? "opacity:0.4;" : ""}">법인 · 본사 ON/OFF</button>
        <button type="button" class="filter-pill ${adminTab === "sns_contact" ? "active" : ""}" onclick="switchAdminTab('sns_contact')" style="${isHr ? "opacity:0.4;" : ""}">SNS · 연락처 · 앱</button>
        <button type="button" class="filter-pill ${adminTab === "articles" ? "active" : ""}" onclick="switchAdminTab('articles')">소식 (${state.articles.length})</button>
        <button type="button" class="filter-pill ${adminTab === "careers" ? "active" : ""}" onclick="switchAdminTab('careers')">채용 (${state.jobs.length})</button>
      </div>

      <div>${bodyHtml}</div>
    `;
  }

  window.saveGeneralAdmin = function () {
    state.config.companyName = document.getElementById("adm-companyName").value;
    state.config.ceoName = document.getElementById("adm-ceoName").value;
    state.config.showKoreaHq = document.getElementById("adm-showKoreaHq").checked;
    state.config.koreaHqName = document.getElementById("adm-koreaHqName").value;
    state.config.koreaHqUrl = document.getElementById("adm-koreaHqUrl").value;
    saveState();
    closeAdminModal();
  };

  window.saveSnsContactAdmin = function () {
    state.config.instagramUrl = document.getElementById("adm-igUrl").value;
    state.config.tiktokUrl = document.getElementById("adm-ttUrl").value;
    state.config.whatsappNumber = document.getElementById("adm-wa").value;
    state.config.contactEmail = document.getElementById("adm-email").value;
    state.config.deliveryAppMode = document.getElementById("adm-appMode").value;
    state.config.deliveryAppUrl = document.getElementById("adm-appUrl").value;
    saveState();
    closeAdminModal();
  };

  window.clearArticlesAdmin = function () {
    state.articles = [];
    saveState();
    renderAdminModal();
  };

  window.addArticleAdmin = function () {
    state.articles.unshift({
      id: "art-" + Date.now(),
      date: "2026.10.30",
      categoryId: "Pengumuman",
      categoryEn: "Update",
      categoryKo: "공지",
      titleId: "Pengumuman Baru MUGGO Indonesia",
      titleEn: "New Update from MUGGO Indonesia",
      titleKo: "MUGGO 인도네시아 신규 소식",
      summaryId: "Ringkasan berita terbaru dari tim HR.",
      summaryEn: "Latest update summary from the HR team.",
      summaryKo: "인사 담당자가 등록한 신규 소식입니다.",
      contentId: "Detail pengumuman.",
      contentEn: "Announcement details.",
      contentKo: "상세 내용입니다."
    });
    saveState();
    renderAdminModal();
  };

  window.deleteArticleAdmin = function (id) {
    state.articles = state.articles.filter((a) => a.id !== id);
    saveState();
    renderAdminModal();
  };

  window.saveArticlesAdmin = function () {
    state.articles.forEach((art, idx) => {
      const idEl = document.getElementById(`adm-art-id-${idx}`);
      const enEl = document.getElementById(`adm-art-en-${idx}`);
      const koEl = document.getElementById(`adm-art-ko-${idx}`);
      if (idEl) art.titleId = idEl.value;
      if (enEl) art.titleEn = enEl.value;
      if (koEl) art.titleKo = koEl.value;
    });
    saveState();
    closeAdminModal();
  };

  window.saveCareersAdmin = function () {
    const el = document.getElementById("adm-careerEmail");
    if (el) state.config.careerEmail = el.value;
    saveState();
    closeAdminModal();
  };

  // Image Spec Modal & Apply Modal
  window.openSpecModal = function () {
    const m = document.getElementById("spec-modal");
    if (m) m.classList.add("open");
  };
  window.closeSpecModal = function () {
    const m = document.getElementById("spec-modal");
    if (m) m.classList.remove("open");
  };
  window.openApplyModal = function (roleTitle) {
    const m = document.getElementById("apply-modal");
    if (m) {
      m.classList.add("open");
      const input = document.getElementById("apply-role-input");
      if (input) input.value = roleTitle || "";
    }
  };
  window.closeApplyModal = function () {
    const m = document.getElementById("apply-modal");
    if (m) m.classList.remove("open");
  };
  window.submitCareerForm = function (e) {
    e.preventDefault();
    const role = document.getElementById("apply-role-input").value;
    const name = document.getElementById("apply-name-input").value;
    const contact = document.getElementById("apply-contact-input").value;
    const msg = document.getElementById("apply-msg-input").value;
    const subject = `[MUGGO Application] ${role} - ${name}`;
    const body = `Role: ${role}\nName: ${name}\nContact: ${contact}\n\nMessage:\n${msg}`;
    window.location.href = `mailto:${state.config.careerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    closeApplyModal();
  };

  function renderAll() {
    renderChrome();
    renderMain();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.lang = lang();
    updateSeoMeta();
    renderAll();
  });
})();
