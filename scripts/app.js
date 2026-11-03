// ==========================================================================
// CORPORATE & RECRUITMENT VERIFICATION APPLICATION (scripts/app.js)
// Reads all single-source configuration values from window.SITE_CONFIG (site.config.js)
// ==========================================================================

(function () {
  const LANG_KEY = "mokgo-language";
  const THEME_KEY = "muggo-theme";

  function cfg() {
    return window.SITE_CONFIG || {};
  }

  function getHandleFromUrl(url, prefixAt = true) {
    if (!url) return "";
    const cleaned = String(url).replace(/\/+$/, "");
    const lastSeg = cleaned.split("/").pop() || "";
    const handle = lastSeg.replace(/^@/, "");
    if (!handle) return "";
    return prefixAt ? `@${handle}` : handle;
  }

  // Interpolate placeholders from window.SITE_CONFIG so nothing is duplicated
  function interp(str) {
    if (typeof str !== "string") return str || "";
    const c = cfg();
    const bCount = Number(c.brandCount) || 30;
    const mCount = bCount * 10;
    const igHandle = getHandleFromUrl(c.instagramUrl, true);
    const ttHandle = getHandleFromUrl(c.tiktokUrl, true);
    return str
      .replace(/\{legalName\}/g, c.legalName || "")
      .replace(/\{brandName\}/g, c.brandName || "")
      .replace(/\{address\}/g, c.address || "")
      .replace(/\{contactEmail\}/g, c.contactEmail || "")
      .replace(/\{brandCount\}/g, String(bCount))
      .replace(/\{menuCount\}/g, String(mCount))
      .replace(/\{instagramHandle\}/g, igHandle)
      .replace(/\{tiktokHandle\}/g, ttHandle);
  }

  function interpDeep(val) {
    if (typeof val === "string") return interp(val);
    if (Array.isArray(val)) return val.map(interpDeep);
    if (val && typeof val === "object") {
      const out = {};
      for (const k of Object.keys(val)) {
        out[k] = interpDeep(val[k]);
      }
      return out;
    }
    return val;
  }

  let state = {
    currentLang: cfg().defaultLanguage || "id",
    metrics: JSON.parse(JSON.stringify((window.DEFAULT_SITE_DATA && window.DEFAULT_SITE_DATA.metrics) || [])),
    articles: JSON.parse(JSON.stringify((window.DEFAULT_SITE_DATA && window.DEFAULT_SITE_DATA.articles) || [])),
    jobs: JSON.parse(JSON.stringify((window.DEFAULT_SITE_DATA && window.DEFAULT_SITE_DATA.jobs) || [])),
    footnotes: JSON.parse(JSON.stringify((window.DEFAULT_SITE_DATA && window.DEFAULT_SITE_DATA.footnotes) || []))
  };

  if (cfg().languageSwitchVisible) {
    try {
      const savedLang = localStorage.getItem(LANG_KEY);
      if (["id", "en", "ko"].includes(savedLang)) {
        state.currentLang = savedLang;
      }
    } catch (e) {}
  } else {
    state.currentLang = cfg().defaultLanguage || "id";
  }

  let currentRoute = "home";
  let currentArticleId = null;
  let selectedBrandCategory = "all";
  let brandSearchQuery = "";
  let expandedBrands = {};
  let lastFocusedTrigger = null;

  function lang() {
    if (!cfg().languageSwitchVisible) return cfg().defaultLanguage || "id";
    return ["id", "en", "ko"].includes(state.currentLang) ? state.currentLang : "id";
  }

  function t() {
    const raw = (window.I18N_DICT && window.I18N_DICT[lang()]) || (window.I18N_DICT && window.I18N_DICT.id) || {};
    return interpDeep(raw);
  }

  function loc(obj, prefix) {
    if (!obj) return "";
    const l = lang();
    const suffix = l === "id" ? "Id" : l === "en" ? "En" : "Ko";
    const val = obj[prefix + suffix] || obj[prefix + "Id"] || obj[prefix + "Ko"] || obj[prefix] || "";
    return interp(val);
  }

  function locBrand(obj, field) {
    if (!obj) return "";
    const l = lang();
    const val = obj[`${field}_${l}`] || obj[`${field}_id`] || obj[`${field}_en`] || obj[`${field}_ko`] || "";
    return interp(val);
  }

  // ==========================================================================
  // OPTIONAL CSV SHEET LOADER (newsSheetCsvUrl & jobsSheetCsvUrl)
  // Empty URL => uses fallback content in data/site-data.js
  // ==========================================================================
  function parseCsv(csvText) {
    const rows = [];
    let current = "";
    let inQuotes = false;
    let row = [];
    for (let i = 0; i < csvText.length; i++) {
      const ch = csvText[i];
      const next = csvText[i + 1];
      if (inQuotes) {
        if (ch === '"' && next === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          row.push(current.trim());
          current = "";
        } else if (ch === "\n" || ch === "\r") {
          if (ch === "\r" && next === "\n") i++;
          row.push(current.trim());
          if (row.some((cell) => cell !== "")) rows.push(row);
          row = [];
          current = "";
        } else {
          current += ch;
        }
      }
    }
    row.push(current.trim());
    if (row.some((cell) => cell !== "")) rows.push(row);
    if (rows.length < 2) return [];
    const headers = rows[0];
    return rows.slice(1).map((r) => {
      const obj = {};
      headers.forEach((h, idx) => {
        if (h) obj[h] = r[idx] !== undefined ? r[idx] : "";
      });
      return obj;
    });
  }

  async function loadOptionalCsvSheets() {
    const c = cfg();
    if (c.newsSheetCsvUrl && c.newsSheetCsvUrl.trim() !== "") {
      try {
        const res = await fetch(c.newsSheetCsvUrl.trim());
        if (res.ok) {
          const parsed = parseCsv(await res.text());
          if (parsed.length > 0) {
            state.articles = parsed.map((item, idx) => ({
              id: item.id || `art-${idx + 1}`,
              date: item.date || "",
              categoryId: item.categoryId || item.category || "",
              categoryEn: item.categoryEn || item.category || "",
              categoryKo: item.categoryKo || item.category || "",
              titleId: item.titleId || item.title || "",
              titleEn: item.titleEn || item.title || "",
              titleKo: item.titleKo || item.title || "",
              summaryId: item.summaryId || item.summary || "",
              summaryEn: item.summaryEn || item.summary || "",
              summaryKo: item.summaryKo || item.summary || "",
              contentId: item.contentId || item.content || "",
              contentEn: item.contentEn || item.content || "",
              contentKo: item.contentKo || item.content || ""
            }));
            renderAll();
          }
        }
      } catch (e) {}
    }

    if (c.jobsSheetCsvUrl && c.jobsSheetCsvUrl.trim() !== "") {
      try {
        const res = await fetch(c.jobsSheetCsvUrl.trim());
        if (res.ok) {
          const parsed = parseCsv(await res.text());
          if (parsed.length > 0) {
            state.jobs = parsed.map((item, idx) => ({
              id: item.id || `job-${idx + 1}`,
              titleId: item.titleId || item.title || "",
              titleEn: item.titleEn || item.title || "",
              titleKo: item.titleKo || item.title || "",
              deptId: item.deptId || item.dept || "",
              deptEn: item.deptEn || item.dept || "",
              deptKo: item.deptKo || item.dept || "",
              typeId: item.typeId || item.type || "",
              typeEn: item.typeEn || item.type || "",
              typeKo: item.typeKo || item.type || "",
              location: item.location || "Jakarta Selatan",
              descId: item.descId || item.desc || "",
              descEn: item.descEn || item.desc || "",
              descKo: item.descKo || item.desc || ""
            }));
            renderAll();
          }
        }
      } catch (e) {}
    }
  }

  // Clean Lucide SVG stroke icons
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

  window.setSiteLang = function (newLang) {
    if (!["id", "en", "ko"].includes(newLang)) return;
    if (window.SITE_CONFIG) window.SITE_CONFIG.languageSwitchVisible = true;
    state.currentLang = newLang;
    document.documentElement.lang = newLang;
    try {
      localStorage.setItem(LANG_KEY, newLang);
    } catch (e) {}
    syncApplyModalText();
    updateSeoMeta();
    renderAll();
  };

  window.openSnsChannel = function (event, platform) {
    if (event) event.preventDefault();
    const c = cfg();
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (platform === "instagram") {
      const url = c.instagramUrl || "";
      const username = getHandleFromUrl(url, false);
      if (!url) return;
      if (isMobile && username) {
        const start = Date.now();
        window.location.href = `instagram://user?username=${encodeURIComponent(username)}`;
        setTimeout(() => {
          if (Date.now() - start < 1500) window.open(url, "_blank", "noopener,noreferrer");
        }, 700);
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (platform === "tiktok") {
      const url = c.tiktokUrl || "";
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // ==========================================================================
  // URL HASH ROUTING & BROWSER HISTORY SYNC
  // ==========================================================================
  const VALID_ROUTES = ["home", "careers", "people", "food-rnd", "platform", "brands", "contact", "privacy", "terms"];

  function routeToHash(route, param) {
    if (route === "article-detail" && param) {
      return `#article/${param}`;
    }
    if (VALID_ROUTES.includes(route)) {
      return `#${route}`;
    }
    return "#home";
  }

  function parseHashToRoute(rawHash) {
    const clean = (rawHash || "").replace(/^#\/?/, "").trim();
    if (!clean || clean === "main-content") {
      return { route: "home", param: null };
    }
    if (clean.startsWith("article/")) {
      const artId = clean.slice("article/".length);
      return { route: "article-detail", param: artId || "art-1" };
    }
    if (VALID_ROUTES.includes(clean)) {
      return { route: clean, param: null };
    }
    return { route: "home", param: null };
  }

  window.navigateTo = function (route, param, skipHistory) {
    currentRoute = route;
    if (route === "article-detail" && param) {
      currentArticleId = param;
    }
    const targetHash = routeToHash(route, currentArticleId);
    if (!skipHistory && window.location.hash !== targetHash) {
      try {
        window.history.pushState({ route: currentRoute, param: currentArticleId }, "", targetHash);
      } catch (e) {
        window.location.hash = targetHash;
      }
    }
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) drawer.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
    updateSeoMeta();
    renderAll();
  };

  window.addEventListener("popstate", () => {
    const parsed = parseHashToRoute(window.location.hash);
    currentRoute = parsed.route;
    if (parsed.param) currentArticleId = parsed.param;
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) drawer.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "auto" });
    updateSeoMeta();
    renderAll();
  });

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#main-content") return;
    const parsed = parseHashToRoute(window.location.hash);
    if (parsed.route !== currentRoute || (parsed.route === "article-detail" && parsed.param !== currentArticleId)) {
      currentRoute = parsed.route;
      if (parsed.param) currentArticleId = parsed.param;
      updateSeoMeta();
      renderAll();
    }
  });

  window.toggleMobileDrawer = function () {
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) drawer.classList.toggle("open");
  };

  function hasValidKoreaHqUrl() {
    const url = (cfg().koreaHqUrl || "").trim();
    return Boolean(url && /^https?:\/\//i.test(url));
  }

  function hasWhatsApp() {
    const wa = (cfg().whatsappNumber || "").trim();
    return wa.length > 0;
  }

  function updateSeoMeta() {
    const dict = t();
    const c = cfg();
    const navMap = {
      home: dict.nav.home,
      careers: dict.nav.careers,
      people: dict.nav.people,
      "food-rnd": dict.nav.foodRnd,
      platform: dict.nav.platform,
      brands: dict.nav.brands,
      contact: dict.nav.contact,
      privacy: dict.footer.privacy,
      terms: dict.footer.terms
    };
    const pageTitle = `${navMap[currentRoute] || dict.nav.home} · ${c.legalName} (${c.brandName})`;
    document.title = pageTitle;

    const setMeta = (selector, val) => {
      const el = document.querySelector(selector);
      if (el && val) el.setAttribute("content", val);
    };
    setMeta('meta[name="description"]', dict.footer.desc);
    setMeta('meta[property="og:site_name"]', `${c.legalName} (${c.brandName})`);
    setMeta('meta[property="og:title"]', pageTitle);
    setMeta('meta[property="og:description"]', dict.hero.subcopyA);

    const skip = document.getElementById("skip-link");
    if (skip) skip.textContent = dict.skipToContent;
  }

  // ==========================================================================
  // CORPORATE IDENTITY & RECRUITMENT VERIFICATION COMPONENT
  // ==========================================================================
  function renderIdentityVerificationCard(showContactBtn = true) {
    const dict = t().identityCard;
    const c = cfg();
    if (!dict) return "";

    return `
      <section class="card section-block" aria-label="${dict.title}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
          <div>
            <p class="eyebrow">${dict.eyebrow}</p>
            <h2 style="margin-bottom:6px;">${dict.title}</h2>
          </div>
          <span class="roster-badge">Pre-Opening · Verified</span>
        </div>
        <p class="intro" style="margin-bottom:18px;">${dict.intro}</p>

        <div class="columns" style="margin-bottom:16px;">
          <div style="background:var(--ui-surface-muted); border:1px solid var(--portal-line); border-radius:10px; padding:14px 16px;">
            <small class="hint" style="display:block; font-weight:700;">${dict.legalLabel}</small>
            <strong style="font-size:17px; color:var(--ui-text);">${c.legalName}</strong>
          </div>
          <div style="background:var(--ui-surface-muted); border:1px solid var(--portal-line); border-radius:10px; padding:14px 16px;">
            <small class="hint" style="display:block; font-weight:700;">${dict.brandLabel}</small>
            <strong style="font-size:17px; color:var(--ui-link);">${c.brandName}</strong>
          </div>
          <div style="background:var(--ui-surface-muted); border:1px solid var(--portal-line); border-radius:10px; padding:14px 16px;">
            <small class="hint" style="display:block; font-weight:700;">${dict.statusLabel}</small>
            <strong style="font-size:14.5px; color:var(--ui-text);">${dict.statusValue}</strong>
          </div>
          <div style="background:var(--ui-surface-muted); border:1px solid var(--portal-line); border-radius:10px; padding:14px 16px;">
            <small class="hint" style="display:block; font-weight:700;">${dict.purposeLabel}</small>
            <strong style="font-size:14.5px; color:var(--ui-text);">${c.address}</strong>
          </div>
        </div>

        <aside class="callout" style="margin:0;">
          <strong style="display:block; font-size:14px; color:var(--ui-link); margin-bottom:4px;">✓ ${dict.antiFraudTitle}</strong>
          <p class="hint" style="color:var(--ui-text);">${dict.antiFraudDesc}</p>
        </aside>

        ${
          showContactBtn
            ? `<div style="margin-top:16px;">
                <button type="button" class="btn btn-secondary" onclick="navigateTo('contact')">
                  ${dict.contactLinkBtn}
                </button>
              </div>`
            : ""
        }
      </section>
    `;
  }

  // ==========================================================================
  // RENDER HEADER, FOOTER, MOBILE STICKY BAR
  // ==========================================================================
  function renderChrome() {
    const dict = t();
    const c = cfg();
    const l = lang();
    const isDark = currentTheme() === "dark";
    const igHandle = getHandleFromUrl(c.instagramUrl, true);
    const ttHandle = getHandleFromUrl(c.tiktokUrl, true);

    // ① Header
    const header = document.getElementById("site-header");
    if (header) {
      const navItems = [
        { id: "home", label: dict.nav.home },
        { id: "brands", label: dict.nav.brands },
        { id: "food-rnd", label: dict.nav.foodRnd },
        { id: "platform", label: dict.nav.platform },
        { id: "people", label: dict.nav.people },
        { id: "careers", label: dict.nav.careers },
        { id: "contact", label: dict.nav.contact }
      ];

      const navButtonsHtml = navItems
        .map(
          (item) =>
            `<button type="button" class="nav-btn" ${currentRoute === item.id ? 'aria-current="page"' : ""} onclick="navigateTo('${item.id}')">${item.label}</button>`
        )
        .join("");

      const themeTitle = dict.themeLabel[isDark ? 1 : 0];

      // Controlled by SITE_CONFIG.languageSwitchVisible (false at launch => hidden)
      const langControlHtml = c.languageSwitchVisible
        ? `<div class="lang-segmented" role="group" aria-label="Bahasa / Language / 언어">
            <button type="button" class="lang-seg-btn ${l === "id" ? "active" : ""}" onclick="setSiteLang('id')" title="Bahasa Indonesia">ID</button>
            <button type="button" class="lang-seg-btn ${l === "en" ? "active" : ""}" onclick="setSiteLang('en')" title="English">EN</button>
            <button type="button" class="lang-seg-btn ${l === "ko" ? "active" : ""}" onclick="setSiteLang('ko')" title="한국어">KO</button>
          </div>`
        : "";

      header.innerHTML = `
        <div class="header-inner">
          <a class="brand" href="#home" onclick="navigateTo('home'); return false;">
            <span class="brand-mark">${c.brandName}</span>
            <span class="brand-text">
              <strong>먹고</strong>
              <span>${c.brandName} / JAKARTA</span>
            </span>
          </a>

          <nav class="desktop-nav" aria-label="Main Navigation">
            ${navButtonsHtml}
          </nav>

          <div class="header-tools">
            <button id="themeToggle" type="button" class="icon-btn" onclick="toggleTheme()" aria-label="${themeTitle}" title="${themeTitle}">
              ${svgIcon(isDark ? "sun" : "moon", 17)}
            </button>

            ${langControlHtml}

            <button type="button" class="icon-btn mobile-menu-toggle" onclick="toggleMobileDrawer()" aria-label="Menu">
              ${svgIcon("menu", 19)}
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
      const cleanWa = (c.whatsappNumber || "").replace(/[^0-9]/g, "");
      const waHtml = hasWhatsApp()
        ? `<div><strong>WhatsApp:</strong> <a href="https://wa.me/${cleanWa}" target="_blank" rel="noopener">${c.whatsappNumber}</a></div>`
        : "";
      const emailHtml = c.contactEmail
        ? `<div><strong>${dict.footer.emailLabel}</strong> <a href="mailto:${c.contactEmail}" style="color:var(--ui-link); font-weight:700;">${c.contactEmail}</a></div>`
        : "";

      const contactHtml = `<div style="margin-top:10px; line-height:1.75;">
          <div><strong>${dict.footer.registeredLabel}</strong> ${c.address}</div>
          ${waHtml}
          ${emailHtml}
        </div>`;

      // Controlled by SITE_CONFIG.showKoreaHqBlock
      const koreaHqLinkHtml =
        c.showKoreaHqBlock && hasValidKoreaHqUrl()
          ? `<li><a href="${c.koreaHqUrl}" target="_blank" rel="noopener noreferrer">${dict.koreaHq.linkText} ↗</a></li>`
          : "";

      footer.innerHTML = `
        <div class="footer-grid">
          <div>
            <div class="brand" style="margin-bottom:10px;">
              <span class="brand-mark">${c.brandName}</span>
              <span class="brand-text">
                <strong>먹고</strong>
                <span>${c.brandName} / JAKARTA</span>
              </span>
            </div>
            <p style="font-weight:700; color:var(--ui-text); margin-bottom:4px;">${c.legalName} (Brand: ${c.brandName})</p>
            <p style="max-width:460px; line-height:1.65;">${dict.footer.desc}</p>
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
              <li><button type="button" onclick="navigateTo('contact')">${dict.nav.contact}</button></li>
              ${koreaHqLinkHtml}
            </ul>
          </div>

          <div>
            <p class="eyebrow" style="margin-bottom:10px;">SOCIAL & CHANNELS</p>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              <a href="${c.instagramUrl}" onclick="openSnsChannel(event, 'instagram')" class="btn btn-secondary" style="padding:8px 14px; min-height:36px; font-size:13px;">
                Instagram (${igHandle})
              </a>
              <a href="${c.tiktokUrl}" onclick="openSnsChannel(event, 'tiktok')" class="btn btn-secondary" style="padding:8px 14px; min-height:36px; font-size:13px;">
                TikTok (${ttHandle})
              </a>
            </div>
          </div>
        </div>

        <div style="padding-top:18px; border-top:1px solid var(--portal-line); display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px;">
          <div>© 2026 ${c.legalName} (Brand: ${c.brandName}). All rights reserved.</div>
          <ul class="footer-nav-links">
            <li><button type="button" onclick="navigateTo('privacy')">${dict.footer.privacy}</button></li>
            <li><button type="button" onclick="navigateTo('terms')">${dict.footer.terms}</button></li>
            <li><button type="button" onclick="openSpecModal(this)">${dict.footer.specLink}</button></li>
          </ul>
        </div>
      `;
    }

    // Mobile Sticky Bottom Action Bar (Instagram / TikTok / Lamar Karir; WhatsApp hidden when empty)
    const stickyBar = document.getElementById("mobile-sticky-bar");
    if (stickyBar) {
      const cleanWa = (c.whatsappNumber || "").replace(/[^0-9]/g, "");
      const waBtn = hasWhatsApp()
        ? `<a href="https://wa.me/${cleanWa}" target="_blank" rel="noopener" class="sticky-btn">${dict.sticky.whatsapp}</a>`
        : "";

      stickyBar.innerHTML = `
        <div class="sticky-inner">
          <a href="${c.instagramUrl}" onclick="openSnsChannel(event, 'instagram')" class="sticky-btn">
            ${dict.sticky.instagram}
          </a>
          <a href="${c.tiktokUrl}" onclick="openSnsChannel(event, 'tiktok')" class="sticky-btn">
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
  // HOME VIEW
  // --------------------------------------------------------------------------
  function renderHomeView() {
    const dict = t();
    const c = cfg();
    const headline = c.showKoreaHqBlock ? dict.hero.headlineA : dict.hero.headlineB;
    const subcopy = c.showKoreaHqBlock ? dict.hero.subcopyA : dict.hero.subcopyB;

    let appButtonHtml = "";
    if (c.deliveryAppMode === "coming_soon") {
      appButtonHtml = `<span class="btn btn-secondary" style="cursor:default;">${dict.hero.appComingSoon}</span>`;
    } else if (c.deliveryAppMode === "active" && c.deliveryAppUrl) {
      appButtonHtml = `<a href="${c.deliveryAppUrl}" target="_blank" rel="noopener" class="btn btn-secondary">${dict.hero.appDownload} ↗</a>`;
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

    // Featured Planned Brands Preview
    const featuredIds = ["sotdak", "seongsu-dak", "bap-club", "pantry12", "salad-pick", "bing-ha"];
    const featuredBrands = (window.MUGGO_CATALOG || []).filter((b) => featuredIds.includes(b.id));
    const featuredBrandsHtml = featuredBrands
      .map(
        (b) => `
        <div class="brand-card" onclick="navigateTo('brands')" style="cursor:pointer;">
          <div class="brand-card-header">
            <img src="${b.logo}" alt="${locBrand(b, "name")}" class="brand-thumb" loading="lazy" />
            <div>
              <span class="roster-badge">${b.category} · ${dict.brandsPage.preOpeningTag || "Pra-Pembukaan"}</span>
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

    // Korea HQ Block (Controlled by SITE_CONFIG.showKoreaHqBlock; link hidden when koreaHqUrl is empty)
    const koreaHqActionHtml = hasValidKoreaHqUrl()
      ? `<a href="${c.koreaHqUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="margin-top:14px;">${dict.koreaHq.linkText} ↗</a>`
      : "";

    const koreaHqHtml = c.showKoreaHqBlock
      ? `
        <section id="korea-hq-block" class="card section-block">
          <p class="eyebrow">${dict.koreaHq.eyebrow}</p>
          <h2>${dict.koreaHq.title}</h2>
          <p class="intro">${dict.koreaHq.desc}</p>
          ${koreaHqActionHtml}
        </section>
      `
      : "";

    // ⑤ Metrics (6 pre-opening indicators)
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

    const roadmapHtml = c.showRegionalRoadmap
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
                  ${art.date ? `<small class="hint">${art.date}</small>` : ""}
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
            <button type="button" class="btn btn-secondary" onclick="navigateTo('contact')">
              ${dict.nav.contact}
            </button>
            ${appButtonHtml}
          </div>
        </div>
        <div class="hero-visual">
          <img src="assets/muggo-brand-hero.jpg" alt="${c.legalName} - ${c.brandName}" />
        </div>
      </section>

      <!-- Official Company Identity & Recruitment Verification Block -->
      ${renderIdentityVerificationCard(true)}

      <!-- ⑥ Our Culture -->
      <section class="card section-block">
        <p class="eyebrow">${dict.culture.eyebrow}</p>
        <h2>${dict.culture.title}</h2>
        <aside class="callout">
          <strong style="font-size:17px; line-height:1.55; display:block;">${dict.culture.quote}</strong>
        </aside>
        <p class="intro" style="margin-bottom:18px;">${dict.culture.desc}</p>
        <div style="display:flex; flex-wrap:wrap; gap:10px;">
          <button type="button" class="btn btn-primary" onclick="navigateTo('careers')">${dict.culture.careerBtn}</button>
          <button type="button" class="btn btn-secondary" onclick="navigateTo('people')">${dict.culture.peopleBtn}</button>
        </div>
      </section>

      <!-- ④ Leadership Message (ceoName hidden when empty) -->
      <section class="card section-block">
        <p class="eyebrow">${dict.ceo.eyebrow}</p>
        <h2>${dict.ceo.titlePrefix}${c.ceoName ? ` · ${c.ceoName}` : ""}</h2>
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
          <span class="hint">${c.legalName} (Brand: ${c.brandName})</span>
          <strong>${dict.ceo.signRole}${c.ceoName ? ` · ${c.ceoName}` : ""}</strong>
        </div>
      </section>

      <!-- ③ Our Pillars & Planned Brand Concepts -->
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

      <!-- ⑤ Pre-Opening Plan & Target Metrics -->
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

      <!-- ⑦ Official Announcements -->
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
  // PLANNED BRANDS VIEW
  // --------------------------------------------------------------------------
  window.setBrandCatFilter = function (cat) {
    selectedBrandCategory = cat;
    renderMain();
  };

  window.handleBrandSearch = function (val) {
    brandSearchQuery = val || "";
    expandedBrands = {};
    renderBrandCardsDOM();
  };

  window.resetBrandSearch = function () {
    brandSearchQuery = "";
    selectedBrandCategory = "all";
    expandedBrands = {};
    renderMain();
  };

  window.toggleBrandMenus = function (brandId) {
    const hasSearch = brandSearchQuery.trim().length > 0;
    const currentlyExpanded = expandedBrands[brandId] !== undefined ? expandedBrands[brandId] : hasSearch;
    expandedBrands[brandId] = !currentlyExpanded;
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
    const hasSearch = brandSearchQuery.trim().length > 0;

    if (brands.length === 0) {
      container.innerHTML = `
        <div class="empty-search-state" role="status" aria-live="polite">
          <h3 style="margin-bottom:8px;">${dict.emptySearchTitle}</h3>
          <p class="hint" style="max-width:480px; margin:0 auto 18px;">${dict.emptySearchDesc}</p>
          <button type="button" class="btn btn-primary" onclick="resetBrandSearch()">
            ${dict.resetSearchBtn}
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = brands
      .map((b) => {
        const isExpanded = expandedBrands[b.id] !== undefined ? expandedBrands[b.id] : hasSearch;
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
                    <small class="hint" style="white-space:nowrap; font-size:11.5px;">${dict.preOpeningTag || "Pra-Pembukaan"}</small>
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>

            <div style="margin-top:12px; padding-top:10px; border-top:1px solid var(--portal-line); display:flex; justify-content:space-between; align-items:center;">
              <small class="hint">${dict.menusCount}</small>
              <button type="button" class="nav-btn" aria-expanded="${isExpanded ? "true" : "false"}" style="padding:5px 10px; min-height:30px; font-size:12.5px; color:var(--ui-link); font-weight:700;" onclick="toggleBrandMenus('${b.id}')">
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
          <input type="text" id="brand-search-input" value="${brandSearchQuery}" oninput="handleBrandSearch(this.value)" placeholder="${dict.searchPlaceholder}" aria-label="${dict.searchPlaceholder}" />
        </div>
      </div>

      <div id="brands-catalog-container" class="brand-catalog-grid"></div>
    `;

    setTimeout(renderBrandCardsDOM, 0);
    return html;
  }

  // --------------------------------------------------------------------------
  // FOOD & R&D VIEW
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

      <aside class="callout">${dict.ingredientCallout}</aside>

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
  // PLATFORM VIEW
  // --------------------------------------------------------------------------
  function renderPlatformView() {
    const dict = t().platformPage;
    const heroDict = t().hero;
    const c = cfg();

    let appAction = "";
    if (c.deliveryAppMode === "coming_soon") {
      appAction = `<span class="btn btn-secondary" style="cursor:default;">${heroDict.appComingSoon}</span>`;
    } else if (c.deliveryAppMode === "active" && c.deliveryAppUrl) {
      appAction = `<a href="${c.deliveryAppUrl}" target="_blank" rel="noopener" class="btn btn-primary">${heroDict.appDownload} ↗</a>`;
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
          <button type="button" class="btn btn-secondary" onclick="navigateTo('careers')">
            ${heroDict.careerBtn}
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
  // CAREERS VIEW
  // --------------------------------------------------------------------------
  window.copyCareerEmail = function (btnEl) {
    const email = cfg().contactEmail || "";
    const dict = t().careersPage;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        if (btnEl) {
          const orig = btnEl.textContent;
          btnEl.textContent = `${dict.copiedNotice} (${email})`;
          setTimeout(() => {
            btnEl.textContent = orig;
          }, 2200);
        }
      });
    }
  };

  function renderCareersView() {
    const dict = t().careersPage;
    const c = cfg();
    const officialEmail = c.contactEmail || "";

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
          <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
            <button type="button" class="btn btn-primary" onclick="openApplyModal('${loc(j, "title").replace(/'/g, "")}', this)">
              ${dict.formBtn}
            </button>
            <a href="mailto:${officialEmail}?subject=${encodeURIComponent("[" + c.legalName + " - " + c.brandName + "] " + loc(j, "title"))}" class="btn btn-secondary">
              ${dict.emailBtn} ↗
            </a>
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

      ${renderIdentityVerificationCard(true)}

      <section class="card">
        <h2>${dict.applyBoxTitle}</h2>
        <p class="hint" style="margin-bottom:14px;">${dict.applyBoxDesc}</p>
        <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
          <button type="button" class="btn btn-primary" onclick="openApplyModal('${c.legalName} (${c.brandName})', this)">
            ${dict.formBtn}
          </button>
          <a href="mailto:${officialEmail}?subject=${encodeURIComponent("[" + c.legalName + " - " + c.brandName + "] Lamaran Kerja")}" class="btn btn-secondary">
            ${dict.emailBtn} (${officialEmail}) ↗
          </a>
          <button type="button" class="btn btn-secondary" onclick="copyCareerEmail(this)">
            ${dict.copyEmailBtn}
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
    const careerDict = t().careersPage;
    const c = cfg();
    const officialEmail = c.contactEmail || "";
    const igHandle = getHandleFromUrl(c.instagramUrl, true);
    const ttHandle = getHandleFromUrl(c.tiktokUrl, true);
    const cleanWa = (c.whatsappNumber || "").replace(/[^0-9]/g, "");
    const waSectionHtml = hasWhatsApp()
      ? `<div style="padding-top:16px; border-top:1px solid var(--portal-line); margin-bottom:16px;">
          <small class="hint" style="display:block; font-weight:700;">WhatsApp</small>
          <div style="margin-top:8px;">
            <a href="https://wa.me/${cleanWa}" target="_blank" rel="noopener" class="btn btn-secondary">${c.whatsappNumber} ↗</a>
          </div>
        </div>`
      : "";

    return `
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">${dict.eyebrow}</p>
          <h1>${dict.title}</h1>
          <p class="intro">${dict.intro}</p>
        </div>
      </div>

      <section class="card">
        <div class="columns" style="margin-bottom:20px;">
          <div>
            <small class="hint" style="display:block; font-weight:700;">${dict.entityLabel}</small>
            <strong style="font-size:18px; color:var(--ui-text);">${c.legalName}</strong>
          </div>
          <div>
            <small class="hint" style="display:block; font-weight:700;">${dict.brandLabel}</small>
            <strong style="font-size:18px; color:var(--ui-link);">${c.brandName}</strong>
          </div>
        </div>

        <div style="padding-top:16px; border-top:1px solid var(--portal-line); margin-bottom:16px;">
          <small class="hint" style="display:block; font-weight:700;">${dict.statusLabel}</small>
          <p style="font-weight:600; margin-top:4px;">${dict.statusText}</p>
        </div>

        <div style="padding-top:16px; border-top:1px solid var(--portal-line); margin-bottom:16px;">
          <small class="hint" style="display:block; font-weight:700;">${dict.addressLabel}</small>
          <p style="font-weight:700; font-size:16px; margin-top:4px;">${c.address}</p>
        </div>

        <div style="padding-top:16px; border-top:1px solid var(--portal-line); margin-bottom:16px;">
          <small class="hint" style="display:block; font-weight:700;">${dict.emailLabel}</small>
          <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-top:8px;">
            <a href="mailto:${officialEmail}" class="btn btn-primary">${officialEmail} ↗</a>
            <button type="button" class="btn btn-secondary" onclick="copyCareerEmail(this)">${careerDict.copyEmailBtn}</button>
          </div>
          <p class="hint" style="margin-top:10px;">${dict.emailNote}</p>
        </div>

        ${waSectionHtml}

        <div style="padding-top:16px; border-top:1px solid var(--portal-line);">
          <small class="hint" style="display:block; font-weight:700; margin-bottom:8px;">${dict.socialLabel}</small>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            <a href="${c.instagramUrl}" onclick="openSnsChannel(event, 'instagram')" class="btn btn-secondary">
              Instagram (${igHandle}) ↗
            </a>
            <a href="${c.tiktokUrl}" onclick="openSnsChannel(event, 'tiktok')" class="btn btn-secondary">
              TikTok (${ttHandle}) ↗
            </a>
          </div>
        </div>
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
          ${art.date ? `<small class="hint">${art.date}</small>` : ""}
        </div>
        <h1>${loc(art, "title")}</h1>
        <div style="margin-top:20px; padding-top:20px; border-top:1px solid var(--portal-line);">
          ${paragraphs}
        </div>
      </article>
    `;
  }

  // --------------------------------------------------------------------------
  // PRIVACY & TERMS VIEW
  // --------------------------------------------------------------------------
  function renderPolicyView(type) {
    const c = cfg();
    const officialEmail = c.contactEmail || "";
    const l = lang();
    const isPrivacy = type === "privacy";

    const copy = {
      id: {
        title: isPrivacy ? "Kebijakan Privasi (Privacy Policy)" : "Syarat & Ketentuan (Terms of Use)",
        body: isPrivacy
          ? `<p style="margin-bottom:14px;"><strong>${c.legalName}</strong> (pemilik merek usaha <strong>${c.brandName}</strong>) menghormati privasi pelamar kerja dan pengunjung situs sesuai dengan Undang-Undang Pelindungan Data Pribadi (UU PDP) Indonesia.</p>
             <p style="margin-bottom:14px;">Data lamaran yang dikirimkan ke saluran email resmi kami (${officialEmail}) hanya digunakan untuk keperluan verifikasi dan seleksi SDM internal serta tidak pernah diperjualbelikan kepada pihak ketiga.</p>`
          : `<p style="margin-bottom:14px;">Situs web ini dikelola secara resmi oleh <strong>${c.legalName}</strong> (Alamat terdaftar: ${c.address}) untuk menyajikan informasi identitas perusahaan, rencana brand <strong>${c.brandName}</strong>, serta verifikasi rekrutmen resmi.</p>
             <p>Saat ini perusahaan berada pada tahap pra-pembukaan (pre-opening) dan belum melakukan penjualan produk secara komersial.</p>`
      },
      en: {
        title: isPrivacy ? "Privacy Policy" : "Terms of Use",
        body: isPrivacy
          ? `<p style="margin-bottom:14px;"><strong>${c.legalName}</strong> (operating the <strong>${c.brandName}</strong> brand) respects the privacy of job applicants and visitors in compliance with Indonesian Personal Data Protection laws (UU PDP).</p>
             <p style="margin-bottom:14px;">Information submitted to our official recruitment email (${officialEmail}) is used strictly for hiring evaluation and HR administration.</p>`
          : `<p style="margin-bottom:14px;">This website is officially operated by <strong>${c.legalName}</strong> (Registered address: ${c.address}) to provide corporate verification, planned <strong>${c.brandName}</strong> brand information, and official career opportunities.</p>
             <p>The business is currently in the pre-opening stage and nothing is on sale yet.</p>`
      },
      ko: {
        title: isPrivacy ? "개인정보처리방침" : "이용약관",
        body: isPrivacy
          ? `<p style="margin-bottom:14px;"><strong>${c.legalName}</strong>(브랜드: <strong>${c.brandName}</strong>)는 인도네시아 개인정보보호법(UU PDP)을 준수하며, 공식 채용 이메일(${officialEmail})을 통해 접수된 지원자 정보를 채용 전형 목적으로만 안전하게 처리합니다.</p>`
          : `<p style="margin-bottom:14px;">본 사이트는 <strong>${c.legalName}</strong>(등록 주소: ${c.address})의 법인 신원 확인, <strong>${c.brandName}</strong> 브랜드 기획 소개 및 공식 채용 안내를 목적으로 운영됩니다.</p>
             <p>현재 당사는 오픈 준비(Pre-Opening) 단계로 아직 상품을 판매하지 않습니다.</p>`
      }
    }[l];

    return `
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">${c.legalName} · ${c.brandName}</p>
          <h1>${copy.title}</h1>
        </div>
      </div>
      <section class="card">${copy.body}</section>
    `;
  }

  // ==========================================================================
  // ACCESSIBLE MODALS
  // ==========================================================================
  function syncApplyModalText() {
    const mDict = t().applyModal;
    if (!mDict) return;
    const officialEmail = cfg().contactEmail || "";
    const setTxt = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };
    setTxt("apply-modal-title", mDict.title);
    setTxt("apply-modal-guide", `${mDict.guidePrefix} ${officialEmail}`);
    setTxt("apply-role-label", mDict.roleLabel);
    setTxt("apply-name-label", mDict.nameLabel);
    setTxt("apply-contact-label", mDict.contactLabel);
    setTxt("apply-msg-label", mDict.msgLabel);
    setTxt("apply-cancel-btn", mDict.cancelBtn);
    setTxt("apply-copy-btn", mDict.copyDraftBtn);
    setTxt("apply-submit-btn", mDict.submitBtn);
  }

  window.openSpecModal = function (triggerEl) {
    lastFocusedTrigger = triggerEl || document.activeElement;
    const m = document.getElementById("spec-modal");
    if (m) {
      m.classList.add("open");
      const closeBtn = document.getElementById("spec-modal-close");
      if (closeBtn) setTimeout(() => closeBtn.focus(), 20);
    }
  };

  window.closeSpecModal = function () {
    const m = document.getElementById("spec-modal");
    if (m) m.classList.remove("open");
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
  };

  window.openApplyModal = function (roleTitle, triggerEl) {
    lastFocusedTrigger = triggerEl || document.activeElement;
    syncApplyModalText();
    const feedback = document.getElementById("apply-copy-feedback");
    if (feedback) feedback.style.display = "none";
    const m = document.getElementById("apply-modal");
    if (m) {
      m.classList.add("open");
      const input = document.getElementById("apply-role-input");
      if (input) {
        input.value = roleTitle || "";
        setTimeout(() => input.focus(), 20);
      }
    }
  };

  window.closeApplyModal = function () {
    const m = document.getElementById("apply-modal");
    if (m) m.classList.remove("open");
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
  };

  function buildApplicationDraftData() {
    const c = cfg();
    const role = (document.getElementById("apply-role-input")?.value || "").trim() || `${c.legalName} (${c.brandName})`;
    const name = (document.getElementById("apply-name-input")?.value || "").trim();
    const contact = (document.getElementById("apply-contact-input")?.value || "").trim();
    const msg = (document.getElementById("apply-msg-input")?.value || "").trim();
    const email = c.contactEmail || "";
    const subject = `[Lamaran Kerja - ${c.legalName} / ${c.brandName}] ${role}${name ? " - " + name : ""}`;
    const body = `Kepada Tim HR ${c.legalName} (Brand: ${c.brandName}),\n\nPosisi yang Dilamar: ${role}\nNama Lengkap: ${name}\nKontak: ${contact}\n\nRingkasan Pengalaman & Motivasi:\n${msg}\n\n[Mohon lampirkan file CV / Resume Anda sebelum mengirim email ini]`;
    return { email, subject, body };
  }

  window.copyApplicationDraft = function () {
    const { email, subject, body } = buildApplicationDraftData();
    const mDict = t().applyModal;
    const fullText = `To: ${email}\nSubject: ${subject}\n\n${body}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).then(() => {
        const fb = document.getElementById("apply-copy-feedback");
        if (fb) {
          fb.textContent = `${mDict.copySuccess} (${email})`;
          fb.style.display = "block";
        }
      });
    }
  };

  window.submitCareerForm = function (e) {
    e.preventDefault();
    const { email, subject, body } = buildApplicationDraftData();
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    closeApplyModal();
  };

  document.addEventListener("keydown", (e) => {
    const openModal = document.querySelector(".modal-overlay.open");
    if (e.key === "Escape") {
      if (openModal) {
        e.preventDefault();
        if (openModal.id === "apply-modal") closeApplyModal();
        else if (openModal.id === "spec-modal") closeSpecModal();
        else openModal.classList.remove("open");
        return;
      }
      const openDrawer = document.getElementById("mobile-drawer");
      if (openDrawer && openDrawer.classList.contains("open")) {
        openDrawer.classList.remove("open");
      }
      return;
    }

    if (e.key === "Tab" && openModal) {
      const dialog = openModal.querySelector(".modal-dialog") || openModal;
      const focusable = Array.from(
        dialog.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || !dialog.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !dialog.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  function renderAll() {
    renderChrome();
    renderMain();
  }

  window.renderAll = renderAll;

  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.lang = lang();
    const initial = parseHashToRoute(window.location.hash);
    currentRoute = initial.route;
    if (initial.param) currentArticleId = initial.param;
    syncApplyModalText();
    updateSeoMeta();
    renderAll();
    loadOptionalCsvSheets();
  });
})();
