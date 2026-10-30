// MUGGO Indonesia Corporate Site - Default Data & CMS State
// 비개발자 관리 화면(CMS)에서 수정 가능한 전체 사이트 데이터 구조

window.DEFAULT_SITE_DATA = {
  config: {
    companyName: "PT MUGGO INDONESIA",
    ceoName: "[Nama CEO / 대표자명]",
    currentLang: "id", // 제안요청서 1 & 5-4: 1차 오픈 언어는 인도네시아어(id), 한국어(ko)/영어(en)는 오픈 후 추가 구조
    showHeaderLangSwitcher: false, // 제안요청서 3-①: "언어 전환은 추가 언어 준비 전까지 숨김"
    showKoreaHq: true, // 제안요청서 5-3: 한국 본사 관계 표시 ON/OFF 모듈 (히어로 문구 A/B 및 푸터/본사 영역 연동)
    koreaHqName: "MUGGO Korea HQ",
    koreaHqUrl: "https://muggo-hq.example.com",
    brandCountLabel: "32", // 30+ / 32
    firstStoreDate: "[Segera / 일정 미확정]", // 1호점 오픈 예정 날짜 [ ]
    showRegionalRoadmap: false, // 제안요청서 2p 하단: 2단계 옵션 "사업 지역 로드맵" ON/OFF
    // 디렉터님 전달 이미지 경로 매핑 (파일 도착 시 교체만 하면 즉시 반영되는 구조)
    heroImageMobile: "", // 예: "assets/hero-mobile.webp"
    heroImageDesktop: "", // 예: "assets/hero-desktop.webp"
    cultureImage: "", // 예: "assets/culture-main.webp"
    // 5-2. SNS 연동
    instagramHandle: "@muggo.indonesia",
    instagramUrl: "https://www.instagram.com/muggo.indonesia",
    tiktokHandle: "@muggo1",
    tiktokUrl: "https://www.tiktok.com/@muggo1",
    // 5-5. 연락처와 앱 연결 (보류: 값이 비어 있으면 자동 숨김!)
    whatsappNumber: "", // 비어 있으면 하단 버튼, 문의 메뉴, 푸터에서 자동 숨김
    contactEmail: "",   // 비어 있으면 문의 영역에서 자동 숨김
    officeAddress: "",  // 자카르타 법인 주소 (확정 후 입력)
    // 자체 배달 앱 설정: 'coming_soon' ("오픈 예정" 표시) | 'hidden' (숨김) | 'active' (링크 입력 시 연결)
    deliveryAppMode: "coming_soon",
    deliveryAppUrl: "", // 링크 입력 시 자동으로 연결 활성화
    // 채용 접수 설정: 이메일 기본 연결 + 추후 지원 폼 확장 가능 구조
    careerEmail: "barasustainable@gmail.com",
    enableCareerForm: false // true로 전환 시 사이트 내 지원 폼 모달 즉시 사용 가능
  },

  // 3-⑤ 지표 (Impact) - 오픈 전이므로 모든 숫자에 "목표·예정" 부착, 매출/고객 수 등 실적 숫자 배제
  metrics: [
    {
      id: "m1",
      numberKo: "11개",
      numberId: "11 Posisi",
      numberEn: "11 Roles",
      labelKo: "모집 직군",
      labelId: "Bidang Rekrutmen",
      labelEn: "Open Job Categories",
      badgeKo: "채용 진행·예정",
      badgeId: "Target Rekrutmen",
      badgeEn: "Hiring Target",
      descKo: "현지 법인 런칭과 함께 조리·운영·마케팅·R&D 등 실제 채용 중인 직군 수",
      descId: "Jumlah bidang posisi yang sedang dibuka untuk peluncuran operasional lokal",
      descEn: "Active job categories recruiting for local operations launch"
    },
    {
      id: "m2",
      numberKo: "5개",
      numberId: "5 Kategori",
      numberEn: "5 Categories",
      labelKo: "푸드 카테고리",
      labelId: "Kategori Kuliner",
      labelEn: "Food Categories",
      badgeKo: "목표·예정",
      badgeId: "Rencana",
      badgeEn: "Planned",
      descKo: "치킨, 한식, 피자·버거·샌드위치, 샐러드, 음료·디저트 5대 핵심 카테고리",
      descId: "Ayam, Korea, Pizza·Burger·Sandwich, Salad, dan Minuman·Dessert",
      descEn: "Chicken, Korean, Pizza/Burger/Sandwich, Salad, Beverage & Dessert"
    },
    {
      id: "m3",
      numberKo: "32개",
      numberId: "32 Brand",
      numberEn: "32 Brands",
      labelKo: "자체 브랜드 (30여 개 / 32개)",
      labelId: "Brand Internal (30+ / 32)",
      labelEn: "In-House Brands (30+ / 32)",
      badgeKo: "목표·예정",
      badgeId: "Target Rencana",
      badgeEn: "Target Plan",
      descKo: "한 곳에서 만나는 카테고리별 독자 기획 자체 F&B 브랜드 라인업 (계획 기준)",
      descId: "Lini brand F&B independen yang terintegrasi dalam satu food court online",
      descEn: "Proprietary F&B brands integrated into one online food court"
    },
    {
      id: "m4",
      numberKo: "5개",
      numberId: "5 Genre",
      numberEn: "5 Genres",
      labelKo: "요리 장르",
      labelId: "Genre Masakan",
      labelEn: "Culinary Genres",
      badgeKo: "목표·예정",
      badgeId: "Rencana R&D",
      badgeEn: "R&D Plan",
      descKo: "한식, 중식, 일식, 인도네시아, 양식을 아우르는 폭넓은 메뉴 R&D 스펙트럼",
      descId: "Pengembangan menu lintas masakan Korea, Tiongkok, Jepang, Indonesia, dan Barat",
      descEn: "Menu R&D spanning Korean, Chinese, Japanese, Indonesian, and Western cuisines"
    },
    {
      id: "m5",
      numberKo: "100개+",
      numberId: "100+ Cabang",
      numberEn: "100+ Locations",
      labelKo: "확장 목표 지점",
      labelId: "Target Ekspansi Gerai",
      labelEn: "Target Store Expansion",
      badgeKo: "목표 (필수표기)",
      badgeId: "Target Bisnis",
      badgeEn: "Target Goal",
      descKo: "인도네시아 주요 도시 거점을 중심으로 한 중장기 지점 확장 사업 계획 목표",
      descId: "Target rencana ekspansi jangka menengah-panjang di kota-kota utama Indonesia",
      descEn: "Mid-to-long-term store expansion target across major Indonesian cities"
    },
    {
      id: "m6",
      numberKo: "[ ] 예정",
      numberId: "Segera [ ]",
      numberEn: "TBA [ ]",
      labelKo: "1호점 오픈 예정",
      labelId: "Rencana Pembukaan Gerai 1",
      labelEn: "1st Flagship Store Opening",
      badgeKo: "오픈 예정",
      badgeId: "Segera Hadir",
      badgeEn: "Upcoming",
      descKo: "자카르타 1호 스마트 푸드코트 거점 오픈 예정 (일정 확정 후 공지 예정)",
      descId: "Pembukaan gerai pertama MUGGO di Jakarta (Jadwal diumumkan segera)",
      descEn: "First flagship smart food court opening in Jakarta (Date TBA)"
    }
  ],

  // 3-⑦ 소식 (Related Articles) - 인사 담당자 수정 영역, 항목 0개 시 섹션 자동 숨김!
  articles: [
    {
      id: "art-1",
      date: "2026.10.25",
      categoryKo: "채용·인사",
      categoryId: "Karir & HR",
      categoryEn: "Careers",
      titleKo: "MUGGO 인도네시아 법인 1기 신입 및 경력 공개 채용 안내 (11개 직군)",
      titleId: "Rekrutmen Terbuka Batch 1 MUGGO Indonesia untuk 11 Bidang Posisi",
      titleEn: "MUGGO Indonesia 1st Batch Open Recruitment Across 11 Job Categories",
      summaryKo: "인도네시아 외식 시장을 혁신할 온라인 푸드코트 몰 MUGGO에서 1호점 오픈을 함께할 11개 직군의 창립 멤버를 모집합니다.",
      summaryId: "Bergabunglah bersama tim pendiri MUGGO untuk membangun masa depan food court online di Indonesia.",
      summaryEn: "Join MUGGO's founding team in Indonesia across 11 key roles from culinary operations to digital platform management.",
      contentKo: "MUGGO 인도네시아 법인이 1호점 오픈 및 온라인 푸드코트 몰 런칭을 앞두고 11개 핵심 직군에서 창립 멤버를 모집합니다.\n\n모집 분야는 주방·조리(Kitchen), 메뉴 R&D, 매장 운영(Store Operations), 품질·위생 관리(QA/QC), 구매·물류(SCM), 디지털 마케팅, 브랜드 디자인, 플랫폼 운영, 고객 경험(CX), 인사·총무(HR/GA), 재무·회계 등 총 11개 직군입니다.\n\n착한 인성과 성실함, 그리고 일에 대한 진심 어린 열정을 가진 분들의 많은 지원을 기다립니다. 지원서는 채용 페이지에 안내된 이메일(barasustainable@gmail.com)을 통해 접수하실 수 있습니다.",
      contentId: "MUGGO Indonesia membuka rekrutmen perdana untuk 11 bidang posisi strategis menjelang peluncuran gerai pertama dan platform food court online kami.\n\nKami mencari rekan kerja dengan karakter yang baik, ketekunan, dan semangat tulus terhadap pekerjaan. Kirimkan CV dan lamaran Anda ke barasustainable@gmail.com.",
      contentEn: "MUGGO Indonesia is recruiting founding team members across 11 strategic positions ahead of our 1st store and online food court launch. Send your application to barasustainable@gmail.com.",
      thumbColor: "linear-gradient(135deg, #E84A27 0%, #9A3412 100%)",
      thumbLabel: "RECRUITMENT · 11 ROLES"
    },
    {
      id: "art-2",
      date: "2026.10.18",
      categoryKo: "브랜드·R&D",
      categoryId: "Brand & R&D",
      categoryEn: "Brand & R&D",
      titleKo: "5대 푸드 카테고리·30여 개 자체 브랜드 메뉴 R&D 라인업 구축 소식",
      titleId: "Pengembangan Lini 30+ Brand Internal dalam 5 Kategori Kuliner Utama",
      titleEn: "Building 30+ Proprietary Brands Across 5 Core Culinary Categories",
      summaryKo: "치킨, 한식, 피자·버거·샌드위치, 샐러드, 음료·디저트까지 한 번의 주문으로 즐길 수 있는 멀티 브랜드 R&D를 진행하고 있습니다.",
      summaryId: "Menghadirkan pengalaman pesan-antar multi-brand mulai dari ayam goreng, masakan Korea, hingga dessert dalam satu pesanan.",
      summaryEn: "Developing a multi-brand lineup from crispy chicken and Korean cuisine to artisan salads and desserts.",
      contentKo: "MUGGO는 한식, 중식, 일식, 인도네시아 현지식, 양식 등 5대 요리 장르를 아우르는 메뉴 R&D를 통해 총 5개 푸드 카테고리(치킨, 한식, 피자·버거·샌드위치, 샐러드, 음료·디저트) 산하 30여 개 자체 브랜드를 준비하고 있습니다.\n\n각 브랜드는 딜리버리와 픽업 환경에서도 최상의 맛과 온도를 유지할 수 있도록 표준화된 조리 매뉴얼과 패키징 솔루션을 적용합니다.",
      contentId: "Melalui riset menu di 5 genre masakan (Korea, Tiongkok, Jepang, Indonesia, Barat), MUGGO menyiapkan lebih dari 30 brand internal yang dirancang khusus untuk layanan delivery dan pickup yang cepat dan berkualitas.",
      contentEn: "Through R&D across 5 culinary genres, MUGGO is preparing over 30 in-house brands optimized for delivery and pickup.",
      thumbColor: "linear-gradient(135deg, #18181B 0%, #3F3F46 100%)",
      thumbLabel: "FOOD R&D · 5 GENRES"
    },
    {
      id: "art-3",
      date: "2026.10.10",
      categoryKo: "플랫폼 비전",
      categoryId: "Visi Platform",
      categoryEn: "Platform Vision",
      titleKo: "딜리버리·픽업 중심 차세대 온라인 푸드코트 몰 및 자체 앱 준비 안내",
      titleId: "Persiapan Mall Food Court Online & Aplikasi Delivery Mandiri MUGGO",
      titleEn: "Preparing Next-Gen Online Food Court Mall & Proprietary Delivery App",
      summaryKo: "서로 다른 브랜드의 메뉴를 한 장바구니에 담아 한 번에 받아보는 온라인 푸드코트 경험을 곧 선보입니다.",
      summaryId: "Nikmati kemudahan memesan berbagai menu dari puluhan brand berbeda dalam satu keranjang dan satu pengiriman.",
      summaryEn: "Order from multiple distinct food brands in a single cart with unified delivery.",
      contentKo: "기존 배달 플랫폼에서는 여러 브랜드의 음식을 동시에 주문하려면 각각 배달비를 내고 따로 받아야 했습니다.\n\nMUGGO 온라인 푸드코트 몰은 치킨, 떡볶이, 버거, 샐러드, 커피·디저트 등 30여 개 자체 브랜드의 메뉴를 단일 주문과 통합 포장으로 한 번에 제공하는 혁신적인 외식 플랫폼을 지향합니다. 현재 자체 배달 앱과 오프라인 픽업 거점 1호점 오픈을 차질 없이 준비하고 있습니다.",
      contentId: "Platform food court online MUGGO memungkinkan pelanggan menggabungkan pesanan dari puluhan brand kuliner ke dalam satu transaksi dan satu pengiriman terpadu.",
      contentEn: "MUGGO's online food court platform enables customers to combine orders across dozens of culinary brands in a single transaction.",
      thumbColor: "linear-gradient(135deg, #B45309 0%, #78350F 100%)",
      thumbLabel: "PLATFORM · FOOD COURT"
    }
  ],

  // 4. 브랜드 페이지 - 5대 카테고리별 대표 자체 브랜드 (총 32개 구성 중 카테고리별 대표 브랜드 & 라인업)
  brandCategories: [
    {
      id: "chicken",
      nameKo: "치킨 (Chicken)",
      nameId: "Ayam (Chicken)",
      nameEn: "Chicken",
      countLabel: "7개 자체 브랜드 (계획)",
      descKo: "바삭한 크리스피 치킨부터 한국식 양념·간장·마늘 치킨, 현지 삼발 풍미 치킨까지",
      descId: "Mulai dari ayam krispi klasik hingga saus bumbu Korea dan cita rasa lokal",
      brands: [
        { code: "CH-01", name: "MUGGO CRISPY LAB", genre: "한식·양식", tagKo: "시그니처 크리스피 치킨", tagId: "Ayam Krispi Signature", color: "#EA580C" },
        { code: "CH-02", name: "SEOUL YANGNYEOM CLUB", genre: "한식", tagKo: "한국 정통 양념·간장 치킨", tagId: "Ayam Saus Korea Autentik", color: "#DC2626" },
        { code: "CH-03", name: "GARLIC & HONEY ROAST", genre: "한식·양식", tagKo: "허니 갈릭 오븐 & 순살 치킨", tagId: "Ayam Panggang Madu Bawang", color: "#D97706" },
        { code: "CH-04", name: "SAMBAL FIRE WINGS", genre: "인도네시아·퓨전", tagKo: "매콤 삼발 & 스파이시 윙", tagId: "Sayap Ayam Pedas Nusantara", color: "#B91C1C" },
        { code: "CH-05", name: "TOKYO KARAAGE BOX", genre: "일식", tagKo: "일식 가라아게 & 치킨 가츠", tagId: "Karaage & Katsu Jepang", color: "#B45309" },
        { code: "CH-06", name: "WOK CHILI CHICKEN", genre: "중식", tagKo: "중화풍 칠리 & 유린기 치킨", tagId: "Ayam Saus Cabai Oriental", color: "#991B1B" },
        { code: "CH-07", name: "TENDER BITE STUDIO", genre: "양식", tagKo: "프리미엄 텐더 & 디핑 플래터", tagId: "Chicken Tender & Saus Celup", color: "#C2410C" }
      ]
    },
    {
      id: "korean",
      nameKo: "한식 (Korean Food)",
      nameId: "Masakan Korea (K-Food)",
      nameEn: "Korean Cuisine",
      countLabel: "8개 자체 브랜드 (계획)",
      descKo: "떡볶이·김밥·비빔밥·김치찌개·불고기 덮밥 등 인도네시아 현지가 사랑하는 K-푸드",
      descId: "Tteokbokki, Kimbap, Bibimbap, hingga Bulgogi Rice Bowl favorit di Indonesia",
      brands: [
        { code: "KR-01", name: "RED POT TTEOKBOKKI", genre: "한식", tagKo: "국물 떡볶이 & 로제 떡볶이", tagId: "Tteokbokki Original & Rose", color: "#E11D48" },
        { code: "KR-02", name: "GIMBAP ATELIER", genre: "한식", tagKo: "프리미엄 수제 김밥 & 롤", tagId: "Kimbap Segar & Rice Roll", color: "#059669" },
        { code: "KR-03", name: "BIBIM BOWL HOUSE", genre: "한식", tagKo: "다채로운 나물 비빔밥 & 돌솥", tagId: "Bibimbap Sehat & Lezat", color: "#16A34A" },
        { code: "KR-04", name: "SEOUL GRILL BULGOGI", genre: "한식", tagKo: "직화 소불고기 & 닭갈비 덮밥", tagId: "Rice Bowl Bulgogi & Dakgalbi", color: "#7C2D12" },
        { code: "KR-05", name: "JJIGAE KITCHEN", genre: "한식", tagKo: "김치찌개·순두부찌개 1인 정식", tagId: "Sup Kimchi & Sundubu Hangat", color: "#BE123C" },
        { code: "KR-06", name: "K-STREET CORNDOG", genre: "한식", tagKo: "모짜렐라 핫도그 & 치즈볼", tagId: "Corndog Mozzarella & Cheese Ball", color: "#D97706" },
        { code: "KR-07", name: "NOODLE POCHA", genre: "한식·중식", tagKo: "K-짜장·짬뽕 & 라면 스페셜", tagId: "Mie Jajang & Ramyeon Korea", color: "#4338CA" },
        { code: "KR-08", name: "DOSIRAK EXPRESS", genre: "한식", tagKo: "든든한 프리미엄 한식 도시락", tagId: "Kotak Makan Siang Korea", color: "#0F766E" }
      ]
    },
    {
      id: "western",
      nameKo: "피자·버거·샌드위치",
      nameId: "Pizza · Burger · Sandwich",
      nameEn: "Pizza · Burger · Sandwich",
      countLabel: "7개 자체 브랜드 (계획)",
      descKo: "수제 스매시 버거, 1인~패밀리 아티산 피자, 그릴드 토스트와 프레시 샌드위치",
      descId: "Smash burger, pizza artisan, dan roti lapis panggang berkualitas",
      brands: [
        { code: "WB-01", name: "SMASH STACK BURGER", genre: "양식", tagKo: "더블 스매시 비프 & 치킨 버거", tagId: "Smash Burger Sapi & Ayam", color: "#B45309" },
        { code: "WB-02", name: "SLICE LAB PIZZA", genre: "양식", tagKo: "수제 도우 피자 & 하프앤하프", tagId: "Pizza Artisan & Half-Half", color: "#DC2626" },
        { code: "WB-03", name: "EGG DROP TOAST CLUB", genre: "한식·양식", tagKo: "스크램블 에그 브리오슈 토스트", tagId: "Roti Panggang Brioche Telur", color: "#F59E0B" },
        { code: "WB-04", name: "PANINI & MELT", genre: "양식", tagKo: "그릴드 치즈 파니니 & 클럽 샌드", tagId: "Panini Keju Panggang", color: "#65A30D" },
        { code: "WB-05", name: "PASTA IN A BOX", genre: "양식·일식", tagKo: "딜리버리 특화 파스타 & 리조또", tagId: "Pasta & Risotto Siap Antar", color: "#E11D48" },
        { code: "WB-06", name: "KATSU SANDO BAR", genre: "일식", tagKo: "두툼한 가츠산도 & 타마고산도", tagId: "Sando Katsu & Tamago Jepang", color: "#D97706" },
        { code: "WB-07", name: "LOADED FRIES CO.", genre: "양식", tagKo: "칠리 치즈 프라이 & 웨지 포테이토", tagId: "Kentang Goreng Saus Keju", color: "#CA8A04" }
      ]
    },
    {
      id: "salad",
      nameKo: "샐러드 (Salad & Healthy)",
      nameId: "Salad & Makanan Sehat",
      nameEn: "Salad & Healthy Bowls",
      countLabel: "4개 자체 브랜드 (계획)",
      descKo: "신선한 로컬 채소와 특제 드레싱, 하와이안 포케, 고단백 그릴 볼과 랩",
      descId: "Sayuran segar lokal, poke bowl, protein bowl, dan wrap sehat",
      brands: [
        { code: "SL-01", name: "GREEN BOWL GARDEN", genre: "양식", tagKo: "데일리 프레시 콥 & 시저 샐러드", tagId: "Salad Segar Harian & Dressing", color: "#15803D" },
        { code: "SL-02", name: "ALOHA POKE STUDIO", genre: "양식·일식", tagKo: "연어·튜나·두부 하와이안 포케 볼", tagId: "Poke Bowl Salmon & Tuna", color: "#0D9488" },
        { code: "SL-03", name: "PROTEIN FIT KITCHEN", genre: "양식·인도네시아", tagKo: "수비드 닭가슴살 & 로스트 비프 볼", tagId: "Menu Tinggi Protein & Sehat", color: "#047857" },
        { code: "SL-04", name: "FRESH WRAP ROLL", genre: "양식", tagKo: "통밀 또띠아 샐러드 랩 & 주스", tagId: "Salad Wrap Gandum Utuh", color: "#65A30D" }
      ]
    },
    {
      id: "dessert",
      nameKo: "음료·디저트 (Beverage & Dessert)",
      nameId: "Minuman & Dessert",
      nameEn: "Beverage & Dessert",
      countLabel: "6개 자체 브랜드 (계획)",
      descKo: "스페셜티 커피, 트로피컬 과일 티, 브라운슈가 밀크티, 크로플과 케이크까지",
      descId: "Kopi spesialti, teh buah tropis, boba milk tea, croffle, dan kue manis",
      brands: [
        { code: "DS-01", name: "MUGGO ROASTERS", genre: "음료", tagKo: "인도네시아 원두 스페셜티 커피", tagId: "Kopi Spesialti Biji Nusantara", color: "#78350F" },
        { code: "DS-02", name: "TROPICAL TEA BAR", genre: "음료", tagKo: "망고·패션프루트 프레시 과일 티", tagId: "Teh Buah Segar Tropis", color: "#EA580C" },
        { code: "DS-03", name: "SEOUL CROFFLE & WAFFLE", genre: "디저트", tagKo: "겉바속촉 플레인·시나몬 크로플", tagId: "Croffle & Waffle Renyah", color: "#B45309" },
        { code: "DS-04", name: "BOBA MILK LAB", genre: "음료", tagKo: "흑당 버블 밀크티 & 말차 라떼", tagId: "Brown Sugar Boba & Matcha", color: "#92400E" },
        { code: "DS-05", name: "SNOW BINGSU HOUSE", genre: "디저트", tagKo: "우유 눈꽃 빙수 & 망고 빙수", tagId: "Bingsu Susu Lembut Korea", color: "#0284C7" },
        { code: "DS-06", name: "SWEET BOX BAKERY", genre: "디저트", tagKo: "티라미수·쿠키·조각 케이크", tagId: "Tiramisu, Kue, & Cookies", color: "#BE185D" }
      ]
    }
  ],

  // 4. 채용 페이지 - 모집 직군 11개 (제안요청서 3-⑤ 및 4번 사이트맵 반영, 인사 담당자 수정 가능)
  jobs: [
    {
      id: "job-1",
      titleKo: "1. 헤드 셰프 / 주방 총괄 (Head of Kitchen Operations)",
      titleId: "1. Head of Kitchen Operations (Kepala Dapur)",
      deptKo: "조리·주방",
      deptId: "Operasional Dapur",
      typeKo: "정규직 · 경력",
      typeId: "Full-time · Berpengalaman",
      location: "Jakarta, Indonesia",
      descKo: "멀티 브랜드 스마트 키친 조리 라인 총괄, 조리 표준화(SOP) 준수 및 주방 팀 리딩",
      descId: "Memimpin operasional dapur multi-brand, menjaga standar SOP memasak, dan mengelola tim dapur."
    },
    {
      id: "job-2",
      titleKo: "2. 멀티 브랜드 조리사 / 쿡 (Multi-Brand Line Cook)",
      titleId: "2. Multi-Brand Line Cook (Juru Masak)",
      deptKo: "조리·주방",
      deptId: "Operasional Dapur",
      typeKo: "정규직 · 신입/경력",
      typeId: "Full-time · Fresh Grad / Berpengalaman",
      location: "Jakarta, Indonesia",
      descKo: "한식·양식·일식·중식·인도네시아식 카테고리별 표준 레시피 조리 및 플레이팅/패키징",
      descId: "Memasak menu sesuai resep standar di 5 kategori kuliner dan memastikan kualitas kemasan."
    },
    {
      id: "job-3",
      titleKo: "3. 메뉴 R&D 전문가 (Food R&D Specialist)",
      titleId: "3. Food R&D Specialist (Pengembangan Menu)",
      deptKo: "푸드·R&D",
      deptId: "Food & R&D",
      typeKo: "정규직 · 경력",
      typeId: "Full-time · Berpengalaman",
      location: "Jakarta, Indonesia",
      descKo: "5대 요리 장르 신메뉴 개발, 현지 식자재 소싱 테스트, 딜리버리 최적화 레시피 연구",
      descId: "Mengembangkan menu baru di 5 genre masakan dan mengoptimalkan resep untuk layanan pesan-antar."
    },
    {
      id: "job-4",
      titleKo: "4. 매장 운영 매니저 (Store Operations Manager)",
      titleId: "4. Store Operations Manager (Manajer Operasional Gerai)",
      deptKo: "매장 운영",
      deptId: "Operasional Gerai",
      typeKo: "정규직 · 경력",
      typeId: "Full-time · Berpengalaman",
      location: "Jakarta, Indonesia",
      descKo: "1호점 및 신규 거점 매장 운영 총괄, 피크타임 주문 흐름 제어, 픽업·배달 라이더 동선 관리",
      descId: "Mengelola operasional harian gerai pertama, alur pesanan, serta koordinasi pickup & kurir."
    },
    {
      id: "job-5",
      titleKo: "5. 품질·위생 관리 담당자 (QA / Hygiene & Halal Coordinator)",
      titleId: "5. QA / Hygiene & Halal Coordinator",
      deptKo: "품질·위생",
      deptId: "Kualitas & Higienitas",
      typeKo: "정규직 · 경력",
      typeId: "Full-time · Berpengalaman",
      location: "Jakarta, Indonesia",
      descKo: "식자재 및 조리 공정 위생 점검, 식품 안전 기준 관리 및 현지 인증 프로세스 대응",
      descId: "Memastikan standar keamanan pangan, kebersihan dapur, dan kepatuhan regulasi lokal."
    },
    {
      id: "job-6",
      titleKo: "6. 식자재 구매·물류 담당자 (SCM & Procurement Specialist)",
      titleId: "6. SCM & Procurement Specialist (Pembelian & Logistik)",
      deptKo: "구매·물류",
      deptId: "SCM & Pengadaan",
      typeKo: "정규직 · 경력",
      typeId: "Full-time · Berpengalaman",
      location: "Jakarta, Indonesia",
      descKo: "30여 개 브랜드 식자재 및 패키징 공급망 구축, 원가 관리 및 재고 최적화",
      descId: "Mengelola pengadaan bahan baku dan kemasan untuk 30+ brand serta pengendalian stok."
    },
    {
      id: "job-7",
      titleKo: "7. SNS·디지털 마케터 (Digital & Social Media Marketer)",
      titleId: "7. Digital & Social Media Marketer (Instagram & TikTok)",
      deptKo: "마케팅",
      deptId: "Pemasaran Digital",
      typeKo: "정규직 · 신입/경력",
      typeId: "Full-time · Fresh Grad / Berpengalaman",
      location: "Jakarta, Indonesia",
      descKo: "인스타그램(@muggo.indonesia) 및 틱톡(@muggo1) 숏폼 콘텐츠 기획, 현지 인플루언서 협업",
      descId: "Mengelola konten kreatif Instagram & TikTok serta kampanye pemasaran digital lokal."
    },
    {
      id: "job-8",
      titleKo: "8. 브랜드·콘텐츠 디자이너 (Brand & Visual Designer)",
      titleId: "8. Brand & Visual Designer (Desainer Grafis & Brand)",
      deptKo: "디자인",
      deptId: "Desain Kreatif",
      typeKo: "정규직 · 경력",
      typeId: "Full-time · Berpengalaman",
      location: "Jakarta, Indonesia",
      descKo: "자체 브랜드 패키지, 온라인 푸드코트 몰 배너, 메뉴 비주얼 에셋 디자인",
      descId: "Merancang identitas visual brand, kemasan makanan, dan materi promosi digital."
    },
    {
      id: "job-9",
      titleKo: "9. 플랫폼·이커머스 운영 담당자 (Platform & Delivery App Ops)",
      titleId: "9. Platform & Delivery App Operations Specialist",
      deptKo: "플랫폼",
      deptId: "Operasional Platform",
      typeKo: "정규직 · 경력",
      typeId: "Full-time · Berpengalaman",
      location: "Jakarta, Indonesia",
      descKo: "온라인 푸드코트 몰 및 자체 배달 앱 메뉴 구성, 프로모션 운영, 배달 플랫폼 연동 관리",
      descId: "Mengelola katalog menu di platform online, promosi aplikasi, dan integrasi pengiriman."
    },
    {
      id: "job-10",
      titleKo: "10. 인사·총무 담당자 (HR & General Affairs Specialist)",
      titleId: "10. HR & General Affairs Specialist (SDM & Umum)",
      deptKo: "인사·경영지원",
      deptId: "HR & GA",
      typeKo: "정규직 · 경력",
      typeId: "Full-time · Berpengalaman",
      location: "Jakarta, Indonesia",
      descKo: "현지 인재 채용 공고 운영, 조직문화 구축, 노무·인사 행정 및 사이트 소식 관리",
      descId: "Mengelola rekrutmen talenta, budaya kerja perusahaan, administrasi HR, dan berita korporat."
    },
    {
      id: "job-11",
      titleKo: "11. 재무·회계 담당자 (Finance & Accounting Specialist)",
      titleId: "11. Finance & Accounting Specialist (Keuangan & Akuntansi)",
      deptKo: "재무·회계",
      deptId: "Keuangan & Akuntansi",
      typeKo: "정규직 · 경력",
      typeId: "Full-time · Berpengalaman",
      location: "Jakarta, Indonesia",
      descKo: "인도네시아 법인 결산, 세무 대응, 매장 및 플랫폼 정산 관리",
      descId: "Mengelola pembukuan korporat, perpajakan lokal, dan rekonsiliasi transaksi."
    }
  ],

  // 3-⑧ 수치 안내 각주 (접었다 펴는 형태 4개 항목)
  footnotes: [
    {
      id: "fn-1",
      titleKo: "1. 사업 계획 및 목표 수치 안내",
      titleId: "1. Catatan Target Rencana Bisnis",
      descKo: "본 사이트에 기재된 모든 숫자는 오픈 전 법인의 사업 계획상 목표 및 예정 수치이며, 현지 시장 상황 및 사업 추진 일정에 따라 변동될 수 있습니다.",
      descId: "Seluruh angka yang ditampilkan di situs ini merupakan target rencana bisnis pra-peluncuran dan dapat berubah sesuai perkembangan operasional."
    },
    {
      id: "fn-2",
      titleKo: "2. 자체 브랜드 수 및 확장 지점 수 기준",
      titleId: "2. Dasar Perhitungan Jumlah Brand & Cabang",
      descKo: "자체 브랜드 수(30여 개 / 32개)와 확장 목표 지점 수(100개 이상)는 단계별 런칭 로드맵을 포함한 계획 기준이며, 현재 운영 실적을 의미하지 않습니다.",
      descId: "Jumlah brand internal (30+ / 32) dan target ekspansi gerai (100+ cabang) merupakan target perencanaan bertahap, bukan klaim kinerja historis."
    },
    {
      id: "fn-3",
      titleKo: "3. 채용 직군 및 1호점 오픈 일정 안내",
      titleId: "3. Informasi Rekrutmen & Jadwal Gerai Pertama",
      descKo: "모집 직군 11개는 1호점 및 본부 구성을 위해 채용 진행·예정인 분야 기준이며, 1호점 오픈 예정일은 확정 시 공식 소식란을 통해 안내됩니다.",
      descId: "11 bidang rekrutmen adalah posisi yang sedang/akan dibuka untuk peluncuran gerai pertama. Tanggal resmi pembukaan akan diumumkan kemudian."
    },
    {
      id: "fn-4",
      titleKo: "4. 사이트 운영 목적 고지",
      titleId: "4. Tujuan Informasi Umum Situs",
      descKo: "본 웹사이트는 인도네시아 현지 고객, 구직자, 파트너에게 법인의 비전과 브랜드, 채용에 관한 일반 정보를 제공할 목적으로 제작되었습니다.",
      descId: "Situs web ini dibuat semata-mata untuk memberikan informasi umum mengenai visi, brand, dan karir perusahaan kepada pelanggan, pelamar, dan mitra."
    }
  ],

  // 6. 최종 이미지 목록표 (착수 단계 제출 필수 규격서 데이터)
  imageSpecSheet: [
    {
      no: "01",
      name: "로고 2종 (밝은 배경용 / 어두운 배경용)",
      location: "헤더(스크롤 전/후), 푸터, 모바일 드로어",
      purpose: "법인/브랜드 공식 아이덴티티 표기",
      device: "PC / 모바일 공통",
      ratio: "가로형 (약 4.2 : 1)",
      pixelSize: "220 × 52 px (벡터 기준)",
      format: "SVG 권장 (폴백 PNG 440×104px @2x)",
      maxWeight: "15KB 이하",
      assetPath: "assets/logo-light-bg.svg, assets/logo-dark-bg.svg"
    },
    {
      no: "02-A",
      name: "히어로 대표 이미지 (모바일 세로형)",
      location: "홈 맨 위 첫 화면 (모바일 뷰포트 ≤768px)",
      purpose: "모바일 첫 인상 및 다양한 푸드코트 메뉴 시각화",
      device: "모바일 전용 (세로형)",
      ratio: "4 : 5 또는 9 : 16",
      pixelSize: "1080 × 1350 px (또는 1080 × 1920 px)",
      format: "WebP / AVIF (원본 JPG 전달 시 개발자 경량화)",
      maxWeight: "120KB 이하 (4G 고속 로딩 기준)",
      assetPath: "assets/hero-mobile.webp"
    },
    {
      no: "02-B",
      name: "히어로 대표 이미지 (PC 가로형)",
      location: "홈 맨 위 첫 화면 (데스크톱 뷰포트 >768px)",
      purpose: "와이드 화면에서 온라인 푸드코트 몰 스케일 전달",
      device: "PC 전용 (가로형)",
      ratio: "16 : 9",
      pixelSize: "1920 × 1080 px",
      format: "WebP / AVIF (원본 JPG/PNG 전달)",
      maxWeight: "200KB 이하",
      assetPath: "assets/hero-desktop.webp"
    },
    {
      no: "03",
      name: "핵심 축 아이콘 4개 (Our Pillars)",
      location: "홈 3번째 섹션 (브랜드 / 푸드·R&D / 플랫폼 / 사람 카드)",
      purpose: "4대 핵심 영역 직관적 상징 (동일 선 굵기·컬러 스타일 통일)",
      device: "PC / 모바일 공통",
      ratio: "1 : 1 정방형",
      pixelSize: "64 × 64 px (벡터 기준)",
      format: "SVG 필수 (듀오톤 또는 라인형 통일)",
      maxWeight: "5KB 이하 / 개당",
      assetPath: "assets/icon-pillar-1~4.svg"
    },
    {
      no: "04",
      name: "브랜드 이미지 (카테고리별·브랜드별)",
      location: "브랜드 페이지 그리드, 홈 카테고리 하이라이트",
      purpose: "치킨·한식·피자/버거·샐러드·디저트 30~32개 브랜드 대표 메뉴/로고",
      device: "PC / 모바일 공통 (반응형 썸네일)",
      ratio: "4 : 3 (메뉴 사진) / 1 : 1 (브랜드 심볼)",
      pixelSize: "800 × 600 px (메뉴) / 400 × 400 px (로고)",
      format: "WebP (원본 JPG/PNG 전달 시 모바일 최적화)",
      maxWeight: "80KB 이하 / 개당 (Lazy-loading 적용)",
      assetPath: "assets/brands/[code].webp"
    },
    {
      no: "05",
      name: "조직문화 대표 이미지 (Our Culture)",
      location: "홈 6번째 조직문화 섹션, 사람(People) 페이지 상단",
      purpose: "성실함과 열정, 서로 존중하는 동료·팀 분위기 전달",
      device: "모바일 (4:3) / PC (16:9 또는 3:2)",
      ratio: "3 : 2 (또는 모바일 4:3 크롭 대응)",
      pixelSize: "1440 × 960 px (모바일 960 × 720 px)",
      format: "WebP (원본 JPG 전달)",
      maxWeight: "150KB 이하",
      assetPath: "assets/culture-main.webp"
    },
    {
      no: "06",
      name: "소식 썸네일 (초기 2~3개)",
      location: "홈 7번째 소식(Related Articles) 카드 및 소식 상세 상단",
      purpose: "법인 소식 및 채용 공지 아티클 대표 이미지",
      device: "PC / 모바일 공통",
      ratio: "16 : 10 (또는 16 : 9)",
      pixelSize: "800 × 500 px",
      format: "WebP / JPG",
      maxWeight: "70KB 이하 / 개당",
      assetPath: "assets/news/thumb-1~3.webp"
    },
    {
      no: "07",
      name: "WhatsApp / SNS 공유 미리보기 이미지 (OG Image)",
      location: "WhatsApp, Instagram DM, 링크 공유 시 미리보기 카드",
      purpose: "인도네시아 현지 메신저 링크 공유 시 브랜드 신뢰도 확보",
      device: "모바일 메신저 / SNS 공통",
      ratio: "1.91 : 1 (Open Graph 표준)",
      pixelSize: "1200 × 630 px (중요 텍스트 중앙 80% 안전 영역 내 배치)",
      format: "JPG / PNG (WhatsApp 호환성을 위해 300KB 미만 필수)",
      maxWeight: "250KB 이하",
      assetPath: "assets/og-preview.svg (배포 시 og-preview.jpg 변환 제공)"
    },
    {
      no: "08",
      name: "파비콘 (Favicon & App Icon)",
      location: "브라우저 탭, 모바일 홈 화면 추가 아이콘",
      purpose: "MUGGO 심볼(M) 인지",
      device: "PC / 모바일 브라우저",
      ratio: "1 : 1 정방형",
      pixelSize: "64 × 64 px (SVG) / 180 × 180 px (Apple Touch Icon)",
      format: "SVG / PNG / ICO",
      maxWeight: "10KB 이하",
      assetPath: "assets/favicon.svg"
    }
  ]
};
