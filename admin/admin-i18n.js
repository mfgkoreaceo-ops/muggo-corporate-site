// ==========================================================================
// MUGGO Admin CMS Bilingual UI Dictionary (KO ↔ ID) & I18N Field Schema
// Zero-Reload Instant Switch (localStorage: muggo-admin-ui-lang)
// ==========================================================================

window.ADMIN_UI_I18N = {
  ko: {
    portalHeaderTitle: "PT BARA SUSTAINABLE INDONESIA — 통합 관리자 시스템 (Admin CMS)",
    portalHeaderShort: "[MUGGO] 관리자 시스템 (Admin Portal)",
    loginTitle: "관리자 로그인 (승인 실무자 전용)",
    loginIdLabel: "관리자 아이디",
    loginIdPlaceholder: "아이디를 입력하세요",
    loginPwLabel: "비밀번호",
    loginPwPlaceholder: "비밀번호를 입력하세요",
    pwShowHide: "👁 표시/숨김",
    capsLockWarning: "⚠️ Caps Lock이 켜져 있습니다. 대소문자를 확인해 주세요.",
    loginBtn: "로그인 →",
    loginErrorMsg: "아이디 또는 비밀번호가 일치하지 않습니다. (5회 실패 시 15분 잠금)",
    lockoutPrefix: "🔒 비밀번호 5회 연속 오입력으로 로그인이 일시 잠겼습니다. 남은 잠금 시간: ",
    loginRuleLine1: "🛡️ 보안 안내: 5회 실패 시 15분간 차단",
    loginRuleLine2: "30분 미사용 시 자동 로그아웃됩니다.",
    loginIsolationNote: "ℹ️ URL만 공유해도 이 브라우저의 로컬 임시초안·계정·암호화 볼트는 다른 사람에게 공유되지 않습니다.",
    backToSiteLink: "← 공식 회사 소개 사이트로 돌아가기",
    securityBannerText: "“본 시스템은 PT BARA SUSTAINABLE INDONESIA (MUGGO) 승인 실무자 전용 페이지입니다. 비인가자의 접근 시도는 자동 차단되며, 로그인 및 문구 수정 이력은 모두 기록됩니다.”",

    sessionTimerPrefix: "보안 세션 남은 시간:",
    sessionExtendBtn: "연장",
    sessionLogoutBtn: "로그아웃",
    previewToggleBtn: "🖥️ 사이트 미리보기 창 (열기/닫기)",
    saveDraftBtn: "💾 임시저장 (이 브라우저 초안)",
    applyLocalBrowserBtn: "🖥️ 이 브라우저에만 반영",
    publishBtn: "🚀 모든 방문자에게 실제 게시",
    publishBtnShort: "🚀 모든 방문자에게 원격 게시",
    applyPreviewBtn: "🔄 미리보기 창에만 적용",
    rollbackTopBtn: "↩️ 롤백 (로컬 초안 복구)",
    openLiveSiteNewTab: "🌐 공개 본 사이트 새 창 열기 ↗",
    livePreviewHeader: "실시간 미리보기 (이 브라우저 전용)",
    refreshPreviewBtn: "새로고침",

    sessionWarnTitle: "⏳ 보안 세션 만료 3분 전 알림",
    sessionWarnDesc: "마우스·키보드 입력이 없어 3분 후 자동 로그아웃됩니다. 작성 중이던 데이터는 로컬 임시 저장소로 자동 보호되었습니다. 계속 작업하시려면 [세션 연장]을 눌러주세요.",
    sessionExtendModalBtn: "세션 30분 연장하기",

    // Left 7 Admin Menus (GNB) & Guide Subtitles (Page 7)
    menu1Title: "📊 대시보드 & 빠른 실행",
    menu1Guide: "현재 설정된 회사 이메일, 노출 중인 채용 공고, 원격 게시 가능 상태 및 최근 수정 내역을 확인합니다.",
    menu1Target: "전체 현황 요약",
    menu2Title: "🏢 회사 기본정보 · 이메일 · 스위치",
    menu2Guide: "대표 이메일, 채용 전용 이메일, WhatsApp 번호 및 기능 노출 스위치를 변경합니다. (Super Admin 전용)",
    menu3Title: "📝 전 페이지 문구 관리 (ID/EN/KO)",
    menu3Guide: "사이트의 모든 페이지 문구를 인도네시아어·영어·한국어로 비교하며 수정합니다.",
    menu4Title: "👥 채용 공고 관리 (11개 직군+)",
    menu4Guide: "모집 직군의 상세 내용 수정, 마감 숨김(ON/OFF), 신규 채용 직군 추가 및 3개 국어 CSV 입출력을 관리합니다.",
    menu5Title: "📰 소식 · 핵심지표 · 법적각주 관리",
    menu5Guide: "홈 화면 공지사항(News), 6대 목표 지표, 하단 법적 고지 각주를 관리합니다.",
    menu6Title: "🍗 브랜드(30) & 메뉴(300) 관리",
    menu6Guide: "30개 브랜드 정보와 300개 메뉴의 이름·설명·스테이션·이미지를 관리합니다.",
    menu7Title: "🛡️ 보안 · 계정 · 변경이력/복구",
    menu7Guide: "관리자 비밀번호 변경, 실무자 계정 관리, 암호화 볼트 상태 및 로컬/원격 복구를 수행합니다.",
    menu7Target: "계정 볼트 & 백업/롤백",

    // Variable Insertion & Validation Alerts (Page 8 & Page 12)
    varBarLabel: "클릭하여 자동 치환 변수 넣기:",
    varLegalName: "+ 법인명 {legalName}",
    varBrandName: "+ 브랜드명 {brandName}",
    varContactEmail: "+ 공식이메일 {contactEmail}",
    varAddress: "+ 등록주소 {address}",
    varBrandCount: "+ 브랜드수 {brandCount}",
    varMenuCount: "+ 메뉴수 {menuCount}",

    errInvalidEmail: "⚠️ 입력하신 이메일 주소 형식이 올바르지 않습니다. (예: contact@muggo.co.id)",
    errInvalidUrl: "⚠️ 허용되지 않는 URL 형식입니다. 안전한 https:// 또는 내부 assets/ 경로만 허용됩니다.",
    warnMissingVar: "⚠️ 문구 내에 있던 {varName} 변수가 삭제되었습니다. 그대로 저장하시겠습니까?",
    msgDraftSaved: "💾 이 브라우저의 임시초안(muggo-cms-draft)으로 저장되었으며 우측 미리보기 창에 반영되었습니다. (실제 방문자에게는 아직 게시되지 않음)",
    msgLocalApplied: "🖥️ 이 브라우저의 로컬 미리보기(muggo-cms-published)에만 반영되었습니다. (다른 방문자에게는 반영되지 않음)",
    msgPublished: "🚀 원격 저장소(GitHub/Vercel) 원자적 커밋 및 검증이 완료되어 모든 방문자에게 실제 게시되었습니다.",
    msgRolledBack: "↩️ 선택한 버전으로 로컬 작업 데이터가 복구되었습니다. (기존 작업본은 보존 스냅샷에 자동 백업됨)"
  },

  id: {
    portalHeaderTitle: "PT BARA SUSTAINABLE INDONESIA — Sistem Admin Terpadu (Admin CMS)",
    portalHeaderShort: "[MUGGO] Portal Admin (Admin CMS)",
    loginTitle: "Login Admin (Khusus Staf Resmi)",
    loginIdLabel: "ID Admin",
    loginIdPlaceholder: "Masukkan ID Admin",
    loginPwLabel: "Kata Sandi",
    loginPwPlaceholder: "Masukkan Kata Sandi",
    pwShowHide: "👁 Tampilkan/Sembunyikan",
    capsLockWarning: "⚠️ Caps Lock sedang aktif. Periksa huruf besar/kecil Anda.",
    loginBtn: "Masuk →",
    loginErrorMsg: "ID atau kata sandi salah. (Terkunci 15 menit setelah 5x gagal)",
    lockoutPrefix: "🔒 Terkunci selama 15 menit karena 5x gagal login. Sisa waktu: ",
    loginRuleLine1: "🛡️ Info Keamanan: Terkunci 15 menit setelah 5x gagal",
    loginRuleLine2: "Otomatis keluar setelah 30 menit tanpa aktivitas.",
    loginIsolationNote: "ℹ️ Membagikan URL tidak membagikan draf lokal, akun, atau vault terenkripsi di browser ini.",
    backToSiteLink: "← Kembali ke Situs Resmi Perusahaan",
    securityBannerText: "“Sistem ini khusus untuk staf resmi PT BARA SUSTAINABLE INDONESIA (MUGGO). Upaya akses tanpa izin akan diblokir otomatis, dan seluruh riwayat login serta perubahan teks dicatat.”",

    sessionTimerPrefix: "Sisa Sesi Keamanan:",
    sessionExtendBtn: "Perpanjang",
    sessionLogoutBtn: "Keluar",
    previewToggleBtn: "🖥️ Panel Pratinjau (Buka/Tutup)",
    saveDraftBtn: "💾 Simpan Draf (Lokal Browser)",
    applyLocalBrowserBtn: "🖥️ Terapkan di Browser Ini Saja",
    publishBtn: "🚀 Publikasikan ke Semua Pengunjung",
    publishBtnShort: "🚀 Publikasi Jarak Jauh",
    applyPreviewBtn: "🔄 Terapkan ke Pratinjau",
    rollbackTopBtn: "↩️ Rollback (Pulihkan Draf Lokal)",
    openLiveSiteNewTab: "🌐 Buka Situs Utama di Tab Baru ↗",
    livePreviewHeader: "Pratinjau Situs (Khusus Browser Ini)",
    refreshPreviewBtn: "Muat Ulang",

    sessionWarnTitle: "⏳ Peringatan Sesi Berakhir dalam 3 Menit",
    sessionWarnDesc: "Sesi akan berakhir otomatis dalam 3 menit karena tidak ada aktivitas. Draf Anda telah disimpan secara lokal. Klik [Perpanjang] untuk melanjutkan pekerjaan.",
    sessionExtendModalBtn: "Perpanjang Sesi 30 Menit",

    // Left 7 Admin Menus (GNB) & Guide Subtitles (Page 7)
    menu1Title: "📊 Dasbor & Aksi Cepat",
    menu1Guide: "Lihat ringkasan email resmi, lowongan aktif, status publikasi jarak jauh, dan riwayat perubahan.",
    menu1Target: "Ringkasan Status",
    menu2Title: "🏢 Info Perusahaan, Email & Sakelar",
    menu2Guide: "Ubah email resmi, email rekrutmen, nomor WhatsApp, dan sakelar fitur situs. (Khusus Super Admin)",
    menu3Title: "📝 Kelola Teks Semua Halaman (ID/EN/KO)",
    menu3Guide: "Edit seluruh teks halaman situs dalam Bahasa Indonesia, Inggris, dan Korea.",
    menu4Title: "👥 Kelola Lowongan Kerja (11+ Posisi)",
    menu4Guide: "Edit deskripsi posisi, tampilkan/sembunyikan lowongan, tambah posisi, dan ekspor/impor CSV 3 bahasa.",
    menu5Title: "📰 Kelola Berita, Metrik & Catatan Hukum",
    menu5Guide: "Kelola pengumuman beranda, 6 kartu metrik target, dan catatan kaki hukum.",
    menu6Title: "🍗 Kelola Brand (30) & Menu (300)",
    menu6Guide: "Kelola 30 brand kuliner beserta nama, deskripsi, stasiun dapur, dan foto 300 menu.",
    menu7Title: "🛡️ Keamanan, Akun & Riwayat Perubahan",
    menu7Guide: "Ubah kata sandi admin, kelola akun staf, buka kunci vault, dan pulihkan versi lokal/jarak jauh.",
    menu7Target: "Vault Akun & Cadangan/Rollback",

    // Variable Insertion & Validation Alerts (Page 8 & Page 12)
    varBarLabel: "Klik untuk menyisipkan variabel otomatis:",
    varLegalName: "+ Nama PT {legalName}",
    varBrandName: "+ Nama Brand {brandName}",
    varContactEmail: "+ Email Resmi {contactEmail}",
    varAddress: "+ Alamat {address}",
    varBrandCount: "+ Jumlah Brand {brandCount}",
    varMenuCount: "+ Jumlah Menu {menuCount}",

    errInvalidEmail: "⚠️ Format alamat email tidak valid. (Contoh: contact@muggo.co.id)",
    errInvalidUrl: "⚠️ Format URL tidak diizinkan. Gunakan https:// atau jalur internal assets/.",
    warnMissingVar: "⚠️ Variabel {varName} telah dihapus dari teks. Apakah Anda yakin ingin menyimpan?",
    msgDraftSaved: "💾 Draf lokal berhasil disimpan di browser ini dan diterapkan ke pratinjau. (Belum dipublikasikan ke pengunjung umum)",
    msgLocalApplied: "🖥️ Perubahan hanya diterapkan pada browser ini (muggo-cms-published). Pengunjung lain belum melihat perubahan ini.",
    msgPublished: "🚀 Komit atomik & verifikasi jarak jauh berhasil. Perubahan kini aktif untuk seluruh pengunjung.",
    msgRolledBack: "↩️ Data lokal berhasil dipulihkan ke versi terpilih (draf sebelumnya telah dicadangkan otomatis)."
  }
};

