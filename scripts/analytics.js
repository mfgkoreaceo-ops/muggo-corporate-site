/* GA4 standard: basic consent mode. No Google requests before opt-in. */
(function () {
  "use strict";
  const id = (window.SITE_CONFIG || {}).ga4MeasurementId || "";
  const params = new URLSearchParams(location.search);
  const enabled = /^G-[A-Z0-9]+$/.test(id) &&
    ["muggo.co.id", "www.muggo.co.id"].includes(location.hostname) &&
    !params.has("cms_preview") && !params.has("test_user") &&
    !params.has("analytics_off") && !location.pathname.startsWith("/admin");
  const key = "muggo-analytics-consent-v1";
  const routes = ["home", "careers", "people", "food-rnd", "platform", "brands", "contact", "privacy", "terms", "article-detail"];
  let choice = "", loaded = false, lastPage = "", page = { route: "home", language: "id" };
  try { choice = localStorage.getItem(key) || ""; } catch (_) {}
  const copy = {
    id: { title: "Analitik opsional", body: "Izinkan cookie Google Analytics untuk membantu kami memahami kunjungan, bahasa pilihan, dan klik tombol pesan. Nama, kontak, dan isi lamaran tidak dikirim. Anda dapat menolak dan tetap menggunakan situs.", yes: "Izinkan analitik", no: "Tolak", settings: "Pengaturan analitik", privacy: "Kebijakan Privasi", details: "Dengan izin Anda, kami menggunakan Google Analytics untuk mengukur halaman, sumber kunjungan, perangkat, bahasa, dan klik menuju situs pemesanan. Google memproses data kunjungan dan pengenal cookie. Kami tidak mengirim nama, kontak, atau isi formulir. Anda dapat mengubah pilihan melalui Pengaturan analitik. Penolakan tidak membatasi layanan.", google: "Cara Google menggunakan data" },
    en: { title: "Optional analytics", body: "Allow Google Analytics cookies to help us understand visits, language choices, and order-button clicks. Names, contact details, and application content are not sent. You can decline and still use the site.", yes: "Allow analytics", no: "Decline", settings: "Analytics settings", privacy: "Privacy Policy", details: "With your permission, we use Google Analytics to measure pages, traffic sources, devices, language, and clicks to the ordering site. Google processes visit data and cookie identifiers. We do not send names, contact details, or form content. Change your choice at any time through Analytics settings. Declining does not limit the service.", google: "How Google uses data" },
    ko: { title: "선택적 방문 분석", body: "Google Analytics 쿠키를 허용하면 방문, 선택 언어, 주문 버튼 클릭을 분석합니다. 이름·연락처·지원서 내용은 전송하지 않습니다. 거절해도 사이트를 이용할 수 있습니다.", yes: "분석 허용", no: "거절", settings: "방문 분석 설정", privacy: "개인정보처리방침", details: "동의하신 경우 Google Analytics로 방문 페이지, 유입 경로, 기기, 언어 및 주문 사이트 이동 클릭을 분석합니다. Google은 방문 데이터와 쿠키 식별자를 처리합니다. 이름·연락처·폼 내용은 전송하지 않습니다. 방문 분석 설정에서 언제든 선택을 변경할 수 있으며, 거절해도 서비스 이용에는 영향이 없습니다.", google: "Google의 데이터 이용 안내" }
  };
  function text() { return copy[page.language] || copy.id; }
  function gtag() { window.dataLayer.push(arguments); }
  function safeReferrer() {
    try { return new URL(document.referrer).origin + "/"; } catch (_) { return ""; }
  }
  function pageUrl() {
    // Never forward arbitrary queries, article IDs, search terms or form values.
    return "https://muggo.co.id/#" + page.route;
  }
  function campaign() {
    const fields = {};
    // Only campaign slugs, never free-text search terms, click IDs or arbitrary URLs.
    ["source", "medium", "campaign", "content"].forEach(function (name) {
      const value = params.get("utm_" + name) || "";
      if (/^[a-zA-Z][a-zA-Z0-9_-]{0,79}$/.test(value)) fields[name === "campaign" ? "campaign_name" : "campaign_" + name] = value;
    });
    return fields;
  }
  function start() {
    if (!enabled || loaded || choice !== "granted") return;
    loaded = true;
    window["ga-disable-" + id] = false;
    window.dataLayer = window.dataLayer || [];
    gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    gtag("consent", "update", { analytics_storage: "granted" });
    gtag("js", new Date());
    gtag("config", id, Object.assign({ send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_domain: "muggo.co.id", cookie_path: "/", page_location: pageUrl(), page_referrer: safeReferrer() }, campaign()));
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(script);
  }
  function send(name, fields) {
    if (!enabled || choice !== "granted") return;
    start();
    gtag("event", name, Object.assign({ send_to: id, page_location: pageUrl(), page_title: "MUGGO | " + page.route, page_referrer: lastPage || safeReferrer(), site_language: page.language }, fields));
  }
  function view() {
    if (choice !== "granted" || !enabled || lastPage === pageUrl()) return;
    send("page_view", {});
    lastPage = pageUrl();
  }
  function clearCookies() {
    document.cookie.split(";").forEach(function (entry) {
      const name = entry.split("=")[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      ["", "; Domain=muggo.co.id", "; Domain=.muggo.co.id", "; Domain=" + location.hostname].forEach(function (domain) {
        document.cookie = name + "=; Max-Age=0; Path=/" + domain + "; SameSite=Lax";
      });
    });
  }
  function choose(value) {
    choice = value;
    try { localStorage.setItem(key, value); } catch (_) {}
    if (value === "granted") {
      window["ga-disable-" + id] = false;
      if (loaded) gtag("consent", "update", { analytics_storage: "granted" });
      view();
    } else {
      window["ga-disable-" + id] = true;
      if (loaded) gtag("consent", "update", { analytics_storage: "denied" });
      lastPage = "";
      clearCookies();
    }
    document.getElementById("analytics-consent").hidden = true;
  }
  function render(show) {
    if (!enabled) return;
    const c = text();
    let box = document.getElementById("analytics-consent");
    if (!box) {
      box = document.createElement("section");
      box.id = "analytics-consent";
      box.className = "analytics-consent";
      box.setAttribute("aria-labelledby", "analytics-consent-title");
      document.body.appendChild(box);
    }
    const wasVisible = !box.hidden;
    box.innerHTML = '<h2 id="analytics-consent-title">' + c.title + '</h2><p>' + c.body + '</p><div class="analytics-consent-actions"><button type="button" data-consent="granted">' + c.yes + '</button><button type="button" data-consent="denied">' + c.no + '</button><a href="#privacy">' + c.privacy + '</a></div>';
    box.querySelectorAll("[data-consent]").forEach(function (button) {
      button.addEventListener("click", function () { choose(button.dataset.consent); });
    });
    box.hidden = !(show || (!choice) || (wasVisible && box.dataset.ready));
    box.dataset.ready = "1";
    const footer = document.querySelector("footer");
    if (footer && !document.getElementById("analytics-settings")) {
      const button = document.createElement("button");
      button.id = "analytics-settings";
      button.className = "btn btn-secondary";
      button.type = "button";
      button.textContent = c.settings;
      button.addEventListener("click", function () { render(true); box.querySelector("button").focus(); });
      footer.appendChild(button);
    }
    const settings = document.getElementById("analytics-settings");
    if (settings) settings.textContent = c.settings;
    if (page.route === "privacy") {
      const target = document.querySelector("main");
      if (target && !document.getElementById("analytics-disclosure")) {
        const section = document.createElement("section");
        section.id = "analytics-disclosure";
        section.className = "card";
        section.innerHTML = '<h2>' + c.title + '</h2><p>' + c.details + '</p><a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">' + c.google + '</a>';
        target.appendChild(section);
      }
    }
  }
  window.MuggoAnalytics = {
    page: function (route, language) {
      page = { route: routes.includes(route) ? route : "home", language: ["id", "en", "ko"].includes(language) ? language : "id" };
      render(false);
      view();
    },
    language: function (language) {
      if (["id", "en", "ko"].includes(language)) send("language_select", { selected_language: language });
    }
  };
  // Capture phase: existing order links stop bubbling. Never delay navigation.
  document.addEventListener("click", function (event) {
    const anchor = event.target.closest && event.target.closest("a[href]");
    if (!anchor) return;
    let url;
    try { url = new URL(anchor.href, location.href); } catch (_) { return; }
    if (url.protocol === "https:" && url.hostname === "order.muggo.co.id") {
      send("order_click", { link_url: "https://order.muggo.co.id/", link_area: anchor.closest("header") ? "header" : anchor.closest("footer") ? "footer" : "content" });
    }
  }, true);
})();
