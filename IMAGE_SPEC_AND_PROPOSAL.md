# Image Specification Sheet (전달용 최종 이미지 규격표)

본 문서는 디렉터님 및 오너분께 전달하는 **전체 웹사이트 이미지 슬롯 규격표(Image Specification Sheet)**입니다.
공개 웹사이트 화면 및 푸터에서는 본 규격표에 접근할 수 없도록 완전히 분리되었습니다.

---

## 1. 전체 이미지 슬롯 규격표 (기존 슬롯 + 신규 추가 7개 영역 슬롯)

| 번호 | 이미지 항목 (Item) | 사용 위치 (Location) | 용도 (Use) | 기기 구분 (Device) | 권장 비율 및 픽셀 크기 (Ratio / Size) | 권장 포맷 및 목표 용량 (Format / Size Limit) | 프로젝트 내 슬롯 경로 (Slot Path) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | **로고 (밝은 배경 / 어두운 배경)** | Header, Footer, Mobile Drawer | 브랜드 로고 및 아이덴티티 표기 | Mobile / Desktop 공통 | `230 × 52 px` · `192 × 192 px` | SVG / PNG (`≤ 15 KB`) | `assets/logo-light-bg.svg`, `assets/logo-dark-bg.svg`, `assets/icon-192.png` |
| **02** | **홈 히어로 대표 이미지 (Hero Visual)** | Home (첫 화면 상단) | 메인 히어로 비주얼 (`eager` 로딩) | Mobile (`4:5`) / Desktop (`16:9` 또는 `4:3`) | `1080 × 1350 px` (모바일) / `1920 × 1080 px` (PC) | WebP / JPG (`≤ 150 KB`) | `assets/muggo-brand-hero.jpg` |
| **03** | **핵심 축 아이콘 4종 (Pillar Icons)** | Home — Our Pillars (4 Cards) | Manusia / Food & R&D / Platform / Brand 아이콘 | Mobile / Desktop 공통 | `1 : 1` (`24 × 24 px` ~ `64 × 64 px`) | Inline SVG Stroke (`≤ 5 KB`) | Inline SVG (`scripts/app.js`) |
| **04** | **CEO / 리더십 포트레이트 (CEO Portrait)** | Home — CEO Message 블록 | 경영진 인사말 인물 사진 (**미제공 시 슬롯 자동 숨김**) | Mobile / Desktop 공통 | **`1 : 1` (`600 × 600 px`)** | WebP / JPG (`≤ 80 KB`) | `site.config.js` → `ceoPortraitUrl` (비어 있으면 숨김) |
| **05** | **공지/소식 카드 썸네일 3종 (News Thumbnails)** | Home — News Cards (3개) 및 상세 상단 | 각 공지/소식 카드 상단 대표 썸네일 | Mobile / Desktop 공통 | **`16 : 9` (`800 × 450 px`)** | WebP / JPG (`≤ 70 KB`) | `assets/slots/news-1.jpg` ~ `news-3.jpg` |
| **06** | **30개 브랜드 썸네일 (Brand Thumbnails)** | Brand 페이지 (30개 카드), Home (6개 대표 카드) | 브랜드별 대표 심볼/메뉴 썸네일 | Mobile / Desktop 공통 | `1 : 1` (`400 × 400 px`) 또는 `4 : 3` (`800 × 600 px`) | WebP / JPG (`≤ 80 KB`) | `https://kind-euclid.vercel.app/images/brands/...` |
| **07** | **Food & R&D 5대 장르 카드 이미지 (5종)** | Food & R&D — 5 Genre Cards | 한식·중식/마라·일식/베이커리·인도네시아·양식 장르별 1장씩 (총 5장) | Mobile / Desktop 공통 | **`4 : 3` (`800 × 600 px`)** | WebP / JPG (**각 `≤ 80 KB`**) | `assets/slots/genre-1-korean.jpg` ~ `genre-5-western.jpg` |
| **08** | **Platform 주문 앱 폰 목업 (Phone Mockup)** | Platform — Ordering App 섹션 | 모바일 주문 앱 화면 및 단일 장바구니 UI 목업 | Mobile / Desktop 공통 | **`4 : 5` (`1080 × 1350 px`)** | WebP / JPG (**`≤ 150 KB`**) | `assets/slots/platform-app-mockup.jpg` |
| **09** | **Manusia (People) 팀/주방 이미지** | Manusia (People) 페이지 상단 | 팀워크·조직문화 및 센트럴 키친 현장 분위기 전달 | Mobile / Desktop 공통 | **`3 : 2` (`1440 × 960 px`)** | WebP / JPG (**`≤ 150 KB`**) | `assets/slots/people-team-kitchen.jpg` |
| **10-A** | **Karir (Careers) 상단 배너 — Desktop** | Karir (Careers) 페이지 상단 배너 | 11개 직군 공식 채용 안내 와이드 배너 | **Desktop (`≥ 768px`)** | **`16 : 9` (`1920 × 1080 px`)** | WebP / JPG (**`≤ 150 KB`**) | `assets/slots/careers-banner-desktop.jpg` |
| **10-B** | **Karir (Careers) 상단 배너 — Mobile** | Karir (Careers) 페이지 상단 배너 | 11개 직군 공식 채용 안내 모바일 세로형 배너 | **Mobile (`< 768px`)** | **`4 : 5` (`1080 × 1350 px`)** | WebP / JPG (**`≤ 150 KB`**) | `assets/slots/careers-banner-mobile.jpg` |
| **11** | **Kontak (Contact) 등록 주소 지도 이미지** | Kontak (Contact) — 등록 주소 영역 | 등록 주소 위치 안내 약도/지도 이미지 (Google Maps 열기 버튼 병행) | Mobile / Desktop 공통 | **`16 : 9` (`1200 × 675 px`)** | WebP / JPG (`≤ 100 KB`) | `assets/slots/contact-map.jpg` |
| **12** | **OG 링크 공유 미리보기 이미지** | 메신저 / SNS 링크 공유 시 미리보기 | 링크 공유 시 카드 썸네일 | Mobile / Desktop 공통 | `1.91 : 1` (`1200 × 630 px`) | JPG / PNG (`≤ 250 KB`) | `assets/muggo-brand-hero.jpg` |

---

## 2. 구현 및 기술 적용 기준 요약

1. **레이아웃 시프트 방지 (Zero CLS)**:
   - 모든 이미지 슬롯에 고정 화면 비율(`.ratio-4-3`, `.ratio-4-5`, `.ratio-3-2`, `.ratio-16-9`, `.ratio-1-1`, `.careers-banner-slot`)과 `width`·`height` 속성을 명시하여 이미지 로딩 전후 레이아웃 흔들림(CLS)이 발생하지 않습니다.
2. **지연 로딩 (`loading="lazy"`) 및 인도네시아어 대체 텍스트 (`alt`)**:
   - 첫 화면(Home Hero)을 제외한 모든 서브페이지 및 하단 슬롯에 `loading="lazy"`를 적용했으며, 모든 슬롯에 인도네시아어 기준의 명확한 `alt` 설명문을 부여했습니다.
3. **브랜드 팔레트 중립 플레이스홀더**:
   - 디렉터님의 실사 원본 이미지가 전달되기 전까지 민트/그린 브랜드 팔레트 톤앤매너에 맞춘 경량 플레이스홀더 이미지(`assets/slots/*.jpg`, 각 21~76KB)가 표시되며, 동일 파일명으로 원본 덮어쓰기 시 코드 수정 없이 즉시 교체됩니다.