// ==========================================================================
// Menu 3: 8 Page Tabs Schema Mapping 100% of data/i18n.js (Pages 12–14)
// ==========================================================================
window.ADMIN_I18N_TABS_SCHEMA = [
  {
    id: "tab1",
    labelKo: "탭 1. 공통 영역 (헤더/푸터/모바일바/입사지원 모달)",
    labelId: "Tab 1. Area Umum (Header/Footer/Bilah Seluler/Modal Lamaran)",
    prefixes: ["skipToContent", "themeLabel", "nav", "sticky", "footer", "applyModal"]
  },
  {
    id: "tab2",
    labelKo: "탭 2. 홈 화면 (Beranda)",
    labelId: "Tab 2. Beranda (Hero, Identitas, 4 Pilar, Korea HQ, CEO, Target, Budaya)",
    prefixes: ["hero", "identityCard", "pillars", "koreaHq", "ceo", "impact", "culture", "articles", "footnotes"]
  },
  {
    id: "tab3",
    labelKo: "탭 3. 브랜드 페이지 (Brand)",
    labelId: "Tab 3. Halaman Brand (Portofolio & Pencarian Brand)",
    prefixes: ["brandsPage"]
  },
  {
    id: "tab4",
    labelKo: "탭 4. 푸드·R&D 페이지 (Food & R&D)",
    labelId: "Tab 4. Halaman Food & R&D (5 Genre Masakan & Prinsip Bahan)",
    prefixes: ["foodRndPage"]
  },
  {
    id: "tab5",
    labelKo: "탭 5. 플랫폼 페이지 (Platform)",
    labelId: "Tab 5. Halaman Platform (Foodcourt Online & Aplikasi)",
    prefixes: ["platformPage"]
  },
  {
    id: "tab6",
    labelKo: "탭 6. 사람·문화 페이지 (Manusia)",
    labelId: "Tab 6. Halaman Manusia & Budaya (3 Nilai Utama)",
    prefixes: ["peoplePage"]
  },
  {
    id: "tab7",
    labelKo: "탭 7. 채용 페이지 (Karir)",
    labelId: "Tab 7. Halaman Karir (Info Lamaran & 5 Manfaat Kerja)",
    prefixes: ["careersPage"]
  },
  {
    id: "tab8",
    labelKo: "탭 8. 문의 및 법적 약관 (Kontak & Policy)",
    labelId: "Tab 8. Halaman Kontak & Kebijakan Hukum (Privasi & Ketentuan)",
    prefixes: ["contactPage", "policyPage"]
  }
];
