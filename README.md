# 느린 책방을 짓다

라라벨을 지나온 PHP 개발자를 위한 100쪽짜리 심포니 8.0 안내서.
**`book.html` 한 파일이 전부**입니다. 빌드도, 의존성도, 빌드 산출물도 없습니다.

## 보기

브라우저로 `book.html`을 열거나, 아래 CDN URL을 방문합니다.

```
https://cdn.jsdelivr.net/gh/jaywoo0830a/my-books@main/book.html
```

태그를 푸시하면 영구 URL이 생깁니다.

```
https://cdn.jsdelivr.net/gh/jaywoo0830a/my-books@v1.0.0/book.html
```

## 인쇄 (PDF)

1. 브라우저에서 `book.html`을 연다.
2. 다이어그램이 모두 그려질 때까지 잠깐 기다린다.
3. `Cmd+P` (또는 `Ctrl+P`) → 대상: \"PDF로 저장\".
4. **\"머리글 및 바닥글\"을 끈다** (htmlasitis가 자체 페이지 번호를 그림).
5. 여백은 어떤 값이든 무방 (htmlasitis가 자체 여백을 가짐).

## 편집

`book.html`을 열어 본문을 수정합니다. 다이어그램은 `<div class="mermaid">` 블록 안의 텍스트를 고치면 됩니다.

```html
<div class="hai-figure mermaid">
classDiagram
  class HttpKernel {
    +handle(Request) Response
  }
  HttpKernel --> Router : asks
</div>
```

저장하고 브라우저에서 새로고침하면 즉시 반영됩니다.

## 의존하는 외부 자원

브라우저가 첫 열기에 한 번 받아 캐싱합니다.

| 자원 | URL |
| --- | --- |
| 본문 글꼴 | Google Fonts — Noto Sans KR |
| 코드 글꼴 | Google Fonts — Roboto Mono |
| 인쇄 CSS | jsDelivr — `htmlasitis@0.1.0` |
| 다이어그램 | jsDelivr — `mermaid@11` (ESM) |

## 구성

| 부 | 페이지 | 주제 |
| --- | --- | --- |
| 1 | 5–12 | 두 풍경 — 라라벨↔심포니 매핑 |
| 2 | 13–22 | 빈 가게 — 셋업, HttpKernel, 컨트롤러 |
| 3 | 23–37 | 진열 — Doctrine, 카탈로그, 검색 |
| 4 | 38–49 | 장바구니 — 도메인 모델, 머지 |
| 5 | 50–61 | 사람과 자물쇠 — Security, Voter |
| 6 | 62–75 | 주문 — 다단계 폼, Workflow, Messenger |
| 7 | 76–83 | 관리자 — CRUD, 권한 분리 |
| 8 | 84–90 | 화면 — AssetMapper, Stimulus, Turbo |
| 9 | 91–98 | 운영 — 캐시, 로그, 테스트, 배포 |

12장의 Mermaid 다이어그램이 함께 들어 있습니다.

## 라이선스

MIT.
