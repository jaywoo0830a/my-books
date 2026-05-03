# 느린 책방을 짓다

라라벨을 지나온 PHP 개발자를 위한 100쪽짜리 심포니 8.0 안내서.
하나의 자기완결적인 HTML 파일과, 같은 내용의 A4 100면 PDF를 만든다.

## 결과물

- `book.html` — 단일 자기완결 HTML 파일. Noto Sans KR과 Roboto Mono를
  Google Fonts로 부르고, 다이어그램은 base64 PNG로 임베드되어 있다.
  이 한 파일만 있으면 책이 보인다.
- `dist/slow-bookstore.pdf` — A4 100면 인쇄본.

## 다이어그램 12장

| 종류     | 파일                       | 내용                       |
| -------- | -------------------------- | -------------------------- |
| class    | class-kernel               | HttpKernel과 주변 사물들   |
| sequence | seq-request                | HTTP 요청의 일생           |
| class    | class-product              | Product · Category · Image |
| ER       | er-catalog                 | 카탈로그 테이블            |
| class    | class-cart                 | Cart · CartItem · Factory  |
| state    | state-cart                 | 장바구니의 상태            |
| class    | class-security             | User · Voter · Firewall    |
| sequence | seq-password-reset         | 비밀번호 재설정            |
| class    | class-order                | Order · Payment · Address  |
| ER       | er-order                   | 주문 테이블                |
| state    | state-order                | 주문의 상태                |
| sequence | seq-checkout               | 체크아웃 다단계            |

## 짓는 법

```bash
npm install
npx playwright install chromium
npm run all
```

`npm run all`은 셋을 차례로 한다.

1. `npm run build` — `diagrams/*.mmd`을 PNG로 그리고, `htmlasitis.css`와
   다이어그램을 `src/book.html`에 인라인하여 `book.html`을 만든다.
2. `npm run inspect` — 100개의 `.hai-page` 섹션 중 단 하나라도
   넘쳐서 잘린 곳이 있는지 헤드리스 Chromium으로 측정한다.
3. `npm run pdf` — `book.html`을 A4 PDF로 인쇄하고 페이지 수를 검증한다.

## 디렉터리

```
my-books/
├── src/book.html                # 편집하는 본문
├── diagrams/*.mmd               # Mermaid 다이어그램 12장
├── scripts/                     # 빌드·인쇄·검증 스크립트
├── book.html                    # 빌드 산출물 (단일 HTML)
└── dist/
    ├── slow-bookstore.pdf
    └── previews/                # 페이지별 미리보기 PNG
```

## 메모

- htmlasitis는 `.hai-page` 한 섹션을 정확히 A4 한 면으로 강제한다.
  내용이 넘치면 잘리고, 그 사실은 `npm run inspect`가 알려준다.
- Mermaid는 클라이언트 SVG가 아니라 `mermaid-cli`로 사전에 PNG로 굽는다
  (3배 스케일, 1400px 폭). 인쇄에서 안정적이다.
- 본문 글꼴은 CSS 변수 `--hai-font-body`, 코드 글꼴은 `--hai-font-mono`로
  교체할 수 있다. Google Fonts 링크는 `<head>`에 그대로 두었다.
