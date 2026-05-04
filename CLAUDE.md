# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

- **개발 서버**: `yarn dev` (Turbopack 사용)
- **빌드**: `yarn build`
- **프로덕션 서버**: `yarn start`
- **린트**: `yarn lint`
- **포맷**: `yarn format` (`src/**/*.{js,jsx,ts,tsx,json,css,scss,md}`에 Prettier 적용)

테스트 러너는 구성되어 있지 않다. 새 기능을 추가할 때 사용자에게 확인하지 않고 테스트 프레임워크를 도입하지 말 것.

## 아키텍처 개요

Next.js 16 + React 19 기반의 App Router 블로그. 핵심 흐름은 **빌드 타임 정적 생성 + 클라이언트 무한 스크롤 + Supabase 방문자 추적**의 조합이다.

### 콘텐츠 파이프라인 (`src/lib/posts.ts`)

마크다운 처리는 단일 파일에 응집되어 있고 두 가지 진입점으로 나뉜다.

- `getAllPostsMetadata()`: frontmatter만 읽는 경량 경로. 1분 TTL 메모리 캐시(`postsMetadataCache`)를 사용. 홈 페이지, `/api/posts` 페이지네이션, `generateStaticParams`가 모두 이 함수를 거친다.
- `getPost(slug)`: 본문까지 처리하는 무거운 경로. **반드시 보안 검증을 통과해야 한다** — `VALIDATION_PATTERNS.SLUG`(`^[a-z0-9]+(?:-[a-z0-9]+)*$`) 매칭과 `path.resolve` 기반 경로 탈출 방어가 들어 있다. slug 검증 패턴이나 경로 검사를 건드릴 때는 두 보호 장치를 모두 유지할 것.

마크다운 → HTML 파이프라인 순서(이 순서가 중요하다):

1. `remark-gfm` — GFM 확장
2. `remarkHighlight` (커스텀) — `highlight.js`로 코드 블록을 미리 HTML로 변환하고 `highlightCache` Map에 캐싱. 노드 타입을 `code` → `html`로 바꾼다
3. `remark-rehype` (`allowDangerousHtml: true`) — 2단계에서 만든 raw HTML이 통과해야 하므로 필수
4. `rehypeHeadingIds` (커스텀) — 헤딩에 `encodeURIComponent`된 ID를 부여하면서 동시에 `h2`만 TOC 배열로 수집(다른 레벨 변경 시 `TableOfContents` 컴포넌트와의 계약을 깸)
5. `rehype-sanitize` — 허용 태그/속성 화이트리스트 적용. 새 마크다운 기능을 추가할 때 여기 화이트리스트를 갱신하지 않으면 조용히 제거된다. `clobberPrefix: ''`로 두어 `user-content-` 접두어가 붙지 않게 한다 (TOC 앵커가 깨지므로)
6. `rehype-stringify` (`allowDangerousHtml: false`) — 최종 직렬화

### 포스트 frontmatter

```
---
title: '제목'
date: 'YYYY-MM-DD'
tag: ['선택', '배열']
published: true   # 생략 시 true. false면 목록·상세에서 모두 제외됨
---
```

CLAUDE.md를 갱신할 때 이 형식과 다른 키(`author` 등)를 추가하지 말 것 — 코드는 무시한다.

### 데이터 흐름: 정적 생성 → 무한 스크롤

홈 페이지(`src/app/page.tsx`)는 처음 10개 포스트와 전체 개수를 서버에서 받아 `InitialPostsLoader`를 통해 `PostsContext`(`src/contexts/PostsContext.tsx`)에 시드한다. 이후 `InfiniteScrollContainer`가 `/api/posts?page=N&limit=5`를 호출해 추가 페이지를 가져온다.

`PostsContext`에는 다음 동작들이 박혀 있고, 변경 시 컨텍스트가 깨지기 쉽다.

- slug 기반 중복 제거(`LOAD_SUCCESS`)
- `maxPostsInMemory: 50` 슬라이딩 윈도우 (오래된 포스트 폐기)
- `SET_INITIAL`에서 초기 시드 개수와 `postsPerPage`로 다음 `currentPage`를 다시 계산 — 초기 개수를 바꿀 때 이 계산식을 함께 갱신해야 함
- 최대 3회 재시도 + 지수 백오프, 10초 `AbortController` 타임아웃
- 네트워크 오류(`TypeError`)에서만 자동 재시도

`/api/posts` 라우트(`src/app/api/posts/route.ts`)는 `limit`을 50으로 클램프(DoS 방지)하고 `page`/`limit`의 NaN·음수를 정규화한다. 새 쿼리 파라미터를 추가할 때 동일한 검증 스타일을 따를 것.

### 방문자 분석

`src/app/api/analytics/route.ts` ↔ `src/lib/analytics-storage.ts` ↔ `src/lib/supabase.ts`. 환경 변수 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 필요하다. `isBot()`으로 User-Agent를 거른 뒤 IP를 `x-forwarded-for` → `x-real-ip` 순으로 결정한다. 클라이언트에서는 `useVisitorTracking` 훅이 트래킹을 트리거.

### 라우팅·렌더링 메모

- `src/app/posts/[slug]/page.tsx`는 `generateStaticParams`로 빌드 타임에 모든 슬러그를 정적 생성한다. 새 포스트는 빌드 후에야 노출된다.
- 포스트 제목에는 `viewTransitionName: title-${slug}`이 부여돼 있고 루트 레이아웃이 `next-view-transitions`의 `<ViewTransitions>`로 감싸져 있다. 슬러그 형식이나 transition name을 바꾸면 페이지 전환 애니메이션이 끊긴다.
- 댓글은 **Giscus** (`src/components/Giscus.tsx`)를 사용한다. 저장소 ID(`R_kgDOOB50Vg`)와 카테고리 ID(`DIC_kwDOOB50Vs4C0cpJ`)가 하드코딩되어 있고 GitHub Discussions와 연결됨.
- 분석은 Vercel Analytics + Google Analytics(`NEXT_PUBLIC_GA_ID`가 설정된 경우에만 마운트)가 동시 동작.

### 빌드 설정 주의

`next.config.ts`에 `typescript.ignoreBuildErrors: true`가 켜져 있다. **빌드가 통과한다고 타입이 올바른 것은 아니다.** 큰 변경 후에는 `yarn lint`(또는 별도 `tsc --noEmit`)로 직접 확인할 것. ESLint도 빌드를 막지 않는다는 점을 염두에 둘 것.

`experimental.optimizePackageImports`에 `highlight.js`가 등록돼 있다 — 번들 크기에 영향이 크므로 제거하지 말 것.

### 스타일링

- TailwindCSS v4 + 페이지별 SCSS(`src/app/style.scss`, `src/app/posts/[slug]/style.scss`)
- 마크다운 본문은 `github-markdown-css`의 `markdown-body` 클래스에 의존
- 본문 컨테이너는 일관되게 `max-w-[700px]`. 폭을 바꾸려면 홈/포스트 양쪽을 함께 수정.
- `lang='ko'`, 다크 테마 기본

## Git 워크플로

작업 완료 후 커밋 시 다음 절차를 따른다:

1. 변경된 파일과 내용을 분석하여 커밋 메시지 초안 작성
2. 사용자에게 커밋 메시지를 보여주고 승인 요청
3. 사용자 승인 후에만 커밋 실행
4. 푸시는 사용자가 명시적으로 요청한 경우에만 실행
