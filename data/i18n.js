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
      headlineB: "{legalName} · Mall Food Court Online {brandName} di Jakarta",
      subcopyA: "Tahap pra-pembukaan {brandName} ({brandCount} brand kuliner) oleh {legalName} di Jakarta Selatan. Belum berjualan; membuka rekrutmen resmi 11 bidang posisi.",
      subcopyB: "Persiapan peluncuran {brandName} ({brandCount} brand kuliner) oleh {legalName} di Jakarta Selatan. Tahap pra-pembukaan (belum berjualan) & rekrutmen 11 bidang posisi.",
      careerBtn: "Lamar Karir (11 Bidang)",
      brandBtn: "Lihat {brandCount} Brand",
      appComingSoon: "Aplikasi Delivery (Segera Hadir)",
      appDownload: "Buka Aplikasi {brandName}"
    },
    identityCard: {
      eyebrow: "FAKTA & IDENTITAS PERUSAHAAN",
      badge: "Pra-Pembukaan · Terverifikasi",
      title: "Fakta Perusahaan & Saluran Verifikasi Resmi",
      intro: "Informasi resmi verifikasi identitas {legalName} (Brand: {brandName}).",
      legalLabel: "Badan Hukum Resmi",
      brandLabel: "Merek Usaha",
      leaderLabel: "Pimpinan",
      leaderRole: "Direktur Utama",
      openPositionsLabel: "Posisi Terbuka",
      openPositionsValue: "11 Bidang Posisi (Rekrutmen Resmi)",
      statusLabel: "Rencana Pembukaan",
      statusValue: "Pra-Pembukaan — Jakarta Selatan (Belum Berjualan)",
      purposeLabel: "Alamat Terdaftar",
      purposeValue: "{address}",
      channelsLabel: "Saluran Resmi",
      antiFraudTitle: "Pernyataan Rekrutmen Resmi",
      antiFraudDesc: "Kami tidak memungut biaya apa pun dalam proses rekrutmen.",
      contactLinkBtn: "Lihat Kontak & Alamat →"
    },
    pillars: {
      eyebrow: "PILAR UTAMA KAMI",
      title: "Empat Pilar Utama {brandName}",
      intro: "4 pilar operasional {legalName} untuk {brandName}:",
      items: [
        {
          id: "people",
          route: "people",
          icon: "users",
          title: "Manusia",
          desc: "Tim yang berkarakter baik, tekun, dan saling menghormati di Jakarta Selatan.",
          action: "Lihat Budaya Kerja →"
        },
        {
          id: "food-rnd",
          route: "food-rnd",
          icon: "utensils",
          title: "Food & R&D",
          desc: "Resep standar Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) di 5 genre masakan.",
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
          desc: "{brandCount} brand internal di 5 kategori kuliner (Pra-Pembukaan).",
          action: "Lihat {brandCount} Brand →"
        }
      ]
    },
    koreaHq: {
      eyebrow: "HUBUNGAN KANTOR PUSAT KOREA ({brandName} KOREA HQ) & REKAM JEJAK GLOBAL",
      title: "Keahlian Global Bertemu Potensi Indonesia",
      desc: "Sinergi Kantor Pusat Korea ({brandName} Korea HQ) dan {legalName} melalui 3 pilar utama:",
      pillars: [
        {
          badge: "01 · KOREA F&B · 35+ GERAI",
          title: "Inovasi F&B Multibrand",
          desc: "Standarisasi Central Kitchen & multibrand melalui ~35 gerai serta brand premium di Korea (Agra, noya, dll.).",
          visualType: "korea-fnb",
          caption1: "Agra · Restoran Premium (Korea)",
          caption2: "noya · Shabu Shabu (Korea)"
        },
        {
          badge: "02 · JERMAN · RITEL GLOBAL",
          title: "Ekspansi Ritel & Pasar Global",
          desc: "Ekspansi ritel global melalui investasi & operasional supermarket kuliner Korea di Jerman ('THE GANGNAM').",
          visualType: "germany-retail",
          caption1: "THE GANGNAM · Korean & Asian Mart (Jerman)"
        },
        {
          badge: "03 · IT & TEKNOLOGI · SMART ERP",
          title: "Operasional Berbasis Teknologi",
          desc: "Smart ERP, platform pesanan & manajemen transparan berbasis data dari pengalaman bisnis & investasi IT.",
          visualType: "tech-ops",
          caption1: "Smart ERP · Platform Pesanan · Analitik Data"
        }
      ],
      summary: "Berlandaskan 3 pilar utama ini, {legalName} menghadirkan platform F&B & gaya hidup yang dioptimalkan bagi Jakarta dan Asia Tenggara.",
      linkText: "Kantor Pusat Korea ({brandName} Korea HQ)"
    },
    ceo: {
      eyebrow: "SAMBUTAN DIREKTUR UTAMA",
      titlePrefix: "Sambutan Direktur Utama",
      p1Title: "Identitas Jelas & Persiapan {brandName}",
      p1: "“{legalName} mempersiapkan peluncuran {brandName} di Jakarta Selatan (tahap pra-pembukaan, belum berjualan) dengan identitas perusahaan yang transparan.”",
      p2Title: "Fokus Manusia & Rekrutmen Resmi",
      p2: "“Layanan terbaik berawal dari tim yang baik. Kami mengundang rekan kerja yang tekun dan saling menghormati melalui rekrutmen resmi bebas biaya.”",
      signRole: "Direktur Utama"
    },
    impact: {
      eyebrow: "TARGET & PETA JALAN",
      title: "Target & Peta Jalan Pra-Pembukaan",
      notice: "Tahap pra-pembukaan (belum berjualan). Seluruh angka merupakan target rencana:",
      roadmapTitle: "Tahapan Rencana Persiapan",
      roadmapSteps: [
        "Tahap 1 · Rekrutmen Tim & Central Kitchen Jakarta Selatan (Target Pra-Pembukaan)",
        "Tahap 2 · Peluncuran Gerai Perdana & Platform {brandName} Jakarta Selatan (Target)",
        "Tahap 3 · Ekspansi Jaringan Cabang Berikutnya (Target Jangka Panjang)"
      ]
    },
    culture: {
      eyebrow: "BUDAYA KERJA KAMI",
      title: "Budaya Kerja & Kriteria Talenta",
      quote: "“Karakter yang baik, ketekunan, dan semangat tulus terhadap pekerjaan — rekan yang bertanggung jawab dan saling menghormati.”",
      desc: "Ketulusan, tanggung jawab, dan rasa hormat adalah nilai utama {legalName}.",
      peopleBtn: "Tentang Budaya & Tim",
      careerBtn: "Lihat 11 Bidang Rekrutmen"
    },
    articles: {
      eyebrow: "PENGUMUMAN RESMI",
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
      intro: "Rencana {brandCount} brand ({menuCount} menu) oleh {legalName} (belum dijual). Standar: Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard).",
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
      searchPlaceholder: "Cari brand atau menu (SOTDAK, Bibimbap, Burger)...",
      preOpeningTag: "Pra-Pembukaan",
      viewAllMenus: "Lihat semua 10 menu",
      hideMenus: "Tutup daftar menu",
      showAllBrandsBtn: "Tampilkan semua brand ({brandCount} Brand)",
      showLessBrandsBtn: "Tampilkan brand pilihan saja (6 Brand)",
      emptySearchTitle: "Tidak ada brand atau menu yang cocok",
      emptySearchDesc: "Tidak ditemukan hasil untuk kata kunci Anda. Coba kata kunci lain atau lihat seluruh {brandCount} brand.",
      resetSearchBtn: "Reset Pencarian"
    },
    foodRndPage: {
      eyebrow: "RISET KULINER · 5 GENRE MASAKAN",
      title: "Pengembangan Menu 5 Genre Masakan",
      intro: "Standarisasi resep 5 genre masakan oleh {legalName} untuk dapur terpusat {brandName}.",
      ingredientCallout: "Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) — Seluruh menu menggunakan ayam, sapi, seafood, dan bahan segar tanpa babi/minyak babi.",
      genresTitle: "5 Genre Masakan Utama",
      genres: [
        {
          title: "1. Masakan Korea",
          desc: "Ayam nurungji (SOTDAK), ayam bakar arang (SEONGSU DAK), rice bowl, bibimbap, jjigae, sup sapi, gimbap & mandu.",
          img: "assets/slots/genre-1-korean.jpg",
          alt: "Ilustrasi pengembangan menu masakan Korea di dapur R&D MUGGO"
        },
        {
          title: "2. Masakan Tiongkok & Mala Fusion",
          desc: "Rempah Mala Sichuan dengan tumis sapi, ayam, dan seafood (MIGAK).",
          img: "assets/slots/genre-2-chinese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Tiongkok dan Mala Fusion"
        },
        {
          title: "3. Masakan Jepang & Bakery Artisan",
          desc: "Shio Pan roti garam mentega Prancis (SALT ROOM), gorengan renyah & saus Jepang.",
          img: "assets/slots/genre-3-japanese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Jepang dan bakery Shio Pan"
        },
        {
          title: "4. Cita Rasa Lokal Indonesia",
          desc: "Kopi & minuman buah tropis (NASI BOSS), sambal lokal & bahan segar Nusantara.",
          img: "assets/slots/genre-4-indonesian.jpg",
          alt: "Ilustrasi pengembangan menu dan minuman cita rasa lokal Indonesia"
        },
        {
          title: "5. Masakan Barat & Deli Eropa",
          desc: "Sandwich (PANTRY 12), burger sapi (SMOKY SALOON & BURNOUT), pizza (WOOD&BRICK), kebab (KEBAVA) & salad.",
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
          title: "02 · Masak Terkoordinasi & Kemasan Terpisah",
          desc: "Makanan hangat dan minuman dingin disiapkan bersamaan serta dikemas terpisah."
        },
        {
          title: "03 · Status: Tahap Pra-Pembukaan",
          desc: "Belum ada produk yang dijual saat ini; aplikasi sedang disiapkan."
        }
      ],
      appBoxTitle: "Aplikasi Pemesanan {brandName} (Pra-Pembukaan)",
      appBoxDesc: "Belum ada produk yang dijual saat ini. Jadwal peluncuran resmi akan diumumkan di situs ini."
    },
    peoplePage: {
      eyebrow: "MANUSIA & BUDAYA KERJA",
      title: "Tim yang Menghargai Ketekunan dan Semangat Kerja",
      intro: "“Karakter yang baik, ketekunan, dan semangat tulus terhadap pekerjaan — rekan yang bertanggung jawab dan saling menghormati.”",
      values: [
        { title: "01 · Karakter Baik & Saling Menghormati", desc: "Menghargai rekan kerja lintas posisi dan berkomunikasi jujur." },
        { title: "02 · Ketekunan dalam Tanggung Jawab", desc: "Menjaga kebersihan dapur, akurasi resep, dan kerapian kemasan setiap hari." },
        { title: "03 · Semangat Tulus untuk Bertumbuh", desc: "Mempelajari operasional kuliner modern dan tumbuh bersama {legalName}." }
      ]
    },
    careersPage: {
      eyebrow: "KARIR RESMI · {legalName}",
      title: "Rekrutmen Resmi {legalName} — Brand {brandName} (11 Bidang)",
      intro: "Bergabunglah dengan tim {legalName} di Jakarta Selatan untuk persiapan {brandName}. Rekrutmen resmi & bebas biaya.",
      applyBoxTitle: "Cara Melamar Kerja",
      applyBoxDesc: "Pilih posisi dan tekan Lamar untuk membuka draf lamaran resmi (subjek Lamaran: <posisi> terisi otomatis).",
      applyJobBtn: "Lamar",
      emailBtn: "Kirim Email",
      formBtn: "Lamar",
      copyEmailBtn: "Salin Alamat Email",
      copiedNotice: "Tersalin!",
      benefitsTitle: "Kesejahteraan & Kepatuhan Ketenagakerjaan",
      benefits: [
        {
          title: "01 · Kontrak Kerja Resmi (PKWT / PKWTT)",
          desc: "Kontrak kerja resmi tertulis (PKWT/PKWTT) bersama {legalName} sesuai hukum ketenagakerjaan Indonesia."
        },
        {
          title: "02 · BPJS & THR Sesuai Regulasi",
          desc: "BPJS Kesehatan & Ketenagakerjaan serta THR sesuai peraturan yang berlaku."
        },
        {
          flag: "showEmployeeDiscountBenefit",
          title: "03 · Makan Karyawan",
          titleExtended: "03 · Makan Karyawan & Diskon Brand",
          desc: "Penyediaan makan selama jam kerja operasional.",
          descExtended: "Makan jam kerja serta manfaat Diskon Brand internal."
        },
        {
          flag: "showCareerPathBenefit",
          title: "04 · Pelatihan Dapur & Higienitas",
          titleExtended: "04 · Pelatihan & Jenjang Karir",
          desc: "Pelatihan operasional dapur standar dan kebersihan pangan.",
          descExtended: "Pelatihan operasional dan jenjang karir menuju Part Leader hingga Branch Manager."
        },
        {
          visibleFlag: "showKoreaHqWorkOpportunity",
          title: "05 · Kesempatan Bekerja di Kantor Pusat Korea",
          desc: "Diberikan kesempatan bekerja di Kantor Pusat Korea ({brandName} Korea HQ)."
        }
      ],
      positionsTitle: "Daftar 11 Bidang Posisi yang Dibuka"
    },
    applyModal: {
      title: "Buat Draf Lamaran Resmi",
      guidePrefix: "Formulir ini menyusun draf lamaran resmi ke {legalName}. Lampirkan CV/Resume saat mengirim ke:",
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
      intro: "Saluran resmi {legalName} (Brand: {brandName}) untuk verifikasi perusahaan & pelamar kerja.",
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
      emailNote: "Catatan: Digunakan sementara selama pra-pembukaan. Mailbox domain perusahaan menyusul.",
      socialLabel: "Media Sosial Resmi {brandName}"
    },
    footer: {
      desc: "Situs resmi {legalName} (Brand: {brandName} · Tahap Pra-Pembukaan).",
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
      privacyP1: "{legalName} (merek {brandName}) menghormati privasi pelamar & pengunjung sesuai UU Pelindungan Data Pribadi (UU PDP) Indonesia.",
      privacyP2: "Data lamaran ke email resmi ({contactEmail}) hanya digunakan untuk seleksi SDM internal.",
      termsTitle: "Syarat & Ketentuan",
      termsP1: "Situs ini dikelola resmi oleh {legalName} ({address}) untuk verifikasi identitas perusahaan, rencana brand {brandName}, dan rekrutmen resmi.",
      termsP2: "Perusahaan berada pada tahap pra-pembukaan dan belum melakukan penjualan produk."
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
      mainNavLabel: "Main navigation",
      mobileNavLabel: "Mobile navigation",
      menuBtnLabel: "Menu",
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
      subcopyA: "Pre-opening preparation of {brandName} ({brandCount} brands) by {legalName} in South Jakarta. Nothing on sale yet; recruiting across 11 job positions.",
      subcopyB: "{legalName} is preparing {brandName} ({brandCount} brands) in South Jakarta. Pre-opening stage (nothing on sale yet) & recruiting across 11 roles.",
      careerBtn: "Apply for Careers (11 Roles)",
      brandBtn: "View {brandCount} Brands",
      appComingSoon: "Delivery App (Coming Soon)",
      appDownload: "Open {brandName} App"
    },
    identityCard: {
      eyebrow: "COMPANY FACTS & VERIFICATION",
      badge: "Pre-Opening · Verified",
      title: "Company Facts & Official Verification Channels",
      intro: "Official verification facts for {legalName} (Brand: {brandName}).",
      legalLabel: "Legal Entity",
      brandLabel: "Brand",
      leaderLabel: "Leadership",
      leaderRole: "President Director",
      openPositionsLabel: "Open Positions",
      openPositionsValue: "11 Job Positions (Official Recruitment)",
      statusLabel: "Planned Opening",
      statusValue: "Pre-Opening — South Jakarta (Nothing on Sale Yet)",
      purposeLabel: "Registered Address",
      purposeValue: "{address}",
      channelsLabel: "Official Channels",
      antiFraudTitle: "Official Recruitment Notice",
      antiFraudDesc: "We do not charge any fees during recruitment.",
      contactLinkBtn: "View Address & Contact →"
    },
    pillars: {
      eyebrow: "OUR PILLARS",
      title: "Four Core Pillars of {brandName}",
      intro: "Four operational pillars prepared by {legalName}:",
      items: [
        {
          id: "people",
          route: "people",
          icon: "users",
          title: "People",
          desc: "A diligent, respectful team in South Jakarta.",
          action: "View Culture →"
        },
        {
          id: "food-rnd",
          route: "food-rnd",
          icon: "utensils",
          title: "Food & R&D",
          desc: "Standardized Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) recipes across 5 genres.",
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
          desc: "{brandCount} in-house brands across 5 categories (Pre-Opening).",
          action: "View {brandCount} Brands →"
        }
      ]
    },
    koreaHq: {
      eyebrow: "KOREA HQ RELATIONSHIP ({brandName} KOREA HQ) & GLOBAL TRACK RECORD",
      title: "Global Expertise Meets Indonesian Potential",
      desc: "Synergy between Korea HQ ({brandName} Korea HQ) and {legalName} across 3 core pillars:",
      pillars: [
        {
          badge: "01 · KOREA F&B · 35+ STORES",
          title: "Multibrand F&B Innovation",
          desc: "Multibrand planning & Central Kitchen standardization via ~35 stores and premium brands in Korea (Agra, noya, etc.).",
          visualType: "korea-fnb",
          caption1: "Agra · Premium Dining (Korea)",
          caption2: "noya · Shabu Shabu (Korea)"
        },
        {
          badge: "02 · GERMANY · GLOBAL RETAIL",
          title: "Global Retail & Market Expansion",
          desc: "Global retail expansion know-how through investing & operating Korean food supermarket ('THE GANGNAM') in Germany.",
          visualType: "germany-retail",
          caption1: "THE GANGNAM · Korean & Asian Mart (Germany)"
        },
        {
          badge: "03 · IT & TECH · SMART ERP",
          title: "Tech-Driven Operations",
          desc: "Smart ERP, ordering platform & data-driven management combining IT operations and tech investment.",
          visualType: "tech-ops",
          caption1: "Smart ERP · Order Platform · Data Analytics"
        }
      ],
      summary: "Built on these 3 core pillars, {legalName} deploys an F&B & lifestyle platform optimized for Jakarta and Southeast Asia.",
      linkText: "Korea Headquarters ({brandName} Korea HQ)"
    },
    ceo: {
      eyebrow: "CEO MESSAGE",
      titlePrefix: "Message from Direktur Utama",
      p1Title: "Clear Identity & Pre-Opening Preparation",
      p1: "“{legalName} is preparing {brandName} in South Jakarta (pre-opening, nothing on sale yet) with transparent corporate verification.”",
      p2Title: "People-Centered Team & Free Recruitment",
      p2: "“Great service starts with great people. We welcome diligent, respectful colleagues through free, official recruitment.”",
      signRole: "President Director"
    },
    impact: {
      eyebrow: "TARGET & ROADMAP",
      title: "Target & Pre-Opening Roadmap",
      notice: "Pre-opening stage (nothing on sale yet). All figures below are planned targets:",
      roadmapTitle: "Preparation Roadmap",
      roadmapSteps: [
        "Phase 1 · Team Recruitment & South Jakarta Central Kitchen Setup (Pre-Opening Target)",
        "Phase 2 · Initial Hub & {brandName} Platform Launch in South Jakarta (Target)",
        "Phase 3 · Subsequent Hub Network Expansion (Long-Term Target)"
      ]
    },
    culture: {
      eyebrow: "OUR CULTURE",
      title: "Our Culture & Who We Look For",
      quote: "“Good character, diligence, and genuine passion — colleagues who fulfill their roles and respect one another.”",
      desc: "Sincerity, responsibility, and mutual respect are the foundation of {legalName}.",
      peopleBtn: "Our Culture & Values",
      careerBtn: "View 11 Job Positions"
    },
    articles: {
      eyebrow: "OFFICIAL ANNOUNCEMENTS",
      title: "Pre-Opening Announcements",
      upcomingLabel: "Coming Soon",
      readMore: "Read More →",
      backBtn: "← Back to List"
    },
    footnotes: {
      summary: "Legal Entity Identity, Pre-Opening Status & Recruitment Verification Notes"
    },
    brandsPage: {
      eyebrow: "{brandName} BRAND PORTFOLIO · PRE-OPENING (NOT ON SALE YET)",
      title: "{brandCount} Brands & {menuCount} Menus Portfolio",
      intro: "Planned {brandCount} brands ({menuCount} menus) by {legalName} (nothing on sale yet). Policy: Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard).",
      allTab: "All ({brandCount} Brands)",
      catNames: {
        Chicken: "Chicken (3)",
        Korean: "Korean Cuisine (13)",
        Western: "Pizza · Burger · Sandwich (6)",
        Salad: "Salad & Poke (1)",
        Dessert: "Beverage & Dessert (7)"
      },
      catBadgeNames: {
        Chicken: "Chicken",
        Korean: "Korean Cuisine",
        Western: "Western & Deli",
        Salad: "Salad & Poke",
        Dessert: "Beverage & Dessert"
      },
      searchPlaceholder: "Search brands or menus...",
      preOpeningTag: "Pre-Opening",
      viewAllMenus: "View all 10 menus",
      hideMenus: "Hide menus",
      showAllBrandsBtn: "Show all brands ({brandCount} Brands · Tampilkan semua brand)",
      showLessBrandsBtn: "Show featured brands only (6 Brands)",
      emptySearchTitle: "No matching brands or menus found",
      emptySearchDesc: "No results matched your search query. Try another keyword or view all {brandCount} brands.",
      resetSearchBtn: "Reset Search"
    },
    foodRndPage: {
      eyebrow: "FOOD & R&D · 5 CULINARY GENRES",
      title: "Menu R&D Across 5 Culinary Genres",
      intro: "Standardized recipes across 5 genres prepared by {legalName} for {brandName}.",
      ingredientCallout: "Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) — All recipes use chicken, beef, seafood, and fresh ingredients without pork or lard.",
      genresTitle: "5 Core Culinary Genres",
      genres: [
        {
          title: "1. Korean Cuisine",
          desc: "Nurungji chicken (SOTDAK), charcoal BBQ chicken (SEONGSU DAK), rice bowls, bibimbap, stews, beef soups, gimbap & dumplings.",
          img: "assets/slots/genre-1-korean.jpg",
          alt: "Illustration of Korean menu development in the MUGGO R&D kitchen"
        },
        {
          title: "2. Chinese & Mala Fusion",
          desc: "Sichuan Mala spices paired with beef, chicken & seafood stir-fry (MIGAK).",
          img: "assets/slots/genre-2-chinese.jpg",
          alt: "Illustration of Chinese and Mala Fusion menu development"
        },
        {
          title: "3. Japanese & Artisan Bakery",
          desc: "French-butter Shio Pan (SALT ROOM), crispy frying & house sauces.",
          img: "assets/slots/genre-3-japanese.jpg",
          alt: "Illustration of Japanese menu and Shio Pan bakery development"
        },
        {
          title: "4. Indonesian Local Flavors",
          desc: "Specialty coffee & tropical fruit drinks (NASI BOSS), local sambal & Nusantara produce.",
          img: "assets/slots/genre-4-indonesian.jpg",
          alt: "Illustration of local Indonesian menu and beverage development"
        },
        {
          title: "5. Western & European Deli",
          desc: "Sandwiches (PANTRY 12), beef burgers (SMOKY SALOON & BURNOUT), pizza (WOOD&BRICK), kebabs (KEBAVA) & salads.",
          img: "assets/slots/genre-5-western.jpg",
          alt: "Illustration of Western burger, pizza and sandwich menu development"
        }
      ]
    },
    platformPage: {
      eyebrow: "PLATFORM · ONLINE FOOD COURT & APP (PRE-OPENING)",
      title: "{brandName} Online Food Court & Delivery Platform",
      intro: "Orders from multiple brands are cooked together and delivered in one shipment.",
      features: [
        { title: "01 · 1 Cart · {brandCount} Brands · 1 Delivery", desc: "Orders from multiple brands are cooked together and delivered in one shipment." },
        { title: "02 · Coordinated Cooking & Separate Packaging", desc: "Hot dishes and cold drinks are prepared together and packed separately." },
        { title: "03 · Status: Pre-Opening Stage", desc: "Nothing is on sale yet while pre-opening preparations are underway." }
      ],
      appBoxTitle: "{brandName} Ordering App (Pre-Opening)",
      appBoxDesc: "Nothing is on sale yet. The official launch schedule will be announced on this site."
    },
    peoplePage: {
      eyebrow: "OUR PEOPLE & CULTURE",
      title: "A Team That Values Diligence and Passion",
      intro: "“Good character, diligence, and genuine passion — colleagues who fulfill their roles and respect one another.”",
      values: [
        { title: "01 · Good Character & Respect", desc: "Respecting teammates across roles and communicating honestly." },
        { title: "02 · Diligence & Ownership", desc: "Upholding kitchen hygiene, exact recipe portions, and neat packaging." },
        { title: "03 · Passion for Growth", desc: "Learning modern culinary operations and growing with {legalName}." }
      ]
    },
    careersPage: {
      eyebrow: "OFFICIAL CAREERS · {legalName}",
      title: "Official Recruitment at {legalName} — Brand {brandName} (11 Categories)",
      intro: "Join {legalName} in South Jakarta ahead of our {brandName} launch. Official & 100% free recruitment.",
      applyBoxTitle: "How to Apply",
      applyBoxDesc: "Press Apply on a position below to open the application draft (subject Lamaran: <position> pre-filled).",
      applyJobBtn: "Apply",
      emailBtn: "Send Email",
      formBtn: "Apply",
      copyEmailBtn: "Copy Email Address",
      copiedNotice: "Copied!",
      benefitsTitle: "Statutory Employment Compliance & Benefits",
      benefits: [
        {
          title: "01 · Official Employment Contract (PKWT / PKWTT)",
          desc: "Official written contracts (PKWT/PKWTT) with {legalName} per Indonesian labor law."
        },
        {
          title: "02 · BPJS & THR per Regulation",
          desc: "BPJS Kesehatan & Ketenagakerjaan coverage and statutory THR."
        },
        {
          flag: "showEmployeeDiscountBenefit",
          title: "03 · Staff Meals",
          titleExtended: "03 · Staff Meals & Brand Discounts",
          desc: "Duty meals provided during operational shifts.",
          descExtended: "Duty meals during shifts plus employee brand discount benefits."
        },
        {
          flag: "showCareerPathBenefit",
          title: "04 · Culinary & Hygiene Training",
          titleExtended: "04 · Culinary Training & Career Path",
          desc: "Structured training on kitchen operations and food hygiene.",
          descExtended: "Structured training and career progression from Part Leader to Branch Manager."
        },
        {
          visibleFlag: "showKoreaHqWorkOpportunity",
          title: "05 · Opportunity to Work at Korea HQ",
          desc: "Opportunities provided to work at our Korea Headquarters ({brandName} Korea HQ)."
        }
      ],
      positionsTitle: "11 Open Job Positions"
    },
    applyModal: {
      title: "Draft Official Application",
      guidePrefix: "This helper prepares your application draft to {legalName}. Attach your CV/Resume and send it to:",
      roleLabel: "Position Applied For",
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
      intro: "Official channel of {legalName} (Brand: {brandName}) for verification & job applicants.",
      entityLabel: "Legal Entity",
      brandLabel: "Brand",
      statusLabel: "Business Status",
      statusText: "Pre-Opening Stage (Nothing is on sale yet)",
      addressLabel: "Registered Address",
      phonePendingNotice: "The official customer service / WhatsApp number will be announced when the first outlet opens.",
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
      privacyP1: "{legalName} ({brandName}) respects applicant and visitor privacy in compliance with Indonesian Personal Data Protection laws (UU PDP).",
      privacyP2: "Information submitted to {contactEmail} is used strictly for hiring evaluation.",
      termsTitle: "Terms of Use",
      termsP1: "This website is operated by {legalName} ({address}) for corporate verification, {brandName} brand info, and official recruitment.",
      termsP2: "The business is in the pre-opening stage and nothing is on sale yet."
    },
    sticky: {
      instagram: "Instagram",
      tiktok: "TikTok",
      careers: "Apply for a Job",
      whatsapp: "WhatsApp"
    }
  },

  ko: {
    skipToContent: "본문 바로가기",
    themeLabel: ["다크 모드", "라이트 모드"],
    nav: {
      mainNavLabel: "주요 메뉴",
      mobileNavLabel: "모바일 메뉴",
      menuBtnLabel: "메뉴",
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
      subcopyA: "자카르타 남부에서 {brandName}({brandCount}개 브랜드) 오픈을 준비 중인 {legalName}입니다. (현재 판매 전 · 11개 직군 공식 채용 중)",
      subcopyB: "{legalName}는 자카르타 남부에서 {brandName}({brandCount}개 브랜드) 오픈 및 11개 직군 채용을 진행 중입니다.",
      careerBtn: "채용 지원 (11개 직군)",
      brandBtn: "{brandCount}개 브랜드 보기",
      appComingSoon: "배달 앱 (출시 예정)",
      appDownload: "{brandName} 앱 열기"
    },
    identityCard: {
      eyebrow: "공식 법인 신원 및 핵심 정보",
      badge: "오픈 준비 중 · 공식 인증",
      title: "법인 기본 정보 및 채용 검증 채널",
      intro: "{legalName} (브랜드: {brandName}) 공식 법인 정보 및 연락 채널입니다.",
      legalLabel: "공식 법인명",
      brandLabel: "브랜드",
      leaderLabel: "대표자",
      leaderRole: "대표이사",
      openPositionsLabel: "채용 중인 직군",
      openPositionsValue: "11개 직군 (공식 채용 중)",
      statusLabel: "오픈 예정 안내",
      statusValue: "오픈 준비 단계 — 자카르타 남부 (현재 판매 전)",
      purposeLabel: "등록 주소",
      purposeValue: "{address}",
      channelsLabel: "공식 채널",
      antiFraudTitle: "공식 채용 무상 진행 안내",
      antiFraudDesc: "채용 과정에서 어떠한 비용도 요구하지 않습니다.",
      contactLinkBtn: "주소 및 연락처 보기 →"
    },
    pillars: {
      eyebrow: "4대 핵심 영역",
      title: "{brandName}의 4대 핵심 축",
      intro: "{legalName}가 준비하는 {brandName}의 4대 핵심 축:",
      items: [
        {
          id: "people",
          route: "people",
          icon: "users",
          title: "사람·문화",
          desc: "자카르타 남부 거점을 함께 세울 성실하고 존중하는 팀",
          action: "조직문화 보기 →"
        },
        {
          id: "food-rnd",
          route: "food-rnd",
          icon: "utensils",
          title: "푸드·R&D",
          desc: "Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) 5대 장르 레시피",
          action: "메뉴 R&D 보기 →"
        },
        {
          id: "platform",
          route: "platform",
          icon: "smartphone",
          title: "플랫폼",
          desc: "여러 브랜드 메뉴를 함께 조리해 한 번에 배달하는 온라인 푸드코트",
          action: "플랫폼 보기 →"
        },
        {
          id: "brands",
          route: "brands",
          icon: "store",
          title: "브랜드 ({brandName})",
          desc: "5개 카테고리 {brandCount}개 자체 브랜드 (오픈 준비 중)",
          action: "{brandCount}개 브랜드 보기 →"
        }
      ]
    },
    koreaHq: {
      eyebrow: "한국 본사 관계 및 글로벌 핵심 역량 ({brandName} KOREA HQ)",
      title: "한국 본사의 글로벌 역량과 인도네시아 잠재력의 결합",
      desc: "한국 본사({brandName} Korea HQ)의 글로벌 역량과 인도네시아 잠재력이 결합된 3대 핵심 축:",
      pillars: [
        {
          badge: "01 · 한국 F&B · 35여 개 직·가맹점",
          title: "멀티 브랜드 F&B 혁신",
          desc: "한국 35여 개 직·가맹점 및 프리미엄 브랜드(아그라, 노야 등) 기반 멀티 브랜드 기획·중앙 주방(Central Kitchen) 표준화 역량",
          visualType: "korea-fnb",
          caption1: "아그라 (Agra) · 한국 프리미엄 다이닝",
          caption2: "노야 (noya) · 한국 샤브샤브 브랜드"
        },
        {
          badge: "02 · 독일 리테일 · 글로벌 마트 체인",
          title: "글로벌 리테일 및 시장 확장",
          desc: "독일 내 한국 식문화 전문 슈퍼마켓('더 강남') 성공적 투자·운영을 통한 글로벌 리테일 확장 노하우",
          visualType: "germany-retail",
          caption1: "더 강남 (THE GANGNAM) · 독일 아시안 슈퍼마켓"
        },
        {
          badge: "03 · IT & 테크 · 스마트 ERP 경영",
          title: "IT·데이터 기반 스마트 운영",
          desc: "IT 기업 운영 및 테크 투자 경험을 접목한 스마트 ERP·주문 플랫폼 및 데이터 기반 투명 경영 시스템",
          visualType: "tech-ops",
          caption1: "Smart ERP · 통합 주문 플랫폼 · 데이터 경영"
        }
      ],
      summary: "이 세 가지 핵심 축을 바탕으로, {legalName}는 자카르타를 비롯한 동남아 최적형 F&B·라이프스타일 플랫폼을 전개합니다.",
      linkText: "한국 본사 ({brandName} Korea HQ)"
    },
    ceo: {
      eyebrow: "대표이사 인사말",
      titlePrefix: "Direktur Utama 인사말",
      p1Title: "명확한 법인 정체성과 {brandName} 오픈 준비",
      p1: "“{legalName}는 자카르타 남부에서 {brandName} 오픈을 준비 중이며(판매 전 단계), 구직자와 검증 기관에 투명한 법인 정보를 안내합니다.”",
      p2Title: "사람 중심 조직과 투명한 채용",
      p2: "“좋은 서비스는 좋은 사람에게서 시작됩니다. 성실하고 서로 존중하는 동료들을 투명한 무상 채용으로 맞이합니다.”",
      signRole: "대표이사"
    },
    impact: {
      eyebrow: "목표 및 로드맵",
      title: "목표 및 오픈 준비 로드맵",
      notice: "현재 오픈 준비 단계(판매 전)이며 아래 수치는 목표 계획입니다.",
      roadmapTitle: "단계별 준비 로드맵",
      roadmapSteps: [
        "1단계 · 자카르타 남부 팀 채용 및 센트럴 키친 준비 (오픈 준비 목표)",
        "2단계 · 자카르타 남부 1호 거점 및 {brandName} 플랫폼 오픈 (목표)",
        "3단계 · 차기 거점 단계별 확장 (중장기 목표)"
      ]
    },
    culture: {
      eyebrow: "조직문화와 인재상",
      title: "조직문화와 인재상",
      quote: "“착한 인성, 성실함, 일에 대한 열정 — 자신의 몫을 다하며 서로 존중하는 동료를 기다립니다.”",
      desc: "{legalName}는 성실함과 상호 존중을 가장 중요한 가치로 여깁니다.",
      peopleBtn: "조직문화 자세히 보기",
      careerBtn: "11개 채용 직군 보기"
    },
    articles: {
      eyebrow: "공식 안내",
      title: "오픈 준비 소식 및 공지",
      upcomingLabel: "예정",
      readMore: "자세히 보기 →",
      backBtn: "← 목록으로 돌아가기"
    },
    footnotes: {
      summary: "공식 법인명, 오픈 전(Pre-Opening) 상태 및 채용 검증 각주"
    },
    brandsPage: {
      eyebrow: "{brandName} BRAND PORTFOLIO · 오픈 준비 중 (판매 전)",
      title: "{brandName} {brandCount}개 브랜드 및 {menuCount}개 메뉴 포트폴리오",
      intro: "{legalName}가 준비 중인 {brandCount}개 브랜드({menuCount}개 메뉴)입니다(판매 전). 전 메뉴 Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) 기준.",
      allTab: "전체 ({brandCount}개 브랜드)",
      catNames: {
        Chicken: "치킨 (3)",
        Korean: "한식 (13)",
        Western: "피자·버거·샌드위치 (6)",
        Salad: "샐러드·포케 (1)",
        Dessert: "음료·디저트·베이커리 (7)"
      },
      catBadgeNames: {
        Chicken: "치킨",
        Korean: "한식",
        Western: "양식·델리",
        Salad: "샐러드·포케",
        Dessert: "음료·디저트"
      },
      searchPlaceholder: "브랜드명 또는 메뉴 검색...",
      preOpeningTag: "오픈 준비 중",
      viewAllMenus: "10개 메뉴 전체보기",
      hideMenus: "메뉴 접기",
      showAllBrandsBtn: "전체 브랜드 보기 ({brandCount}개 · Tampilkan semua brand)",
      showLessBrandsBtn: "대표 브랜드만 보기 (6개)",
      emptySearchTitle: "일치하는 브랜드 또는 메뉴가 없습니다",
      emptySearchDesc: "검색어에 해당하는 항목이 없습니다. 다른 검색어를 입력하거나 전체 {brandCount}개 브랜드를 확인해 주세요.",
      resetSearchBtn: "검색 초기화"
    },
    foodRndPage: {
      eyebrow: "푸드 & R&D · 5대 요리 장르",
      title: "5대 요리 장르 메뉴 R&D",
      intro: "{legalName}가 준비 중인 5대 요리 장르 표준 레시피입니다.",
      ingredientCallout: "Tanpa Babi · Tanpa Minyak Babi (No Pork · No Lard) — 돼지고기·라드를 배제하고 닭고기·소고기·해산물 중심 식자재로 설계했습니다.",
      genresTitle: "5대 요리 장르 R&D",
      genres: [
        {
          title: "1. 한식 (Korean Cuisine)",
          desc: "누룽지 통닭(솥닭), 숯불 치킨(성수닭), 덮밥, 비빔밥, 소고기 탕·찌개, 김밥, 만두",
          img: "assets/slots/genre-1-korean.jpg",
          alt: "MUGGO R&D 주방의 한식 메뉴 개발 이미지"
        },
        {
          title: "2. 중식 및 마라 퓨전 (Chinese & Mala)",
          desc: "사천 마라 풍미를 소고기·닭고기·해산물에 접목한 중화 요리(미각)",
          img: "assets/slots/genre-2-chinese.jpg",
          alt: "중식 및 마라 퓨전 메뉴 개발 이미지"
        },
        {
          title: "3. 일식 및 아티산 베이커리 (Japanese)",
          desc: "프랑스산 버터 소금빵(솔트룸) 및 바삭한 튀김·특제 소스",
          img: "assets/slots/genre-3-japanese.jpg",
          alt: "일식 및 시오빵 베이커리 개발 이미지"
        },
        {
          title: "4. 인도네시아 현지화 메뉴 (Indonesian)",
          desc: "스페셜티 커피·열대과일 음료(나씨보스), 현지 삼발 및 로컬 식자재",
          img: "assets/slots/genre-4-indonesian.jpg",
          alt: "인도네시아 현지 메뉴와 음료 개발 이미지"
        },
        {
          title: "5. 양식 및 유러피안 델리 (Western)",
          desc: "샌드위치(펜트리12), 비프 버거(스모키살루온·번아웃), 피자(우드앤브릭), 케밥(케바바), 포케",
          img: "assets/slots/genre-5-western.jpg",
          alt: "서양식 버거·피자·샌드위치 메뉴 개발 이미지"
        }
      ]
    },
    platformPage: {
      eyebrow: "플랫폼 · 온라인 푸드코트 & 앱 (오픈 준비 중)",
      title: "{brandName} 온라인 푸드코트 몰 및 배달 플랫폼",
      intro: "여러 브랜드의 메뉴를 동시에 조리하여 한 번의 배달로 전달합니다.",
      features: [
        { title: "01 · {brandCount}개 브랜드 단일 장바구니 & 1회 배달", desc: "여러 브랜드의 메뉴를 동시에 조리하여 한 번의 배달로 전달합니다." },
        { title: "02 · 조리 시간 맞춤 & 온·냉 분리 포장", desc: "따뜻한 요리와 차가운 음료를 함께 준비하고 분리 포장합니다." },
        { title: "03 · 현재 상태: 오픈 준비 중 (판매 전)", desc: "현재 오픈 준비 단계로 아직 상품을 판매하지 않습니다." }
      ],
      appBoxTitle: "{brandName} 주문 앱 (오픈 준비 중)",
      appBoxDesc: "현재 오픈 준비 단계이며 아직 상품을 판매하지 않습니다."
    },
    peoplePage: {
      eyebrow: "사람 & 조직문화",
      title: "성실함과 열정을 존중하는 팀",
      intro: "“착한 인성, 성실함, 일에 대한 열정 — 자신의 몫을 다하며 서로 존중하는 동료를 기다립니다.”",
      values: [
        { title: "01 · 착한 인성과 상호 존중", desc: "서로의 역할을 존중하고 정직하게 소통합니다." },
        { title: "02 · 자신의 몫을 다하는 성실함", desc: "주방 위생, 정확한 계량, 깔끔한 포장을 매일 실천합니다." },
        { title: "03 · 일에 대한 진심 어린 열정", desc: "{legalName}와 함께 배우며 성장합니다." }
      ]
    },
    careersPage: {
      eyebrow: "공식 채용 · {legalName}",
      title: "{legalName} (브랜드 {brandName}) 공식 채용 안내 (11개 직군)",
      intro: "자카르타 남부 거점 및 {brandName} 오픈을 함께할 11개 직군 인재를 모집합니다.",
      applyBoxTitle: "지원 방법 안내",
      applyBoxDesc: "모집 직군의 지원하기 버튼을 누르면 지원 직군(Lamaran: <직군>)이 자동 입력된 지원창이 열립니다.",
      applyJobBtn: "지원하기",
      emailBtn: "이메일 보내기",
      formBtn: "지원하기",
      copyEmailBtn: "이메일 주소 복사",
      copiedNotice: "복사됨!",
      benefitsTitle: "근로기준 준수 및 근무 환경",
      benefits: [
        {
          title: "01 · 공식 근로계약 체결 (PKWT / PKWTT)",
          desc: "{legalName}와 현지 노동법에 따른 서면 근로계약(PKWT/PKWTT)을 체결합니다."
        },
        {
          title: "02 · BPJS 및 법정 THR 준수",
          desc: "BPJS Kesehatan & Ketenagakerjaan 가입 및 법정 명절수당(THR)을 준수합니다."
        },
        {
          flag: "showEmployeeDiscountBenefit",
          title: "03 · 근무 중 식사 제공",
          titleExtended: "03 · 근무 식사 및 브랜드 할인 혜택",
          desc: "근무 시간 중 직원 식사를 제공합니다.",
          descExtended: "근무 식사 제공 및 임직원 브랜드 할인 혜택을 제공합니다."
        },
        {
          flag: "showCareerPathBenefit",
          title: "04 · 주방 운영 및 위생 교육",
          titleExtended: "04 · 주방 교육 및 커리어 성장",
          desc: "표준 조리 절차 및 식품 위생 교육을 제공합니다.",
          descExtended: "체계적인 조리 교육 및 파트장(Part Leader)에서 지점장(Branch Manager)까지의 성장 기회를 제공합니다."
        },
        {
          visibleFlag: "showKoreaHqWorkOpportunity",
          title: "05 · 한국 본사 근무 기회 부여",
          desc: "한국 본사({brandName} Korea HQ)에서 일할 수 있는 기회가 주어집니다."
        }
      ],
      positionsTitle: "모집 중인 11개 직군"
    },
    applyModal: {
      title: "지원서 초안 작성",
      guidePrefix: "본 창은 {legalName} 입사 지원 초안 작성을 돕습니다. 이력서(CV) 첨부 후 아래 이메일로 발송해 주세요:",
      roleLabel: "지원 직무",
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
      eyebrow: "공식 법인 정보 & 등록 주소",
      title: "공식 법인 정보, 등록 주소 및 연락처",
      intro: "{legalName} (Brand: {brandName}) 공식 소통 및 기업 확인 채널입니다.",
      entityLabel: "공식 법인명",
      brandLabel: "브랜드",
      statusLabel: "사업 상태",
      statusText: "오픈 준비 단계 (Pre-Opening · 현재 판매 전)",
      addressLabel: "등록 주소 (Alamat Terdaftar)",
      phonePendingNotice: "고객용 전화번호 및 공식 WhatsApp 채널은 1호점 오픈 시점에 공개됩니다.",
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
      privacyP2: "공식 이메일({contactEmail})로 접수된 지원자 정보는 채용 목적으로만 처리됩니다.",
      termsTitle: "이용약관",
      termsP1: "본 사이트는 {legalName}({address})의 법인 확인, {brandName} 소개 및 공식 채용 안내를 위해 운영됩니다.",
      termsP2: "현재 오픈 준비 단계로 아직 상품을 판매하지 않습니다."
    },
    sticky: {
      instagram: "Instagram",
      tiktok: "TikTok",
      careers: "채용 지원",
      whatsapp: "WhatsApp"
    }
  }
};
