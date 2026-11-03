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
      contact: "Kontak"
    },
    hero: {
      eyebrow: "{legalName} · BRAND: {brandName} (PRA-PEMBUKAAN)",
      headlineA: "Identitas Resmi & Rekrutmen {legalName} (Brand: {brandName})",
      headlineB: "{legalName} · Membangun Mall Food Court Online {brandName} di Jakarta",
      subcopyA: "{legalName} sedang dalam tahap pra-pembukaan untuk meluncurkan {brandName} ({brandCount} brand kuliner) di Jakarta Selatan. Belum ada produk yang dijual saat ini; kami sedang membuka rekrutmen resmi 11 bidang posisi.",
      subcopyB: "{legalName} mempersiapkan peluncuran {brandName} ({brandCount} brand kuliner) di Jakarta Selatan. Saat ini tahap pra-pembukaan (belum berjualan) dan fokus pada rekrutmen 11 bidang posisi.",
      careerBtn: "Lamar Karir (11 Bidang)",
      brandBtn: "Lihat {brandCount} Brand",
      appComingSoon: "Pra-Pembukaan (Belum Berjualan)",
      appDownload: "Buka Aplikasi {brandName}"
    },
    identityCard: {
      eyebrow: "VERIFIKASI IDENTITAS PERUSAHAAN",
      title: "Identitas Resmi Perusahaan & Verifikasi Rekrutmen",
      intro: "Informasi resmi bagi pelamar kerja dan tim verifikasi portal lowongan kerja untuk memastikan keaslian identitas {legalName} (Brand: {brandName}).",
      legalLabel: "Badan Hukum Resmi (Legal Entity)",
      brandLabel: "Merek Usaha (Brand)",
      statusLabel: "Status Bisnis Saat Ini",
      statusValue: "Tahap Pra-Pembukaan (Pre-Opening) — Belum ada produk yang dijual",
      purposeLabel: "Alamat Terdaftar",
      purposeValue: "{address}",
      antiFraudTitle: "Rekrutmen Resmi Tanpa Biaya",
      antiFraudDesc: "{legalName} tidak memungut biaya apa pun dalam proses rekrutmen. Komunikasi resmi hanya melalui email {contactEmail} di bagian Kontak & Footer.",
      contactLinkBtn: "Lihat Kontak & Alamat Terdaftar →"
    },
    pillars: {
      eyebrow: "OUR PILLARS",
      title: "Empat Pilar Utama {brandName}",
      intro: "Fondasi operasional {legalName} untuk mempersiapkan peluncuran {brandName}:",
      items: [
        {
          id: "people",
          route: "people",
          icon: "users",
          title: "Manusia",
          desc: "Membangun tim yang berkarakter baik, tekun, dan saling menghormati di Jakarta Selatan",
          action: "Lihat Budaya Kerja →"
        },
        {
          id: "food-rnd",
          route: "food-rnd",
          icon: "utensils",
          title: "Food & R&D",
          desc: "Resep terstandarisasi Tanpa Babi & Tanpa Minyak Babi (No Pork, No Lard) lintas 5 genre masakan",
          action: "Lihat R&D & 6 Stasiun →"
        },
        {
          id: "platform",
          route: "platform",
          icon: "smartphone",
          title: "Platform",
          desc: "Sistem dapur terpusat 6 stasiun serta platform delivery & pickup",
          action: "Pelajari Platform →"
        },
        {
          id: "brands",
          route: "brands",
          icon: "store",
          title: "Brand ({brandName})",
          desc: "Portofolio {brandCount} brand internal di 5 kategori kuliner (Pra-Pembukaan)",
          action: "Lihat {brandCount} Brand →"
        }
      ]
    },
    koreaHq: {
      eyebrow: "GLOBAL F&B KNOW-HOW",
      title: "Kantor Pusat Korea ({brandName} Korea HQ)",
      desc: "{legalName} mengadaptasi sistem operasional F&B dari Kantor Pusat Korea ({brandName} Korea HQ) untuk pasar Indonesia:",
      points: [
        "01 · Perencanaan Multi-Brand ({brandCount} Brand)",
        "02 · Standarisasi SOP 6 Stasiun Dapur",
        "03 · Teknologi R&D Resep 5 Genre"
      ],
      linkText: "Kantor Pusat Korea ({brandName} Korea HQ)"
    },
    ceo: {
      eyebrow: "CEO MESSAGE",
      titlePrefix: "Sambutan Manajemen",
      p1Title: "Identitas Jelas & Persiapan Pra-Pembukaan {brandName}",
      p1: "“Melalui {legalName}, kami mempersiapkan peluncuran {brandName} di Jakarta Selatan. Belum ada produk yang dijual saat ini; prioritas kami adalah transparansi identitas perusahaan bagi pelamar kerja dan mitra verifikasi.”",
      p2Title: "Organisasi Berpusat pada Manusia & Rekrutmen Resmi",
      p2: "“Layanan terbaik berawal dari tim yang hebat. Kami mencari rekan kerja yang berkarakter baik, tekun, dan bersemangat melalui proses rekrutmen yang adil dan transparan.”",
      signRole: "Manajemen"
    },
    impact: {
      eyebrow: "PRE-OPENING PLAN",
      title: "Rencana Pra-Pembukaan & Peta Jalan",
      notice: "{legalName} berada pada tahap pra-pembukaan (belum berjualan). Indikator di bawah ini merupakan rencana persiapan.",
      roadmapTitle: "Tahapan Rencana Persiapan",
      roadmapSteps: [
        "Tahap 1 · Rekrutmen Tim & Persiapan Dapur Terpusat Jakarta Selatan (Pra-Pembukaan)",
        "Tahap 2 · Peluncuran Perdana Gerai & Platform {brandName} di Jakarta Selatan",
        "Tahap 3 · Pengembangan Jaringan Hub Berikutnya"
      ]
    },
    culture: {
      eyebrow: "OUR CULTURE",
      title: "Budaya Kerja & Kriteria Talenta",
      quote: "“Karakter yang baik, ketekunan, dan semangat yang tulus terhadap pekerjaan. Kami menantikan rekan kerja yang menjalankan tanggung jawabnya dengan sungguh-sungguh dan saling menghormati.”",
      desc: "Ketulusan sikap, tanggung jawab atas peran masing-masing, dan rasa hormat antar rekan kerja adalah nilai utama {legalName} ({brandName}).",
      peopleBtn: "Tentang Budaya & Tim",
      careerBtn: "Lihat 11 Bidang Rekrutmen"
    },
    articles: {
      eyebrow: "PENGUMUMAN RESMI",
      title: "Informasi & Pengumuman Pra-Pembukaan",
      readMore: "Baca Selengkapnya →",
      backBtn: "← Kembali ke Daftar"
    },
    footnotes: {
      summary: "Catatan Hukum, Status Pra-Pembukaan & Verifikasi Rekrutmen"
    },
    brandsPage: {
      eyebrow: "{brandName} BRAND PORTFOLIO · PRA-PEMBUKAAN (BELUM DIJUAL)",
      title: "Portofolio {brandCount} Brand & {menuCount} Menu {brandName}",
      intro: "Rencana {brandCount} brand kuliner ({menuCount} menu) oleh {legalName} untuk merek {brandName} (tahap pra-pembukaan, belum ada penjualan). Seluruh menu Tanpa Babi & Tanpa Minyak Babi (No Pork, No Lard).",
      allTab: "Semua ({brandCount} Brand)",
      catNames: {
        Chicken: "Ayam (Chicken · 3)",
        Korean: "Masakan Korea (13)",
        Western: "Pizza · Burger · Sandwich (6)",
        Salad: "Salad & Poke (1)",
        Dessert: "Minuman & Dessert (7)"
      },
      searchPlaceholder: "Cari nama brand atau menu (contoh: SOTDAK, Bibimbap, Burger, Bingsu)...",
      preOpeningTag: "Pra-Pembukaan",
      viewAllMenus: "Lihat semua 10 menu",
      hideMenus: "Tutup daftar menu",
      emptySearchTitle: "Tidak ada brand atau menu yang cocok",
      emptySearchDesc: "Tidak ditemukan hasil untuk kata kunci pencarian Anda. Coba kata kunci lain atau tampilkan kembali seluruh {brandCount} brand.",
      resetSearchBtn: "Reset Pencarian"
    },
    foodRndPage: {
      eyebrow: "FOOD & R&D · 5 GENRES & 6 STATIONS",
      title: "Pengembangan Menu 5 Genre & Sistem 6 Stasiun Dapur",
      intro: "Standarisasi resep lintas 5 genre masakan dan sistem 6 stasiun dapur terpusat yang disiapkan oleh {legalName} untuk {brandName}.",
      ingredientCallout: "Kebijakan Bahan Baku Tanpa Babi & Tanpa Minyak Babi (No Pork, No Lard): Seluruh menu dikembangkan tanpa daging babi dan tanpa minyak babi menggunakan daging ayam, sapi, makanan laut, dan bahan baku pilihan.",
      genresTitle: "5 Genre Masakan Utama",
      genres: [
        {
          title: "1. Masakan Korea (Korean Cuisine)",
          desc: "Ayam panggang nurungji (SOTDAK), ayam bakar arang (SEONGSU DAK), rice bowl, bibimbap, jjigae, sup kaldu sapi, gimbap, dan mandu.",
          img: "assets/slots/genre-1-korean.jpg",
          alt: "Ilustrasi pengembangan menu masakan Korea di dapur R&D MUGGO"
        },
        {
          title: "2. Masakan Tiongkok & Mala Fusion (Chinese)",
          desc: "Perpaduan rempah Mala Sichuan autentik dengan teknik masak suhu tinggi (MIGAK) serta hidangan tumis berbahan sapi & ayam.",
          img: "assets/slots/genre-2-chinese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Tiongkok dan Mala Fusion"
        },
        {
          title: "3. Masakan Jepang & Bakery Artisan (Japanese)",
          desc: "Shio Pan roti garam mentega Prancis (SALT ROOM), teknik gorengan renyah, serta saus spesial bergaya Jepang.",
          img: "assets/slots/genre-3-japanese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Jepang dan bakery Shio Pan"
        },
        {
          title: "4. Cita Rasa Lokal Indonesia (Indonesian)",
          desc: "Kreasi minuman kopi & buah tropis (NASI BOSS), penyesuaian tingkat kepedasan sambal lokal, dan bahan segar Nusantara.",
          img: "assets/slots/genre-4-indonesian.jpg",
          alt: "Ilustrasi pengembangan menu dan minuman cita rasa lokal Indonesia"
        },
        {
          title: "5. Masakan Barat & Deli (Western)",
          desc: "Sandwich Eropa (PANTRY 12), burger sapi asap (SMOKY SALOON & BURNOUT), pizza tungku kayu (WOOD&BRICK), kebab (KEBAVA), dan salad.",
          img: "assets/slots/genre-5-western.jpg",
          alt: "Ilustrasi pengembangan menu burger, pizza, dan sandwich Barat"
        }
      ],
      stationsTitle: "6 Stasiun Dapur Terpusat",
      stations: [
        "Stasiun 1 · Fryer (Ayam Krispi & Gorengan)",
        "Stasiun 2 · Grill (Ayam Bakar Arang, BBQ Sapi, Burger Patty & Oven)",
        "Stasiun 3 · Soup & Simmer (Kaldu Sapi, Jjigae, Mie Dingin)",
        "Stasiun 4 · Assembly & Prep (Rice Bowl, Bibimbap, Gimbap, Salad)",
        "Stasiun 5 · Bakery & Dessert (Bingsu Salju, Shio Pan, Bagel)",
        "Stasiun 6 · Beverage Bar (Kopi Spesialti, Teh Bunga, Boba Milk Tea)"
      ]
    },
    platformPage: {
      eyebrow: "PLATFORM · ONLINE FOOD COURT & APP (PRA-PEMBUKAAN)",
      title: "Mall Food Court Online & Platform Delivery {brandName}",
      intro: "Platform delivery & pickup yang dipersiapkan oleh {legalName} untuk menyatukan {brandCount} brand {brandName} dalam satu pesanan.",
      features: [
        { title: "01 · 1 Keranjang · {brandCount} Brand · 1x Pengiriman", desc: "Memesan berbagai menu lintas brand dalam satu transaksi tanpa biaya antar ganda." },
        { title: "02 · Sinkronisasi KDS & Kemasan Termal", desc: "KDS menyinkronkan waktu masak 6 stasiun serta memisahkan Thermal Bag (panas) dan Cooler Bag (dingin)." },
        { title: "03 · Status: Tahap Pra-Pembukaan", desc: "Saat ini belum ada produk yang dijual. Aplikasi pemesanan sedang dalam persiapan pra-pembukaan." }
      ],
      appBoxTitle: "Aplikasi Pemesanan {brandName} (Pra-Pembukaan)",
      appBoxDesc: "Belum ada makanan atau minuman yang dijual saat ini. Jadwal peluncuran resmi akan diumumkan di situs ini."
    },
    peoplePage: {
      eyebrow: "OUR PEOPLE & CULTURE",
      title: "Tim yang Menghargai Ketekunan dan Semangat Kerja",
      intro: "“Karakter yang baik, ketekunan, dan semangat yang tulus terhadap pekerjaan. Kami menantikan rekan kerja yang menjalankan tanggung jawabnya dengan sungguh-sungguh dan saling menghormati.”",
      values: [
        { title: "01 · Karakter Baik & Saling Menghormati", desc: "Menghargai rekan kerja lintas posisi, berkomunikasi jujur, dan membangun lingkungan kerja yang suportif." },
        { title: "02 · Ketekunan dalam Tanggung Jawab", desc: "Menjaga standar kebersihan dapur, ketepatan resep, dan kerapian pengemasan setiap hari." },
        { title: "03 · Semangat Tulus untuk Bertumbuh", desc: "Mempelajari sistem F&B modern dan berkembang bersama {legalName} ({brandName})." }
      ]
    },
    careersPage: {
      eyebrow: "OFFICIAL CAREERS · {legalName}",
      title: "Rekrutmen Resmi {legalName} — Brand {brandName} (11 Bidang)",
      intro: "Bergabunglah bersama tim {legalName} di Jakarta Selatan untuk persiapan peluncuran {brandName} ({brandCount} brand kuliner). Rekrutmen resmi dan bebas biaya.",
      applyBoxTitle: "Cara Melamar Kerja (Via Email Resmi)",
      applyBoxDesc: "Selama masa pra-pembukaan, seluruh lamaran dikirimkan ke email resmi sementara perusahaan:",
      emailBtn: "Kirim Email",
      formBtn: "Lamar via Email",
      copyEmailBtn: "Salin Alamat Email",
      copiedNotice: "Tersalin!",
      benefitsTitle: "Kesejahteraan & Lingkungan Kerja",
      benefits: [
        { title: "01 · Kontrak Resmi & BPJS", desc: "Kontrak kerja {legalName} (PKWT/PKWTT), BPJS Kesehatan & Ketenagakerjaan, serta THR." },
        { title: "02 · Gaji Transparan & Tepat Waktu", desc: "Perhitungan periode kerja jelas, lembur sesuai ketentuan, dan slip gaji transparan." },
        { title: "03 · Makan Karyawan & Manfaat", desc: "Penyediaan makan selama jam kerja operasional serta manfaat internal." },
        { title: "04 · Pelatihan SOP & Karir", desc: "Pelatihan standar kuliner profesional dan jenjang karir menuju Part Leader hingga Branch Manager." }
      ],
      positionsTitle: "Daftar 11 Bidang Posisi yang Dibuka"
    },
    applyModal: {
      title: "Buat Draf Email Lamaran Resmi",
      guidePrefix: "Formulir ini menyusun draf email lamaran ke {legalName}. Setelah aplikasi email terbuka, lampirkan CV/Resume Anda dan kirim ke:",
      roleLabel: "Posisi yang Dilamar",
      nameLabel: "Nama Lengkap",
      contactLabel: "Nomor Telepon / Email Aktif",
      msgLabel: "Ringkasan Pengalaman & Motivasi Singkat",
      cancelBtn: "Batal",
      submitBtn: "Buka Aplikasi Email ↗",
      copyDraftBtn: "Salin Teks & Alamat Email",
      copySuccess: "Teks lamaran dan alamat email resmi telah disalin ke papan klip."
    },
    contactPage: {
      eyebrow: "OFFICIAL CORPORATE IDENTITY & CONTACT",
      title: "Identitas Perusahaan, Alamat Terdaftar & Kontak Resmi",
      intro: "Informasi resmi {legalName} (Brand: {brandName}) untuk verifikasi perusahaan dan pelamar kerja.",
      entityLabel: "Badan Hukum Resmi (Legal Entity)",
      brandLabel: "Merek Usaha (Brand)",
      statusLabel: "Status Bisnis",
      statusText: "Tahap Pra-Pembukaan (Pre-Opening · Belum ada produk yang dijual saat ini)",
      addressLabel: "Alamat Terdaftar (Registered Address)",
      openMapsBtn: "Buka di Google Maps ↗",
      emailLabel: "Email Kontak Resmi Sementara",
      emailNote: "Catatan: Alamat email ini digunakan sementara selama tahap pra-pembukaan. Mailbox domain perusahaan menyusul.",
      socialLabel: "Media Sosial Resmi {brandName}"
    },
    footer: {
      desc: "Situs resmi {legalName} (Brand: {brandName} · Tahap Pra-Pembukaan).",
      registeredLabel: "Alamat Terdaftar:",
      emailLabel: "Email Kontak:",
      privacy: "Kebijakan Privasi",
      terms: "Syarat & Ketentuan"
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
      appComingSoon: "Pre-Opening (Not on Sale Yet)",
      appDownload: "Open {brandName} App"
    },
    identityCard: {
      eyebrow: "COMPANY VERIFICATION",
      title: "Official Corporate Identity & Recruitment Verification",
      intro: "Official information for job seekers and job-board verifiers to confirm the legal identity of {legalName} (Brand: {brandName}).",
      legalLabel: "Legal Entity",
      brandLabel: "Brand",
      statusLabel: "Current Business Status",
      statusValue: "Pre-Opening Stage — Nothing is on sale yet",
      purposeLabel: "Registered Address",
      purposeValue: "{address}",
      antiFraudTitle: "Official Zero-Fee Recruitment Notice",
      antiFraudDesc: "{legalName} never charges any recruitment fees. All official communication uses {contactEmail} listed in Contact & Footer.",
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
          desc: "Building a diligent, respectful team in South Jakarta",
          action: "View Culture →"
        },
        {
          id: "food-rnd",
          route: "food-rnd",
          icon: "utensils",
          title: "Food & R&D",
          desc: "Standardized No Pork, No Lard recipe R&D spanning 5 culinary genres",
          action: "View R&D & 6 Stations →"
        },
        {
          id: "platform",
          route: "platform",
          icon: "smartphone",
          title: "Platform",
          desc: "6-station central kitchen workflow and delivery/pickup platform",
          action: "Explore Platform →"
        },
        {
          id: "brands",
          route: "brands",
          icon: "store",
          title: "Brands ({brandName})",
          desc: "Portfolio of {brandCount} in-house brands across 5 categories (Pre-Opening)",
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
        "02 · 6-Station Kitchen SOPs",
        "03 · 5-Genre Recipe R&D"
      ],
      linkText: "Kantor Pusat Korea ({brandName} Korea HQ)"
    },
    ceo: {
      eyebrow: "CEO MESSAGE",
      titlePrefix: "Message from Management",
      p1Title: "Clear Corporate Identity & Pre-Opening Preparation",
      p1: "“Through {legalName}, we are preparing the launch of {brandName} in South Jakarta. Nothing is on sale yet; our focus is providing clear corporate identity for job seekers and verifiers.”",
      p2Title: "People-Centered Organization & Fair Recruitment",
      p2: "“Great service begins with great people. We welcome colleagues with good character, diligence, and passion through a transparent recruitment process.”",
      signRole: "Management"
    },
    impact: {
      eyebrow: "PRE-OPENING PLAN",
      title: "Pre-Opening Plan & Roadmap",
      notice: "{legalName} is currently in the pre-opening phase (nothing is on sale yet).",
      roadmapTitle: "Preparation Roadmap",
      roadmapSteps: [
        "Phase 1 · Team Recruitment & Central Kitchen Setup in South Jakarta (Pre-Opening)",
        "Phase 2 · Initial Hub & {brandName} Platform Launch in South Jakarta",
        "Phase 3 · Subsequent Hub Network Expansion"
      ]
    },
    culture: {
      eyebrow: "OUR CULTURE",
      title: "Our Culture & Who We Look For",
      quote: "“Good character, diligence, and genuine passion for work. We look forward to colleagues who faithfully fulfill their roles and respect one another.”",
      desc: "Sincerity, ownership of one's role, and mutual respect among teammates are the core foundations of {legalName} ({brandName}).",
      peopleBtn: "Our Culture & Values",
      careerBtn: "View 11 Job Positions"
    },
    articles: {
      eyebrow: "OFFICIAL ANNOUNCEMENTS",
      title: "Pre-Opening Announcements",
      readMore: "Read More →",
      backBtn: "← Back to List"
    },
    footnotes: {
      summary: "Legal Entity Identity, Pre-Opening Status & Recruitment Verification Notes"
    },
    brandsPage: {
      eyebrow: "{brandName} BRAND PORTFOLIO · PRE-OPENING (NOT ON SALE YET)",
      title: "{brandCount} Brands & {menuCount} Menus Portfolio",
      intro: "Planned {brandCount} culinary brands ({menuCount} menus) by {legalName} for {brandName} (pre-opening stage, nothing on sale yet). All menus follow No Pork & No Lard.",
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
      emptySearchTitle: "No matching brands or menus found",
      emptySearchDesc: "No results matched your search query. Try another keyword or view all {brandCount} brands.",
      resetSearchBtn: "Reset Search"
    },
    foodRndPage: {
      eyebrow: "FOOD & R&D · 5 GENRES & 6 STATIONS",
      title: "Menu R&D Across 5 Culinary Genres & 6 Kitchen Stations",
      intro: "Standardized recipes across 5 culinary genres and a 6-station central kitchen workflow prepared by {legalName} for {brandName}.",
      ingredientCallout: "Ingredient Policy — No Pork, No Lard: All recipes are formulated without pork or lard using chicken, beef, seafood, and selected ingredients.",
      genresTitle: "5 Core Culinary Genres",
      genres: [
        {
          title: "1. Korean Cuisine",
          desc: "Cauldron-roasted nurungji chicken (SOTDAK), charcoal BBQ chicken (SEONGSU DAK), rice bowls, bibimbap, stews, ox-bone soups, gimbap, and dumplings.",
          img: "assets/slots/genre-1-korean.jpg",
          alt: "Ilustrasi pengembangan menu masakan Korea di dapur R&D MUGGO"
        },
        {
          title: "2. Chinese & Mala Fusion",
          desc: "Authentic Sichuan Mala spice infusions and high-heat wok techniques (MIGAK) paired with beef, chicken, and seafood creations.",
          img: "assets/slots/genre-2-chinese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Tiongkok dan Mala Fusion"
        },
        {
          title: "3. Japanese & Artisan Bakery",
          desc: "French-butter Japanese Shio Pan salted bread (SALT ROOM), crispy frying techniques, and house sauces.",
          img: "assets/slots/genre-3-japanese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Jepang dan bakery Shio Pan"
        },
        {
          title: "4. Indonesian Local Flavors",
          desc: "Specialty coffee and tropical fruit creations (NASI BOSS), localized spice levels, and fresh Indonesian produce.",
          img: "assets/slots/genre-4-indonesian.jpg",
          alt: "Ilustrasi pengembangan menu dan minuman cita rasa lokal Indonesia"
        },
        {
          title: "5. Western & European Deli",
          desc: "European sandwiches (PANTRY 12), smoked beef burgers (SMOKY SALOON & BURNOUT), wood-fired pizza (WOOD&BRICK), kebabs (KEBAVA), and poke bowls.",
          img: "assets/slots/genre-5-western.jpg",
          alt: "Ilustrasi pengembangan menu burger, pizza, dan sandwich Barat"
        }
      ],
      stationsTitle: "6 Specialized Central Kitchen Stations",
      stations: [
        "Station 1 · Fryer (Crispy Chicken & Fritters)",
        "Station 2 · Grill (Charcoal BBQ, Beef Grill, Burger Sear & Oven)",
        "Station 3 · Soup & Simmer (Ox-Bone Broth, Jjigae, Chilled Noodles)",
        "Station 4 · Assembly & Prep (Rice Bowls, Bibimbap, Gimbap, Salads)",
        "Station 5 · Bakery & Dessert (Snow Bingsu, Shio Pan, Bagels)",
        "Station 6 · Beverage Bar (Specialty Coffee, Floral Teas, Boba Milk Tea)"
      ]
    },
    platformPage: {
      eyebrow: "PLATFORM · ONLINE FOOD COURT & APP (PRE-OPENING)",
      title: "{brandName} Online Food Court & Delivery Platform",
      intro: "Delivery and pickup platform prepared by {legalName} to unite {brandCount} {brandName} brands in one order.",
      features: [
        { title: "01 · 1 Cart · {brandCount} Brands · 1 Delivery", desc: "Order across multiple brands in a single transaction." },
        { title: "02 · 6-Station KDS & Dual Packaging", desc: "Synchronizes cooking times and separates hot dishes from chilled drinks/desserts." },
        { title: "03 · Status: Pre-Opening Stage", desc: "Nothing is on sale yet." }
      ],
      appBoxTitle: "{brandName} Ordering App (Pre-Opening)",
      appBoxDesc: "Nothing is on sale yet while pre-opening preparations are underway."
    },
    peoplePage: {
      eyebrow: "OUR PEOPLE & CULTURE",
      title: "A Team That Values Diligence and Passion",
      intro: "“Good character, diligence, and genuine passion for work. We look forward to colleagues who faithfully fulfill their roles and respect one another.”",
      values: [
        { title: "01 · Good Character & Respect", desc: "Respecting teammates across every role and communicating honestly." },
        { title: "02 · Diligence & Ownership", desc: "Upholding strict hygiene standards, exact recipe portions, and careful preparation." },
        { title: "03 · Passion for Growth", desc: "Growing together with {legalName} ({brandName})." }
      ]
    },
    careersPage: {
      eyebrow: "OFFICIAL CAREERS · {legalName}",
      title: "Official Recruitment at {legalName} — Brand {brandName} (11 Categories)",
      intro: "Join {legalName} in South Jakarta ahead of our {brandName} ({brandCount} brands) launch. Official and 100% free recruitment.",
      applyBoxTitle: "How to Apply (Via Official Email)",
      applyBoxDesc: "During pre-opening, all applications are received via our temporary contact email:",
      emailBtn: "Send Email",
      formBtn: "Apply via Email",
      copyEmailBtn: "Copy Email Address",
      copiedNotice: "Copied!",
      benefitsTitle: "Benefits & Working Environment",
      benefits: [
        { title: "01 · Official Contract & BPJS", desc: "Employment contracts with {legalName} (PKWT/PKWTT), BPJS coverage, and THR." },
        { title: "02 · Transparent Payroll", desc: "Clear monthly payroll cycles, overtime calculation, and transparent payslips." },
        { title: "03 · Staff Meals & Benefits", desc: "Duty meals during operational shifts plus internal benefits." },
        { title: "04 · SOP Training & Growth", desc: "Structured training and career progression toward Part Leader and Branch Manager." }
      ],
      positionsTitle: "11 Open Job Positions"
    },
    applyModal: {
      title: "Draft Official Email Application",
      guidePrefix: "This helper prepares your application email to {legalName}. Attach your CV/Resume in your email app and send it to:",
      roleLabel: "Target Role / Category",
      nameLabel: "Full Name",
      contactLabel: "Phone Number / Active Email",
      msgLabel: "Brief Experience Summary & Motivation",
      cancelBtn: "Cancel",
      submitBtn: "Open Email App ↗",
      copyDraftBtn: "Copy Draft & Email",
      copySuccess: "Application draft and email address copied to clipboard."
    },
    contactPage: {
      eyebrow: "OFFICIAL CORPORATE IDENTITY & CONTACT",
      title: "Company Identity, Registered Address & Contact",
      intro: "Official information for {legalName} (Brand: {brandName}).",
      entityLabel: "Legal Entity",
      brandLabel: "Brand",
      statusLabel: "Business Status",
      statusText: "Pre-Opening Stage (Nothing is on sale yet)",
      addressLabel: "Registered Address",
      openMapsBtn: "Open in Google Maps ↗",
      emailLabel: "Temporary Contact Email",
      emailNote: "Note: A company-domain mailbox will come later.",
      socialLabel: "Official Social Media"
    },
    footer: {
      desc: "Official website of {legalName} (Brand: {brandName} · Pre-Opening).",
      registeredLabel: "Registered Address:",
      emailLabel: "Contact Email:",
      privacy: "Privacy Policy",
      terms: "Terms of Use"
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
      subcopyA: "자카르타 남부에서 브랜드 {brandName}({brandCount}개 브랜드) 오픈을 준비 중인 {legalName}입니다. 현재 판매 전(Pre-Opening) 단계로 11개 직군 채용을 진행하고 있습니다.",
      subcopyB: "{legalName}는 자카르타 남부에서 브랜드 {brandName}({brandCount}개 브랜드) 오픈을 준비하고 있으며 11개 직군 채용을 진행 중입니다.",
      careerBtn: "채용 지원 (11개 직군)",
      brandBtn: "{brandCount}개 브랜드 보기",
      appComingSoon: "오픈 준비 중 (판매 전)",
      appDownload: "{brandName} 앱 열기"
    },
    identityCard: {
      eyebrow: "공식 법인 신원 확인",
      title: "공식 법인 정보 및 채용 검증 안내",
      intro: "구직자 및 채용 사이트 검증 담당자가 {legalName} (브랜드: {brandName})의 법인명과 등록 주소를 확인할 수 있는 공식 안내입니다.",
      legalLabel: "공식 법인명 (Legal Entity)",
      brandLabel: "브랜드 (Brand)",
      statusLabel: "사업 상태",
      statusValue: "오픈 준비 단계 (Pre-Opening) — 현재 상품 판매 전",
      purposeLabel: "등록 주소",
      purposeValue: "{address}",
      antiFraudTitle: "공식 채용 확인 안내",
      antiFraudDesc: "{legalName}는 채용 과정에서 어떠한 비용도 요구하지 않습니다. 공식 연락은 {contactEmail}을 통해 진행됩니다.",
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
          desc: "No Pork, No Lard(돼지고기·돈지 무첨가) 기준 5대 요리 장르 레시피 개발",
          action: "메뉴 R&D & 6대 스테이션 →"
        },
        {
          id: "platform",
          route: "platform",
          icon: "smartphone",
          title: "플랫폼",
          desc: "6대 스테이션 센트럴 키친 및 딜리버리·픽업 플랫폼 준비",
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
        "02 · 6대 스테이션 조리 표준 (SOP)",
        "03 · 5대 장르 레시피 R&D"
      ],
      linkText: "Kantor Pusat Korea ({brandName} Korea HQ)"
    },
    ceo: {
      eyebrow: "CEO MESSAGE",
      titlePrefix: "경영진 인사말",
      p1Title: "명확한 법인 정체성과 {brandName} 오픈 준비",
      p1: "“{legalName}는 자카르타 남부에서 브랜드 {brandName} 오픈을 준비하고 있습니다. 현재 판매 전 단계로서 구직자와 검증 기관에 명확한 법인 신원을 안내하는 것을 최우선으로 합니다.”",
      p2Title: "사람 중심 조직과 투명한 채용",
      p2: "“좋은 서비스는 좋은 사람에게서 시작됩니다. 착한 인성과 성실함, 열정을 가진 동료들을 투명한 채용 절차로 맞이합니다.”",
      signRole: "경영진"
    },
    impact: {
      eyebrow: "PRE-OPENING PLAN",
      title: "오픈 준비 계획 및 로드맵",
      notice: "{legalName}는 현재 오픈 준비(Pre-Opening) 단계로 아직 상품을 판매하지 않습니다.",
      roadmapTitle: "단계별 준비 로드맵",
      roadmapSteps: [
        "1단계 · 자카르타 남부 팀 채용 및 센트럴 키친 오픈 준비 (오픈 준비 중)",
        "2단계 · 자카르타 남부 1호 거점 및 {brandName} 플랫폼 오픈",
        "3단계 · 차기 거점 단계별 확장"
      ]
    },
    culture: {
      eyebrow: "OUR CULTURE",
      title: "조직문화와 인재상",
      quote: "“착한 인성, 성실함, 그리고 일에 대한 진심 어린 열정. 자신의 몫을 성실히 해내며 서로 존중하는 동료를 기다립니다.”",
      desc: "{legalName} ({brandName})는 기본에 충실한 태도와 동료에 대한 상호 존중을 가장 중요한 가치로 여깁니다.",
      peopleBtn: "조직문화 자세히 보기",
      careerBtn: "11개 채용 직군 보기"
    },
    articles: {
      eyebrow: "공식 안내",
      title: "오픈 준비 소식 및 공지",
      readMore: "자세히 보기 →",
      backBtn: "← 목록으로 돌아가기"
    },
    footnotes: {
      summary: "공식 법인명, 오픈 전(Pre-Opening) 상태 및 채용 검증 각주"
    },
    brandsPage: {
      eyebrow: "{brandName} BRAND PORTFOLIO · 오픈 준비 중 (판매 전)",
      title: "{brandName} {brandCount}개 브랜드 및 {menuCount}개 메뉴 포트폴리오",
      intro: "{legalName}가 준비 중인 브랜드 {brandName}의 {brandCount}개 브랜드({menuCount}개 메뉴) 구성입니다(현재 판매 전). 모든 메뉴는 돼지고기와 돈지를 배제한 No Pork, No Lard 기준입니다.",
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
      emptySearchTitle: "일치하는 브랜드 또는 메뉴가 없습니다",
      emptySearchDesc: "검색어에 해당하는 항목을 찾지 못했습니다. 다른 검색어를 입력하거나 전체 {brandCount}개 브랜드를 확인해 주세요.",
      resetSearchBtn: "검색 초기화"
    },
    foodRndPage: {
      eyebrow: "FOOD & R&D · 5 GENRES & 6 STATIONS",
      title: "5대 요리 장르 메뉴 R&D 및 6대 조리 스테이션",
      intro: "{legalName}가 준비 중인 5대 요리 장르 표준 레시피와 6대 조리 스테이션 분업 시스템입니다.",
      ingredientCallout: "원료 기준 — No Pork, No Lard (돼지고기·돈지 무첨가): 모든 메뉴에서 돼지고기와 돈지(라드)를 배제하고 닭고기·소고기·해산물 중심의 식자재로 레시피를 설계했습니다.",
      genresTitle: "5대 요리 장르 R&D",
      genres: [
        {
          title: "1. 한식 (Korean Cuisine)",
          desc: "가마솥 누룽지 통닭(솥닭), 숯불 양념치킨(성수닭), 주먹밥(주목), 덮밥(밥클럽·얹다), 전주 비빔밥, 한우 뭇국·온탕, 온담 반상, 냉면(냉탕), 수제 김밥(말다), 왕만두(두야)",
          img: "assets/slots/genre-1-korean.jpg",
          alt: "Ilustrasi pengembangan menu masakan Korea di dapur R&D MUGGO"
        },
        {
          title: "2. 중식 및 마라 퓨전 (Chinese & Mala)",
          desc: "사천식 마라 풍미를 소고기·닭고기·해산물 요리에 접목한 미각(MIGAK) 등 중화풍 메뉴 R&D",
          img: "assets/slots/genre-2-chinese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Tiongkok dan Mala Fusion"
        },
        {
          title: "3. 일식 및 아티산 베이커리 (Japanese)",
          desc: "프랑스산 버터와 천일염으로 구워낸 시오빵/소금빵(솔트룸) 및 튀김·덮밥 조리 기술",
          img: "assets/slots/genre-3-japanese.jpg",
          alt: "Ilustrasi pengembangan menu masakan Jepang dan bakery Shio Pan"
        },
        {
          title: "4. 인도네시아 현지화 메뉴 (Indonesian)",
          desc: "스페셜티 커피·음료(나씨보스), 현지 입맛에 맞춘 맵기 단계 설계 및 로컬 식자재 결합",
          img: "assets/slots/genre-4-indonesian.jpg",
          alt: "Ilustrasi pengembangan menu dan minuman cita rasa lokal Indonesia"
        },
        {
          title: "5. 양식 및 유러피안 델리 (Western)",
          desc: "유러피안 샌드위치(펜트리12), 아메리칸 비프 버거(스모키살루온·번아웃), 화덕 피자(우드앤브릭·베이스오븐), 케밥(케바바), 포케 샐러드(샐러드픽)",
          img: "assets/slots/genre-5-western.jpg",
          alt: "Ilustrasi pengembangan menu burger, pizza, dan sandwich Barat"
        }
      ],
      stationsTitle: "센트럴 키친 6대 조리 스테이션",
      stations: [
        "Station 1 · Fryer (가마솥 후라이드 치킨 및 튀김)",
        "Station 2 · Grill (숯불 바베큐 치킨, 소고기 구이, 버거 패티 & 오븐)",
        "Station 3 · Soup & Simmer (곰탕, 뭇국, 찌개, 냉면 육수)",
        "Station 4 · Assembly & Prep (덮밥, 비빔밥, 김밥, 주먹밥, 포케 샐러드)",
        "Station 5 · Bakery & Dessert (눈꽃 빙수, 소금빵, 베이글)",
        "Station 6 · Beverage Bar (스페셜티 커피, 티, 밀크티)"
      ]
    },
    platformPage: {
      eyebrow: "PLATFORM · ONLINE FOOD COURT & APP (오픈 준비 중)",
      title: "{brandName} 온라인 푸드코트 몰 및 배달 플랫폼",
      intro: "{legalName}가 준비 중인 딜리버리·픽업 중심 {brandCount}개 브랜드 온라인 푸드코트 플랫폼입니다.",
      features: [
        { title: "01 · {brandCount}개 브랜드 단일 장바구니 & 1회 배달", desc: "서로 다른 브랜드 메뉴를 한 번의 주문으로 함께 조리·배달합니다." },
        { title: "02 · 6대 스테이션 KDS 연동 & 보온·보냉 분리 포장", desc: "조리 완료 시각을 동기화하며 따뜻한 요리와 차가운 음료를 분리 포장합니다." },
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
        { title: "02 · 자신의 몫을 다하는 성실함", desc: "위생 관리부터 정확한 레시피 계량까지 기본과 원칙을 지킵니다." },
        { title: "03 · 일에 대한 진심 어린 열정", desc: "{legalName} ({brandName})와 함께 성장합니다." }
      ]
    },
    careersPage: {
      eyebrow: "OFFICIAL CAREERS · {legalName}",
      title: "{legalName} (브랜드 {brandName}) 공식 채용 안내 (11개 직군)",
      intro: "자카르타 남부 거점 및 {brandName}({brandCount}개 브랜드) 오픈을 함께 준비할 11개 직군의 인재를 모집합니다.",
      applyBoxTitle: "지원 방법 (공식 이메일)",
      applyBoxDesc: "회사 도메인 메일 개설 전까지 모든 입사 지원은 공식 임시 이메일로 접수합니다:",
      emailBtn: "이메일 보내기",
      formBtn: "이메일로 지원",
      copyEmailBtn: "이메일 주소 복사",
      copiedNotice: "복사됨!",
      benefitsTitle: "근무 조건 및 복지 혜택",
      benefits: [
        { title: "01 · 공식 근로계약 및 BPJS", desc: "{legalName}와의 공식 근로계약(PKWT/PKWTT) 체결, BPJS 및 THR 지급" },
        { title: "02 · 투명한 급여 정산", desc: "명확한 급여 산정 주기와 투명한 급여 명세서 제공" },
        { title: "03 · 근무 식사 및 혜택", desc: "근무 중 식사 제공 및 사내 혜택" },
        { title: "04 · SOP 교육 및 성장 기회", desc: "체계적인 조리·운영 교육 및 파트 리더·지점장 승진 기회" }
      ],
      positionsTitle: "모집 중인 11개 직군"
    },
    applyModal: {
      title: "이메일 지원 초안 작성",
      guidePrefix: "본 창은 {legalName} 입사 지원 메일 초안 작성을 돕습니다. 메일 작성창에서 이력서(CV) 첨부 후 아래 이메일로 발송해 주세요:",
      roleLabel: "지원 직군",
      nameLabel: "성명",
      contactLabel: "연락처 (전화번호 / 이메일)",
      msgLabel: "주요 경력 및 지원 동기 요약",
      cancelBtn: "취소",
      submitBtn: "메일 앱 열기 ↗",
      copyDraftBtn: "초안 및 이메일 복사",
      copySuccess: "지원서 초안과 이메일 주소가 복사되었습니다."
    },
    contactPage: {
      eyebrow: "OFFICIAL CORPORATE IDENTITY & CONTACT",
      title: "공식 법인 정보, 등록 주소 및 연락처",
      intro: "{legalName} (Brand: {brandName}) 공식 기업 정보입니다.",
      entityLabel: "공식 법인명 (Legal Entity)",
      brandLabel: "브랜드 (Brand)",
      statusLabel: "사업 상태",
      statusText: "오픈 준비 단계 (Pre-Opening · 현재 판매 전)",
      addressLabel: "등록 주소 (Registered Address)",
      openMapsBtn: "구글 지도에서 열기 ↗",
      emailLabel: "임시 연락 이메일",
      emailNote: "안내: 회사 도메인 메일은 추후 개설 예정입니다.",
      socialLabel: "공식 소셜 미디어"
    },
    footer: {
      desc: "{legalName} (Brand: {brandName} · 오픈 준비 단계) 공식 사이트입니다.",
      registeredLabel: "등록 주소:",
      emailLabel: "이메일:",
      privacy: "개인정보처리방침",
      terms: "이용약관"
    },
    sticky: {
      instagram: "Instagram",
      tiktok: "TikTok",
      careers: "Lamar Karir",
      whatsapp: "WhatsApp"
    }
  }
};
