// ==========================================================================
// MUGGO INDONESIA CORPORATE SITE - MAIN APPLICATION & ROLE-BASED CMS
// ==========================================================================

(function () {
  const STORAGE_KEY = "muggo_cms_data_v1";

  // Load state from localStorage or default
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
    } catch (e) {
      console.warn("Storage load fallback:", e);
    }
    return JSON.parse(JSON.stringify(window.DEFAULT_SITE_DATA));
  }

  let state = loadState();
  let currentRoute = "home";
  let currentArticleId = null;
  let selectedBrandCategory = "all";
  let selectedJobDept = "all";
  let adminRole = "super"; // 'super' (총괄 관리자) | 'hr' (인사 담당자: 소식·채용만 수정 가능)
  let adminTab = "general"; // 'general' | 'metrics' | 'articles' | 'careers' | 'sns_contact'

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
    renderAll();
  }

  window.resetSiteData = function () {
    if (confirm("모든 관리자 수정 내역을 초기 제안요청서 기본값으로 되돌리시겠습니까?")) {
      localStorage.removeItem(STORAGE_KEY);
      state = JSON.parse(JSON.stringify(window.DEFAULT_SITE_DATA));
      renderAll();
      if (document.getElementById("admin-modal").classList.contains("open")) {
        renderAdminModal();
      }
    }
  };

  // Helper: Get current dictionary
  function t() {
    const lang = state.config.currentLang || "ko";
    return window.I18N_DICT[lang] || window.I18N_DICT.ko;
  }

  // Helper: Pick localized field from object (e.g. titleKo, titleId, titleEn)
  function loc(obj, prefix) {
    const lang = state.config.currentLang || "ko";
    const suffix = lang === "id" ? "Id" : lang === "en" ? "En" : "Ko";
    return obj[prefix + suffix] || obj[prefix + "Ko"] || "";
  }

  // 5-2. SNS 연동: 모바일에서는 앱이 설치되어 있으면 앱으로 열리는 방식 우선 적용 + 새 창 열기
  window.openSnsChannel = function (event, platform) {
    if (event) event.preventDefault();
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (platform === "instagram") {
      const url = state.config.instagramUrl || "https://www.instagram.com/muggo.indonesia";
      const username = (state.config.instagramHandle || "@muggo.indonesia").replace("@", "");
      if (isMobile) {
        const appScheme = `instagram://user?username=${encodeURIComponent(username)}`;
        const start = Date.now();
        window.location.href = appScheme;
        setTimeout(() => {
          if (Date.now() - start < 1500) {
            window.open(url, "_blank", "noopener,noreferrer");
          }
        }, 700);
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (platform === "tiktok") {
      const url = state.config.tiktokUrl || "https://www.tiktok.com/@muggo1";
      const username = (state.config.tiktokHandle || "@muggo1").replace("@", "");
      if (isMobile) {
        // TikTok 모바일 앱 스킴 시도 후 웹 새 창 폴백
        const appScheme = `snssdk1233://user/profile/${encodeURIComponent(username)}`;
        const start = Date.now();
        window.location.href = appScheme;
        setTimeout(() => {
          if (Date.now() - start < 1500) {
            window.open(url, "_blank", "noopener,noreferrer");
          }
        }, 700);
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // 4대 핵심 축 통일 스타일 SVG 아이콘
  function getPillarSvg(id) {
    switch (id) {
      case "brands":
        return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
      case "food-rnd":
        return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>`;
      case "platform":
        return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`;
      case "people":
        return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
      default:
        return "";
    }
  }

  // 라우팅 이동
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

  // ⑩ 메타 정보 (페이지별 제목과 설명, WhatsApp 공유 미리보기 OG 동기화)
  function updateSeoMeta() {
    const lang = state.config.currentLang;
    const company = state.config.companyName;
    const pageTitles = {
      home: lang === "id" ? `Beranda | ${company}` : `홈 | ${company}`,
      brands: lang === "id" ? `Brand Kuliner (5 Kategori) | ${company}` : `브랜드 소개 | ${company}`,
      "food-rnd": lang === "id" ? `Food & R&D (5 Genre) | ${company}` : `푸드·R&D | ${company}`,
      platform: lang === "id" ? `Platform & Aplikasi | ${company}` : `플랫폼 소개 | ${company}`,
      people: lang === "id" ? `Budaya & Tim | ${company}` : `사람·조직문화 | ${company}`,
      careers: lang === "id" ? `Karir (11 Bidang Posisi) | ${company}` : `채용 안내 (11개 직군) | ${company}`,
      contact: lang === "id" ? `Kontak | ${company}` : `문의하기 | ${company}`
    };
    const title = pageTitles[currentRoute] || `${company}`;
    document.title = title;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
  }

  // 빠른 컨트롤 바 액션
  window.setSiteLang = function (lang) {
    state.config.currentLang = lang;
    document.documentElement.lang = lang;
    saveState();
  };

  window.toggleKoreaHqQuick = function () {
    state.config.showKoreaHq = !state.config.showKoreaHq;
    saveState();
  };

  window.toggleMobileDrawer = function () {
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) drawer.classList.toggle("open");
  };

  // 연락처 존재 여부 확인 (5-5: 값이 비어 있으면 자동 숨김)
  function hasContactInfo() {
    return Boolean(
      (state.config.whatsappNumber && state.config.whatsappNumber.trim() !== "") ||
      (state.config.contactEmail && state.config.contactEmail.trim() !== "")
    );
  }

  // ==========================================================================
  // RENDER HEADER, CONTROL BAR, FOOTER, STICKY BAR
  // ==========================================================================
  function renderChrome() {
    const dict = t();
    const cfg = state.config;
    const contactVisible = hasContactInfo();

    // 1. 상단 RFP 검수 컨트롤 바
    const ctrlBar = document.getElementById("rfp-control-bar");
    if (ctrlBar) {
      ctrlBar.innerHTML = `
        <div class="rfp-control-inner">
          <div class="rfp-control-group">
            <span class="rfp-badge">RFP 100% 반영 프로토타입</span>
            <button class="ctrl-btn ${cfg.currentLang === 'ko' ? 'active' : ''}" onclick="setSiteLang('ko')">🇰🇷 한국어 (기획안 원문)</button>
            <button class="ctrl-btn ${cfg.currentLang === 'id' ? 'active' : ''}" onclick="setSiteLang('id')">🇮🇩 인도네시아어 (1차 오픈)</button>
            <button class="ctrl-btn ${cfg.currentLang === 'en' ? 'active' : ''}" onclick="setSiteLang('en')">🇺🇸 English (확장)</button>
          </div>
          <div class="rfp-control-group">
            <button class="ctrl-btn ${cfg.showKoreaHq ? 'active' : ''}" onclick="toggleKoreaHqQuick()" title="대표님 결정 사항: 히어로 문구 A/B 및 푸터 본사 링크 연동">
              한국 본사 표시: ${cfg.showKoreaHq ? 'ON (문구 A)' : 'OFF (문구 B)'}
            </button>
            <button class="ctrl-btn spec-btn" onclick="openSpecModal()">📋 최종 이미지 목록표 & 기술 제안서</button>
            <button class="ctrl-btn admin-btn" onclick="openAdminModal('super')">⚙️ 관리 화면 (총괄 관리자)</button>
            <button class="ctrl-btn admin-btn" onclick="openAdminModal('hr')">👤 인사 담당자 권한 체험</button>
          </div>
        </div>
      `;
    }

    // 2. ① 헤더 (로고 2종 지원, 메뉴 5개 + 문의 조건부 노출, 언어 전환 기본 숨김)
    const header = document.getElementById("site-header");
    const isDarkHeader = currentRoute !== "home";
    if (header) {
      header.className = `site-header ${isDarkHeader ? "dark-mode-header" : ""}`;
      const logoSrc = isDarkHeader ? "assets/logo-dark-bg.svg" : "assets/logo-light-bg.svg";

      const navItems = [
        { id: "brands", label: dict.nav.brands },
        { id: "food-rnd", label: dict.nav.foodRnd },
        { id: "platform", label: dict.nav.platform },
        { id: "people", label: dict.nav.people },
        { id: "careers", label: dict.nav.careers }
      ];
      // 연락처 값이 입력되어 있을 때만 문의 메뉴 자동 노출 (비어 있으면 보류/자동 숨김)
      if (contactVisible) {
        navItems.push({ id: "contact", label: dict.nav.contact });
      }

      const navHtml = navItems
        .map(
          (item) =>
            `<button class="nav-link ${currentRoute === item.id ? "active" : ""}" onclick="navigateTo('${item.id}')">${item.label}</button>`
        )
        .join("");

      const langSwitcherHtml = cfg.showHeaderLangSwitcher
        ? `<select class="lang-select-header" onchange="setSiteLang(this.value)" aria-label="Language">
            <option value="id" ${cfg.currentLang === "id" ? "selected" : ""}>ID (Bahasa)</option>
            <option value="ko" ${cfg.currentLang === "ko" ? "selected" : ""}>KO (한국어)</option>
            <option value="en" ${cfg.currentLang === "en" ? "selected" : ""}>EN (English)</option>
           </select>`
        : "";

      header.innerHTML = `
        <div class="header-inner">
          <a href="#home" class="brand-logo-link" onclick="navigateTo('home'); return false;" title="로고 2종(밝은 배경용/어두운 배경용) 자동 전환">
            <img src="${logoSrc}" alt="MUGGO Logo" class="brand-logo-img" />
          </a>
          <nav class="desktop-nav" aria-label="Main Navigation">
            ${navHtml}
          </nav>
          <div class="header-actions">
            <a href="${cfg.instagramUrl}" onclick="openSnsChannel(event, 'instagram')" class="ctrl-btn" title="Instagram ${cfg.instagramHandle}" style="text-decoration:none; padding:6px 9px;">📸 IG</a>
            <a href="${cfg.tiktokUrl}" onclick="openSnsChannel(event, 'tiktok')" class="ctrl-btn" title="TikTok ${cfg.tiktokHandle}" style="text-decoration:none; padding:6px 9px;">🎵 TikTok</a>
            ${langSwitcherHtml}
            <button class="header-cta-btn" onclick="navigateTo('careers')">${dict.nav.careerCta}</button>
            <button class="mobile-menu-btn" onclick="toggleMobileDrawer()" aria-label="메뉴 열기">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
        <div id="mobile-drawer" class="mobile-drawer">
          <button class="nav-link ${currentRoute === 'home' ? 'active' : ''}" onclick="navigateTo('home')">${dict.nav.home}</button>
          ${navHtml}
          <div style="display:flex; gap:8px; padding-top:8px;">
            <a href="${cfg.instagramUrl}" onclick="openSnsChannel(event, 'instagram')" class="ctrl-btn" style="flex:1; justify-content:center; padding:10px; text-decoration:none;">📸 Instagram (${cfg.instagramHandle})</a>
            <a href="${cfg.tiktokUrl}" onclick="openSnsChannel(event, 'tiktok')" class="ctrl-btn" style="flex:1; justify-content:center; padding:10px; text-decoration:none;">🎵 TikTok (${cfg.tiktokHandle})</a>
          </div>
          <div style="padding-top:8px; display:flex; gap:8px;">
            <button class="btn-primary" style="width:100%; padding:12px;" onclick="navigateTo('careers')">${dict.nav.careerCta}</button>
          </div>
        </div>
      `;
    }

    // 3. ⑨ 푸터 (어두운 배경용 로고, 인스타그램/틱톡, 메뉴 재노출, 한국 본사 링크 ON/OFF, 개인정보처리방침/이용약관, 저작권)
    const footer = document.getElementById("site-footer");
    if (footer) {
      const cleanWa = (cfg.whatsappNumber || "").replace(/[^0-9]/g, "");
      const contactBlockHtml = contactVisible
        ? `<div style="margin-top:14px; padding-top:12px; border-top:1px solid #27272A; font-size:13px; color:#D4D4D8;">
            ${cfg.whatsappNumber ? `<div>WhatsApp: <a href="https://wa.me/${cleanWa}" target="_blank" rel="noopener" style="color:#FF7849;">${cfg.whatsappNumber}</a></div>` : ""}
            ${cfg.contactEmail ? `<div>Email: <a href="mailto:${cfg.contactEmail}" style="color:#FF7849;">${cfg.contactEmail}</a></div>` : ""}
           </div>`
        : `<div style="margin-top:12px; font-size:12px; color:#71717A;">※ 문의 연락처(WhatsApp·이메일)는 현재 미확정 상태로 자동 숨김 처리 중입니다. (관리 화면 입력 시 자동 노출)</div>`;

      const koreaHqFooterLink = cfg.showKoreaHq
        ? `<div style="margin-top:12px;">
            <a href="${cfg.koreaHqUrl}" target="_blank" rel="noopener noreferrer" class="sns-pill-link" style="border-color:rgba(232,74,39,0.5); color:#FF8A65;">
              🇰🇷 ${dict.footer.hqLinkText} (${cfg.koreaHqName}) ↗
            </a>
           </div>`
        : "";

      footer.innerHTML = `
        <div class="container">
          <div class="footer-grid">
            <div>
              <img src="assets/logo-dark-bg.svg" alt="MUGGO Dark Logo" style="height:38px; margin-bottom:14px;" />
              <p style="color:#A1A1AA; max-width:420px; line-height:1.6;">${dict.footer.desc}</p>
              ${koreaHqFooterLink}
              ${contactBlockHtml}
            </div>
            <div>
              <h4 style="color:#FFFFFF; font-size:14px; font-weight:800; margin-bottom:14px;">${dict.footer.menuTitle}</h4>
              <ul class="footer-links">
                <li><button onclick="navigateTo('home')">${dict.nav.home}</button></li>
                <li><button onclick="navigateTo('brands')">${dict.nav.brands}</button></li>
                <li><button onclick="navigateTo('food-rnd')">${dict.nav.foodRnd}</button></li>
                <li><button onclick="navigateTo('platform')">${dict.nav.platform}</button></li>
                <li><button onclick="navigateTo('people')">${dict.nav.people}</button></li>
                <li><button onclick="navigateTo('careers')">${dict.nav.careers}</button></li>
                ${contactVisible ? `<li><button onclick="navigateTo('contact')">${dict.nav.contact}</button></li>` : ""}
              </ul>
            </div>
            <div>
              <h4 style="color:#FFFFFF; font-size:14px; font-weight:800; margin-bottom:12px;">${dict.footer.snsTitle}</h4>
              <div class="footer-sns-row">
                <a href="${cfg.instagramUrl}" onclick="openSnsChannel(event, 'instagram')" class="sns-pill-link">
                  <span>📸 Instagram</span>
                  <span style="color:#A1A1AA; font-size:12px;">${cfg.instagramHandle}</span>
                </a>
                <a href="${cfg.tiktokUrl}" onclick="openSnsChannel(event, 'tiktok')" class="sns-pill-link">
                  <span>🎵 TikTok</span>
                  <span style="color:#A1A1AA; font-size:12px;">${cfg.tiktokHandle}</span>
                </a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <div>© 2026 <strong>${cfg.companyName}</strong>. All rights reserved.</div>
            <div class="footer-links">
              <button onclick="navigateTo('privacy')">${dict.footer.policyPrivacy}</button>
              <span>|</span>
              <button onclick="navigateTo('terms')">${dict.footer.policyTerms}</button>
              <span>|</span>
              <button onclick="openSpecModal()" style="color:#93C5FD;">이미지 규격표 & 제안서</button>
              <span>|</span>
              <button onclick="openAdminModal('super')" style="color:#6EE7B7;">⚙️ ${dict.footer.adminBtn}</button>
            </div>
          </div>
        </div>
      `;
    }

    // 4. 5-1. 모바일 하단 고정 버튼 바 (인스타그램, 틱톡, 채용 지원 + 연락처 입력 시 WhatsApp 자동 추가)
    const stickyBar = document.getElementById("mobile-sticky-bar");
    if (stickyBar) {
      const cleanWa = (cfg.whatsappNumber || "").replace(/[^0-9]/g, "");
      const waBtnHtml = cfg.whatsappNumber && cfg.whatsappNumber.trim() !== ""
        ? `<a href="https://wa.me/${cleanWa}" target="_blank" rel="noopener" class="sticky-sns-btn" style="border-color:#22C55E; color:#86EFAC;">💬 ${dict.stickyBar.whatsapp}</a>`
        : "";

      stickyBar.innerHTML = `
        <div class="sticky-bar-inner">
          <a href="${cfg.instagramUrl}" onclick="openSnsChannel(event, 'instagram')" class="sticky-sns-btn ig" title="Instagram ${cfg.instagramHandle}">
            📸 ${dict.stickyBar.instagram}
          </a>
          <a href="${cfg.tiktokUrl}" onclick="openSnsChannel(event, 'tiktok')" class="sticky-sns-btn tt" title="TikTok ${cfg.tiktokHandle}">
            🎵 ${dict.stickyBar.tiktok}
          </a>
          ${waBtnHtml}
          <button class="sticky-career-btn" onclick="navigateTo('careers')">
            🚀 ${dict.stickyBar.apply}
          </button>
        </div>
      `;
    }
  }

  // ==========================================================================
  // RENDER MAIN PAGE CONTENT
  // ==========================================================================
  function renderMain() {
    const main = document.getElementById("main-content");
    if (!main) return;

    switch (currentRoute) {
      case "home":
        main.innerHTML = renderHomePage();
        break;
      case "brands":
        main.innerHTML = renderBrandsPage();
        break;
      case "food-rnd":
        main.innerHTML = renderFoodRndPage();
        break;
      case "platform":
        main.innerHTML = renderPlatformPage();
        break;
      case "people":
        main.innerHTML = renderPeoplePage();
        break;
      case "careers":
        main.innerHTML = renderCareersPage();
        break;
      case "contact":
        main.innerHTML = renderContactPage();
        break;
      case "article-detail":
        main.innerHTML = renderArticleDetailPage();
        break;
      case "privacy":
        main.innerHTML = renderPolicyPage("privacy");
        break;
      case "terms":
        main.innerHTML = renderPolicyPage("terms");
        break;
      default:
        main.innerHTML = renderHomePage();
    }
  }

  // --------------------------------------------------------------------------
  // 3. 홈 화면 (섹션 ② ~ ⑧ 완비)
  // --------------------------------------------------------------------------
  function renderHomePage() {
    const dict = t();
    const cfg = state.config;

    // ② 히어로 문구 A (본사 노출) vs 문구 B (본사 비노출)
    const headline = cfg.showKoreaHq ? dict.hero.headlineA : dict.hero.headlineB;
    const subcopy = cfg.showKoreaHq ? dict.hero.subcopyA : dict.hero.subcopyB;
    const modeTag = cfg.showKoreaHq
      ? "문구 안 A (한국 본사 관계 노출 ON)"
      : "문구 안 B (한국 본사 관계 비노출 OFF)";

    // 자체 배달 앱 버튼 상태 (5-5: "오픈 예정" 표시 / 숨김 / 링크 연결)
    let deliveryBtnHtml = "";
    if (cfg.deliveryAppMode === "coming_soon") {
      deliveryBtnHtml = `<span class="btn-coming-soon">📱 ${dict.hero.appComingSoon}</span>`;
    } else if (cfg.deliveryAppMode === "active" && cfg.deliveryAppUrl) {
      deliveryBtnHtml = `<a href="${cfg.deliveryAppUrl}" target="_blank" rel="noopener" class="btn-secondary">📱 ${dict.hero.appDownload} ↗</a>`;
    }

    // ③ 핵심 축 카드 4개
    const pillarsHtml = dict.pillars.items
      .map(
        (item) => `
        <article class="pillar-card" onclick="navigateTo('${item.route}')" tabindex="0" role="button">
          <div>
            <div class="pillar-icon-wrap">${getPillarSvg(item.id)}</div>
            <div class="pillar-ref-badge">${item.refMap}</div>
            <h3 class="pillar-title">${item.title}</h3>
            <p class="pillar-desc">${item.desc}</p>
          </div>
          <span class="pillar-link">${item.linkText}</span>
        </article>
      `
      )
      .join("");

    // 5-3. 한국 본사 관계 표시 모듈 (켜고 끄기 가능)
    const koreaHqModuleHtml = cfg.showKoreaHq
      ? `
        <div class="korea-hq-banner">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <span class="hero-pill">${dict.koreaHqModule.badge}</span>
            <span style="font-size:12px; color:#A1A1AA;">대표님 결정에 따라 관리 화면에서 ON/OFF 가능</span>
          </div>
          <h3>${dict.koreaHqModule.title}</h3>
          <p>${dict.koreaHqModule.desc}</p>
          <div>
            <a href="${cfg.koreaHqUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="padding:10px 18px; font-size:13.5px;">
              ${dict.koreaHqModule.linkLabel}
            </a>
          </div>
        </div>
      `
      : "";

    // ⑤ 지표 (Impact) - 큰 숫자 6개 + "목표·예정" 표기
    const metricsHtml = state.metrics
      .map((m) => {
        let numDisplay = loc(m, "number");
        if (m.id === "m3" && cfg.brandCountLabel && cfg.currentLang === "ko") {
          numDisplay = cfg.brandCountLabel;
        }
        if (m.id === "m6" && cfg.firstStoreDate && cfg.currentLang === "ko") {
          numDisplay = cfg.firstStoreDate;
        }
        return `
          <div class="metric-card">
            <div class="metric-top">
              <span class="metric-label">${loc(m, "label")}</span>
              <span class="metric-target-badge">${loc(m, "badge")}</span>
            </div>
            <div class="metric-number">${numDisplay}</div>
            <p class="metric-desc">${loc(m, "desc")}</p>
          </div>
        `;
      })
      .join("");

    // 2단계 옵션: 사업 지역 로드맵
    const roadmapHtml = cfg.showRegionalRoadmap
      ? `
        <div class="roadmap-box">
          <span class="section-tag" style="margin-bottom:8px;">PHASE 2 OPTION</span>
          <h3 style="font-size:20px; font-weight:800; color:#FFF;">${dict.impact.roadmapTitle}</h3>
          <p style="font-size:14px; color:#D4D4D8; margin-top:4px;">${dict.impact.roadmapDesc}</p>
          <div class="roadmap-steps">
            ${dict.impact.roadmapSteps
              .map(
                (st) => `
              <div class="roadmap-step-card">
                <div style="font-size:12px; font-weight:800; color:#FF7849;">${st.phase}</div>
                <div style="font-size:16px; font-weight:800; color:#FFF; margin:4px 0;">${st.region}</div>
                <div style="font-size:13px; color:#A1A1AA;">${st.detail}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
      : "";

    // ⑦ 소식 (Related Articles) - 항목이 없으면 섹션 자동 숨김!
    let articlesSectionHtml = "";
    if (state.articles && state.articles.length > 0) {
      const cardsHtml = state.articles
        .map(
          (art) => `
          <article class="article-card" onclick="navigateTo('article-detail', '${art.id}')">
            <div class="article-thumb" style="background: ${art.thumbColor || 'linear-gradient(135deg, #E84A27, #18181B)'};">
              <span style="font-size:11px; font-weight:800; background:rgba(0,0,0,0.45); padding:4px 10px; border-radius:99px; align-self:flex-start;">
                ${art.thumbLabel || "MUGGO NEWS"}
              </span>
              <span style="font-size:11px; color:rgba(255,255,255,0.8);">썸네일 이미지 슬롯 (800×500px)</span>
            </div>
            <div class="article-body">
              <div>
                <div class="article-meta">
                  <span class="article-cat">${loc(art, "category")}</span>
                  <span>·</span>
                  <span>${art.date}</span>
                </div>
                <h3 class="article-title">${loc(art, "title")}</h3>
                <p class="article-summary">${loc(art, "summary")}</p>
              </div>
              <span class="pillar-link">${dict.articles.readMore}</span>
            </div>
          </article>
        `
        )
        .join("");

      articlesSectionHtml = `
        <section class="section" id="section-articles">
          <div class="container">
            <div class="section-header" style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:12px;">
              <div>
                <span class="section-tag">${dict.articles.sectionTag}</span>
                <h2 class="section-title">${dict.articles.sectionTitle}</h2>
                <p class="section-desc">${dict.articles.sectionNotice}</p>
              </div>
              <button class="ctrl-btn admin-btn" style="padding:8px 14px; font-size:12.5px;" onclick="openAdminModal('hr')">
                ✏️ 인사 담당자 소식 관리 열기
              </button>
            </div>
            <div class="articles-grid">
              ${cardsHtml}
            </div>
          </div>
        </section>
      `;
    }

    // ⑧ 수치 안내 각주 (접었다 펴는 형태 3~4개 항목)
    const footnotesHtml = state.footnotes
      .map(
        (fn) => `
        <div class="footnote-item">
          <strong>${loc(fn, "title")}</strong>
          <span>${loc(fn, "desc")}</span>
        </div>
      `
      )
      .join("");

    return `
      <!-- ② 히어로 (맨 위 큰 첫 화면) -->
      <section class="hero-section" id="section-hero">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-text-col">
              <div class="hero-badge-row">
                <span class="hero-pill">${dict.hero.badge}</span>
                <span class="hero-mode-indicator">${modeTag}</span>
              </div>
              <h1 class="hero-headline">${headline}</h1>
              <p class="hero-subcopy">${subcopy}</p>
              <div class="hero-cta-group">
                <button class="btn-primary" onclick="navigateTo('careers')">
                  🚀 ${dict.hero.careerBtn}
                </button>
                <button class="btn-secondary" onclick="navigateTo('brands')">
                  🍽️ ${dict.hero.brandBtn}
                </button>
                ${deliveryBtnHtml}
              </div>
            </div>
            <!-- 히어로 대표 이미지: 모바일 세로형(4:5) & PC 가로형(16:9) 반응형 대응 -->
            <div class="hero-visual-box">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; font-weight:800; color:#FF8A65; letter-spacing:1px;">MUGGO SMART FOOD COURT</span>
                <span style="font-size:11px; background:rgba(232,74,39,0.25); color:#FFD166; padding:3px 10px; border-radius:99px; font-weight:700;">
                  5 Categories · ${cfg.brandCountLabel} Brands
                </span>
              </div>
              <div class="hero-visual-grid-collage">
                <div class="collage-card">
                  <span class="collage-icon">🍗</span>
                  <span class="collage-title">Chicken & K-Food</span>
                  <span class="collage-sub">치킨 · 한식 대표 브랜드</span>
                </div>
                <div class="collage-card">
                  <span class="collage-icon">🍔</span>
                  <span class="collage-title">Pizza · Burger · Sub</span>
                  <span class="collage-sub">아티산 피자 · 스매시 버거</span>
                </div>
                <div class="collage-card">
                  <span class="collage-icon">🥗</span>
                  <span class="collage-title">Salad & Poke Bowl</span>
                  <span class="collage-sub">프레시 샐러드 · 헬시 볼</span>
                </div>
                <div class="collage-card">
                  <span class="collage-icon">🧋</span>
                  <span class="collage-title">Coffee & Dessert</span>
                  <span class="collage-sub">스페셜티 커피 · 크로플 · 빙수</span>
                </div>
              </div>
              <div class="spec-slot-banner">
                <span>
                  🖼️ <strong class="mobile-only-text">${dict.hero.mobileImgTag}</strong>
                  <strong class="pc-only-text">${dict.hero.pcImgTag}</strong>
                </span>
                <button class="ctrl-btn" onclick="openSpecModal()" style="white-space:nowrap;">규격 보기</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ③ 핵심 축 (Our Pillars) -->
      <section class="section" id="section-pillars">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">${dict.pillars.sectionTag}</span>
            <h2 class="section-title">${dict.pillars.sectionTitle}</h2>
            <p class="section-desc">${dict.pillars.sectionDesc}</p>
          </div>
          <div class="pillars-grid">
            ${pillarsHtml}
          </div>
          ${koreaHqModuleHtml}
        </div>
      </section>

      <!-- ④ 대표 인사말 (CEO Message) -->
      <section class="section ceo-section" id="section-ceo">
        <div class="container">
          <div class="ceo-card">
            <span class="section-tag">${dict.ceo.sectionTag}</span>
            <h2 class="section-title" style="margin-top:4px;">
              ${dict.ceo.titlePrefix} <span style="color:var(--brand-primary); font-weight:800;">${cfg.ceoName}</span>
            </h2>
            <div class="ceo-paragraphs">
              <div class="ceo-p-box">
                <div class="ceo-p-label">01 · ${dict.ceo.p1Label}</div>
                <p class="ceo-p-text">${dict.ceo.p1}</p>
              </div>
              <div class="ceo-p-box">
                <div class="ceo-p-label">02 · ${dict.ceo.p2Label}</div>
                <p class="ceo-p-text">${dict.ceo.p2}</p>
              </div>
            </div>
            <div class="ceo-signature">
              <div>
                <div style="font-size:13px; color:var(--text-muted);">${cfg.companyName}</div>
                <div style="font-size:17px; font-weight:800; color:var(--text-main); margin-top:2px;">
                  ${dict.ceo.signPrefix} ${cfg.ceoName}
                </div>
              </div>
              <span style="font-size:12px; color:var(--text-muted);">※ 대표자명 및 법인명은 관리 화면에서 즉시 변경 가능합니다.</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ⑤ 지표 (Impact - 사업 계획상 목표 수치와 '목표·예정' 표기) -->
      <section class="section impact-section" id="section-impact">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">${dict.impact.sectionTag}</span>
            <h2 class="section-title">${dict.impact.sectionTitle}</h2>
          </div>
          <div class="impact-notice">
            ${dict.impact.sectionNotice}
          </div>
          <div class="metrics-grid">
            ${metricsHtml}
          </div>
          ${roadmapHtml}
        </div>
      </section>

      <!-- ⑥ 조직문화 (Our Culture) -->
      <section class="section" id="section-culture">
        <div class="container">
          <div class="culture-banner">
            <div class="culture-visual-slot">
              <span class="hero-pill" style="align-self:flex-start;">OUR CULTURE & PEOPLE</span>
              <div style="margin:auto 0;">
                <div style="font-size:36px; margin-bottom:10px;">🤝 🌟 🔥</div>
                <div style="font-size:18px; font-weight:800;">착한 인성 · 성실함 · 진심 어린 열정</div>
                <div style="font-size:13px; color:#D4D4D8; margin-top:4px;">Good Character · Diligence · Genuine Passion</div>
              </div>
              <div class="spec-slot-banner">
                <span>🖼️ 조직문화 대표 이미지 슬롯 (1440×960px WebP)</span>
              </div>
            </div>
            <div class="culture-content">
              <span class="section-tag" style="align-self:flex-start; margin-bottom:14px;">${dict.culture.sectionTag}</span>
              <blockquote class="culture-quote">${dict.culture.quote}</blockquote>
              <p class="culture-sub">${dict.culture.subdesc}</p>
              <div style="display:flex; flex-wrap:wrap; gap:10px;">
                <button class="btn-primary" onclick="navigateTo('people')">${dict.culture.peopleBtn}</button>
                <button class="btn-secondary" onclick="navigateTo('careers')">${dict.culture.careerBtn}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ⑦ 소식 (Related Articles - 항목 0개 시 자동 숨김) -->
      ${articlesSectionHtml}

      <!-- ⑧ 수치 안내 각주 (접었다 펴는 형태 3~4개 항목) -->
      <section class="footnote-section" id="section-footnotes">
        <div class="container">
          <div class="footnote-accordion">
            <button class="footnote-trigger" onclick="toggleFootnotes()" aria-expanded="true" id="footnote-btn">
              <span>📌 ${dict.footnotes.buttonTitle}</span>
              <span class="metric-target-badge" id="footnote-arrow">${dict.footnotes.badge} ▼</span>
            </button>
            <div class="footnote-content open" id="footnote-body">
              ${footnotesHtml}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  window.toggleFootnotes = function () {
    const body = document.getElementById("footnote-body");
    if (body) body.classList.toggle("open");
  };

  // --------------------------------------------------------------------------
  // 서브페이지 1: 브랜드 (카테고리별 자체 브랜드 소개 - 치킨, 한식, 피자·버거·샌드위치, 샐러드, 음료·디저트)
  // --------------------------------------------------------------------------
  window.filterBrands = function (catId) {
    selectedBrandCategory = catId;
    renderMain();
  };

  function renderBrandsPage() {
    const cfg = state.config;
    const isId = cfg.currentLang === "id";
    const cats = state.brandCategories;
    const filteredCats =
      selectedBrandCategory === "all"
        ? cats
        : cats.filter((c) => c.id === selectedBrandCategory);

    const tabsHtml = `
      <button class="filter-tab ${selectedBrandCategory === "all" ? "active" : ""}" onclick="filterBrands('all')">
        ${isId ? `Semua Kategori (5 Kategori · ${cfg.brandCountLabel} Brand)` : `전체 카테고리 (5개 카테고리 · ${cfg.brandCountLabel})`}
      </button>
      ${cats
        .map(
          (c) => `
        <button class="filter-tab ${selectedBrandCategory === c.id ? "active" : ""}" onclick="filterBrands('${c.id}')">
          ${loc(c, "name")}
        </button>
      `
        )
        .join("")}
    `;

    const sectionsHtml = filteredCats
      .map(
        (cat) => `
        <div style="margin-bottom:44px;">
          <div style="display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:8px; margin-bottom:16px; border-bottom:2px solid var(--border-light); padding-bottom:10px;">
            <div>
              <h2 style="font-size:22px; font-weight:800;">${loc(cat, "name")}</h2>
              <p style="font-size:14px; color:var(--text-secondary); margin-top:2px;">${loc(cat, "desc")}</p>
            </div>
            <span class="section-tag">${cat.countLabel}</span>
          </div>
          <div class="brands-grid">
            ${cat.brands
              .map(
                (b) => `
              <div class="brand-item-card">
                <div class="brand-img-slot" style="background: linear-gradient(135deg, ${b.color}, #18181B);">
                  <div style="display:flex; justify-content:space-between; font-size:11px; opacity:0.9;">
                    <span style="font-weight:800;">${b.code}</span>
                    <span style="background:rgba(0,0,0,0.4); padding:2px 8px; border-radius:99px;">${b.genre}</span>
                  </div>
                  <div>
                    <div style="font-size:17px; font-weight:900; letter-spacing:-0.3px;">${b.name}</div>
                    <div style="font-size:11px; opacity:0.8; margin-top:2px;">${isId ? "Slot Gambar Brand (800×600px)" : "브랜드 이미지 슬롯 (800×600px)"}</div>
                  </div>
                </div>
                <div class="brand-card-body">
                  <div style="font-size:14px; font-weight:700; color:var(--text-main);">${isId ? b.tagId : b.tagKo}</div>
                  <div style="font-size:12px; color:var(--text-muted); margin-top:6px;">${isId ? "Lini Brand Internal (Rencana)" : "목표·예정 자체 브랜드 라인업"}</div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
      )
      .join("");

    return `
      <div class="subpage-hero">
        <div class="container">
          <span class="hero-pill">OUR BRANDS · 5 CATEGORIES</span>
          <h1>${isId ? "Brand Internal di 5 Kategori Mulai dari Ayam hingga Dessert" : "치킨부터 디저트까지 5개 카테고리의 자체 브랜드"}</h1>
          <p>${isId ? `Menghadirkan ${cfg.brandCountLabel} brand kuliner internal (target rencana) dalam satu food court online.` : `인도네시아 고객의 다양한 취향을 만족시키는 ${cfg.brandCountLabel}(계획 기준) 자체 브랜드를 한 곳에서 선보입니다.`}</p>
        </div>
      </div>
      <section class="section">
        <div class="container">
          <div class="filter-tabs">${tabsHtml}</div>
          ${sectionsHtml}
        </div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // 서브페이지 2: 푸드·R&D (한식, 중식, 일식, 인도네시아, 양식 메뉴 개발 소개)
  // --------------------------------------------------------------------------
  function renderFoodRndPage() {
    const genres = [
      {
        code: "GENRE 01",
        title: "한식 (Korean Cuisine)",
        desc: "떡볶이, 김밥, 비빔밥, 한국식 양념치킨, 불고기·찌개 등 정통 레시피와 트렌디한 K-스트리트 푸드",
        points: ["한국 특제 소스 배합 표준화", "인도네시아 현지 입맛 맞춤 매운맛 단계 설계", "딜리버리 면·밥류 식감 유지 기술"]
      },
      {
        code: "GENRE 02",
        title: "중식 (Chinese & Oriental)",
        desc: "웍(Wok) 화력을 살린 중화풍 칠리 요리, 볶음면, 딤섬·사이드 및 오리엔탈 덮밥 메뉴 개발",
        points: ["고온 단시간 조리 표준 매뉴얼", "바삭함이 유지되는 튀김·소스 분리 패키징", "대중적인 아시안 풍미 구현"]
      },
      {
        code: "GENRE 03",
        title: "일식 (Japanese Cuisine)",
        desc: "가라아게, 가츠산도, 돈부리, 포케·롤 등 깔끔하고 정갈한 일식 메뉴 라인업",
        points: ["정량 포션 컨트롤 및 수비드·튀김 온도 관리", "피크타임 5분 이내 조리 완료 공정 설계", "원팩 소스 시스템"]
      },
      {
        code: "GENRE 04",
        title: "인도네시아 (Indonesian Local & Fusion)",
        desc: "현지 고객에게 친숙한 삼발(Sambal) 풍미, 아얌(Ayam) 요리, 로컬 식자재를 결합한 퓨전 메뉴",
        points: ["인도네시아 신선 로컬 식자재 적극 활용", "No Pork / No Lard 등 현지 식문화 존중 레시피 설계", "현지인 셰프와 한국 R&D 팀 공동 테스트"]
      },
      {
        code: "GENRE 05",
        title: "양식 (Western · Pizza · Burger · Salad)",
        desc: "수제 스매시 버거, 아티산 피자, 파니니·토스트, 프레시 샐러드 볼과 스페셜티 디저트",
        points: ["배달 후에도 온도와 바삭함을 지키는 전용 패키지", "신선 채소 콜드체인 관리 공정", "전 연령층이 즐기는 글로벌 스탠다드 메뉴"]
      }
    ];

    return `
      <div class="subpage-hero">
        <div class="container">
          <span class="hero-pill">FOOD & R&D · 5 CULINARY GENRES</span>
          <h1>한식, 중식, 일식, 인도네시아, 양식을 아우르는 메뉴 개발</h1>
          <p>5대 요리 장르의 경계를 넘어 딜리버리와 픽업에 최적화된 표준 레시피를 연구합니다.</p>
        </div>
      </div>
      <section class="section">
        <div class="container">
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:20px;">
            ${genres
              .map(
                (g) => `
              <div class="pillar-card" style="cursor:default;">
                <div>
                  <span class="section-tag">${g.code}</span>
                  <h3 class="pillar-title" style="margin-top:8px;">${g.title}</h3>
                  <p class="pillar-desc">${g.desc}</p>
                  <ul style="padding-left:18px; font-size:13.5px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
                    ${g.points.map((pt) => `<li>${pt}</li>`).join("")}
                  </ul>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // 서브페이지 3: 플랫폼 (온라인 푸드코트 몰과 자체 배달 앱 소개)
  // --------------------------------------------------------------------------
  function renderPlatformPage() {
    const cfg = state.config;
    let appActionHtml = "";
    if (cfg.deliveryAppMode === "coming_soon") {
      appActionHtml = `<div class="btn-coming-soon" style="font-size:15px;">📱 자체 배달 앱 · 오픈 예정 (Segera Hadir)</div>`;
    } else if (cfg.deliveryAppMode === "active" && cfg.deliveryAppUrl) {
      appActionHtml = `<a href="${cfg.deliveryAppUrl}" target="_blank" rel="noopener" class="btn-primary">📱 자체 배달 앱 다운로드 / 바로가기 ↗</a>`;
    } else {
      appActionHtml = `<div style="font-size:13px; color:#A1A1AA;">(현재 자체 배달 앱 버튼이 관리 화면에서 '숨김' 설정되어 있습니다.)</div>`;
    }

    return `
      <div class="subpage-hero">
        <div class="container">
          <span class="hero-pill">PLATFORM · ONLINE FOOD COURT & APP</span>
          <h1>딜리버리·픽업 중심의 온라인 푸드코트 몰과 자체 배달 앱</h1>
          <p>30여 개 브랜드의 메뉴를 한 장바구니에 담아 한 번의 배달로 받아보는 차세대 외식 플랫폼입니다.</p>
        </div>
      </div>
      <section class="section">
        <div class="container">
          <div class="pillars-grid" style="grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); margin-bottom:36px;">
            <div class="pillar-card" style="cursor:default;">
              <span class="section-tag">01 · SINGLE CART MULTI-BRAND</span>
              <h3 class="pillar-title" style="margin-top:10px;">통합 장바구니 & 합포장 딜리버리</h3>
              <p class="pillar-desc">치킨, 떡볶이, 버거, 샐러드, 커피까지 서로 다른 브랜드의 메뉴를 추가 배달비 없이 한 번에 주문하고 동시에 받아볼 수 있습니다.</p>
            </div>
            <div class="pillar-card" style="cursor:default;">
              <span class="section-tag">02 · SMART PICKUP & HUB</span>
              <h3 class="pillar-title" style="margin-top:10px;">스마트 키친 & 오프라인 픽업 거점</h3>
              <p class="pillar-desc">자카르타 1호점(오픈 예정)을 시작으로 딜리버리 라이더와 픽업 고객의 동선을 최적화한 스마트 푸드코트 허브를 구축합니다.</p>
            </div>
            <div class="pillar-card" style="cursor:default;">
              <span class="section-tag">03 · PROPRIETARY APP</span>
              <h3 class="pillar-title" style="margin-top:10px;">자체 배달 앱 (오픈 예정)</h3>
              <p class="pillar-desc">현지 주요 배달 앱 연동뿐만 아니라 브랜드 멤버십, 묶음 할인, 픽업 예약이 가능한 MUGGO 전용 앱을 준비하고 있습니다.</p>
            </div>
          </div>

          <div class="korea-hq-banner" style="margin-top:0;">
            <h3>MUGGO 자체 배달 앱 연결 모듈 (제안요청서 5-5 반영)</h3>
            <p>앱 출시 전에는 <strong>"오픈 예정"</strong> 표시 또는 <strong>"숨김"</strong> 중 선택할 수 있으며, 앱 출시 후 관리 화면에서 스토어/앱 링크만 입력하면 즉시 활성 버튼으로 전환됩니다.</p>
            <div style="display:flex; flex-wrap:wrap; align-items:center; gap:12px; margin-top:8px;">
              ${appActionHtml}
              <button class="ctrl-btn admin-btn" style="padding:10px 14px;" onclick="openAdminModal('super', 'sns_contact')">
                ⚙️ 관리 화면에서 앱 버튼 상태 변경해보기
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // 서브페이지 4: 사람 (조직문화와 인재상)
  // --------------------------------------------------------------------------
  function renderPeoplePage() {
    const dict = t();
    return `
      <div class="subpage-hero">
        <div class="container">
          <span class="hero-pill">OUR PEOPLE & CULTURE</span>
          <h1>성실함과 열정을 존중하는 팀</h1>
          <p>${dict.culture.quote}</p>
        </div>
      </div>
      <section class="section">
        <div class="container">
          <div class="culture-banner" style="margin-bottom:40px;">
            <div class="culture-visual-slot">
              <span class="hero-pill" style="align-self:flex-start;">TEAM MUGGO INDONESIA</span>
              <div style="margin:auto 0;">
                <h2 style="font-size:24px; font-weight:800;">함께 일하고 싶은 동료의 모습</h2>
                <p style="color:#D4D4D8; margin-top:8px; font-size:14.5px;">우리는 서로의 역할을 존중하고 약속을 지키는 팀워크를 가장 소중히 여깁니다.</p>
              </div>
              <div class="spec-slot-banner">
                <span>🖼️ 사람 페이지 대표 이미지 슬롯 (홈 조직문화 이미지와 연동 가능)</span>
              </div>
            </div>
            <div class="culture-content">
              <span class="section-tag" style="align-self:flex-start; margin-bottom:12px;">CORE VALUES · 3대 인재상</span>
              <blockquote class="culture-quote">${dict.culture.quote}</blockquote>
              <p class="culture-sub">MUGGO 인도네시아 법인의 모든 채용과 평가는 아래 3가지 핵심 태도를 기준으로 이루어집니다.</p>
            </div>
          </div>

          <div class="pillars-grid" style="grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));">
            <div class="pillar-card" style="cursor:default;">
              <span class="section-tag">VALUE 01 · GOOD CHARACTER</span>
              <h3 class="pillar-title" style="margin-top:10px;">착한 인성과 상호 존중</h3>
              <p class="pillar-desc">다양한 문화와 직무의 동료들이 함께 일하는 만큼, 정직하고 배려심 있는 태도로 서로를 존중하는 문화를 만듭니다.</p>
            </div>
            <div class="pillar-card" style="cursor:default;">
              <span class="section-tag">VALUE 02 · DILIGENCE</span>
              <h3 class="pillar-title" style="margin-top:10px;">자신의 몫을 해내는 성실함</h3>
              <p class="pillar-desc">보이지 않는 주방의 위생부터 고객에게 전달되는 마지막 포장까지, 맡은 자리에서 기본과 원칙을 성실히 지킵니다.</p>
            </div>
            <div class="pillar-card" style="cursor:default;">
              <span class="section-tag">VALUE 03 · GENUINE PASSION</span>
              <h3 class="pillar-title" style="margin-top:10px;">일에 대한 진심 어린 열정</h3>
              <p class="pillar-desc">더 맛있는 음식, 더 편리한 플랫폼을 만들기 위해 끊임없이 고민하고 회사와 함께 성장하려는 에너지를 응원합니다.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // 서브페이지 5: 채용 (모집 직군 11개, 복지, 지원 방법 - 이메일 및 지원 폼 확장 구조)
  // --------------------------------------------------------------------------
  function renderCareersPage() {
    const cfg = state.config;
    const jobsHtml = state.jobs
      .map(
        (job) => `
        <div class="job-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
            <div>
              <div class="job-badges" style="margin-bottom:8px;">
                <span class="job-badge dept">${loc(job, "dept")}</span>
                <span class="job-badge">${loc(job, "type")}</span>
                <span class="job-badge">📍 ${job.location}</span>
              </div>
              <h3 style="font-size:18px; font-weight:800; color:var(--text-main);">${loc(job, "title")}</h3>
              <p style="font-size:14px; color:var(--text-secondary); margin-top:6px;">${loc(job, "desc")}</p>
            </div>
            <div style="display:flex; gap:8px;">
              ${
                cfg.enableCareerForm
                  ? `<button class="btn-primary" style="padding:10px 18px; font-size:13.5px;" onclick="openApplyModal('${loc(job, "title").replace(/'/g, "")}')">온라인 지원 폼 작성</button>`
                  : `<a href="mailto:${cfg.careerEmail}?subject=${encodeURIComponent("[MUGGO 입사지원] " + loc(job, "title"))}" class="btn-primary" style="padding:10px 18px; font-size:13.5px;">📧 이메일 지원하기</a>`
              }
            </div>
          </div>
        </div>
      `
      )
      .join("");

    return `
      <div class="subpage-hero">
        <div class="container">
          <span class="hero-pill">CAREERS · 11 OPEN CATEGORIES</span>
          <h1>MUGGO 인도네시아 채용 안내 (모집 직군 ${state.jobs.length}개)</h1>
          <p>인도네시아 외식 시장을 함께 바꿀 창립 멤버를 기다립니다. 채용 공고는 인사 담당자가 관리 화면에서 직접 수정할 수 있습니다.</p>
        </div>
      </div>
      <section class="section">
        <div class="container">
          <!-- 지원 방법 & 이메일 안내 박스 (제안요청서 5-5 반영) -->
          <div class="korea-hq-banner" style="margin-top:0; margin-bottom:36px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <span class="hero-pill">HOW TO APPLY · 지원 방법 안내</span>
              <button class="ctrl-btn admin-btn" onclick="openAdminModal('hr')">👤 인사 담당자 채용 공고 관리 열기</button>
            </div>
            <h3>채용 접수처: <a href="mailto:${cfg.careerEmail}" style="color:#FF8A65; text-decoration:underline;">${cfg.careerEmail}</a></h3>
            <p>
              이력서(CV)와 희망 지원 직군을 기재하여 <strong>${cfg.careerEmail}</strong>으로 보내주세요.<br/>
              <span style="font-size:13px; color:#A1A1AA;">※ 제안요청서 5-5 요건에 따라 기본 이메일 링크 연결 외에 <strong>추후 온라인 지원 폼으로 즉시 전환 가능한 확장 모듈</strong>이 내장되어 있습니다.</span>
            </p>
            <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:6px;">
              <a href="mailto:${cfg.careerEmail}?subject=${encodeURIComponent("[MUGGO Indonesia] Job Application")}" class="btn-primary" style="padding:12px 20px; font-size:14px;">
                📧 ${cfg.careerEmail} 이메일 보내기
              </a>
              <button class="btn-secondary" style="padding:12px 20px; font-size:14px;" onclick="openApplyModal('전체 직군 지원')">
                📝 온라인 지원 폼(확장 모듈) 미리보기
              </button>
            </div>
          </div>

          <!-- 복지 및 근무 환경 -->
          <div style="margin-bottom:40px;">
            <h2 style="font-size:22px; font-weight:800; margin-bottom:16px;">근무 환경 및 복지 혜택 (Benefits)</h2>
            <div class="pillars-grid">
              <div class="pillar-card" style="cursor:default;">
                <h4 style="font-size:16px; font-weight:800; margin-bottom:6px;">🏛️ 현지 법규 준수 & 4대 보험 (BPJS)</h4>
                <p style="font-size:13.5px; color:var(--text-secondary);">인도네시아 노동법 기준 근로계약, BPJS Kesehatan 및 Ketenagakerjaan, 종교 명절 수당(THR) 완벽 보장</p>
              </div>
              <div class="pillar-card" style="cursor:default;">
                <h4 style="font-size:16px; font-weight:800; margin-bottom:6px;">🍱 근무 중 식사 및 브랜드 할인</h4>
                <p style="font-size:13.5px; color:var(--text-secondary);">근무 중 든든한 직원 식사 제공 및 MUGGO 산하 30여 개 브랜드 임직원 할인 혜택 제공</p>
              </div>
              <div class="pillar-card" style="cursor:default;">
                <h4 style="font-size:16px; font-weight:800; margin-bottom:6px;">📈 체계적인 직무 교육 & 성장 기회</h4>
                <p style="font-size:13.5px; color:var(--text-secondary);">표준 조리·운영 매뉴얼 교육 및 100개 지점 확장 로드맵에 따른 핵심 관리자 승진 기회 부여</p>
              </div>
              <div class="pillar-card" style="cursor:default;">
                <h4 style="font-size:16px; font-weight:800; margin-bottom:6px;">🏅 우수 사원 포상 & 인센티브</h4>
                <p style="font-size:13.5px; color:var(--text-secondary);">성실함과 열정으로 뛰어난 성과를 만든 팀과 개인에게 정기 포상 및 성과 인센티브 지급</p>
              </div>
            </div>
          </div>

          <!-- 모집 직군 11개 상세 -->
          <h2 style="font-size:22px; font-weight:800; margin-bottom:16px;">현재 모집 중인 직군 (${state.jobs.length}개 분야)</h2>
          <div class="jobs-list">
            ${jobsHtml}
          </div>
        </div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // 서브페이지 6: 문의 (연락처 확정 후 노출 - 보류 상태 대응)
  // --------------------------------------------------------------------------
  function renderContactPage() {
    const cfg = state.config;
    const cleanWa = (cfg.whatsappNumber || "").replace(/[^0-9]/g, "");
    return `
      <div class="subpage-hero">
        <div class="container">
          <span class="hero-pill">CONTACT US · 문의하기</span>
          <h1>파트너십 및 고객 문의</h1>
          <p>인도네시아 현지 고객, 파트너, 입점·협업 문의 채널입니다.</p>
        </div>
      </div>
      <section class="section">
        <div class="container">
          <div class="ceo-card">
            ${
              hasContactInfo()
                ? `
                  <h2 style="font-size:22px; font-weight:800; margin-bottom:16px;">공식 연락처 안내</h2>
                  <div style="display:grid; gap:14px; font-size:16px;">
                    ${cfg.whatsappNumber ? `<div>💬 <strong>WhatsApp:</strong> <a href="https://wa.me/${cleanWa}" target="_blank" style="color:var(--brand-primary); font-weight:800;">${cfg.whatsappNumber}</a></div>` : ""}
                    ${cfg.contactEmail ? `<div>📧 <strong>문의 이메일:</strong> <a href="mailto:${cfg.contactEmail}" style="color:var(--brand-primary); font-weight:800;">${cfg.contactEmail}</a></div>` : ""}
                    ${cfg.officeAddress ? `<div>📍 <strong>법인 주소:</strong> ${cfg.officeAddress}</div>` : ""}
                  </div>
                `
                : `
                  <span class="section-tag">보류 상태 안내 (제안요청서 5-5)</span>
                  <h2 style="font-size:22px; font-weight:800; margin-top:8px;">WhatsApp 번호 및 문의 이메일 확정 전 자동 숨김 중</h2>
                  <p style="margin-top:10px; color:var(--text-secondary);">
                    제안요청서 5-5 요건에 따라 현재 연락처(WhatsApp 번호, 문의 이메일) 값이 비어 있어 헤더 메뉴, 모바일 하단 버튼, 푸터에서 자동으로 숨겨져 있습니다.<br/>
                    관리 화면에서 연락처를 입력하시면 즉시 전체 영역에 반영됩니다.
                  </p>
                  <button class="btn-primary" style="margin-top:18px;" onclick="openAdminModal('super', 'sns_contact')">
                    ⚙️ 관리 화면에서 연락처 입력 테스트하기
                  </button>
                `
            }
          </div>
        </div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // 서브페이지 7: 소식 상세 페이지 (사이트 내 상세 페이지 - 제안요청서 3-⑦)
  // --------------------------------------------------------------------------
  function renderArticleDetailPage() {
    const dict = t();
    const art = state.articles.find((a) => a.id === currentArticleId) || state.articles[0];
    if (!art) {
      return `<section class="section"><div class="container"><p>등록된 소식이 없습니다.</p></div></section>`;
    }
    const contentParagraphs = (loc(art, "content") || "")
      .split("\n\n")
      .map((p) => `<p style="margin-bottom:16px; font-size:16px; line-height:1.8;">${p}</p>`)
      .join("");

    return `
      <div class="subpage-hero">
        <div class="container">
          <button class="ctrl-btn" onclick="navigateTo('home')" style="margin-bottom:14px;">${dict.articles.backToList}</button>
          <div style="font-size:13px; color:#FF8A65; font-weight:700;">${loc(art, "category")} · ${art.date}</div>
          <h1 style="font-size:26px; margin-top:6px;">${loc(art, "title")}</h1>
        </div>
      </div>
      <section class="section">
        <div class="container" style="max-width:820px;">
          <div style="border-radius:16px; height:240px; background:${art.thumbColor}; padding:24px; color:#fff; display:flex; align-items:flex-end; margin-bottom:28px;">
            <span style="background:rgba(0,0,0,0.55); padding:6px 14px; border-radius:8px; font-size:13px;">
              🖼️ ${art.thumbLabel} · 사이트 내 소식 상세 페이지
            </span>
          </div>
          <div class="ceo-card" style="background:#FFFFFF;">
            ${contentParagraphs}
          </div>
          <div style="margin-top:24px; display:flex; justify-content:space-between;">
            <button class="btn-primary" onclick="navigateTo('home')">${dict.articles.backToList}</button>
            <button class="ctrl-btn admin-btn" onclick="openAdminModal('hr')">✏️ 인사 담당자 화면에서 이 소식 수정하기</button>
          </div>
        </div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // 서브페이지 8: 개인정보처리방침 & 이용약관 (제안요청서 3-⑨, 5-7)
  // --------------------------------------------------------------------------
  function renderPolicyPage(type) {
    const cfg = state.config;
    const isPrivacy = type === "privacy";
    return `
      <div class="subpage-hero">
        <div class="container">
          <span class="hero-pill">LEGAL & POLICY</span>
          <h1>${isPrivacy ? "개인정보처리방침 (Kebijakan Privasi)" : "이용약관 (Syarat & Ketentuan)"}</h1>
          <p>${cfg.companyName} 공식 웹사이트 운영 정책</p>
        </div>
      </div>
      <section class="section">
        <div class="container" style="max-width:860px;">
          <div class="ceo-card" style="background:#FFFFFF; line-height:1.8;">
            ${
              isPrivacy
                ? `
                  <h3 style="margin-bottom:10px;">1. 개인정보의 수집 목적 및 항목</h3>
                  <p style="margin-bottom:18px; color:var(--text-secondary);">
                    ${cfg.companyName}(이하 "법인")은 채용 지원 접수(${cfg.careerEmail}) 및 파트너십 문의를 위해 지원자 및 문의자가 자발적으로 제공하는 성명, 이메일 주소, 연락처, 이력서 기재 항목만을 수집·이용합니다.
                  </p>
                  <h3 style="margin-bottom:10px;">2. 개인정보의 보유 및 파기</h3>
                  <p style="margin-bottom:18px; color:var(--text-secondary);">
                    수집된 채용 지원 및 문의 정보는 목적 달성 후 지체 없이 파기하며, 인도네시아 개인정보보호법(UU PDP) 및 관련 법령을 준수합니다.
                  </p>
                  <h3 style="margin-bottom:10px;">3. 문의처</h3>
                  <p style="color:var(--text-secondary);">개인정보 관련 문의: ${cfg.careerEmail}</p>
                `
                : `
                  <h3 style="margin-bottom:10px;">제1조 (목적)</h3>
                  <p style="margin-bottom:18px; color:var(--text-secondary);">
                    본 약관은 ${cfg.companyName}이 운영하는 기업 소개 웹사이트의 이용 조건 및 법적 고지 사항을 규정합니다.
                  </p>
                  <h3 style="margin-bottom:10px;">제2조 (정보 제공 목적 및 목표 수치 고지)</h3>
                  <p style="margin-bottom:18px; color:var(--text-secondary);">
                    본 웹사이트에 게시된 자체 브랜드 수, 확장 목표 지점 수, 오픈 예정 일정 등 모든 수치는 사업 계획상 목표 및 예정 사항이며, 향후 사업 여건에 따라 변경될 수 있습니다.
                  </p>
                  <h3 style="margin-bottom:10px;">제3조 (지식재산권)</h3>
                  <p style="color:var(--text-secondary);">
                    본 사이트의 로고, 브랜드명, 텍스트 및 이미지 콘텐츠에 대한 권리는 ${cfg.companyName}에 귀속됩니다.
                  </p>
                `
            }
          </div>
        </div>
      </section>
    `;
  }

  // ==========================================================================
  // 5-6. 관리 화면과 권한 (CMS MODAL: 총괄 관리자 vs 인사 담당자 권한 분리)
  // ==========================================================================
  window.openAdminModal = function (role, tab) {
    if (role) adminRole = role;
    if (adminRole === "hr") {
      // 인사 담당자는 소식과 채용 공고만 수정 가능!
      if (tab !== "articles" && tab !== "careers") {
        adminTab = "articles";
      } else {
        adminTab = tab;
      }
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
      alert("인사 담당자(HR) 계정은 '소식(Articles)'과 '채용 공고(Careers)'만 수정할 수 있습니다. (제안요청서 5-6 권한 구분 반영)");
      return;
    }
    adminTab = tab;
    renderAdminModal();
  };

  function renderAdminModal() {
    const container = document.getElementById("admin-modal-content");
    if (!container) return;
    const cfg = state.config;
    const isHr = adminRole === "hr";

    let tabBodyHtml = "";

    if (adminTab === "general" && !isHr) {
      tabBodyHtml = `
        <h3 style="margin-bottom:14px;">기본 정보 및 대표님 결정 사항 설정</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px;">
          <div class="form-group">
            <label>법인명 [ ] (푸터·인사말·메타 정보 자동 반영)</label>
            <input type="text" class="form-control" id="adm-companyName" value="${cfg.companyName}" />
          </div>
          <div class="form-group">
            <label>대표자명 [ ] (홈 대표 인사말 자동 반영)</label>
            <input type="text" class="form-control" id="adm-ceoName" value="${cfg.ceoName}" />
          </div>
          <div class="form-group">
            <label>자체 브랜드 수 표기 (30여 개 / 32개 통일)</label>
            <input type="text" class="form-control" id="adm-brandCount" value="${cfg.brandCountLabel}" />
          </div>
          <div class="form-group">
            <label>1호점 오픈 예정 날짜 [ ]</label>
            <input type="text" class="form-control" id="adm-firstStoreDate" value="${cfg.firstStoreDate}" />
          </div>
        </div>

        <div style="background:#FAF8F5; border:1px solid #E4E4E7; padding:16px; border-radius:12px; margin:12px 0;">
          <h4 style="margin-bottom:10px;">🇰🇷 한국 본사 관계 표시 모듈 (제안요청서 5-3)</h4>
          <label style="display:flex; align-items:center; gap:8px; font-weight:700; cursor:pointer; margin-bottom:12px;">
            <input type="checkbox" id="adm-showKoreaHq" ${cfg.showKoreaHq ? "checked" : ""} />
            한국 본사 관계 노출 켜기 (ON: 히어로 문구 A + 본사 영역 + 푸터 링크 노출 / OFF: 히어로 문구 B + 본사 숨김)
          </label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div class="form-group" style="margin:0;">
              <label>한국 본사 표기명</label>
              <input type="text" class="form-control" id="adm-koreaHqName" value="${cfg.koreaHqName}" />
            </div>
            <div class="form-group" style="margin:0;">
              <label>한국 본사 링크 URL</label>
              <input type="text" class="form-control" id="adm-koreaHqUrl" value="${cfg.koreaHqUrl}" />
            </div>
          </div>
        </div>

        <div style="background:#FAF8F5; border:1px solid #E4E4E7; padding:16px; border-radius:12px; margin:12px 0;">
          <h4 style="margin-bottom:10px;">🌐 다국어 및 2단계 옵션 모듈</h4>
          <label style="display:flex; align-items:center; gap:8px; font-weight:600; cursor:pointer; margin-bottom:8px;">
            <input type="checkbox" id="adm-showLangSwitcher" ${cfg.showHeaderLangSwitcher ? "checked" : ""} />
            헤더에 언어 전환 드롭다운 노출하기 (체크 해제 시 제안요청서 3-① 기준 숨김)
          </label>
          <label style="display:flex; align-items:center; gap:8px; font-weight:600; cursor:pointer;">
            <input type="checkbox" id="adm-showRoadmap" ${cfg.showRegionalRoadmap ? "checked" : ""} />
            홈 지표 섹션 하단에 2단계 옵션 '사업 지역 로드맵' 표시하기
          </label>
        </div>

        <button class="btn-primary" onclick="saveGeneralAdmin()">💾 기본 설정 저장 및 즉시 반영</button>
      `;
    } else if (adminTab === "metrics" && !isHr) {
      tabBodyHtml = `
        <h3 style="margin-bottom:8px;">⑤ 홈 화면 계획 지표 (숫자 6개) 수정</h3>
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px;">오픈 전이므로 모든 숫자에 '목표·예정' 배지가 함께 표시됩니다.</p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:14px;">
          ${state.metrics
            .map(
              (m, idx) => `
            <div style="border:1px solid #E4E4E7; padding:14px; border-radius:10px;">
              <div class="form-group">
                <label>[지표 ${idx + 1}] 라벨 (한국어)</label>
                <input type="text" class="form-control" id="adm-m-label-${idx}" value="${m.labelKo}" />
              </div>
              <div class="form-group">
                <label>큰 숫자 표기 (한국어)</label>
                <input type="text" class="form-control" id="adm-m-num-${idx}" value="${m.numberKo}" />
              </div>
              <div class="form-group" style="margin:0;">
                <label>한 줄 설명</label>
                <input type="text" class="form-control" id="adm-m-desc-${idx}" value="${m.descKo}" />
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        <button class="btn-primary" style="margin-top:16px;" onclick="saveMetricsAdmin()">💾 숫자 지표 저장하기</button>
      `;
    } else if (adminTab === "sns_contact" && !isHr) {
      tabBodyHtml = `
        <h3 style="margin-bottom:14px;">SNS 연동 · 연락처(자동 숨김) · 자체 배달 앱 설정</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:14px;">
          <div class="form-group">
            <label>인스타그램 계정 (@muggo.indonesia)</label>
            <input type="text" class="form-control" id="adm-igHandle" value="${cfg.instagramHandle}" />
          </div>
          <div class="form-group">
            <label>인스타그램 주소</label>
            <input type="text" class="form-control" id="adm-igUrl" value="${cfg.instagramUrl}" />
          </div>
          <div class="form-group">
            <label>틱톡 계정 (@muggo1)</label>
            <input type="text" class="form-control" id="adm-ttHandle" value="${cfg.tiktokHandle}" />
          </div>
          <div class="form-group">
            <label>틱톡 주소</label>
            <input type="text" class="form-control" id="adm-ttUrl" value="${cfg.tiktokUrl}" />
          </div>
        </div>

        <div style="background:#FFFBEB; border:1px solid #FDE68A; padding:16px; border-radius:12px; margin:14px 0;">
          <h4 style="margin-bottom:6px;">📞 연락처 설정 (제안요청서 5-5: 값이 비어 있으면 자동 숨김)</h4>
          <p style="font-size:12.5px; color:#92400E; margin-bottom:12px;">
            WhatsApp 번호나 문의 이메일을 입력하고 저장하면 헤더 '문의' 메뉴, 모바일 하단 WhatsApp 버튼, 푸터 연락처가 자동으로 나타납니다. 비워두면 자동으로 숨겨집니다.
          </p>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
            <div class="form-group" style="margin:0;">
              <label>WhatsApp 번호 (예: +62 812-3456-7890)</label>
              <input type="text" class="form-control" id="adm-wa" placeholder="비워두면 자동 숨김" value="${cfg.whatsappNumber}" />
            </div>
            <div class="form-group" style="margin:0;">
              <label>문의 이메일 (비워두면 자동 숨김)</label>
              <input type="text" class="form-control" id="adm-email" placeholder="예: contact@muggo.co.id" value="${cfg.contactEmail}" />
            </div>
          </div>
        </div>

        <div style="background:#FAF8F5; border:1px solid #E4E4E7; padding:16px; border-radius:12px; margin:14px 0;">
          <h4 style="margin-bottom:8px;">📱 자체 배달 앱 버튼 설정 (제안요청서 5-5)</h4>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
            <div class="form-group" style="margin:0;">
              <label>노출 방식 선택</label>
              <select class="form-control" id="adm-appMode">
                <option value="coming_soon" ${cfg.deliveryAppMode === "coming_soon" ? "selected" : ""}>"오픈 예정" 표시 (기본)</option>
                <option value="hidden" ${cfg.deliveryAppMode === "hidden" ? "selected" : ""}>버튼 숨김</option>
                <option value="active" ${cfg.deliveryAppMode === "active" ? "selected" : ""}>출시 완료 (아래 링크로 연결)</option>
              </select>
            </div>
            <div class="form-group" style="margin:0;">
              <label>배달 앱 다운로드/웹 링크 (입력 시 연결)</label>
              <input type="text" class="form-control" id="adm-appUrl" placeholder="https://..." value="${cfg.deliveryAppUrl}" />
            </div>
          </div>
        </div>

        <button class="btn-primary" onclick="saveSnsContactAdmin()">💾 SNS · 연락처 · 앱 설정 저장</button>
      `;
    } else if (adminTab === "articles") {
      tabBodyHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
          <div>
            <h3>⑦ 소식 (Related Articles) 관리 — 인사 담당자 권한 영역</h3>
            <p style="font-size:12.5px; color:var(--text-secondary);">
              현재 등록된 소식: <strong>${state.articles.length}개</strong> (모든 소식을 삭제해 0개가 되면 홈 화면에서 '소식' 섹션이 자동으로 숨겨집니다!)
            </p>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="ctrl-btn" style="background:#DC2626; color:#fff; padding:8px 12px;" onclick="clearAllArticlesTest()">
              🧪 전체 삭제하여 '섹션 자동 숨김' 테스트
            </button>
            <button class="ctrl-btn admin-btn" style="padding:8px 12px;" onclick="addNewArticle()">
              + 새 소식 카드 추가
            </button>
          </div>
        </div>
        <div style="display:grid; gap:14px;">
          ${state.articles
            .map(
              (art, idx) => `
            <div style="border:1px solid #E4E4E7; border-radius:10px; padding:14px; background:#FAF8F5;">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <strong>소식 카드 #${idx + 1} (${art.date})</strong>
                <button class="ctrl-btn" style="background:#EF4444; color:#fff;" onclick="deleteArticle('${art.id}')">삭제</button>
              </div>
              <div style="display:grid; grid-template-columns:140px 1fr; gap:10px; margin-bottom:8px;">
                <input type="text" class="form-control" id="adm-art-date-${idx}" value="${art.date}" placeholder="날짜" />
                <input type="text" class="form-control" id="adm-art-title-${idx}" value="${art.titleKo}" placeholder="제목 (한국어)" />
              </div>
              <input type="text" class="form-control" id="adm-art-sum-${idx}" value="${art.summaryKo}" placeholder="요약 설명" />
            </div>
          `
            )
            .join("")}
        </div>
        ${state.articles.length > 0 ? `<button class="btn-primary" style="margin-top:14px;" onclick="saveArticlesAdmin()">💾 소식 수정사항 저장</button>` : ""}
      `;
    } else if (adminTab === "careers") {
      tabBodyHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
          <div>
            <h3>채용 공고 (모집 직군 ${state.jobs.length}개) 관리 — 인사 담당자 권한 영역</h3>
            <p style="font-size:12.5px; color:var(--text-secondary);">채용 접수 이메일 및 모집 직군을 수정·추가할 수 있습니다.</p>
          </div>
          <button class="ctrl-btn admin-btn" style="padding:8px 12px;" onclick="addNewJob()">+ 모집 직군 추가</button>
        </div>
        <div style="background:#FAF8F5; border:1px solid #E4E4E7; padding:14px; border-radius:10px; margin-bottom:16px; display:flex; flex-wrap:wrap; gap:16px; align-items:center;">
          <div style="flex:1; min-width:220px;">
            <label style="font-size:12.5px; font-weight:700; display:block; margin-bottom:4px;">채용 접수 이메일 (기본: barasustainable@gmail.com)</label>
            <input type="text" class="form-control" id="adm-careerEmail" value="${cfg.careerEmail}" />
          </div>
          <label style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:700; cursor:pointer; padding-top:16px;">
            <input type="checkbox" id="adm-enableCareerForm" ${cfg.enableCareerForm ? "checked" : ""} />
            지원 버튼 클릭 시 이메일 대신 '사이트 내 온라인 지원 폼(확장 모듈)' 바로 열기
          </label>
        </div>
        <div style="display:grid; gap:10px; max-height:360px; overflow-y:auto; padding-right:4px;">
          ${state.jobs
            .map(
              (job, idx) => `
            <div style="border:1px solid #E4E4E7; border-radius:8px; padding:12px; display:grid; grid-template-columns:1fr auto; gap:10px; align-items:center;">
              <div style="display:grid; gap:6px;">
                <input type="text" class="form-control" id="adm-job-title-${idx}" value="${job.titleKo}" />
                <input type="text" class="form-control" id="adm-job-desc-${idx}" value="${job.descKo}" style="font-size:12.5px;" />
              </div>
              <button class="ctrl-btn" style="background:#EF4444; color:#fff;" onclick="deleteJob('${job.id}')">삭제</button>
            </div>
          `
            )
            .join("")}
        </div>
        <button class="btn-primary" style="margin-top:14px;" onclick="saveCareersAdmin()">💾 채용 공고 저장하기</button>
      `;
    }

    container.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:10px; padding-bottom:16px; border-bottom:1px solid #E4E4E7; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:13px; font-weight:800;">현재 로그인 권한 모드:</span>
          <button class="ctrl-btn ${!isHr ? "active" : ""}" onclick="switchAdminRole('super')">🔑 총괄 관리자 (전체 권한)</button>
          <button class="ctrl-btn ${isHr ? "active" : ""}" onclick="switchAdminRole('hr')">👤 인사 담당자 (소식·채용 전용 권한)</button>
        </div>
        <button class="ctrl-btn" onclick="resetSiteData()">🔄 초기 기본값 복원</button>
      </div>

      ${
        isHr
          ? `<div style="background:#ECFDF5; border:1px solid #10B981; color:#065F46; padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:16px;">
              🔒 <strong>인사 담당자(HR) 권한 모드 작동 중:</strong> 제안요청서 5-6 요건에 따라 <strong>소식(Articles)</strong>과 <strong>채용 공고(Careers)</strong> 탭만 수정할 수 있으며, 법인 설정/숫자/SNS 탭은 접근이 제한됩니다.
             </div>`
          : ""
      }

      <div class="filter-tabs" style="margin-bottom:20px;">
        <button class="filter-tab ${adminTab === "general" ? "active" : ""}" onclick="switchAdminTab('general')" style="${isHr ? "opacity:0.45;" : ""}">
          ${isHr ? "🔒 " : ""}1. 법인명 · 본사 ON/OFF · 다국어
        </button>
        <button class="filter-tab ${adminTab === "metrics" ? "active" : ""}" onclick="switchAdminTab('metrics')" style="${isHr ? "opacity:0.45;" : ""}">
          ${isHr ? "🔒 " : ""}2. 숫자 지표 (6개)
        </button>
        <button class="filter-tab ${adminTab === "sns_contact" ? "active" : ""}" onclick="switchAdminTab('sns_contact')" style="${isHr ? "opacity:0.45;" : ""}">
          ${isHr ? "🔒 " : ""}3. SNS · 연락처(자동숨김) · 배달앱
        </button>
        <button class="filter-tab ${adminTab === "articles" ? "active" : ""}" onclick="switchAdminTab('articles')">
          4. 소식 관리 (${state.articles.length}개) [인사담당]
        </button>
        <button class="filter-tab ${adminTab === "careers" ? "active" : ""}" onclick="switchAdminTab('careers')">
          5. 채용 공고 (${state.jobs.length}개) [인사담당]
        </button>
      </div>

      <div>${tabBodyHtml}</div>
    `;
  }

  // CMS Save Handlers
  window.saveGeneralAdmin = function () {
    state.config.companyName = document.getElementById("adm-companyName").value;
    state.config.ceoName = document.getElementById("adm-ceoName").value;
    state.config.brandCountLabel = document.getElementById("adm-brandCount").value;
    state.config.firstStoreDate = document.getElementById("adm-firstStoreDate").value;
    state.config.showKoreaHq = document.getElementById("adm-showKoreaHq").checked;
    state.config.koreaHqName = document.getElementById("adm-koreaHqName").value;
    state.config.koreaHqUrl = document.getElementById("adm-koreaHqUrl").value;
    state.config.showHeaderLangSwitcher = document.getElementById("adm-showLangSwitcher").checked;
    state.config.showRegionalRoadmap = document.getElementById("adm-showRoadmap").checked;
    saveState();
    alert("기본 설정 및 본사 관계 노출 여부가 사이트에 즉시 반영되었습니다.");
  };

  window.saveMetricsAdmin = function () {
    state.metrics.forEach((m, idx) => {
      const l = document.getElementById(`adm-m-label-${idx}`);
      const n = document.getElementById(`adm-m-num-${idx}`);
      const d = document.getElementById(`adm-m-desc-${idx}`);
      if (l) m.labelKo = l.value;
      if (n) m.numberKo = n.value;
      if (d) m.descKo = d.value;
    });
    saveState();
    alert("숫자 지표가 업데이트되었습니다.");
  };

  window.saveSnsContactAdmin = function () {
    state.config.instagramHandle = document.getElementById("adm-igHandle").value;
    state.config.instagramUrl = document.getElementById("adm-igUrl").value;
    state.config.tiktokHandle = document.getElementById("adm-ttHandle").value;
    state.config.tiktokUrl = document.getElementById("adm-ttUrl").value;
    state.config.whatsappNumber = document.getElementById("adm-wa").value;
    state.config.contactEmail = document.getElementById("adm-email").value;
    state.config.deliveryAppMode = document.getElementById("adm-appMode").value;
    state.config.deliveryAppUrl = document.getElementById("adm-appUrl").value;
    if (state.config.deliveryAppUrl && state.config.deliveryAppUrl.trim() !== "") {
      state.config.deliveryAppMode = "active";
    }
    saveState();
    alert("SNS 계정, 연락처(자동 노출/숨김), 배달 앱 버튼 설정이 저장되었습니다.");
  };

  window.saveArticlesAdmin = function () {
    state.articles.forEach((art, idx) => {
      const dt = document.getElementById(`adm-art-date-${idx}`);
      const ti = document.getElementById(`adm-art-title-${idx}`);
      const sm = document.getElementById(`adm-art-sum-${idx}`);
      if (dt) art.date = dt.value;
      if (ti) art.titleKo = ti.value;
      if (sm) art.summaryKo = sm.value;
    });
    saveState();
    alert("소식 카드가 저장되었습니다.");
  };

  window.clearAllArticlesTest = function () {
    state.articles = [];
    saveState();
    renderAdminModal();
    alert("모든 소식 항목을 비웠습니다. 이제 홈 화면 ⑦ 소식(Related Articles) 섹션이 자동으로 숨겨진 것을 확인하실 수 있습니다!");
  };

  window.addNewArticle = function () {
    state.articles.unshift({
      id: "art-" + Date.now(),
      date: "2026.10.30",
      categoryKo: "신규 소식",
      categoryId: "Berita Baru",
      categoryEn: "News",
      titleKo: "새로운 법인 소식 제목을 입력하세요",
      titleId: "Judul Berita Korporat Baru",
      titleEn: "New Corporate Update Title",
      summaryKo: "인사 담당자가 관리 화면에서 추가한 신규 소식 요약문입니다.",
      summaryId: "Ringkasan berita baru yang ditambahkan oleh tim HR.",
      summaryEn: "Summary of the new update added by HR.",
      contentKo: "상세 본문 내용입니다.",
      thumbColor: "linear-gradient(135deg, #0F766E 0%, #115E59 100%)",
      thumbLabel: "NEW ARTICLE"
    });
    saveState();
    renderAdminModal();
  };

  window.deleteArticle = function (id) {
    state.articles = state.articles.filter((a) => a.id !== id);
    saveState();
    renderAdminModal();
  };

  window.saveCareersAdmin = function () {
    const emailEl = document.getElementById("adm-careerEmail");
    const formToggleEl = document.getElementById("adm-enableCareerForm");
    if (emailEl) state.config.careerEmail = emailEl.value;
    if (formToggleEl) state.config.enableCareerForm = formToggleEl.checked;
    state.jobs.forEach((job, idx) => {
      const tEl = document.getElementById(`adm-job-title-${idx}`);
      const dEl = document.getElementById(`adm-job-desc-${idx}`);
      if (tEl) job.titleKo = tEl.value;
      if (dEl) job.descKo = dEl.value;
    });
    saveState();
    alert("채용 공고 및 접수 방식 설정이 저장되었습니다.");
  };

  window.addNewJob = function () {
    const nextNum = state.jobs.length + 1;
    state.jobs.push({
      id: "job-" + Date.now(),
      titleKo: `${nextNum}. 신규 모집 직군명 입력`,
      titleId: `${nextNum}. Posisi Rekrutmen Baru`,
      deptKo: "신규 부서",
      deptId: "Departemen Baru",
      typeKo: "정규직",
      typeId: "Full-time",
      location: "Jakarta, Indonesia",
      descKo: "담당 업무 및 자격 요건을 입력하세요.",
      descId: "Deskripsi pekerjaan dan kualifikasi."
    });
    saveState();
    renderAdminModal();
  };

  window.deleteJob = function (id) {
    state.jobs = state.jobs.filter((j) => j.id !== id);
    saveState();
    renderAdminModal();
  };

  // ==========================================================================
  // 6 & 7. 최종 이미지 목록표 & 기술 제안서 모달 (착수 단계 제출 필수 문서)
  // ==========================================================================
  window.openSpecModal = function () {
    const modal = document.getElementById("spec-modal");
    if (!modal) return;
    modal.classList.add("open");

    const rowsHtml = state.imageSpecSheet
      .map(
        (row) => `
        <tr>
          <td><strong>${row.no}</strong></td>
          <td><strong>${row.name}</strong><br/><span style="font-size:11.5px; color:#71717A;">${row.assetPath}</span></td>
          <td>${row.location}</td>
          <td>${row.purpose}</td>
          <td><span class="job-badge dept">${row.device}</span></td>
          <td><strong>${row.ratio}</strong><br/>${row.pixelSize}</td>
          <td>${row.format}<br/><span style="color:#E84A27; font-weight:700;">${row.maxWeight}</span></td>
        </tr>
      `
      )
      .join("");

    document.getElementById("spec-modal-body").innerHTML = `
      <div style="margin-bottom:28px;">
        <span class="section-tag">제안요청서 6번 항목 · 착수 단계 제출 필수 문서</span>
        <h3 style="font-size:20px; font-weight:800; margin:6px 0;">최종 이미지 목록표 (디렉터님 전달용 규격서)</h3>
        <p style="font-size:13.5px; color:var(--text-secondary); margin-bottom:14px;">
          이미지 도착 전에는 현재 사이트처럼 임시 레이아웃으로 작동하며, 디렉터님께서 원본 이미지를 전달해 주시면 개발자가 모바일 4G 기준으로 용량만 경량화(원본 비율·디자인 무수정)하여 즉시 교체합니다.
        </p>
        <div style="overflow-x:auto;">
          <table class="spec-table">
            <thead>
              <tr>
                <th>No</th>
                <th>이미지 항목 (파일 경로)</th>
                <th>사용 위치</th>
                <th>용도</th>
                <th>모바일 / PC 구분</th>
                <th>비율 및 픽셀 크기</th>
                <th>파일 형식 및 권장 용량</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:18px;">
        <div style="background:#FAF8F5; border:1px solid #E4E4E7; border-radius:12px; padding:18px;">
          <span class="section-tag">제안요청서 7-1 항목</span>
          <h4 style="font-size:17px; font-weight:800; margin:8px 0;">사용 기술과 선택 이유</h4>
          <ul style="padding-left:18px; font-size:13.5px; color:var(--text-secondary); display:flex; flex-direction:column; gap:8px;">
            <li><strong>모바일 퍼스트 경량 웹 아키텍처 + 역할 기반 CMS:</strong> WordPress + 무거운 페이지 빌더(WPBakery)는 인도네시아 현지 4G 모바일 환경에서 초기 로딩이 4~7초 이상 지연되는 단점이 있습니다.</li>
            <li><strong>초고속 로딩 & 비개발자 수정 완벽 양립:</strong> 불필요한 외부 플러그인 없이 즉각 렌더링되는 구조 위에 <strong>비개발자용 직관적 관리 화면(총괄 관리자 / 인사 담당자 권한 분리)</strong>을 내장하여 속도와 유지보수 편의성을 동시에 달성했습니다.</li>
            <li><strong>모듈형 조건부 렌더링:</strong> 한국 본사 노출 ON/OFF, 소식 0개 시 자동 숨김, 연락처 미입력 시 자동 숨김, 배달 앱 상태 전환이 코드 수정 없이 스위치 하나로 작동합니다.</li>
          </ul>
        </div>
        <div style="background:#FAF8F5; border:1px solid #E4E4E7; border-radius:12px; padding:18px;">
          <span class="section-tag">제안요청서 7-2 항목</span>
          <h4 style="font-size:17px; font-weight:800; margin:8px 0;">속도와 모바일 호환성 검수 기준 (SLA)</h4>
          <ul style="padding-left:18px; font-size:13.5px; color:var(--text-secondary); display:flex; flex-direction:column; gap:8px;">
            <li><strong>첫 화면 로딩 속도 (FCP / LCP):</strong> 인도네시아 4G 모바일 회선 기준 첫 화면 표시 <strong>1.2초 이내</strong> (Lighthouse Performance 95점+ 기준)</li>
            <li><strong>이미지 경량화 기준:</strong> 원본 비주얼 훼손 없이 WebP/SVG 포맷 적용, 모바일 첫 화면 총 리소스 <strong>300KB 이하</strong> 유지</li>
            <li><strong>모바일 기기 호환성:</strong> iOS Safari, Android Chrome(갤럭시/샤오미/오포 등 현지 주류 기기 360px~430px 뷰포트) 완벽 대응 및 하단 고정 바 터치 영역(44px 이상) 확보</li>
            <li><strong>메신저 공유 호환성:</strong> WhatsApp, Instagram DM 링크 공유 시 Open Graph 미리보기 이미지(1200×630px) 및 인도네시아어/한국어 설명문 정상 노출 검수</li>
          </ul>
        </div>
      </div>
    `;
  };

  window.closeSpecModal = function () {
    const modal = document.getElementById("spec-modal");
    if (modal) modal.classList.remove("open");
  };

  // ==========================================================================
  // 온라인 채용 지원 폼 모달 (제안요청서 5-5 확장 구조)
  // ==========================================================================
  window.openApplyModal = function (jobTitle) {
    const modal = document.getElementById("apply-modal");
    if (!modal) return;
    modal.classList.add("open");
    const roleInput = document.getElementById("apply-role-input");
    if (roleInput) roleInput.value = jobTitle || "";
  };

  window.closeApplyModal = function () {
    const modal = document.getElementById("apply-modal");
    if (modal) modal.classList.remove("open");
  };

  window.submitCareerForm = function (e) {
    e.preventDefault();
    const role = document.getElementById("apply-role-input").value;
    const name = document.getElementById("apply-name-input").value;
    const contact = document.getElementById("apply-contact-input").value;
    const msg = document.getElementById("apply-msg-input").value;
    const targetEmail = state.config.careerEmail || "barasustainable@gmail.com";

    const subject = `[MUGGO 입사지원] ${role} - ${name}`;
    const body = `지원 직군: ${role}\n성명: ${name}\n연락처/WhatsApp: ${contact}\n\n자기소개 및 지원동기:\n${msg}`;
    window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    closeApplyModal();
  };

  function renderAll() {
    renderChrome();
    renderMain();
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderAll();
  });
})();
