// Trilingual Dictionary (Default Launch Language: ID; KO & EN preserved in i18n structure)
// All legalName, brandName, address, contactEmail, and brandCount values are interpolated from site.config.js.

window.I18N_DICT = {
  id: {
    skipToContent: "Langsung ke konten utama",
    themeLabel: ["Mode gelap", "Mode terang"],
    nav: {
      home: "Beranda",
      brands: "Brand",
      foodRnd: "Food & R&D",
      platform: "Platform",
      people: "Manusia",
      careers: "Karir",
      contact: "Kontak",
      mainNavLabel: "Navigasi Utama",
      mobileNavLabel: "Navigasi Seluler",
      menuBtnLabel: "Menu"
    },
    hero: {
      eyebrow: "{legalName} · MEREK: {brandName} (PRA-PEMBUKAAN)",
      headlineA: "Identitas Resmi & Rekrutmen {legalName} (Brand: {brandName})",
      headlineB: "{legalName} · Membangun Mall Food Court Online {brandName} di Jakarta",
      subcopyA: "{legalName} sedang mempersiapkan peluncuran {brandName} ({brandCount} brand kuliner) di Jakarta Selatan. Belum ada produk yang dijual saat ini; kami sedang membuka rekrutmen resmi 11 bidang posisi.",
      subcopyB: "{legalName} mempersiapkan peluncuran {brandName} ({brandCount} brand kuliner) di Jakarta Selatan. Saat ini tahap pra-pembukaan (belum berjualan) dan membuka rekrutmen 11 bidang posisi.",
      careerBtn: "Lamar Karir (11 Bidang)",
      brandBtn: "Lihat {brandCount} Brand",
      appComingSoon: "Aplikasi Delivery (Segera Hadir)",
      appDownload: "Buka Aplikasi {brandName}"
    },
    identityCard: {
      eyebrow: "FAKTA & IDENTITAS PERUSAHAAN",
      badge: "Pra-Pembukaan · Terverifikasi",
      title: "Fakta Perusahaan & Saluran Verifikasi Resmi",
      intro: "Informasi resmi untuk verifikasi identitas {legalName} (Brand: {brandName}).",
      legalLabel: "Badan Hukum Resmi",
      brandLabel: "Merek Usaha",
      leaderLabel: "Pimpinan",
      leaderRole: "Direktur Utama",
      openPositionsLabel: "Posisi Terbuka",
      openPositionsValue: "11 Bidang Posisi (Rekrutmen Resmi)",
      statusLabel: "Rencana Pembukaan",
      statusValue: "Tahap Pra-Pembukaan — Jakarta Selatan (Belum Berjualan)",
      purposeLabel: "Alamat Terdaftar",
      purposeValue: "{address}",
      channelsLabel: "Saluran Resmi",
      antiFraudTitle: "Pernyataan Rekrutmen Resmi",
      antiFraudDesc: "Kami tidak memungut biaya apa pun dalam proses rekrutmen.",
      contactLinkBtn: "Lihat Kontak & Alamat Terdaftar →"
    },
    pillars: {
      eyebrow: "PILAR UTAMA KAMI",
      title: "Empat Pilar Utama {brandName}",
      intro: "Fondasi operasional {legalName} untuk mempersiapkan {brandName}:",
      items: [
        {
          id: "people",
          route: "people",
          icon: "users",
          title: "Manusia",
          desc: "Membangun tim yang berkarakter baik, tekun, dan saling menghormati di Jakarta Selatan.",
          action: "Lihat Budaya Kerja →"
        },
        {
          id: "food-rnd",
          route: "food-rnd",
          icon: "utensils",
          title: "Food & R&D",
          desc: "Resep terstandarisasi Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) lintas 5 genre masakan.",
          action: "Lihat R&D Kuliner →"
        },
        {
          id: "platform",
          route: "platform",
          icon: "smartphone",
          title: "Platform",
          desc: "Pesanan dari banyak brand dimasak bersamaan dan dikirim dalam satu pengiriman.",
          action: "Pelajari Platform →"
        },
        {
          id: "brands",
          route: "brands",
          icon: "store",
          title: "Brand ({brandName})",
          desc: "Portofolio {brandCount} brand internal di 5 kategori kuliner (Pra-Pembukaan).",
          action: "Lihat {brandCount} Brand →"
        }
      ]
    },
    koreaHq: {
      eyebrow: "KEAHLIAN F&B GLOBAL",
      title: "Kantor Pusat Korea ({brandName} Korea HQ)",
      desc: "{legalName} mengadaptasi sistem operasional dapur dari Kantor Pusat Korea ({brandName} Korea HQ) untuk pasar Indonesia:",
      points: [
        "01 · Perencanaan Multi-Brand ({brandCount} Brand)",
        "02 · Standarisasi Prosedur Operasional Dapur Terpusat",
        "03 · Pengembangan Resep 5 Genre Masakan"
      ],
      linkText: "Kantor Pusat Korea ({brandName} Korea HQ)"
    },
    ceo: {
      eyebrow: "SAMBUTAN DIREKTUR UTAMA",
      titlePrefix: "Sambutan Direktur Utama",
      p1Title: "Identitas Jelas & Persiapan Pra-Pembukaan {brandName}",
      p1: "“Melalui {legalName}, kami mempersiapkan peluncuran {brandName} di Jakarta Selatan. Belum ada produk yang dijual saat ini; prioritas kami adalah kejelasan identitas perusahaan bagi pelamar kerja dan mitra verifikasi.”",
      p2Title: "Organisasi Berpusat pada Manusia & Rekrutmen Resmi",
      p2: "“Layanan terbaik berawal dari tim yang baik. Kami mencari rekan kerja yang tekun dan saling menghormati melalui rekrutmen resmi bebas biaya.”",
      signRole: "Direktur Utama"
    },
    impact: {
      eyebrow: "TARGET & PETA JALAN",
      title: "Target & Peta Jalan Pra-Pembukaan",
      notice: "{legalName} berada pada tahap pra-pembukaan (belum berjualan). Seluruh angka di bawah ini adalah target rencana.",
      roadmapTitle: "Tahapan Rencana Persiapan",
      roadmapSteps: [
        "Tahap 1 · Rekrutmen Tim & Persiapan Dapur Terpusat Jakarta Selatan (Target Pra-Pembukaan)",
        "Tahap 2 · Peluncuran Perdana Gerai & Platform {brandName} di Jakarta Selatan (Target)",
        "Tahap 3 · Pengembangan Jaringan Cabang Berikutnya (Target Jangka Panjang)"
      ]
    },
    culture: {
      eyebrow: "BUDAYA KERJA KAMI",
      title: "Budaya Kerja & Kriteria Talenta",
      quote: "“Karakter yang baik, ketekunan, dan semangat yang tulus terhadap pekerjaan. Kami menantikan rekan kerja yang menjalankan tanggung jawabnya dengan sungguh-sungguh dan saling menghormati.”",
      desc: "Ketulusan sikap, tanggung jawab, dan rasa hormat antar rekan kerja adalah nilai utama {legalName}.",
      peopleBtn: "Tentang Budaya & Tim",
      careerBtn: "Lihat 11 Bidang Rekrutmen"
    },
    articles: {
      eyebrow: "ARTIKEL & PENGUMUMAN TERKAIT",
      title: "Informasi & Pengumuman Pra-Pembukaan",
      upcomingLabel: "Akan Datang",
      readMore: "Baca Selengkapnya →",
      backBtn: "← Kembali ke Daftar"
    },
    footnotes: {
      summary: "Catatan Hukum, Status Pra-Pembukaan & Verifikasi Rekrutmen"
    },
    brandsPage: {
      eyebrow: "PORTOFOLIO BRAND {brandName} · PRA-PEMBUKAAN (BELUM DIJUAL)",
      title: "Portofolio {brandCount} Brand & {menuCount} Menu {brandName}",
      intro: "Rencana {brandCount} brand kuliner ({menuCount} menu) oleh {legalName} (pra-pembukaan, belum dijual). Kebijakan bahan: Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard).",
      allTab: "Semua ({brandCount} Brand)",
      catNames: {
        Chicken: "Ayam (3)",
        Korean: "Masakan Korea (13)",
        Western: "Pizza · Burger · Sandwich (6)",
        Salad: "Salad & Poke (1)",
        Dessert: "Minuman & Dessert (7)"
      },
      catBadgeNames: {
        Chicken: "Ayam",
        Korean: "Masakan Korea",
        Western: "Barat & Deli",
        Salad: "Salad & Poke",
        Dessert: "Minuman & Dessert"
      },
      searchPlaceholder: "Cari nama brand atau menu (contoh: SOTDAK, Bibimbap, Burger, Bingsu)...",
      preOpeningTag: "Pra-Pembukaan",
      viewAllMenus: "Lihat semua 10 menu",
      hideMenus: "Tutup daftar menu",
      showAllBrandsBtn: "Tampilkan semua brand",
      showLessBrandsBtn: "Tampilkan brand pilihan saja",
      emptySearchTitle: "Tidak ada brand atau menu yang cocok",
      emptySearchDesc: "Tidak ditemukan hasil untuk kata kunci Anda. Coba kata kunci lain atau tampilkan kembali seluruh {brandCount} brand.",
      resetSearchBtn: "Reset Pencarian"
    },
    foodRndPage: {
      eyebrow: "RISET KULINER · 5 GENRE MASAKAN",
      title: "Pengembangan Menu 5 Genre Masakan",
      intro: "Standarisasi resep lintas 5 genre masakan yang disiapkan oleh {legalName} untuk dapur terpusat {brandName}.",
      ingredientCallout: "Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) — Seluruh menu dikembangkan tanpa daging babi dan tanpa minyak babi menggunakan daging ayam, sapi, makanan laut, dan bahan pilihan.",
      genresTitle: "5 Genre Masakan Utama",
      genres: [
        {
          title: "1. Masakan Korea",
          desc: "Ayam panggang nurungji (SOTDAK), ayam bakar arang (SEONGSU DAK), rice bowl, bibimbap, jjigae, sup kaldu sapi, gimbap, dan mandu.",
          img: "assets/slots/genre-1-korean.jpg",
          alt: "Ilustrasi pengembangan menu masakan Korea di dapur R&D MUGGO"
        },
        {
          title: "2. Masakan Tiongkok & Mala Fusion",
          desc: "Perpaduan rempah Mala Sichuan dengan hidangan tumis sapi, ayam, dan makanan laut (MIGAK).",
          img: "assets/slots/genre-2-chinese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Tiongkok dan Mala Fusion"
        },
        {
          title: "3. Masakan Jepang & Bakery Artisan",
          desc: "Shio Pan roti garam mentega Prancis (SALT ROOM), gorengan renyah, dan saus bergaya Jepang.",
          img: "assets/slots/genre-3-japanese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Jepang dan bakery Shio Pan"
        },
        {
          title: "4. Cita Rasa Lokal Indonesia",
          desc: "Minuman kopi & buah tropis (NASI BOSS), tingkat kepedasan sambal lokal, dan bahan segar Nusantara.",
          img: "assets/slots/genre-4-indonesian.jpg",
          alt: "Ilustrasi pengembangan menu dan minuman cita rasa lokal Indonesia"
        },
        {
          title: "5. Masakan Barat & Deli Eropa",
          desc: "Sandwich Eropa (PANTRY 12), burger sapi asap (SMOKY SALOON & BURNOUT), pizza (WOOD&BRICK), kebab (KEBAVA), dan salad.",
          img: "assets/slots/genre-5-western.jpg",
          alt: "Ilustrasi pengembangan menu burger, pizza, dan sandwich Barat"
        }
      ]
    },
    platformPage: {
      eyebrow: "PLATFORM · FOOD COURT ONLINE & APLIKASI (PRA-PEMBUKAAN)",
      title: "Mall Food Court Online & Platform Delivery {brandName}",
      intro: "Pesanan dari banyak brand dimasak bersamaan dan dikirim dalam satu pengiriman.",
      features: [
        {
          title: "01 · 1 Keranjang · {brandCount} Brand · 1x Pengiriman",
          desc: "Pesanan dari banyak brand dimasak bersamaan dan dikirim dalam satu pengiriman."
        },
        {
          title: "02 · Penyelarasan Waktu Masak & Kemasan Terpisah",
          desc: "Makanan hangat dan minuman dingin disiapkan bersamaan lalu dikemas terpisah agar suhu tetap terjaga."
        },
        {
          title: "03 · Status: Tahap Pra-Pembukaan",
          desc: "Belum ada produk yang dijual saat ini. Aplikasi pemesanan sedang disiapkan."
        }
      ],
      appBoxTitle: "Aplikasi Pemesanan {brandName} (Pra-Pembukaan)",
      appBoxDesc: "Belum ada makanan atau minuman yang dijual saat ini. Jadwal peluncuran resmi akan diumumkan di situs ini."
    },
    peoplePage: {
      eyebrow: "MANUSIA & BUDAYA KERJA",
      title: "Tim yang Menghargai Ketekunan dan Semangat Kerja",
      intro: "“Karakter yang baik, ketekunan, dan semangat yang tulus terhadap pekerjaan. Kami menantikan rekan kerja yang menjalankan tanggung jawabnya dengan sungguh-sungguh dan saling menghormati.”",
      values: [
        { title: "01 · Karakter Baik & Saling Menghormati", desc: "Menghargai rekan kerja lintas posisi dan berkomunikasi secara jujur." },
        { title: "02 · Ketekunan dalam Tanggung Jawab", desc: "Menjaga standar kebersihan dapur, ketepatan resep, dan kerapian pengemasan setiap hari." },
        { title: "03 · Semangat Tulus untuk Bertumbuh", desc: "Mempelajari operasional kuliner modern dan berkembang bersama {legalName}." }
      ]
    },
    careersPage: {
      eyebrow: "KARIR RESMI · {legalName}",
      title: "Rekrutmen Resmi {legalName} — Brand {brandName} (11 Bidang)",
      intro: "Bergabunglah bersama tim pendiri {legalName} di Jakarta Selatan untuk persiapan peluncuran {brandName}. Rekrutmen resmi dan bebas biaya.",
      applyBoxTitle: "Cara Melamar Kerja",
      applyBoxDesc: "Pilih posisi di bawah lalu tekan tombol Lamar untuk membuka draf lamaran resmi (posisi dan subjek email Lamaran: <posisi> terisi otomatis).",
      applyJobBtn: "Lamar",
      emailBtn: "Kirim Email",
      formBtn: "Lamar",
      copyEmailBtn: "Salin Alamat Email",
      copiedNotice: "Tersalin!",
      benefitsTitle: "Kesejahteraan & Kepatuhan Ketenagakerjaan",
      benefits: [
        {
          title: "01 · Kontrak Kerja Resmi (PKWT / PKWTT)",
          desc: "Hubungan kerja mengikuti hukum ketenagakerjaan Indonesia melalui kontrak kerja resmi (PKWT/PKWTT) bersama {legalName}."
        },
        {
          title: "02 · BPJS & THR Sesuai Regulasi",
          desc: "Pendaftaran BPJS Kesehatan & Ketenagakerjaan serta Tunjangan Hari Raya (THR) sesuai peraturan yang berlaku."
        },
        {
          flag: "showEmployeeDiscountBenefit",
          title: "03 · Penyediaan Makan Karyawan",
          titleExtended: "03 · Makan Karyawan & Diskon Brand",
          desc: "Penyediaan makan selama jam kerja operasional.",
          descExtended: "Penyediaan makan selama jam kerja operasional serta manfaat Diskon Brand internal."
        },
        {
          flag: "showCareerPathBenefit",
          title: "04 · Pelatihan Operasional Dapur & Higienitas",
          titleExtended: "04 · Pelatihan Operasional & Jenjang Karir",
          desc: "Pelatihan prosedur operasional dapur profesional dan kebersihan pangan.",
          descExtended: "Pelatihan operasional kuliner dan jenjang karir menuju Part Leader hingga Branch Manager."
        },
        {
          title: "05 · Kesempatan Bekerja di Kantor Pusat Korea",
          desc: "Diberikan kesempatan untuk bekerja di Kantor Pusat Korea ({brandName} Korea HQ)."
        }
      ],
      positionsTitle: "Daftar 11 Bidang Posisi yang Dibuka"
    },
    applyModal: {
      title: "Buat Draf Lamaran Resmi",
      guidePrefix: "Formulir ini menyusun draf lamaran resmi ke {legalName}. Lampirkan CV/Resume Anda saat mengirim ke:",
      roleLabel: "Posisi yang Dilamar",
      nameLabel: "Nama Lengkap",
      contactLabel: "Nomor Telepon / Email Aktif",
      msgLabel: "Ringkasan Pengalaman & Motivasi Singkat",
      privacyNotice: "", // TODO(owner): Task 4.3 — single text key for Indonesian privacy notice in application draft; hidden when empty
      cancelBtn: "Batal",
      submitBtn: "Buka Aplikasi Email ↗",
      whatsappBtn: "Lamar via WhatsApp ↗",
      webformBtn: "Kirim Formulir Web ↗",
      copyDraftBtn: "Salin Teks & Alamat Email",
      copySuccess: "Teks lamaran dan alamat email resmi telah disalin ke papan klip."
    },
    contactPage: {
      eyebrow: "KONTAK & LOKASI TERDAFTAR",
      title: "Identitas Perusahaan, Alamat Terdaftar & Kontak Resmi",
      intro: "Saluran komunikasi resmi {legalName} (Brand: {brandName}) untuk verifikasi perusahaan dan pelamar kerja.",
      entityLabel: "Badan Hukum Resmi",
      brandLabel: "Merek Usaha",
      statusLabel: "Status Bisnis",
      statusText: "Tahap Pra-Pembukaan — Belum ada produk yang dijual saat ini",
      addressLabel: "Alamat Terdaftar",
      phonePendingNotice: "Nomor telepon pelanggan / WhatsApp resmi akan diumumkan saat pembukaan gerai pertama.",
      openMapsBtn: "Buka di Google Maps ↗",
      emailUnifiedLabel: "Email Resmi (Umum, Kemitraan & Rekrutmen)",
      emailGeneralLabel: "Email Umum & Kemitraan",
      emailRecruitmentLabel: "Email Rekrutmen Resmi",
      emailLabel: "Email Kontak Resmi Sementara",
      emailNote: "Catatan: Alamat email ini digunakan sementara selama tahap pra-pembukaan. Mailbox domain perusahaan menyusul.",
      socialLabel: "Media Sosial Resmi {brandName}"
    },
    footer: {
      desc: "Situs perkenalan korporat resmi {legalName} (Brand: {brandName} · Tahap Pra-Pembukaan).",
      navHeading: "NAVIGASI",
      socialHeading: "MEDIA SOSIAL & SALURAN RESMI",
      registeredLabel: "Alamat Terdaftar:",
      emailLabel: "Email Kontak:",
      copyright: "© 2026 {legalName} (Brand: {brandName}). Seluruh hak cipta dilindungi.",
      privacy: "Kebijakan Privasi",
      terms: "Syarat & Ketentuan"
    },
    policyPage: {
      privacyTitle: "Kebijakan Privasi",
      privacyP1: "{legalName} (pemilik merek usaha {brandName}) menghormati privasi pelamar kerja dan pengunjung situs sesuai Undang-Undang Pelindungan Data Pribadi (UU PDP) Indonesia.",
      privacyP2: "Data lamaran yang dikirimkan ke saluran email resmi kami ({contactEmail}) hanya digunakan untuk seleksi SDM internal dan tidak pernah diperjualbelikan kepada pihak ketiga.",
      termsTitle: "Syarat & Ketentuan",
      termsP1: "Situs web ini dikelola secara resmi oleh {legalName} (Alamat terdaftar: {address}) untuk menyajikan identitas perusahaan, rencana brand {brandName}, dan verifikasi rekrutmen resmi.",
      termsP2: "Saat ini perusahaan berada pada tahap pra-pembukaan dan belum melakukan penjualan produk."
    },
    sticky: {
      instagram: "Instagram",
      tiktok: "TikTok",
      careers: "Lamar Karir",
      whatsapp: "WhatsApp"
    }
  },

  en: {
    skipToContent: "Skip to main content",
    themeLabel: ["Dark mode", "Light mode"],
    nav: {
      home: "Home",
      brands: "Brands",
      foodRnd: "Food & R&D",
      platform: "Platform",
      people: "People",
      careers: "Careers",
      contact: "Contact"
    },
    hero: {
      eyebrow: "{legalName} · BRAND: {brandName} (PRE-OPENING)",
      headlineA: "Official Corporate Identity & Recruitment of {legalName} (Brand: {brandName})",
      headlineB: "{legalName} · Building the {brandName} Online Food Court in Jakarta",
      subcopyA: "{legalName} is in the pre-opening stage for {brandName} ({brandCount} culinary brands) in South Jakarta. Nothing is on sale yet; we are recruiting across 11 job positions.",
      subcopyB: "{legalName} is preparing the pre-opening launch of {brandName} ({brandCount} culinary brands) in South Jakarta. Nothing is on sale yet as we recruit across 11 job positions.",
      careerBtn: "Apply for Careers (11 Roles)",
      brandBtn: "View {brandCount} Brands",
      appComingSoon: "Aplikasi Delivery (Segera Hadir)",
      appDownload: "Open {brandName} App"
    },
    identityCard: {
      eyebrow: "COMPANY FACTS & VERIFICATION",
      badge: "Pre-Opening · Verified",
      title: "Company Facts & Official Verification Channels",
      intro: "Official information to verify the identity of {legalName} (Brand: {brandName}).",
      legalLabel: "Legal Entity",
      brandLabel: "Brand",
      leaderLabel: "Leadership",
      leaderRole: "Direktur Utama",
      openPositionsLabel: "Open Positions",
      openPositionsValue: "11 Job Positions (Official Recruitment)",
      statusLabel: "Planned Opening",
      statusValue: "Pre-Opening Stage — South Jakarta (Nothing on Sale Yet)",
      purposeLabel: "Registered Address",
      purposeValue: "{address}",
      channelsLabel: "Official Channels",
      antiFraudTitle: "Official Recruitment Notice",
      antiFraudDesc: "Kami tidak memungut biaya apa pun dalam proses rekrutmen.",
      contactLinkBtn: "View Registered Address & Contact →"
    },
    pillars: {
      eyebrow: "OUR PILLARS",
      title: "Four Core Pillars of {brandName}",
      intro: "{legalName} is preparing {brandName} across four operational pillars:",
      items: [
        {
          id: "people",
          route: "people",
          icon: "users",
          title: "People",
          desc: "Building a diligent, respectful team in South Jakarta.",
          action: "View Culture →"
        },
        {
          id: "food-rnd",
          route: "food-rnd",
          icon: "utensils",
          title: "Food & R&D",
          desc: "Standardized Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) recipes across 5 culinary genres.",
          action: "View Culinary R&D →"
        },
        {
          id: "platform",
          route: "platform",
          icon: "smartphone",
          title: "Platform",
          desc: "Orders from multiple brands are cooked together and delivered in one shipment.",
          action: "Explore Platform →"
        },
        {
          id: "brands",
          route: "brands",
          icon: "store",
          title: "Brands ({brandName})",
          desc: "Portfolio of {brandCount} in-house brands across 5 categories (Pre-Opening).",
          action: "View {brandCount} Brands →"
        }
      ]
    },
    koreaHq: {
      eyebrow: "GLOBAL F&B KNOW-HOW",
      title: "Kantor Pusat Korea ({brandName} Korea HQ)",
      desc: "{legalName} adapts F&B operational systems from {brandName} Korea HQ for Indonesia:",
      points: [
        "01 · Multi-Brand Planning ({brandCount} Brands)",
        "02 · Standardized Central Kitchen Operations",
        "03 · 5-Genre Recipe R&D"
      ],
      linkText: "Kantor Pusat Korea ({brandName} Korea HQ)"
    },
    ceo: {
      eyebrow: "CEO MESSAGE",
      titlePrefix: "Message from Direktur Utama",
      p1Title: "Clear Corporate Identity & Pre-Opening Preparation",
      p1: "“Through {legalName}, we are preparing the launch of {brandName} in South Jakarta. Nothing is on sale yet; our focus is clear corporate identity for job seekers and verifiers.”",
      p2Title: "People-Centered Organization & Fair Recruitment",
      p2: "“Great service begins with great people. We welcome diligent, respectful colleagues through a transparent, free recruitment process.”",
      signRole: "Direktur Utama"
    },
    impact: {
      eyebrow: "TARGET & ROADMAP",
      title: "Target & Pre-Opening Roadmap",
      notice: "{legalName} is currently in the pre-opening phase (nothing is on sale yet). All figures below are planned targets.",
      roadmapTitle: "Preparation Roadmap",
      roadmapSteps: [
        "Phase 1 · Team Recruitment & Central Kitchen Setup in South Jakarta (Pre-Opening Target)",
        "Phase 2 · Initial Hub & {brandName} Platform Launch in South Jakarta (Target)",
        "Phase 3 · Subsequent Hub Network Expansion (Long-Term Target)"
      ]
    },
    culture: {
      eyebrow: "OUR CULTURE",
      title: "Our Culture & Who We Look For",
      quote: "“Good character, diligence, and genuine passion for work. We look forward to colleagues who faithfully fulfill their roles and respect one another.”",
      desc: "Sincerity, responsibility, and mutual respect are the core foundations of {legalName}.",
      peopleBtn: "Our Culture & Values",
      careerBtn: "View 11 Job Positions"
    },
    articles: {
      eyebrow: "OFFICIAL ANNOUNCEMENTS",
      title: "Pre-Opening Announcements",
      upcomingLabel: "Akan Datang",
      readMore: "Read More →",
      backBtn: "← Back to List"
    },
    footnotes: {
      summary: "Legal Entity Identity, Pre-Opening Status & Recruitment Verification Notes"
    },
    brandsPage: {
      eyebrow: "{brandName} BRAND PORTFOLIO · PRE-OPENING (NOT ON SALE YET)",
      title: "{brandCount} Brands & {menuCount} Menus Portfolio",
      intro: "Planned {brandCount} culinary brands ({menuCount} menus) by {legalName} (pre-opening, nothing on sale yet). Dietary policy: Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard).",
      allTab: "All ({brandCount} Brands)",
      catNames: {
        Chicken: "Chicken (3)",
        Korean: "Korean Cuisine (13)",
        Western: "Pizza · Burger · Sandwich (6)",
        Salad: "Salad & Poke (1)",
        Dessert: "Beverage & Dessert (7)"
      },
      searchPlaceholder: "Search brands or menus...",
      preOpeningTag: "Pre-Opening",
      viewAllMenus: "View all 10 menus",
      hideMenus: "Hide menus",
      showAllBrandsBtn: "Tampilkan semua brand",
      showLessBrandsBtn: "Show featured brands only",
      emptySearchTitle: "No matching brands or menus found",
      emptySearchDesc: "No results matched your search query. Try another keyword or view all {brandCount} brands.",
      resetSearchBtn: "Reset Search"
    },
    foodRndPage: {
      eyebrow: "FOOD & R&D · 5 CULINARY GENRES",
      title: "Menu R&D Across 5 Culinary Genres",
      intro: "Standardized recipes across 5 culinary genres prepared by {legalName} for {brandName}.",
      ingredientCallout: "Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) — All recipes are formulated without pork or lard using chicken, beef, seafood, and selected ingredients.",
      genresTitle: "5 Core Culinary Genres",
      genres: [
        {
          title: "1. Korean Cuisine",
          desc: "Roasted nurungji chicken (SOTDAK), charcoal BBQ chicken (SEONGSU DAK), rice bowls, bibimbap, stews, beef soups, gimbap, and dumplings.",
          img: "assets/slots/genre-1-korean.jpg",
          alt: "Ilustrasi pengembangan menu masakan Korea di dapur R&D MUGGO"
        },
        {
          title: "2. Chinese & Mala Fusion",
          desc: "Sichuan Mala spice infusions paired with beef, chicken, and seafood stir-fry dishes (MIGAK).",
          img: "assets/slots/genre-2-chinese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Tiongkok dan Mala Fusion"
        },
        {
          title: "3. Japanese & Artisan Bakery",
          desc: "French-butter Shio Pan salted bread (SALT ROOM), crispy frying techniques, and house sauces.",
          img: "assets/slots/genre-3-japanese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Jepang dan bakery Shio Pan"
        },
        {
          title: "4. Indonesian Local Flavors",
          desc: "Specialty coffee and tropical fruit drinks (NASI BOSS), local sambal spice levels, and fresh Nusantara produce.",
          img: "assets/slots/genre-4-indonesian.jpg",
          alt: "Ilustrasi pengembangan menu dan minuman cita rasa lokal Indonesia"
        },
        {
          title: "5. Western & European Deli",
          desc: "European sandwiches (PANTRY 12), smoked beef burgers (SMOKY SALOON & BURNOUT), pizza (WOOD&BRICK), kebabs (KEBAVA), and salads.",
          img: "assets/slots/genre-5-western.jpg",
          alt: "Ilustrasi pengembangan menu burger, pizza, dan sandwich Barat"
        }
      ]
    },
    platformPage: {
      eyebrow: "PLATFORM · ONLINE FOOD COURT & APP (PRE-OPENING)",
      title: "{brandName} Online Food Court & Delivery Platform",
      intro: "Orders from multiple brands are cooked together and delivered in one shipment.",
      features: [
        { title: "01 · 1 Cart · {brandCount} Brands · 1 Delivery", desc: "Orders from multiple brands are cooked together and delivered in one shipment." },
        { title: "02 · Coordinated Cooking & Separate Packaging", desc: "Hot dishes and cold drinks are prepared together and packed separately to preserve temperature." },
        { title: "03 · Status: Pre-Opening Stage", desc: "Nothing is on sale yet while pre-opening preparations are underway." }
      ],
      appBoxTitle: "{brandName} Ordering App (Pre-Opening)",
      appBoxDesc: "Nothing is on sale yet. The official launch schedule will be announced on this site."
    },
    peoplePage: {
      eyebrow: "OUR PEOPLE & CULTURE",
      title: "A Team That Values Diligence and Passion",
      intro: "“Good character, diligence, and genuine passion for work. We look forward to colleagues who faithfully fulfill their roles and respect one another.”",
      values: [
        { title: "01 · Good Character & Respect", desc: "Respecting teammates across every role and communicating honestly." },
        { title: "02 · Diligence & Ownership", desc: "Upholding kitchen hygiene standards, exact recipe portions, and neat packaging." },
        { title: "03 · Passion for Growth", desc: "Learning modern culinary operations and growing together with {legalName}." }
      ]
    },
    careersPage: {
      eyebrow: "OFFICIAL CAREERS · {legalName}",
      title: "Official Recruitment at {legalName} — Brand {brandName} (11 Categories)",
      intro: "Join {legalName} in South Jakarta ahead of our {brandName} launch. Official and 100% free recruitment.",
      applyBoxTitle: "How to Apply",
      applyBoxDesc: "Select a position below and press Lamar to open the official application draft with the position pre-filled.",
      applyJobBtn: "Lamar",
      emailBtn: "Send Email",
      formBtn: "Lamar",
      copyEmailBtn: "Copy Email Address",
      copiedNotice: "Copied!",
      benefitsTitle: "Statutory Employment Compliance & Benefits",
      benefits: [
        {
          title: "01 · Official Employment Contract (PKWT / PKWTT)",
          desc: "Employment follows Indonesian labor law through official written contracts (PKWT/PKWTT) with {legalName}."
        },
        {
          title: "02 · BPJS & THR per Regulation",
          desc: "BPJS Kesehatan & Ketenagakerjaan coverage and religious holiday allowance (THR) in accordance with prevailing regulations."
        },
        {
          flag: "showEmployeeDiscountBenefit",
          title: "03 · Staff Meals",
          titleExtended: "03 · Staff Meals & Diskon Brand",
          desc: "Duty meals provided during operational shifts.",
          descExtended: "Duty meals during operational shifts plus Diskon Brand employee discount benefits."
        },
        {
          flag: "showCareerPathBenefit",
          title: "04 · Culinary & Hygiene Training",
          titleExtended: "04 · Culinary Training & Career Path",
          desc: "Structured training on professional kitchen operations and food hygiene.",
          descExtended: "Structured training and career progression toward Part Leader hingga Branch Manager."
        },
        {
          title: "05 · Opportunity to Work at Korea HQ",
          desc: "Opportunities are provided to work at our Korea Headquarters ({brandName} Korea HQ)."
        }
      ],
      positionsTitle: "11 Open Job Positions"
    },
    applyModal: {
      title: "Draft Official Application",
      guidePrefix: "This helper prepares your application draft to {legalName}. Attach your CV/Resume and send it to:",
      roleLabel: "Posisi yang Dilamar",
      nameLabel: "Full Name",
      contactLabel: "Phone Number / Active Email",
      msgLabel: "Brief Experience Summary & Motivation",
      privacyNotice: "",
      cancelBtn: "Cancel",
      submitBtn: "Open Email App ↗",
      whatsappBtn: "Apply via WhatsApp ↗",
      webformBtn: "Submit Web Form ↗",
      copyDraftBtn: "Copy Draft & Email",
      copySuccess: "Application draft and email address copied to clipboard."
    },
    contactPage: {
      eyebrow: "OFFICIAL CORPORATE IDENTITY & CONTACT",
      title: "Company Identity, Registered Address & Contact",
      intro: "Official communication channel of {legalName} (Brand: {brandName}) for company verification and job applicants.",
      entityLabel: "Legal Entity",
      brandLabel: "Brand",
      statusLabel: "Business Status",
      statusText: "Pre-Opening Stage (Nothing is on sale yet)",
      addressLabel: "Alamat Terdaftar",
      phonePendingNotice: "Nomor telepon pelanggan / WhatsApp resmi akan diumumkan saat pembukaan gerai pertama.",
      openMapsBtn: "Open in Google Maps ↗",
      emailUnifiedLabel: "Official Email (General, Partnership & Recruitment)",
      emailGeneralLabel: "General & Partnership Email",
      emailRecruitmentLabel: "Official Recruitment Email",
      emailLabel: "Temporary Contact Email",
      emailNote: "Note: A company-domain mailbox will come later.",
      socialLabel: "Official Social Media"
    },
    footer: {
      desc: "Official website of {legalName} (Brand: {brandName} · Pre-Opening).",
      navHeading: "NAVIGATION",
      socialHeading: "SOCIAL & CHANNELS",
      registeredLabel: "Registered Address:",
      emailLabel: "Contact Email:",
      copyright: "© 2026 {legalName} (Brand: {brandName}). All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Use"
    },
    policyPage: {
      privacyTitle: "Privacy Policy",
      privacyP1: "{legalName} (operating the {brandName} brand) respects the privacy of job applicants and visitors in compliance with Indonesian Personal Data Protection laws (UU PDP).",
      privacyP2: "Information submitted to our official recruitment email ({contactEmail}) is used strictly for hiring evaluation and HR administration.",
      termsTitle: "Terms of Use",
      termsP1: "This website is officially operated by {legalName} (Registered address: {address}) to provide corporate verification, planned {brandName} brand information, and official career opportunities.",
      termsP2: "The business is currently in the pre-opening stage and nothing is on sale yet."
    },
    sticky: {
      instagram: "Instagram",
      tiktok: "TikTok",
      careers: "Lamar Karir",
      whatsapp: "WhatsApp"
    }
  },

  ko: {
    skipToContent: "본문 바로가기",
    themeLabel: ["다크 모드", "라이트 모드"],
    nav: {
      home: "홈",
      brands: "브랜드",
      foodRnd: "푸드·R&D",
      platform: "플랫폼",
      people: "사람·문화",
      careers: "채용",
      contact: "문의"
    },
    hero: {
      eyebrow: "{legalName} · BRAND: {brandName} (오픈 준비 중)",
      headlineA: "{legalName} (브랜드: {brandName}) 공식 법인 소개 및 채용",
      headlineB: "{legalName} · 자카르타 온라인 푸드코트 {brandName} 오픈 준비",
      subcopyA: "자카르타 남부에서 브랜드 {brandName}({brandCount}개 브랜드) 오픈을 준비 중인 {legalName}입니다. 현재 판매 전 단계로 11개 직군 채용을 진행하고 있습니다.",
      subcopyB: "{legalName}는 자카르타 남부에서 브랜드 {brandName}({brandCount}개 브랜드) 오픈을 준비하고 있으며 11개 직군 채용을 진행 중입니다.",
      careerBtn: "채용 지원 (11개 직군)",
      brandBtn: "{brandCount}개 브랜드 보기",
      appComingSoon: "Aplikasi Delivery (Segera Hadir)",
      appDownload: "{brandName} 앱 열기"
    },
    identityCard: {
      eyebrow: "공식 법인 신원 및 핵심 정보",
      badge: "오픈 준비 중 · 공식 인증",
      title: "법인 기본 정보 및 채용 검증 채널",
      intro: "{legalName} (브랜드: {brandName})의 법인명과 등록 주소를 확인할 수 있는 공식 안내입니다.",
      legalLabel: "공식 법인명",
      brandLabel: "브랜드",
      leaderLabel: "대표자",
      leaderRole: "Direktur Utama",
      openPositionsLabel: "채용 중인 직군",
      openPositionsValue: "11개 직군 (공식 채용 중)",
      statusLabel: "오픈 예정 안내",
      statusValue: "오픈 준비 단계 — 자카르타 남부 (현재 상품 판매 전)",
      purposeLabel: "등록 주소",
      purposeValue: "{address}",
      channelsLabel: "공식 채널",
      antiFraudTitle: "공식 채용 무상 진행 안내",
      antiFraudDesc: "Kami tidak memungut biaya apa pun dalam proses rekrutmen.",
      contactLinkBtn: "등록 주소 및 연락처 보기 →"
    },
    pillars: {
      eyebrow: "OUR PILLARS",
      title: "{brandName}의 4대 핵심 축",
      intro: "{legalName}가 준비하는 {brandName}의 4대 핵심 영역:",
      items: [
        {
          id: "people",
          route: "people",
          icon: "users",
          title: "사람·문화",
          desc: "자카르타 남부 거점을 함께 세울 성실하고 서로 존중하는 팀 구축",
          action: "조직문화 보기 →"
        },
        {
          id: "food-rnd",
          route: "food-rnd",
          icon: "utensils",
          title: "푸드·R&D",
          desc: "Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) 기준 5대 요리 장르 레시피 개발",
          action: "메뉴 R&D 보기 →"
        },
        {
          id: "platform",
          route: "platform",
          icon: "smartphone",
          title: "플랫폼",
          desc: "여러 브랜드의 메뉴를 함께 조리해 한 번에 배달하는 온라인 푸드코트",
          action: "플랫폼 보기 →"
        },
        {
          id: "brands",
          route: "brands",
          icon: "store",
          title: "브랜드 ({brandName})",
          desc: "5개 카테고리 {brandCount}개 자체 브랜드 포트폴리오 (오픈 준비 중)",
          action: "{brandCount}개 브랜드 보기 →"
        }
      ]
    },
    koreaHq: {
      eyebrow: "GLOBAL F&B KNOW-HOW",
      title: "Kantor Pusat Korea ({brandName} Korea HQ)",
      desc: "{legalName}는 한국 본사({brandName} Korea HQ)의 F&B 운영 노하우를 현지화합니다:",
      points: [
        "01 · 다브랜드 기획 ({brandCount}개 브랜드)",
        "02 · 센트럴 키친 표준 조리 운영 절차",
        "03 · 5대 장르 레시피 R&D"
      ],
      linkText: "Kantor Pusat Korea ({brandName} Korea HQ)"
    },
    ceo: {
      eyebrow: "CEO MESSAGE",
      titlePrefix: "Direktur Utama 인사말",
      p1Title: "명확한 법인 정체성과 {brandName} 오픈 준비",
      p1: "“{legalName}는 자카르타 남부에서 브랜드 {brandName} 오픈을 준비하고 있습니다. 현재 판매 전 단계로서 구직자와 검증 기관에 명확한 법인 신원을 안내합니다.”",
      p2Title: "사람 중심 조직과 투명한 채용",
      p2: "“좋은 서비스는 좋은 사람에게서 시작됩니다. 성실하고 서로 존중하는 동료들을 투명한 채용 절차로 맞이합니다.”",
      signRole: "Direktur Utama"
    },
    impact: {
      eyebrow: "TARGET & ROADMAP",
      title: "목표 및 오픈 준비 로드맵",
      notice: "{legalName}는 현재 오픈 준비 단계로 아직 상품을 판매하지 않습니다. 아래 수치는 목표 계획입니다.",
      roadmapTitle: "단계별 준비 로드맵",
      roadmapSteps: [
        "1단계 · 자카르타 남부 팀 채용 및 센트럴 키친 준비 (오픈 준비 목표)",
        "2단계 · 자카르타 남부 1호 거점 및 {brandName} 플랫폼 오픈 (목표)",
        "3단계 · 차기 거점 단계별 확장 (중장기 목표)"
      ]
    },
    culture: {
      eyebrow: "OUR CULTURE",
      title: "조직문화와 인재상",
      quote: "“착한 인성, 성실함, 그리고 일에 대한 진심 어린 열정. 자신의 몫을 성실히 해내며 서로 존중하는 동료를 기다립니다.”",
      desc: "{legalName}는 성실한 태도와 동료 간 상호 존중을 가장 중요한 가치로 여깁니다.",
      peopleBtn: "조직문화 자세히 보기",
      careerBtn: "11개 채용 직군 보기"
    },
    articles: {
      eyebrow: "공식 안내",
      title: "오픈 준비 소식 및 공지",
      upcomingLabel: "Akan Datang",
      readMore: "자세히 보기 →",
      backBtn: "← 목록으로 돌아가기"
    },
    footnotes: {
      summary: "공식 법인명, 오픈 전(Pre-Opening) 상태 및 채용 검증 각주"
    },
    brandsPage: {
      eyebrow: "{brandName} BRAND PORTFOLIO · 오픈 준비 중 (판매 전)",
      title: "{brandName} {brandCount}개 브랜드 및 {menuCount}개 메뉴 포트폴리오",
      intro: "{legalName}가 준비 중인 {brandCount}개 브랜드({menuCount}개 메뉴) 구성입니다(현재 판매 전). 모든 메뉴는 Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) 기준입니다.",
      allTab: "전체 ({brandCount}개 브랜드)",
      catNames: {
        Chicken: "치킨 (3)",
        Korean: "한식 (13)",
        Western: "피자·버거·샌드위치 (6)",
        Salad: "샐러드·포케 (1)",
        Dessert: "음료·디저트·베이커리 (7)"
      },
      searchPlaceholder: "브랜드명 또는 메뉴 검색...",
      preOpeningTag: "오픈 준비 중",
      viewAllMenus: "10개 메뉴 전체보기",
      hideMenus: "메뉴 접기",
      showAllBrandsBtn: "Tampilkan semua brand",
      showLessBrandsBtn: "대표 브랜드만 보기",
      emptySearchTitle: "일치하는 브랜드 또는 메뉴가 없습니다",
      emptySearchDesc: "검색어에 해당하는 항목을 찾지 못했습니다. 다른 검색어를 입력하거나 전체 {brandCount}개 브랜드를 확인해 주세요.",
      resetSearchBtn: "검색 초기화"
    },
    foodRndPage: {
      eyebrow: "FOOD & R&D · 5 CULINARY GENRES",
      title: "5대 요리 장르 메뉴 R&D",
      intro: "{legalName}가 준비 중인 5대 요리 장르 표준 레시피입니다.",
      ingredientCallout: "Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) — 모든 메뉴에서 돼지고기와 돈지(라드)를 배제하고 닭고기·소고기·해산물 중심의 식자재로 레시피를 설계했습니다.",
      genresTitle: "5대 요리 장르 R&D",
      genres: [
        {
          title: "1. 한식 (Korean Cuisine)",
          desc: "가마솥 누룽지 통닭(솥닭), 숯불 양념치킨(성수닭), 주먹밥, 덮밥, 전주 비빔밥, 소고기 탕·찌개, 김밥, 만두",
          img: "assets/slots/genre-1-korean.jpg",
          alt: "Ilustrasi pengembangan menu masakan Korea di dapur R&D MUGGO"
        },
        {
          title: "2. 중식 및 마라 퓨전 (Chinese & Mala)",
          desc: "사천식 마라 풍미를 소고기·닭고기·해산물 요리에 접목한 중화풍 메뉴(미각)",
          img: "assets/slots/genre-2-chinese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Tiongkok dan Mala Fusion"
        },
        {
          title: "3. 일식 및 아티산 베이커리 (Japanese)",
          desc: "프랑스산 버터로 구워낸 소금빵(솔트룸) 및 바삭한 튀김·소스 조리 기술",
          img: "assets/slots/genre-3-japanese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Jepang dan bakery Shio Pan"
        },
        {
          title: "4. 인도네시아 현지화 메뉴 (Indonesian)",
          desc: "스페셜티 커피·열대과일 음료(나씨보스), 현지 삼발 맵기 단계 및 로컬 식자재 활용",
          img: "assets/slots/genre-4-indonesian.jpg",
          alt: "Ilustrasi pengembangan menu dan minuman cita rasa lokal Indonesia"
        },
        {
          title: "5. 양식 및 유러피안 델리 (Western)",
          desc: "유러피안 샌드위치(펜트리12), 비프 버거(스모키살루온·번아웃), 피자(우드앤브릭), 케밥(케바바), 포케 샐러드",
          img: "assets/slots/genre-5-western.jpg",
          alt: "Ilustrasi pengembangan menu burger, pizza, dan sandwich Barat"
        }
      ]
    },
    platformPage: {
      eyebrow: "PLATFORM · ONLINE FOOD COURT & APP (오픈 준비 중)",
      title: "{brandName} 온라인 푸드코트 몰 및 배달 플랫폼",
      intro: "여러 브랜드의 메뉴를 동시에 조리하여 한 번의 배달로 전달합니다.",
      features: [
        { title: "01 · {brandCount}개 브랜드 단일 장바구니 & 1회 배달", desc: "여러 브랜드의 메뉴를 동시에 조리하여 한 번의 배달로 전달합니다." },
        { title: "02 · 조리 시간 맞춤 & 온·냉 분리 포장", desc: "따뜻한 요리와 차가운 음료·디저트를 함께 준비하고 온도에 맞게 분리 포장합니다." },
        { title: "03 · 현재 상태: 오픈 준비 중 (판매 전)", desc: "현재 오픈 준비 단계로 아직 상품을 판매하지 않습니다." }
      ],
      appBoxTitle: "{brandName} 주문 앱 (오픈 준비 중)",
      appBoxDesc: "현재 오픈 준비 단계이며 아직 상품을 판매하지 않습니다."
    },
    peoplePage: {
      eyebrow: "OUR PEOPLE & CULTURE",
      title: "성실함과 열정을 존중하는 팀",
      intro: "“착한 인성, 성실함, 그리고 일에 대한 진심 어린 열정. 자신의 몫을 성실히 해내며 서로 존중하는 동료를 기다립니다.”",
      values: [
        { title: "01 · 착한 인성과 상호 존중", desc: "모든 동료가 서로의 역할을 존중하고 정직하게 소통합니다." },
        { title: "02 · 자신의 몫을 다하는 성실함", desc: "주방 위생과 정확한 레시피 계량, 깔끔한 포장을 매일 실천합니다." },
        { title: "03 · 일에 대한 진심 어린 열정", desc: "{legalName}와 함께 배우며 성장합니다." }
      ]
    },
    careersPage: {
      eyebrow: "OFFICIAL CAREERS · {legalName}",
      title: "{legalName} (브랜드 {brandName}) 공식 채용 안내 (11개 직군)",
      intro: "자카르타 남부 거점 및 {brandName} 오픈을 함께 준비할 11개 직군의 인재를 모집합니다.",
      applyBoxTitle: "지원 방법 안내",
      applyBoxDesc: "아래 모집 직군에서 Lamar 버튼을 누르면 지원 직군과 이메일 제목(Lamaran: <직군>)이 자동 입력된 지원서 작성창이 열립니다.",
      applyJobBtn: "Lamar",
      emailBtn: "이메일 보내기",
      formBtn: "Lamar",
      copyEmailBtn: "이메일 주소 복사",
      copiedNotice: "복사됨!",
      benefitsTitle: "근로기준 준수 및 근무 환경",
      benefits: [
        {
          title: "01 · 공식 근로계약 체결 (PKWT / PKWTT)",
          desc: "{legalName}와 현지 노동법에 따른 공식 서면 근로계약(PKWT/PKWTT)을 체결합니다."
        },
        {
          title: "02 · BPJS 및 법정 THR 준수",
          desc: "BPJS Kesehatan & Ketenagakerjaan 가입 및 현지 법규에 따른 명절수당(THR)을 준수합니다."
        },
        {
          flag: "showEmployeeDiscountBenefit",
          title: "03 · 근무 중 식사 제공",
          titleExtended: "03 · 근무 식사 및 Diskon Brand",
          desc: "근무 시간 중 직원 식사를 제공합니다.",
          descExtended: "근무 시간 중 식사 제공 및 Diskon Brand 임직원 할인 혜택을 제공합니다."
        },
        {
          flag: "showCareerPathBenefit",
          title: "04 · 주방 운영 및 위생 교육",
          titleExtended: "04 · 주방 교육 및 커리어 성장",
          desc: "표준 주방 조리 절차 및 식품 위생 관리에 대한 교육을 제공합니다.",
          descExtended: "체계적인 조리·운영 교육 및 Part Leader hingga Branch Manager 승진 기회를 제공합니다."
        },
        {
          title: "05 · 한국 본사 근무 기회 부여",
          desc: "한국 본사({brandName} Korea HQ)에서 일할 수 있는 기회가 주어집니다."
        }
      ],
      positionsTitle: "모집 중인 11개 직군"
    },
    applyModal: {
      title: "지원서 초안 작성",
      guidePrefix: "본 창은 {legalName} 입사 지원 초안 작성을 돕습니다. 이력서(CV) 첨부 후 아래 이메일로 발송해 주세요:",
      roleLabel: "Posisi yang Dilamar",
      nameLabel: "성명",
      contactLabel: "연락처 (전화번호 / 이메일)",
      msgLabel: "주요 경력 및 지원 동기 요약",
      privacyNotice: "",
      cancelBtn: "취소",
      submitBtn: "메일 앱 열기 ↗",
      whatsappBtn: "WhatsApp으로 지원 ↗",
      webformBtn: "웹 폼으로 제출 ↗",
      copyDraftBtn: "초안 및 이메일 복사",
      copySuccess: "지원서 초안과 이메일 주소가 복사되었습니다."
    },
    contactPage: {
      eyebrow: "OFFICIAL CORPORATE IDENTITY & CONTACT",
      title: "공식 법인 정보, 등록 주소 및 연락처",
      intro: "{legalName} (Brand: {brandName}) 공식 소통 및 기업 확인 채널입니다.",
      entityLabel: "공식 법인명",
      brandLabel: "브랜드",
      statusLabel: "사업 상태",
      statusText: "오픈 준비 단계 (Pre-Opening · 현재 판매 전)",
      addressLabel: "Alamat Terdaftar",
      phonePendingNotice: "Nomor telepon pelanggan / WhatsApp resmi akan diumumkan saat pembukaan gerai pertama.",
      openMapsBtn: "구글 지도에서 열기 ↗",
      emailUnifiedLabel: "공식 이메일 (일반·제휴 및 채용 통합)",
      emailGeneralLabel: "일반·제휴 문의 이메일",
      emailRecruitmentLabel: "공식 채용 이메일",
      emailLabel: "임시 연락 이메일",
      emailNote: "안내: 회사 도메인 메일은 추후 개설 예정입니다.",
      socialLabel: "공식 소셜 미디어"
    },
    footer: {
      desc: "{legalName} (Brand: {brandName} · 오픈 준비 단계) 공식 사이트입니다.",
      navHeading: "바로가기",
      socialHeading: "공식 소셜 채널",
      registeredLabel: "등록 주소:",
      emailLabel: "이메일:",
      copyright: "© 2026 {legalName} (Brand: {brandName}). All rights reserved.",
      privacy: "개인정보처리방침",
      terms: "이용약관"
    },
    policyPage: {
      privacyTitle: "개인정보처리방침",
      privacyP1: "{legalName}(브랜드: {brandName})는 인도네시아 개인정보보호법(UU PDP)을 준수합니다.",
      privacyP2: "공식 채용 이메일({contactEmail})을 통해 접수된 지원자 정보는 채용 전형 목적으로만 안전하게 처리됩니다.",
      termsTitle: "이용약관",
      termsP1: "본 사이트는 {legalName}(등록 주소: {address})의 법인 신원 확인, {brandName} 브랜드 기획 소개 및 공식 채용 안내를 목적으로 운영됩니다.",
      termsP2: "현재 당사는 오픈 준비 단계로 아직 상품을 판매하지 않습니다."
    },
    sticky: {
      instagram: "Instagram",
      tiktok: "TikTok",
      careers: "Lamar Karir",
      whatsapp: "WhatsApp"
    }
  }
};
