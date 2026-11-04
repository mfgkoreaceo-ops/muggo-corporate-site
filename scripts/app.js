// ==========================================================================
// CORPORATE & RECRUITMENT VERIFICATION APPLICATION (scripts/app.js)
// Reads all single-source configuration values from window.SITE_CONFIG (site.config.js)
// ==========================================================================

(function () {
  const LANG_KEY = "mokgo-language";
  const THEME_KEY = "muggo-theme";

  // Synchronize live CMS published overrides (or draft overrides when ?cms_preview=1)
  (function applyCmsRuntimeOverrides() {
    try {
      const params = new URLSearchParams(window.location.search || "");
      const isPreview = params.get("cms_preview") === "1";
      if (!isPreview) return; // Public pages always use repository data. Legacy local overrides are retained, not applied.
      const raw = localStorage.getItem("muggo-cms-draft");
      if (!raw) return;
      const bundle = JSON.parse(raw);
      if (bundle && typeof bundle === "object") {
        if (bundle.config && typeof bundle.config === "object") {
          window.SITE_CONFIG = Object.assign({}, window.SITE_CONFIG || {}, bundle.config);
        }
        if (bundle.i18n && typeof bundle.i18n === "object" && bundle.i18n.id && bundle.i18n.id.nav) {
          window.I18N_DICT = bundle.i18n;
        }
        if (bundle.siteData && typeof bundle.siteData === "object" && Array.isArray(bundle.siteData.jobs)) {
          window.DEFAULT_SITE_DATA = bundle.siteData;
        }
        if (Array.isArray(bundle.catalog)) {
          window.MUGGO_CATALOG = bundle.catalog;
        }
      }
    } catch (e) {}
  })();

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

  const NEWS_CACHE_KEY = "muggo-sheet-news-cache-v1";
  const JOBS_CACHE_KEY = "muggo-sheet-jobs-cache-v1";
  const NEWS_ALLOWED_COLUMNS = ["id", "title", "summary", "status", "date", "imageUrl", "visible"];
  const JOBS_ALLOWED_COLUMNS = ["id", "title", "department", "employmentType", "experience", "location", "description", "requirements", "visible"];

  function capLen(val, maxLen) {
    if (val === null || val === undefined) return "";
    const str = String(val).trim();
    return str.length > maxLen ? str.slice(0, maxLen) : str;
  }

  function isSafeHttpUrl(url) {
    if (!url || typeof url !== "string") return false;
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) return false;
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (e) {
      return false;
    }
  }

  function isRowVisible(row) {
    if (!row) return false;
    const v = row.visible !== undefined ? row.visible : "TRUE";
    return String(v).trim().toUpperCase() === "TRUE";
  }

  function getFallbackArticles() {
    const raw = (window.DEFAULT_SITE_DATA && window.DEFAULT_SITE_DATA.articles) || [];
    return JSON.parse(JSON.stringify(raw)).filter(isRowVisible);
  }

  function getFallbackJobs() {
    const raw = (window.DEFAULT_SITE_DATA && window.DEFAULT_SITE_DATA.jobs) || [];
    return JSON.parse(JSON.stringify(raw)).filter(isRowVisible);
  }

  let state = {
    currentLang: cfg().defaultLanguage || "id",
    metrics: JSON.parse(JSON.stringify((window.DEFAULT_SITE_DATA && window.DEFAULT_SITE_DATA.metrics) || [])),
    articles: getFallbackArticles(),
    jobs: getFallbackJobs(),
    footnotes: JSON.parse(JSON.stringify((window.DEFAULT_SITE_DATA && window.DEFAULT_SITE_DATA.footnotes) || []))
  };

  try {
    const urlParams = new URLSearchParams(window.location.search || "");
    const qLang = (urlParams.get("lang") || "").trim().toLowerCase();
    if (["id", "en", "ko"].includes(qLang)) {
      if (window.SITE_CONFIG) window.SITE_CONFIG.languageSwitchVisible = true;
      state.currentLang = qLang;
    }
  } catch (e) {}

  if (cfg().languageSwitchVisible) {
    try {
      const urlParams = new URLSearchParams(window.location.search || "");
      const qLang = (urlParams.get("lang") || "").trim().toLowerCase();
      if (!["id", "en", "ko"].includes(qLang)) {
        const savedLang = localStorage.getItem(LANG_KEY);
        if (["id", "en", "ko"].includes(savedLang)) {
          state.currentLang = savedLang;
        }
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
  let showAllBrandsOnPage = false;
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

  // Format any date string to Indonesian local style: "25 Okt 2026"
  function formatLocalDate(dateStr) {
    if (!dateStr) return "";
    const raw = String(dateStr).trim();
    if (!raw) return "";
    const monthsId = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const m = raw.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})$/);
    if (m) {
      const year = m[1];
      const monthIdx = parseInt(m[2], 10) - 1;
      const day = parseInt(m[3], 10);
      if (monthIdx >= 0 && monthIdx < 12 && day >= 1 && day <= 31) {
        return `${day} ${monthsId[monthIdx]} ${year}`;
      }
    }
    return raw;
  }

  // ==========================================================================
  // GOOGLE SHEETS CSV LOADER & SAFETY SANITIZER (Task 7.1 & 7.2)
  // - Parses quoted fields, escaped quotes (""), commas & line breaks inside cells
  // - Ignores extra columns not in the allowed schema
  // - Filters visible === TRUE and preserves row order
  // - Caps lengths (title 120, summary 300, description 600, requirements 600)
  // - Accepts only http(s) URLs for imageUrl
  // - Caches last good response in localStorage with a timestamp
  // - Silently falls back on error or empty rows (never shows error UI to visitors)
  // ==========================================================================
  function parseCsv(csvText, allowedColumns) {
    if (!csvText || typeof csvText !== "string") return [];
    const cleanText = csvText.replace(/^\uFEFF/, "");
    const rows = [];
    let current = "";
    let inQuotes = false;
    let row = [];

    for (let i = 0; i < cleanText.length; i++) {
      const ch = cleanText[i];
      const next = cleanText[i + 1];
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

    const rawHeaders = rows[0].map((h) => String(h || "").trim());
    const allowedMap = {};
    if (Array.isArray(allowedColumns)) {
      allowedColumns.forEach((col) => {
        allowedMap[col.toLowerCase()] = col;
      });
    }

    return rows.slice(1).map((r) => {
      const obj = {};
      rawHeaders.forEach((h, idx) => {
        if (!h) return;
        const canonicalKey = Array.isArray(allowedColumns) ? allowedMap[h.toLowerCase()] : h;
        if (!canonicalKey) return; // Ignore extra columns not in allowedColumns
        obj[canonicalKey] = r[idx] !== undefined ? r[idx] : "";
      });
      return obj;
    });
  }

  function normalizeNewsRows(rawRows) {
    if (!Array.isArray(rawRows)) return [];
    return rawRows
      .filter(isRowVisible)
      .map((item, idx) => {
        const rawStatus = String(item.status || "").trim().toLowerCase();
        const status = rawStatus === "published" ? "published" : "upcoming";
        const safeImg = isSafeHttpUrl(item.imageUrl) ? item.imageUrl.trim() : "";
        return {
          id: capLen(item.id, 60) || `art-${idx + 1}`,
          title: capLen(item.title, 120),
          summary: capLen(item.summary, 300),
          status,
          date: status === "published" ? capLen(item.date, 30) : "",
          imageUrl: safeImg,
          visible: "TRUE"
        };
      })
      .filter((item) => Boolean(item.title || item.summary));
  }

  function normalizeJobRows(rawRows) {
    if (!Array.isArray(rawRows)) return [];
    return rawRows
      .filter(isRowVisible)
      .map((item, idx) => ({
        id: capLen(item.id, 60) || `job-${idx + 1}`,
        title: capLen(item.title, 120),
        department: capLen(item.department, 120),
        employmentType: capLen(item.employmentType, 120),
        experience: capLen(item.experience, 120),
        location: capLen(item.location, 120) || "Jakarta Selatan",
        description: capLen(item.description, 600),
        requirements: capLen(item.requirements, 600),
        visible: "TRUE"
      }))
      .filter((item) => Boolean(item.title));
  }

  function saveSheetCache(cacheKey, url, rows) {
    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          timestamp: Date.now(),
          url,
          rows
        })
      );
    } catch (e) {}
  }

  function loadSheetCache(cacheKey, url) {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && (!url || parsed.url === url) && Array.isArray(parsed.rows) && parsed.rows.length > 0) {
        return parsed.rows;
      }
    } catch (e) {}
    return null;
  }

  async function loadOptionalCsvSheets() {
    const c = cfg();
    const newsUrl = (c.newsSheetCsvUrl || "").trim();
    if (newsUrl) {
      let loadedNews = null;
      try {
        const res = await fetch(newsUrl);
        if (res.ok) {
          const parsed = parseCsv(await res.text(), NEWS_ALLOWED_COLUMNS);
          const valid = normalizeNewsRows(parsed);
          if (valid.length > 0) {
            loadedNews = valid;
            saveSheetCache(NEWS_CACHE_KEY, newsUrl, valid);
          }
        } else {
          loadedNews = loadSheetCache(NEWS_CACHE_KEY, newsUrl);
        }
      } catch (e) {
        loadedNews = loadSheetCache(NEWS_CACHE_KEY, newsUrl);
      }
      state.articles = loadedNews && loadedNews.length > 0 ? loadedNews : getFallbackArticles();
      renderAll();
    } else {
      state.articles = getFallbackArticles();
    }

    const jobsUrl = (c.jobsSheetCsvUrl || "").trim();
    if (jobsUrl) {
      let loadedJobs = null;
      try {
        const res = await fetch(jobsUrl);
        if (res.ok) {
          const parsed = parseCsv(await res.text(), JOBS_ALLOWED_COLUMNS);
          const valid = normalizeJobRows(parsed);
          if (valid.length > 0) {
            loadedJobs = valid;
            saveSheetCache(JOBS_CACHE_KEY, jobsUrl, valid);
          }
        } else {
          loadedJobs = loadSheetCache(JOBS_CACHE_KEY, jobsUrl);
        }
      } catch (e) {
        loadedJobs = loadSheetCache(JOBS_CACHE_KEY, jobsUrl);
      }
      state.jobs = loadedJobs && loadedJobs.length > 0 ? loadedJobs : getFallbackJobs();
      renderAll();
    } else {
      state.jobs = getFallbackJobs();
    }
  }

  window.__MUGGO_SHEET_UTILS__ = {
    parseCsv,
    normalizeNewsRows,
    normalizeJobRows,
    isSafeHttpUrl,
    capLen,
    NEWS_ALLOWED_COLUMNS,
    JOBS_ALLOWED_COLUMNS
  };

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

  function hasApplyFormEndpoint() {
    const ep = (cfg().applyFormEndpoint || "").trim();
    return Boolean(ep && /^https?:\/\//i.test(ep));
  }

  // Task 4.4: recruitmentEmail falls back to contactEmail when empty
  function getRecruitmentEmail() {
    const c = cfg();
    const rec = (c.recruitmentEmail || "").trim();
    return rec || (c.contactEmail || "").trim();
  }

  function hasDistinctRecruitmentEmail() {
    const c = cfg();
    const rec = (c.recruitmentEmail || "").trim();
    const gen = (c.contactEmail || "").trim();
    return Boolean(rec && rec.toLowerCase() !== gen.toLowerCase());
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
  // COMPACT TRUST & COMPANY FACTS BLOCK (Task 3.8 & 6.2 — Top of Home, Karir, Kontak)
  // Shows legal name, leadership ("Direktur Utama" without a name until supplied),
  // registered address, open positions, planned opening, official channels (email, Instagram, TikTok),
  // and: "Kami tidak memungut biaya apa pun dalam proses rekrutmen."
  // ==========================================================================
  function renderIdentityVerificationCard(showContactBtn = true, pageContext = "default") {
    const dict = t().identityCard;
    const contactDict = t().contactPage || {};
    const careerDict = t().careersPage || {};
    const c = cfg();
    if (!dict) return "";
    const igHandle = getHandleFromUrl(c.instagramUrl, true);
    const ttHandle = getHandleFromUrl(c.tiktokUrl, true);
    const leaderDisplay = `${dict.leaderRole || "Direktur Utama"}${c.ceoName ? ` · ${c.ceoName}` : ""}`;
    const primaryEmail = pageContext === "careers" ? getRecruitmentEmail() : (c.contactEmail || "");

    const extraContactDetailsHtml =
      pageContext === "contact"
        ? `
          <div style="margin-top:8px; display:flex; flex-wrap:wrap; align-items:center; gap:8px;">
            <button type="button" class="btn btn-secondary" style="min-height:36px; padding:6px 12px; font-size:14px;" onclick="copyEmailAddress('${primaryEmail}', this)">
              ${careerDict.copyEmailBtn || "Salin Alamat Email"}
            </button>
            <span class="hint" style="font-size:14px;">${contactDict.emailNote || ""}</span>
          </div>
          ${
            hasDistinctRecruitmentEmail()
              ? `<div style="margin-top:10px; padding-top:10px; border-top:1px dashed var(--portal-line); display:flex; flex-wrap:wrap; align-items:center; gap:10px;">
                  <small class="hint" style="font-weight:700;">${contactDict.emailRecruitmentLabel || "Email Rekrutmen Resmi"}:</small>
                  <a href="mailto:${getRecruitmentEmail()}" style="color:var(--ui-link); font-weight:700; text-decoration:none;">${getRecruitmentEmail()}</a>
                  <button type="button" class="btn btn-secondary" style="min-height:34px; padding:5px 10px; font-size:14px;" onclick="copyEmailAddress('${getRecruitmentEmail()}', this)">
                    ${careerDict.copyEmailBtn || "Salin Alamat Email"}
                  </button>
                </div>`
              : ""
          }
        `
        : "";

    return `
      <section class="card section-block" aria-label="${dict.title}" style="padding:18px 20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <div>
            <p class="eyebrow" style="margin-bottom:4px;">${dict.eyebrow}</p>
            <h2 style="margin-bottom:0; font-size:19px;">${dict.title}</h2>
          </div>
          <span class="roster-badge">${dict.badge || "Pra-Pembukaan · Terverifikasi"}</span>
        </div>

        <div class="columns" style="margin-bottom:12px; gap:12px;">
          <div style="background:var(--ui-surface-muted); border:1px solid var(--portal-line); border-radius:10px; padding:12px 14px;">
            <small class="hint" style="display:block; font-weight:700;">${dict.legalLabel}</small>
            <strong style="font-size:16px; color:var(--ui-text); display:block;">${c.legalName}</strong>
            <span class="hint" style="font-size:14px;">${dict.brandLabel}: <strong style="color:var(--ui-link);">${c.brandName}</strong> · ${dict.leaderLabel || "Pimpinan"}: <strong>${leaderDisplay}</strong></span>
          </div>
          <div style="background:var(--ui-surface-muted); border:1px solid var(--portal-line); border-radius:10px; padding:12px 14px;">
            <small class="hint" style="display:block; font-weight:700;">${dict.purposeLabel}</small>
            <strong style="font-size:14.5px; color:var(--ui-text); display:block;">${c.address}</strong>
          </div>
        </div>

        <div class="columns" style="margin-bottom:12px; gap:12px;">
          <div style="background:var(--ui-surface-muted); border:1px solid var(--portal-line); border-radius:10px; padding:12px 14px;">
            <small class="hint" style="display:block; font-weight:700;">${dict.openPositionsLabel || "Posisi Terbuka"}</small>
            <strong style="font-size:14.5px; color:var(--ui-text); display:block;">${dict.openPositionsValue || `${state.jobs.length} Bidang Posisi (Rekrutmen Resmi)`}</strong>
          </div>
          <div style="background:var(--ui-surface-muted); border:1px solid var(--portal-line); border-radius:10px; padding:12px 14px;">
            <small class="hint" style="display:block; font-weight:700;">${dict.statusLabel || "Rencana Pembukaan"}</small>
            <strong style="font-size:14.5px; color:var(--ui-text); display:block;">${dict.statusValue}</strong>
          </div>
        </div>

        <div style="background:var(--ui-surface-muted); border:1px solid var(--portal-line); border-radius:10px; padding:12px 14px; margin-bottom:12px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px;">
          <div style="flex:1; min-width:240px;">
            <small class="hint" style="display:block; font-weight:700;">${
              pageContext === "contact" && !hasDistinctRecruitmentEmail()
                ? contactDict.emailUnifiedLabel || dict.channelsLabel || "Saluran Resmi"
                : dict.channelsLabel || "Saluran Resmi"
            }</small>
            <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin-top:4px; font-size:14px;">
              ${primaryEmail ? `<a href="mailto:${primaryEmail}" style="color:var(--ui-link); font-weight:700; text-decoration:none;">${primaryEmail}</a>` : ""}
              <a href="${c.instagramUrl}" onclick="openSnsChannel(event, 'instagram')" style="color:var(--ui-link); font-weight:700; text-decoration:none;">Instagram (${igHandle}) ↗</a>
              <a href="${c.tiktokUrl}" onclick="openSnsChannel(event, 'tiktok')" style="color:var(--ui-link); font-weight:700; text-decoration:none;">TikTok (${ttHandle}) ↗</a>
            </div>
            ${extraContactDetailsHtml}
          </div>
          ${
            showContactBtn
              ? `<button type="button" class="btn btn-secondary" style="min-height:38px; padding:8px 14px; font-size:14px;" onclick="navigateTo('contact')">
                  ${dict.contactLinkBtn}
                </button>`
              : ""
          }
        </div>

        <aside class="callout" style="margin:0; padding:12px 16px;">
          <strong style="display:block; font-size:14px; color:var(--ui-text);">✓ ${dict.antiFraudDesc}</strong>
        </aside>
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

          <nav class="desktop-nav" aria-label="${dict.nav.mainNavLabel || "Navigasi Utama"}">
            ${navButtonsHtml}
          </nav>

          <div class="header-tools">
            <button id="themeToggle" type="button" class="icon-btn" onclick="toggleTheme()" aria-label="${themeTitle}" title="${themeTitle}">
              ${svgIcon(isDark ? "sun" : "moon", 17)}
            </button>

            ${langControlHtml}

            <button type="button" class="icon-btn mobile-menu-toggle" onclick="toggleMobileDrawer()" aria-label="${dict.nav.menuBtnLabel || "Menu"}">
              ${svgIcon("menu", 19)}
            </button>
          </div>
        </div>

        <nav id="mobile-drawer" class="mobile-drawer" aria-label="${dict.nav.mobileNavLabel || "Navigasi Seluler"}">
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
        : dict.contactPage && dict.contactPage.phonePendingNotice
        ? `<div class="hint" style="font-size:14px;">${dict.contactPage.phonePendingNotice}</div>`
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
            <p class="eyebrow" style="margin-bottom:10px;">${dict.footer.navHeading || "NAVIGASI"}</p>
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
            <p class="eyebrow" style="margin-bottom:10px;">${dict.footer.socialHeading || "MEDIA SOSIAL & SALURAN RESMI"}</p>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              <a href="${c.instagramUrl}" onclick="openSnsChannel(event, 'instagram')" class="btn btn-secondary" style="padding:8px 14px; min-height:38px; font-size:14px;">
                Instagram (${igHandle})
              </a>
              <a href="${c.tiktokUrl}" onclick="openSnsChannel(event, 'tiktok')" class="btn btn-secondary" style="padding:8px 14px; min-height:38px; font-size:14px;">
                TikTok (${ttHandle})
              </a>
            </div>
          </div>
        </div>

        <div style="padding-top:18px; border-top:1px solid var(--portal-line); display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px;">
          <div>${dict.footer.copyright || `© 2026 ${c.legalName} (Brand: ${c.brandName}).`}</div>
          <ul class="footer-nav-links">
            <li><a href="#privacy" onclick="navigateTo('privacy'); return false;">${dict.footer.privacy}</a></li>
            <li><a href="#terms" onclick="navigateTo('terms'); return false;">${dict.footer.terms}</a></li>
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
        populateNewsGridDOM();
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
        populateCareersJobsDOM();
        break;
      case "contact":
        main.innerHTML = renderContactView();
        break;
      case "article-detail":
        main.innerHTML = renderArticleDetailView();
        populateArticleDetailDOM();
        break;
      case "privacy":
        main.innerHTML = renderPolicyView("privacy");
        break;
      case "terms":
        main.innerHTML = renderPolicyView("terms");
        break;
      default:
        main.innerHTML = renderHomeView();
        populateNewsGridDOM();
    }
  }

  // ==========================================================================
  // SAFE DOM RENDERERS FOR SHEET DATA (Task 7.1 & 7.2)
  // Renders all News & Jobs fields strictly with textContent (never innerHTML)
  // ==========================================================================
  function getArticleTitle(art) {
    if (!art) return "";
    const raw = loc(art, "title") || interp(art.title || "");
    return capLen(raw, 120);
  }

  function getArticleSummary(art) {
    if (!art) return "";
    const raw = loc(art, "summary") || interp(art.summary || "");
    return capLen(raw, 300);
  }

  function getArticleImageSrc(art, idx) {
    if (art && isSafeHttpUrl(art.imageUrl)) {
      return art.imageUrl.trim();
    }
    if (art && art.image && /^assets\//.test(art.image)) {
      return art.image;
    }
    return `assets/slots/news-${(idx % 3) + 1}.jpg`;
  }

  function getArticleStatusBadgeText(art, dictArticles) {
    const upcomingLabel = (dictArticles && dictArticles.upcomingLabel) || "Akan Datang";
    if (!art) return upcomingLabel;
    const status = String(art.status || "upcoming").trim().toLowerCase();
    if (status === "published") {
      return art.date && String(art.date).trim() !== "" ? formatLocalDate(art.date) : "";
    }
    return upcomingLabel;
  }

  function populateNewsGridDOM() {
    const grid = document.getElementById("home-news-grid");
    if (!grid) return;
    grid.replaceChildren();

    const dict = t();
    const visibleArticles = (state.articles || []).filter(isRowVisible);

    visibleArticles.forEach((art, idx) => {
      const card = document.createElement("article");
      card.className = "service-card";
      card.addEventListener("click", () => window.navigateTo("article-detail", art.id));

      const pic = document.createElement("picture");
      pic.className = "slot-frame ratio-16-9";
      pic.style.marginBottom = "14px";

      const img = document.createElement("img");
      img.src = getArticleImageSrc(art, idx);
      img.width = 800;
      img.height = 450;
      img.loading = "lazy";
      img.alt = art.altId || getArticleTitle(art) || "Ilustrasi pengumuman resmi MUGGO";
      pic.appendChild(img);
      card.appendChild(pic);

      const badgeRow = document.createElement("div");
      badgeRow.style.cssText = "display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:10px;";

      const catText = loc(art, "category");
      if (catText) {
        const catBadge = document.createElement("span");
        catBadge.className = "roster-badge";
        catBadge.textContent = capLen(catText, 60);
        badgeRow.appendChild(catBadge);
      }

      const statusText = getArticleStatusBadgeText(art, dict.articles);
      if (statusText) {
        const statusBadge = document.createElement("span");
        statusBadge.className = "roster-badge";
        statusBadge.textContent = statusText;
        badgeRow.appendChild(statusBadge);
      }
      card.appendChild(badgeRow);

      const h3 = document.createElement("h3");
      h3.textContent = getArticleTitle(art);
      card.appendChild(h3);

      const p = document.createElement("p");
      p.textContent = getArticleSummary(art);
      card.appendChild(p);

      const actionSpan = document.createElement("span");
      actionSpan.className = "card-action";
      actionSpan.textContent = dict.articles.readMore;
      card.appendChild(actionSpan);

      grid.appendChild(card);
    });
  }

  function populateCareersJobsDOM() {
    const listEl = document.getElementById("careers-jobs-list");
    const countEl = document.getElementById("careers-jobs-count");
    const dict = t().careersPage || {};
    const visibleJobs = (state.jobs || []).filter(isRowVisible);

    if (countEl) {
      countEl.textContent = `${dict.positionsTitle || "Daftar 11 Bidang Posisi yang Dibuka"} (${visibleJobs.length})`;
    }
    if (!listEl) return;
    listEl.replaceChildren();

    visibleJobs.forEach((j) => {
      const row = document.createElement("div");
      row.className = "checklist-row";

      const infoCol = document.createElement("div");
      infoCol.style.cssText = "flex:1; min-width:240px;";

      const metaRow = document.createElement("div");
      metaRow.style.cssText = "display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:6px;";

      const deptText = capLen(loc(j, "dept") || interp(j.department || ""), 120);
      if (deptText) {
        const deptBadge = document.createElement("span");
        deptBadge.className = "roster-badge";
        deptBadge.textContent = deptText;
        metaRow.appendChild(deptBadge);
      }

      const typeExpParts = [];
      const selectedType = j["type" + (lang() === "id" ? "Id" : lang() === "en" ? "En" : "Ko")];
      if (selectedType) {
        typeExpParts.push(capLen(interp(selectedType), 240));
      } else if (j.employmentType || j.experience) {
        if (j.employmentType) typeExpParts.push(capLen(interp(j.employmentType), 120));
        if (j.experience) typeExpParts.push(capLen(interp(j.experience), 120));
      } else {
        const legacyType = loc(j, "type");
        if (legacyType) typeExpParts.push(capLen(legacyType, 120));
      }
      if (j.location && !selectedType) {
        typeExpParts.push(capLen(interp(j.location), 120));
      }

      if (typeExpParts.length > 0) {
        const metaSmall = document.createElement("small");
        metaSmall.className = "hint";
        metaSmall.textContent = typeExpParts.join(" · ");
        metaRow.appendChild(metaSmall);
      }
      infoCol.appendChild(metaRow);

      const jobTitle = capLen(loc(j, "title") || interp(j.title || ""), 120);
      const h3 = document.createElement("h3");
      h3.textContent = jobTitle;
      infoCol.appendChild(h3);

      const jobDesc = capLen(loc(j, "desc") || interp(j.description || ""), 600);
      if (jobDesc) {
        const descP = document.createElement("p");
        descP.className = "hint";
        descP.style.marginTop = "4px";
        descP.textContent = jobDesc;
        infoCol.appendChild(descP);
      }

      const jobReq = capLen(interp(j.requirements || ""), 600);
      if (jobReq) {
        const reqP = document.createElement("p");
        reqP.className = "hint";
        reqP.style.marginTop = "4px";
        reqP.textContent = jobReq;
        infoCol.appendChild(reqP);
      }

      const actionCol = document.createElement("div");
      actionCol.style.cssText = "display:flex; flex-wrap:wrap; gap:8px; align-items:center;";

      const applyBtn = document.createElement("button");
      applyBtn.type = "button";
      applyBtn.className = "btn btn-primary";
      applyBtn.textContent = dict.applyJobBtn || "Lamar";
      applyBtn.addEventListener("click", () => {
        window.openApplyModal(jobTitle, applyBtn);
      });
      actionCol.appendChild(applyBtn);

      row.appendChild(infoCol);
      row.appendChild(actionCol);
      listEl.appendChild(row);
    });
  }

  function populateArticleDetailDOM() {
    const root = document.getElementById("article-detail-root");
    if (!root) return;
    root.replaceChildren();

    const dict = t().articles || {};
    const visibleArticles = (state.articles || []).filter(isRowVisible);
    const artIdx = visibleArticles.findIndex((a) => a.id === currentArticleId);
    const art = artIdx >= 0 ? visibleArticles[artIdx] : visibleArticles[0];
    if (!art) return;

    const card = document.createElement("article");
    card.className = "card";

    const pic = document.createElement("picture");
    pic.className = "slot-frame ratio-16-9";
    pic.style.marginBottom = "16px";

    const img = document.createElement("img");
    img.src = getArticleImageSrc(art, artIdx >= 0 ? artIdx : 0);
    img.width = 800;
    img.height = 450;
    img.loading = "lazy";
    img.alt = art.altId || getArticleTitle(art) || "Ilustrasi pengumuman resmi MUGGO";
    pic.appendChild(img);
    card.appendChild(pic);

    const badgeRow = document.createElement("div");
    badgeRow.style.cssText = "display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:10px;";

    const catText = loc(art, "category");
    if (catText) {
      const catBadge = document.createElement("span");
      catBadge.className = "roster-badge";
      catBadge.textContent = capLen(catText, 60);
      badgeRow.appendChild(catBadge);
    }

    const statusText = getArticleStatusBadgeText(art, dict);
    if (statusText) {
      const statusBadge = document.createElement("span");
      statusBadge.className = "roster-badge";
      statusBadge.textContent = statusText;
      badgeRow.appendChild(statusBadge);
    }
    card.appendChild(badgeRow);

    const h1 = document.createElement("h1");
    h1.textContent = getArticleTitle(art);
    card.appendChild(h1);

    const bodyWrap = document.createElement("div");
    bodyWrap.style.cssText = "margin-top:20px; padding-top:20px; border-top:1px solid var(--portal-line);";

    const rawBody = loc(art, "content") || getArticleSummary(art);
    rawBody
      .split(/\n\n+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((paraText) => {
        const p = document.createElement("p");
        p.style.cssText = "margin-bottom:16px; line-height:1.8;";
        p.textContent = capLen(paraText, 600);
        bodyWrap.appendChild(p);
      });

    card.appendChild(bodyWrap);
    root.appendChild(card);
  }

  // --------------------------------------------------------------------------
  // HOME VIEW (Task 6.2 Facts First order:
  // (1) Hero, (2) Company Facts, (3) Four Pillars, (4) Single "Target & Roadmap" section,
  // followed by Korea HQ, CEO Message, Culture, Articles, Footnotes)
  // --------------------------------------------------------------------------
  function renderHomeView() {
    const dict = t();
    const c = cfg();
    const headline = c.showKoreaHqBlock ? dict.hero.headlineA : dict.hero.headlineB;
    const subcopy = c.showKoreaHqBlock ? dict.hero.subcopyA : dict.hero.subcopyB;

    let platformAppBtnHtml = "";
    if (c.deliveryAppMode === "coming_soon" || !c.deliveryAppUrl) {
      platformAppBtnHtml = `<span class="btn btn-disabled" aria-disabled="true" onclick="event.stopPropagation(); return false;" style="pointer-events:auto; cursor:not-allowed; min-height:36px; padding:7px 12px; font-size:14px; margin-top:10px;">${dict.hero.appComingSoon}</span>`;
    } else if (c.deliveryAppMode === "active" && c.deliveryAppUrl) {
      platformAppBtnHtml = `<a href="${c.deliveryAppUrl}" target="_blank" rel="noopener" class="btn btn-secondary" style="min-height:36px; padding:7px 12px; font-size:14px; margin-top:10px;" onclick="event.stopPropagation()">${dict.hero.appDownload} ↗</a>`;
    }

    // (3) The Four Pillars (4 cards; delivery-app button placed in the Platform card per Task 5.2)
    const pillarsHtml = dict.pillars.items
      .map(
        (p) => `
        <button type="button" class="service-card" onclick="navigateTo('${p.route}')">
          <i class="service-icon">${svgIcon(p.icon, 20)}</i>
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <span class="card-action">${p.action}</span>
          ${p.id === "platform" ? platformAppBtnHtml : ""}
        </button>
      `
      )
      .join("");

    // Korea HQ Relationship Block (Controlled by SITE_CONFIG.showKoreaHqBlock; positioned after Four Pillars and before CEO Message)
    const koreaHqPillarsHtml = Array.isArray(dict.koreaHq.pillars)
      ? `<div class="hq-pillars-grid">
          ${dict.koreaHq.pillars
            .map((p) => {
              let visualHtml = "";
              if (p.visualType === "korea-fnb") {
                visualHtml = `
                  <div class="hq-visual-pair">
                    <figure class="hq-logo-card hq-logo-light">
                      <div class="hq-logo-img-wrap">
                        <img src="assets/hq/logo-agra.png" alt="Logo Agra - Brand Restoran Premium di Korea" loading="lazy" />
                      </div>
                      <figcaption>${p.caption1}</figcaption>
                    </figure>
                    <figure class="hq-logo-card hq-logo-light">
                      <div class="hq-logo-img-wrap">
                        <img src="assets/hq/logo-noya.jpg" alt="Logo noya Shabu Shabu - Brand Kuliner di Korea" loading="lazy" />
                      </div>
                      <figcaption>${p.caption2}</figcaption>
                    </figure>
                  </div>
                `;
              } else if (p.visualType === "germany-retail") {
                visualHtml = `
                  <figure class="hq-logo-card hq-logo-dark">
                    <div class="hq-logo-img-wrap">
                      <img src="assets/hq/logo-the-gangnam.png" alt="Logo THE GANGNAM - Korean, Japanese & Asian Mart di Jerman" loading="lazy" />
                    </div>
                    <figcaption>${p.caption1}</figcaption>
                  </figure>
                `;
              } else {
                visualHtml = `
                  <figure class="hq-logo-card hq-logo-tech">
                    <div class="hq-logo-img-wrap">
                      <img src="assets/hq/hq-smart-erp.svg" alt="Sistem Smart ERP dan Platform Pemesanan Terpadu" loading="lazy" />
                    </div>
                    <figcaption>${p.caption1}</figcaption>
                  </figure>
                `;
              }
              return `
                <article class="hq-pillar-card">
                  ${visualHtml}
                  <div>
                    <span class="roster-badge" style="margin-bottom:8px;">${p.badge}</span>
                    <h3 style="font-size:18px; margin-bottom:8px;">${p.title}</h3>
                    <p class="hint" style="margin:0; font-size:14.5px; line-height:1.65;">${p.desc}</p>
                  </div>
                </article>
              `;
            })
            .join("")}
        </div>`
      : "";

    const koreaHqSummaryHtml = dict.koreaHq.summary
      ? `<aside class="callout" style="margin:18px 0 0; font-weight:600;">${dict.koreaHq.summary}</aside>`
      : "";

    const koreaHqActionHtml = hasValidKoreaHqUrl()
      ? `<a href="${c.koreaHqUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="margin-top:14px;">${dict.koreaHq.linkText} ↗</a>`
      : "";

    const koreaHqHtml = c.showKoreaHqBlock
      ? `
        <section id="korea-hq-block" class="card section-block">
          <p class="eyebrow">${dict.koreaHq.eyebrow}</p>
          <h2>${dict.koreaHq.title}</h2>
          <p class="intro">${dict.koreaHq.desc}</p>
          ${koreaHqPillarsHtml}
          ${koreaHqSummaryHtml}
          ${koreaHqActionHtml}
        </section>
      `
      : "";

    // (4) Single "Target & Roadmap" section grouping all planned numbers, each visibly labeled as a target
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
          <h3 style="font-size:16px; margin-bottom:10px;">${dict.impact.roadmapTitle}</h3>
          <ol class="workflow">
            ${dict.impact.roadmapSteps.map((step) => `<li>${step}</li>`).join("")}
          </ol>
        </div>
      `
      : "";

    // Related Articles (Auto-hidden if 0 visible items; cards populated via textContent in populateNewsGridDOM)
    const visibleArticles = (state.articles || []).filter(isRowVisible);
    let articlesHtml = "";
    if (visibleArticles.length > 0) {
      articlesHtml = `
        <section class="section-block">
          <div class="workspace-heading">
            <div>
              <p class="eyebrow">${dict.articles.eyebrow}</p>
              <h2>${dict.articles.title}</h2>
            </div>
          </div>
          <div id="home-news-grid" class="metrics-grid"></div>
        </section>
      `;
    }

    // Footnotes Accordion
    const footnotesHtml = state.footnotes
      .map(
        (fn) => `
        <div>
          <strong style="display:block; font-size:14px; margin-bottom:3px;">${loc(fn, "title")}</strong>
          <p class="hint">${loc(fn, "desc")}</p>
        </div>
      `
      )
      .join("");

    return `
      <!-- (1) Hero Section -->
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
          </div>
        </div>
        <div class="hero-visual">
          <img src="assets/muggo-brand-hero.jpg" alt="${c.legalName} - ${c.brandName}" />
        </div>
      </section>

      <!-- (2) Company Facts (Legal name, registered address, open positions, social channels, planned opening) -->
      ${renderIdentityVerificationCard(true, "home")}

      <!-- (3) The Four Pillars -->
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
      </section>

      <!-- Korea HQ Relationship Block (Positioned right after the 4 Pillars and right before CEO Message) -->
      ${koreaHqHtml}

      <!-- Leadership Message (ceoPortraitUrl 1:1 slot hidden when empty; ceoName hidden when empty) -->
      <section class="card section-block">
        <p class="eyebrow">${dict.ceo.eyebrow}</p>
        <h2>${dict.ceo.titlePrefix}${c.ceoName ? ` · ${c.ceoName}` : ""}</h2>
        <div class="${c.ceoPortraitUrl && c.ceoPortraitUrl.trim() !== "" ? "ceo-grid-with-portrait" : ""}" style="margin-top:16px;">
          ${
            c.ceoPortraitUrl && c.ceoPortraitUrl.trim() !== ""
              ? `<picture class="slot-frame ratio-1-1 ceo-portrait-slot">
                  <img src="${c.ceoPortraitUrl.trim()}" width="600" height="600" loading="lazy" alt="Potret kepemimpinan dan manajemen perusahaan" />
                </picture>`
              : ""
          }
          <div class="columns">
            <aside class="callout" style="margin:0;">
              <strong style="display:block; font-size:14px; color:var(--ui-link); margin-bottom:6px;">01 · ${dict.ceo.p1Title}</strong>
              <p>${dict.ceo.p1}</p>
            </aside>
            <aside class="callout" style="margin:0;">
              <strong style="display:block; font-size:14px; color:var(--ui-link); margin-bottom:6px;">02 · ${dict.ceo.p2Title}</strong>
              <p>${dict.ceo.p2}</p>
            </aside>
          </div>
        </div>
        <div style="margin-top:16px; padding-top:14px; border-top:1px solid var(--portal-line); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
          <span class="hint">${c.legalName} (Brand: ${c.brandName})</span>
          <strong>${dict.ceo.signRole}${c.ceoName ? ` · ${c.ceoName}` : ""}</strong>
        </div>
      </section>

      <!-- (4) Single "Target & Roadmap" Section (All planned numbers visibly labeled as targets + roadmap) -->
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

      <!-- Our Culture -->
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

      <!-- Official Announcements -->
      ${articlesHtml}

      <!-- Footnotes Accordion -->
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
  // PLANNED BRANDS VIEW (Task 6.1: Show representative brands first and fold the rest
  // behind "Tampilkan semua brand")
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
    showAllBrandsOnPage = false;
    renderMain();
  };

  window.toggleShowAllBrands = function (expand) {
    showAllBrandsOnPage = expand !== undefined ? Boolean(expand) : !showAllBrandsOnPage;
    renderBrandCardsDOM();
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
    const foldWrap = document.getElementById("brands-fold-action");
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
      if (foldWrap) foldWrap.innerHTML = "";
      return;
    }

    // Task 6.1: On the Brand page show only a few representative brands first and fold the rest ("Tampilkan semua brand")
    const featuredIds = ["sotdak", "seongsu-dak", "bap-club", "pantry12", "salad-pick", "bing-ha"];
    const shouldFold = selectedBrandCategory === "all" && !hasSearch && !showAllBrandsOnPage && brands.length > 6;
    let displayedBrands = brands;
    if (shouldFold) {
      const rep = brands.filter((b) => featuredIds.includes(b.id));
      displayedBrands = rep.length >= 6 ? rep.slice(0, 6) : brands.slice(0, 6);
    }

    const catBadgeMap = dict.catBadgeNames || {};
    container.innerHTML = displayedBrands
      .map((b) => {
        const isExpanded = expandedBrands[b.id] !== undefined ? expandedBrands[b.id] : hasSearch;
        const visibleMenus = isExpanded ? b.menus : b.menus.slice(0, 2);

        return `
          <article class="brand-card">
            <div>
              <div class="brand-card-header">
                <img src="${b.logo}" alt="${locBrand(b, "name")}" class="brand-thumb" loading="lazy" />
                <div style="min-width:0;">
                  <span class="roster-badge">${catBadgeMap[b.category] || b.category}</span>
                  <h3 style="margin-top:4px;">${locBrand(b, "name")}</h3>
                </div>
              </div>
              <p class="hint brand-desc-oneline">${locBrand(b, "desc")}</p>

              <ul class="menu-preview-list">
                ${visibleMenus
                  .map(
                    (m) => `
                  <li class="menu-preview-item">
                    <span>${locBrand(m, "name")}</span>
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>

            <div style="margin-top:10px; padding-top:8px; border-top:1px solid var(--portal-line); display:flex; justify-content:flex-end; align-items:center;">
              <button type="button" class="nav-btn" aria-expanded="${isExpanded ? "true" : "false"}" style="padding:5px 10px; min-height:32px; font-size:14px; color:var(--ui-link); font-weight:700;" onclick="toggleBrandMenus('${b.id}')">
                ${isExpanded ? dict.hideMenus : dict.viewAllMenus}
              </button>
            </div>
          </article>
        `;
      })
      .join("");

    if (foldWrap) {
      if (selectedBrandCategory === "all" && !hasSearch && brands.length > 6) {
        foldWrap.innerHTML = shouldFold
          ? `<button type="button" class="btn btn-secondary" onclick="toggleShowAllBrands(true)">${dict.showAllBrandsBtn || "Tampilkan semua brand"}</button>`
          : `<button type="button" class="btn btn-secondary" onclick="toggleShowAllBrands(false)">${dict.showLessBrandsBtn || "Tampilkan brand pilihan saja"}</button>`;
      } else {
        foldWrap.innerHTML = "";
      }
    }
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
      <div id="brands-fold-action" style="margin-top:20px; display:flex; justify-content:center;"></div>
    `;

    setTimeout(renderBrandCardsDOM, 0);
    return html;
  }

  // --------------------------------------------------------------------------
  // FOOD & R&D VIEW (5 Genre Cards with 4:3 Image Slots)
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
              (g, idx) => `
            <article class="card" style="margin:0;">
              <picture class="slot-frame ratio-4-3" style="margin-bottom:14px;">
                <img src="${g.img || `assets/slots/genre-${idx + 1}-korean.jpg`}" width="800" height="600" loading="lazy" alt="${g.alt || g.title}" />
              </picture>
              <h3>${g.title}</h3>
              <p class="hint" style="margin-top:8px;">${g.desc}</p>
            </article>
          `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // PLATFORM VIEW (Task 5.1 & 5.2: Disabled non-interactive "Aplikasi Delivery (Segera Hadir)"
  // button with aria-disabled="true", no hover effect, and no link target)
  // --------------------------------------------------------------------------
  function renderPlatformView() {
    const dict = t().platformPage;
    const heroDict = t().hero;
    const c = cfg();

    let appAction = "";
    if (c.deliveryAppMode === "coming_soon" || !c.deliveryAppUrl) {
      appAction = `<button type="button" class="btn btn-disabled" disabled aria-disabled="true">${heroDict.appComingSoon}</button>`;
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
        <div class="platform-mockup-grid">
          <div>
            <h2>${dict.appBoxTitle}</h2>
            <p class="intro" style="margin-bottom:18px;">${dict.appBoxDesc}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              ${appAction}
              <button type="button" class="btn btn-secondary" onclick="navigateTo('careers')">
                ${heroDict.careerBtn}
              </button>
            </div>
          </div>
          <picture class="slot-frame ratio-4-5 platform-mockup-frame">
            <img src="assets/slots/platform-app-mockup.jpg" width="1080" height="1350" loading="lazy" alt="Pratinjau tampilan layar aplikasi pemesanan dan keranjang gabungan MUGGO" />
          </picture>
        </div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // PEOPLE & CULTURE VIEW (3:2 Team/Kitchen Image Slot + 3 Number Cards)
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

      <picture class="slot-frame ratio-3-2" style="margin-bottom:20px;">
        <img src="assets/slots/people-team-kitchen.jpg" width="1440" height="960" loading="lazy" alt="Suasana kerja tim dan kolaborasi operasional dapur terpusat di Jakarta Selatan" />
      </picture>

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
  // CAREERS VIEW (Task 4.1: One "Lamar" button per job — 11 buttons total)
  // --------------------------------------------------------------------------
  window.copyEmailAddress = function (emailAddr, btnEl) {
    const email = emailAddr || getRecruitmentEmail();
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

  window.copyCareerEmail = function (btnEl) {
    window.copyEmailAddress(getRecruitmentEmail(), btnEl);
  };

  function renderCareersView() {
    const dict = t().careersPage;
    const c = cfg();
    const visibleJobsCount = (state.jobs || []).filter(isRowVisible).length;

    return `
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">${dict.eyebrow}</p>
          <h1>${dict.title}</h1>
          <p class="intro">${dict.intro}</p>
        </div>
      </div>

      ${renderIdentityVerificationCard(false, "careers")}

      <picture class="slot-frame careers-banner-slot">
        <source media="(max-width: 767px)" srcset="assets/slots/careers-banner-mobile.jpg" width="1080" height="1350" />
        <source media="(min-width: 768px)" srcset="assets/slots/careers-banner-desktop.jpg" width="1920" height="1080" />
        <img src="assets/slots/careers-banner-desktop.jpg" width="1920" height="1080" loading="lazy" alt="Banner rekrutmen resmi 11 bidang posisi operasional dan manajemen di Jakarta Selatan" />
      </picture>

      <section class="section-block">
        <h2>${dict.benefitsTitle}</h2>
        <div class="columns">
          ${dict.benefits
            .filter((b) => !b.visibleFlag || c[b.visibleFlag] !== false)
            .map((b) => {
              const useExt = Boolean(b.flag && c[b.flag]);
              const bTitle = useExt && b.titleExtended ? b.titleExtended : b.title;
              const bDesc = useExt && b.descExtended ? b.descExtended : b.desc;
              return `
                <article class="card" style="margin:0;">
                  <h3>${bTitle}</h3>
                  <p class="hint" style="margin-top:6px;">${bDesc}</p>
                </article>
              `;
            })
            .join("")}
        </div>
      </section>

      <section class="card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
          <div>
            <h2 id="careers-jobs-count" style="margin-bottom:4px;">${dict.positionsTitle} (${visibleJobsCount})</h2>
            <p class="hint">${dict.applyBoxDesc}</p>
          </div>
          <button type="button" class="btn btn-secondary" onclick="copyCareerEmail(this)">
            ${dict.copyEmailBtn}
          </button>
        </div>
        <div id="careers-jobs-list"></div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // CONTACT VIEW (Task 4.4: Show email once when recruitmentEmail is empty;
  // support separate contactEmail and recruitmentEmail when configured)
  // --------------------------------------------------------------------------
  function renderContactView() {
    const dict = t().contactPage;
    const c = cfg();
    const cleanWa = (c.whatsappNumber || "").replace(/[^0-9]/g, "");
    const waSectionHtml = hasWhatsApp()
      ? `<div style="padding-top:16px; border-top:1px solid var(--portal-line); margin-top:16px;">
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

      ${renderIdentityVerificationCard(false, "contact")}

      <section class="card">
        <div style="margin-bottom:16px;">
          <small class="hint" style="display:block; font-weight:700;">${dict.statusLabel}</small>
          <p style="font-weight:600; margin-top:4px;">${dict.statusText}</p>
        </div>

        <div style="padding-top:16px; border-top:1px solid var(--portal-line);">
          <small class="hint" style="display:block; font-weight:700;">${dict.addressLabel}</small>
          <p style="font-weight:700; font-size:16px; margin-top:4px; margin-bottom:8px;">${c.address}</p>
          ${!hasWhatsApp() && dict.phonePendingNotice ? `<p class="hint" style="margin-bottom:12px;">${dict.phonePendingNotice}</p>` : ""}
          <div style="margin-bottom:14px;">
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              ${dict.openMapsBtn || "Buka di Google Maps ↗"}
            </a>
          </div>
          <picture class="slot-frame ratio-16-9">
            <img src="assets/slots/contact-map.jpg" width="1200" height="675" loading="lazy" alt="Peta lokasi alamat terdaftar perusahaan di Jakarta Selatan" />
          </picture>
        </div>

        ${waSectionHtml}
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // ARTICLE DETAIL VIEW (Populated safely with textContent in populateArticleDetailDOM)
  // --------------------------------------------------------------------------
  function renderArticleDetailView() {
    const dict = t().articles;
    return `
      <div style="margin-bottom:16px;">
        <button type="button" class="btn btn-secondary" onclick="navigateTo('home')">${dict.backBtn}</button>
      </div>
      <div id="article-detail-root"></div>
    `;
  }

  // --------------------------------------------------------------------------
  // PRIVACY & TERMS VIEW (Task 4.3 & 5.4 — All strings read from per-language dictionary)
  // TODO(owner): Supply finalized full Indonesian legal wording for Kebijakan Privasi & Syarat & Ketentuan when ready.
  // --------------------------------------------------------------------------
  function renderPolicyView(type) {
    const c = cfg();
    const pDict = t().policyPage || {};
    const isPrivacy = type === "privacy";
    const title = isPrivacy ? pDict.privacyTitle : pDict.termsTitle;
    const p1 = isPrivacy ? pDict.privacyP1 : pDict.termsP1;
    const p2 = isPrivacy ? pDict.privacyP2 : pDict.termsP2;

    return `
      <div class="workspace-heading">
        <div>
          <p class="eyebrow">${c.legalName} · ${c.brandName}</p>
          <h1>${title || ""}</h1>
        </div>
      </div>
      <section class="card">
        <!-- TODO(owner): Replace or expand with finalized legal wording in data/i18n.js -->
        <p style="margin-bottom:14px;">${p1 || ""}</p>
        <p>${p2 || ""}</p>
      </section>
    `;
  }

  // ==========================================================================
  // ACCESSIBLE APPLICATION MODAL & SWAPPABLE APPLY CHANNELS (Task 4.1, 4.2, 4.3)
  // Channels: (a) email draft, (b) WhatsApp link from whatsappNumber, (c) webform endpoint
  // Each channel is shown ONLY when its config value is set.
  // ==========================================================================
  function syncApplyModalText() {
    const mDict = t().applyModal;
    if (!mDict) return;
    const c = cfg();
    const officialEmail = getRecruitmentEmail();
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
    setTxt("apply-whatsapp-btn", mDict.whatsappBtn || "Lamar via WhatsApp ↗");
    setTxt("apply-webform-btn", mDict.webformBtn || "Kirim Formulir Web ↗");

    // Task 4.3: Short privacy notice slot above buttons, filled from a single text key, hidden when empty
    const privacySlot = document.getElementById("apply-privacy-notice");
    const noticeText = ((c.applyPrivacyNotice !== undefined && c.applyPrivacyNotice !== "" ? c.applyPrivacyNotice : mDict.privacyNotice) || "").trim();
    if (privacySlot) {
      if (noticeText) {
        privacySlot.textContent = noticeText;
        privacySlot.removeAttribute("hidden");
        privacySlot.style.display = "block";
      } else {
        privacySlot.textContent = "";
        privacySlot.setAttribute("hidden", "");
        privacySlot.style.display = "none";
      }
    }

    // Task 4.2: Show each apply channel button ONLY when its config value is set
    const emailBtn = document.getElementById("apply-submit-btn");
    const copyBtn = document.getElementById("apply-copy-btn");
    const waBtn = document.getElementById("apply-whatsapp-btn");
    const formBtn = document.getElementById("apply-webform-btn");

    const hasEmail = Boolean(officialEmail);
    if (emailBtn) {
      emailBtn.style.display = hasEmail ? "inline-flex" : "none";
      if (hasEmail) emailBtn.removeAttribute("hidden");
      else emailBtn.setAttribute("hidden", "");
    }
    if (copyBtn) {
      copyBtn.style.display = hasEmail ? "inline-flex" : "none";
      if (hasEmail) copyBtn.removeAttribute("hidden");
      else copyBtn.setAttribute("hidden", "");
    }
    if (waBtn) {
      const showWa = hasWhatsApp();
      waBtn.style.display = showWa ? "inline-flex" : "none";
      if (showWa) waBtn.removeAttribute("hidden");
      else waBtn.setAttribute("hidden", "");
    }
    if (formBtn) {
      const showForm = hasApplyFormEndpoint();
      formBtn.style.display = showForm ? "inline-flex" : "none";
      if (showForm) formBtn.removeAttribute("hidden");
      else formBtn.setAttribute("hidden", "");
    }
  }

  window.openApplyModal = function (roleTitle, triggerEl) {
    lastFocusedTrigger = triggerEl || document.activeElement;
    syncApplyModalText();
    const feedback = document.getElementById("apply-copy-feedback");
    if (feedback) feedback.style.display = "none";
    const m = document.getElementById("apply-modal");
    if (m) {
      m.removeAttribute("hidden");
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
    if (m) {
      m.classList.remove("open");
      m.setAttribute("hidden", "");
    }
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
    const email = getRecruitmentEmail();
    // Task 4.1: Email subject format "Lamaran: <position>"
    const subject = `Lamaran: ${role}`;
    const body = `Kepada Tim HR ${c.legalName} (Brand: ${c.brandName}),\n\nPosisi yang Dilamar: ${role}\nNama Lengkap: ${name}\nKontak: ${contact}\n\nRingkasan Pengalaman & Motivasi:\n${msg}\n\n[Mohon lampirkan file CV / Resume Anda sebelum mengirim email ini]`;
    return { email, role, name, contact, msg, subject, body };
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

  // Task 4.2: Structured apply action with swappable channels:
  // (a) "email" — email draft (current)
  // (b) "whatsapp" — WhatsApp link built from whatsappNumber
  // (c) "webform" — web form endpoint (not implemented yet)
  window.applyViaChannel = async function (channel, e) {
    if (e) e.preventDefault();
    const c = cfg();
    const data = buildApplicationDraftData();

    if (channel === "whatsapp") {
      if (!hasWhatsApp()) return;
      const cleanWa = (c.whatsappNumber || "").replace(/[^0-9]/g, "");
      if (!cleanWa) return;
      const waText = `${data.subject}\n\n${data.body}`;
      window.open(`https://wa.me/${cleanWa}?text=${encodeURIComponent(waText)}`, "_blank", "noopener,noreferrer");
      closeApplyModal();
      return;
    }

    if (channel === "webform") {
      if (!hasApplyFormEndpoint()) return;
      const endpoint = (c.applyFormEndpoint || "").trim();
      try {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            position: data.role,
            name: data.name,
            contact: data.contact,
            message: data.msg,
            subject: data.subject
          })
        });
      } catch (err) {
        window.open(endpoint, "_blank", "noopener,noreferrer");
      }
      closeApplyModal();
      return;
    }

    // Default channel (a): email draft
    if (data.email) {
      window.location.href = `mailto:${data.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;
      closeApplyModal();
    }
  };

  window.submitCareerForm = function (e) {
    window.applyViaChannel("email", e);
  };

  document.addEventListener("keydown", (e) => {
    const openModal = document.querySelector(".modal-overlay.open");
    if (e.key === "Escape") {
      if (openModal) {
        e.preventDefault();
        if (openModal.id === "apply-modal") closeApplyModal();
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
