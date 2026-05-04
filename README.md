# my-books

라라벨을 지나온 PHP 개발자를 위한 심포니 8.0 안내서 두 권. 각 권은 **단일 HTML 파일** 한 개로, 빌드도 의존성도 없습니다.

## 두 권의 책

### `book.html` — 느린 책방을 짓다 · 100면

이커머스 한 채를 처음부터 끝까지 짓는 본권. 카탈로그 · 장바구니 · 인증 · 주문 · 관리자 · 운영의 6 도메인을 단일 코드베이스에서 다룬다. 12장의 다이어그램(class · sequence · ER · state) 포함.

### `quickstart.html` — 심포니 8로 쇼핑몰 만들기 · 39면

심포니 핵심 컴포넌트 11개(Doctrine · Forms · Validation · Security · Session · Cache · Logging · Error Pages · Console · Notifier · Testing)를 작은 쇼핑몰 한 프로젝트로 빠르게 익힌다.

## 보기

브라우저로 파일을 직접 열거나, jsDelivr CDN으로 접근합니다.

```
https://cdn.jsdelivr.net/gh/jaywoo0830a/my-books@main/book.html
https://cdn.jsdelivr.net/gh/jaywoo0830a/my-books@main/quickstart.html
```

태그를 푸시하면 영구 URL이 생깁니다 (`@v1.0.0` 같은 형태).

## 인쇄 (PDF)

1. 브라우저로 파일을 연다.
2. 다이어그램이 모두 그려질 때까지 1~2초 기다린다.
3. `Cmd+P` (또는 `Ctrl+P`) → 대상: \"PDF로 저장\".
4. **\"머리글 및 바닥글\" 끄기** (htmlasitis가 자체 페이지 번호를 그림).
5. 여백은 어떤 값이든 무방.

## 편집

각 HTML 파일을 직접 수정합니다. 다이어그램은 `<div class=\"mermaid\">` 블록 안의 텍스트로 들어 있어 그 자리를 수정하면 됩니다.

```html
<div class=\"hai-figure mermaid\">
classDiagram
  class HttpKernel {
    +handle(Request) Response
  }
  HttpKernel --> Router : asks
</div>
```

저장 후 브라우저에서 새로고침하면 즉시 반영됩니다.

## 의존하는 외부 자원

브라우저가 첫 열기 시점에 받아 캐시합니다. 이후로는 오프라인에서도 동작합니다.

| 자원 | URL |
| --- | --- |
| 본문 글꼴 | Google Fonts — Noto Sans KR |
| 코드 글꼴 | Google Fonts — Roboto Mono |
| 인쇄 CSS | jsDelivr — `htmlasitis@0.1.0` |
| 다이어그램 | jsDelivr — `mermaid@11` (ESM) |

## 라이선스

MIT.
