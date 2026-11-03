# Google Sheets 기반 소식(News) 및 채용 공고(Jobs) 운영 가이드

이 문서는 개발자가 아닌 담당자(HR·운영 담당자)가 코드를 수정하지 않고 웹사이트의 **소식/공지(News)** 및 **채용 공고(Jobs)**를 수정할 수 있도록 Google Sheets(CSV)를 설정하고 연동하는 방법을 안내합니다.

> **중요 (디렉터 결정 대기 사항)**
> - 누가 Google Sheet를 생성하고, 누구에게 공유하며, 누가 관리할지는 **디렉터(Director)의 결정 사항**입니다.
> - 디렉터의 결정 전까지 임의로 시트를 생성·공유하거나 `site.config.js`의 URL을 채워 넣지 마세요.
> - `site.config.js`의 `newsSheetCsvUrl`과 `jobsSheetCsvUrl`이 비어 있는(`""`) 동안에는 웹사이트가 저장소 내 기본 데이터(`data/site-data.js`)를 안전하게 표시합니다.

---

## 1. 관리 범위 구분 (HR 편집 가능 항목 vs 관리자 전용 항목)

- **Google Sheets에서 편집 가능한 항목 (HR 담당자용)**:
  1. **News 시트**: 홈 화면 소식/공지 카드 (`templates/news.csv` 기준)
  2. **Jobs 시트**: 채용 페이지(Karir) 모집 공고 목록 (`templates/jobs.csv` 기준)
- **`site.config.js`에서만 관리하는 항목 (관리자 전용 / Admin-only)**:
  - 법인명(`legalName`), 브랜드명(`brandName`), 등록 주소(`address`), 공식 이메일(`contactEmail`, `recruitmentEmail`), WhatsApp 번호(`whatsappNumber`), 소셜 미디어 링크(`instagramUrl`, `tiktokUrl`), 브랜드 수(`brandCount`), 각종 기능 스위치(`showKoreaHqBlock`, `languageSwitchVisible`, `showEmployeeDiscountBenefit`, `showCareerPathBenefit`)는 절대 시트에 넣지 않고 `site.config.js`에서만 관리합니다.

---

## 2. Google Sheets 생성 및 CSV 웹 게시 절차

디렉터가 시트 운영 담당자를 지정하면 아래 순서대로 진행합니다.

### 단계 1: 템플릿 CSV로 Google Sheet 생성
1. Google Drive에서 **새로 만들기 → Google 스프레드시트**를 엽니다 (소식용 시트 1개, 채용용 시트 1개를 각각 별도로 생성).
2. 상단 메뉴에서 **파일(File) → 가져오기(Import) → 업로드(Upload)**를 선택한 뒤, 레포지토리의 템플릿 파일을 각각 업로드합니다:
   - 소식(News) 시트: `templates/news.csv`
   - 채용(Jobs) 시트: `templates/jobs.csv`

### 단계 2: 첫 번째 행(헤더 행) 정확히 유지
시트의 **첫 번째 행(1행)** 컬럼 이름은 템플릿과 철자까지 **정확히 일치**해야 합니다(순서나 이름을 임의로 변경하지 마세요).

- **News 시트 1행 헤더**:
  `id,title,summary,status,date,imageUrl,visible`
  - `status`: `upcoming` 또는 `published` 입력 (`published`일 때만 `date`가 화면에 표시되며, `upcoming`일 때는 `Akan Datang` 라벨이 표시됨)
  - `date`: 선택 입력 (`YYYY-MM-DD` 형식, 예: `2026-10-25`)
  - `imageUrl`: 선택 입력 (`https://`로 시작하는 이미지 URL만 허용되며, 비워 두면 기본 슬롯 이미지가 표시됨)
  - `visible`: `TRUE`인 행만 웹사이트에 노출됨 (`FALSE`로 바꾸면 숨김 처리됨)
  - 글자 수 제한: `title` 최대 120자, `summary` 최대 300자

- **Jobs 시트 1행 헤더**:
  `id,title,department,employmentType,experience,location,description,requirements,visible`
  - `title`: 직무명 (지원자가 `Lamar` 버튼을 누르면 이 `title` 값이 지원서 초안의 지원 직무 및 이메일 제목 `Lamaran: <직무명>`에 자동 입력됨)
  - `visible`: `TRUE`인 행만 웹사이트에 노출됨 (`FALSE`로 바꾸면 마감/숨김 처리됨)
  - 글자 수 제한: `title` 최대 120자, `description` 최대 600자, `requirements` 최대 600자
  - 시트의 행(Row) 순서가 그대로 웹사이트 화면의 표시 순서가 됩니다.

### 단계 3: 각 시트를 CSV로 웹에 게시 (Publish to web)
1. Google 스프레드시트 상단 메뉴에서 **파일(File) → 공유(Share) → 웹에 게시(Publish to web)**를 클릭합니다.
2. 게시 대상 시트 탭을 선택하고, 파일 형식을 **`쉼표로 구분된 값(.csv)` / `Comma-separated values (.csv)`**로 선택합니다.
3. **게시(Publish)** 버튼을 누르고 생성된 `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv` 형식의 URL을 복사합니다.

### 단계 4: `site.config.js`에 URL 입력
복사한 두 개의 CSV 게시 URL을 관리자 설정 파일인 `site.config.js`에 입력합니다:

```js
newsSheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv",
jobsSheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv",
```

### 단계 5: 시트 편집 권한 공유
- Google 스프레드시트 우측 상단의 **공유(Share)** 버튼을 눌러, **디렉터(Director)가 승인한 담당자에게만 편집자(Editor) 권한**으로 시트를 공유합니다.
- 일반 방문자에게는 스프레드시트 편집 링크를 공유하지 마세요.

---

## 3. 보안 및 개인정보 주의사항 (필독)

1. **지원자 개인정보 절대 입력 금지**:
   - `웹에 게시(Publish to web)`된 시트의 데이터는 인터넷에 공개(Public)됩니다.
   - **입사 지원자의 이름, 전화번호, 이메일 주소, 이력서(CV), 평가 메모 등 개인정보를 절대 이 시트에 입력하거나 시트의 다른 탭에 보관하지 마세요.**
2. **안전한 텍스트 렌더링 및 자동 복구**:
   - 웹사이트는 시트의 모든 텍스트를 HTML이 아닌 순수 텍스트(`textContent`)로만 렌더링하므로 서식 코드나 스크립트는 실행되지 않습니다.
   - 만약 시트 URL이 비어 있거나, 일시적인 네트워크 오류가 발생하거나, `visible`이 `TRUE`인 행이 하나도 없을 경우 방문자에게 에러 화면을 보여주지 않고 자동으로 기본 데이터를 표시합니다.
