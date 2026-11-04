// ==========================================================================
// SINGLE-SOURCE CONFIGURATION (site.config.js)
// All site-wide identity, contact, social, sheet URLs, counts, and feature
// flags live in this single file. Nothing below is hard-coded elsewhere.
// ==========================================================================

const SITE_CONFIG = {
  legalName: "PT BARA SUSTAINABLE INDONESIA",
  brandName: "MUGGO",
  address: "Jl. Gatot Subroto No. Kav. 71-73, Menteng Dalam, Kec. Tebet, Jakarta Selatan 12870",
  contactEmail: "barasustainable@gmail.com",
  recruitmentEmail: "",          // TODO(owner): Task 4.4 — optional separate recruitment email; when empty, reuses contactEmail and shows it once
  whatsappNumber: "",            // TODO(owner): unknown; empty => hide every WhatsApp element
  applyFormEndpoint: "",         // TODO(owner): Task 4.2 — web form endpoint (not implemented yet); empty => hide web form channel
  applyPrivacyNotice: "",        // TODO(owner): Task 4.3 — single text key for application draft privacy notice (ID); empty => hidden
  newsSheetCsvUrl: "",           // TODO(owner): filled in later (pending director decision); empty => use fallback news content
  jobsSheetCsvUrl: "",           // TODO(owner): filled in later (pending director decision); empty => use fallback job content
  instagramUrl: "https://www.instagram.com/muggo.indonesia",
  tiktokUrl: "https://www.tiktok.com/@muggo1",
  brandCount: 30,                // owner will confirm 30 or 32; changing this number updates every mention
  showKoreaHqBlock: true,        // owner decides later; one flag shows/hides the home "Kantor Pusat Korea (MUGGO Korea HQ)" block and any footer HQ link
  languageSwitchVisible: false,  // hide ID/EN/KO switcher at launch; keep the i18n structure

  // Additional optional placeholders & feature flags (hidden when empty/false per Section 1 & Section 3.6–3.8)
  defaultLanguage: "id",
  ceoName: "",                   // TODO(owner): unknown; empty => keep "Direktur Utama" without a name
  ceoPortraitUrl: "",            // TODO(owner): 1:1 (600x600) portrait image URL; empty => hide slot
  showEmployeeDiscountBenefit: false, // TODO(owner): Task 3.6 — false hides "Diskon Brand" employee-discount text until confirmed
  showCareerPathBenefit: false,       // TODO(owner): Task 3.6 — false hides "Part Leader hingga Branch Manager" career-path text until confirmed
  showKoreaHqWorkOpportunity: true,   // Additional user request: shows "05 · Kesempatan Bekerja di Kantor Pusat Korea" benefit card on Careers page
  koreaHqUrl: "",                // TODO(owner): unknown; empty => hide external link if empty
  deliveryAppUrl: "",            // TODO(owner): unknown; empty => hide active download link
  deliveryAppMode: "coming_soon",
  showRegionalRoadmap: true
};

if (typeof window !== "undefined") {
  window.SITE_CONFIG = SITE_CONFIG;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_CONFIG;
}
