/**
 * [Intent]
 * 게시글 공유 URL은 하드코딩된 예시 도메인이 아니라 배포 환경과 로컬 환경을 모두 안전하게 반영하는 공통 규칙으로 생성되어야 한다.
 */

const FQA = {
  intent:
    "게시글 공유하기가 어느 환경에서든 실제 열 수 있는 주소를 만들고, 로컬/프리뷰/운영 환경마다 다른 도메인 때문에 잘못된 링크가 복사되지 않게 한다.",
  userSignal:
    "사용자가 게시글 상세에서 공유 버튼을 눌렀을 때 복사된 링크가 현재 서비스 가능한 주소여야 한다.",
  happyPath:
    "상세 페이지에서 공유 버튼 클릭 -> 공통 URL 생성 유틸이 env 또는 런타임 origin 기반으로 절대 URL 생성 -> 클립보드 복사 또는 공유 시트 호출 -> 상대방이 해당 게시글 상세로 정상 진입한다.",
  edgeCases: [
    {
      case: "배포 도메인이 설정되지 않은 로컬 개발 환경",
      check: "env 값이 없더라도 현재 브라우저 origin 기반 URL을 만든다.",
      expected: "localhost 기준 링크가 생성된다.",
    },
    {
      case: "preview 배포나 임시 도메인 환경",
      check: "운영 도메인을 강제로 붙이지 않는다.",
      expected: "현재 환경에서 실제 열 수 있는 절대 URL이 생성된다.",
    },
    {
      case: "SSR 또는 window 미존재 환경",
      check: "유틸은 브라우저 의존 로직을 안전하게 분기한다.",
      expected: "window 접근 실패로 렌더가 깨지지 않는다.",
    },
    {
      case: "postId는 있는데 title이 특수문자를 포함하는 경우",
      check: "공유 URL은 title이 아니라 라우트의 실제 식별자를 기준으로 만든다.",
      expected: "링크가 깨지지 않는다.",
    },
  ],
  guards: [
    "배포용 env 값이 비어 있어도 공유 버튼은 동작해야 한다.",
    "잘못된 절대 URL이 생성될 가능성이 있으면 `window.location.origin` fallback을 우선 사용한다.",
  ],
  invariants: [
    "공유 URL은 항상 절대 URL이어야 한다.",
    "게시글 상세 URL 생성 규칙은 한 곳에서만 정의한다.",
    "UI 컴포넌트는 도메인이나 env 규칙을 직접 알지 않는다.",
  ],
  persistence: [
    "공유 URL 도메인 설정은 `.env.local`에서만 관리하고 저장소에는 실제 값을 커밋하지 않는다.",
  ],
  observability: [
    "공유 URL 생성 실패 시 조용히 fallback하지 말고 개발 환경에서는 경고 로그를 남긴다.",
  ],
};

# 게시글 공유 URL 도메인 리팩토링

## 문제 정의

현재 게시글 상세 카드의 공유 버튼은 다음과 같이 하드코딩된 예시 도메인을 사용하고 있다.

- [PostDetailCard.tsx](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/shared/ui/PostDetailCard/PostDetailCard.tsx)

```tsx
<ShareButton url={`https://yourdomain.com/post/${title}`} />
```

이 구조의 문제는 네 가지다.

1. `yourdomain.com`은 실제 서비스 도메인이 아니라서 로컬, preview, staging, 운영 어디에서도 신뢰할 수 없다.
2. URL 식별자에 `title`을 쓰고 있어 공백, 특수문자, 제목 변경에 취약하다.
3. 카드 UI가 배포 환경과 라우팅 규칙까지 직접 알고 있다.
4. `.env.local` 같은 개발자별 설정이 있어도 현재 구현은 이를 소비하지 못한다.

즉 지금 공유 URL은 "보이는 버튼"은 있지만, 제품 동작 관점에서는 아직 placeholder에 가깝다.

## 현재 코드 기준 사실관계

### 1. 공유 URL은 상세 카드 내부에서 직접 생성한다

- [PostDetailCard.tsx](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/shared/ui/PostDetailCard/PostDetailCard.tsx)

이 컴포넌트는 표현용 카드여야 하는데, 현재는 링크 생성 규칙까지 들고 있다.

### 2. 현재 env 예시는 API base만 존재한다

- [.env.example](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/.env.example)

```env
VITE_API_BASE_URL=http://localhost:8080
```

즉 앱 URL 또는 공유용 기준 origin을 위한 env는 아직 정의되지 않았다.

### 3. `.env` 계열은 이미 gitignore 대상이다

- [.gitignore](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/.gitignore)

```text
*.local
.env
```

따라서 `VITE_APP_BASE_URL` 또는 유사한 값을 `.env.local`로 관리하는 방향은 현재 레포 정책과 충돌하지 않는다.

## 목표

- 게시글 공유 URL은 모든 환경에서 실제 접속 가능한 절대 URL로 생성된다.
- 도메인 결정 규칙은 공통 유틸로 이동한다.
- UI 컴포넌트는 `postId` 같은 최소 입력만 넘기고, 절대 URL 조합은 공통 레이어가 담당한다.
- 로컬 개발 환경에서는 추가 설정이 없어도 `window.location.origin`으로 안전하게 동작한다.

## 비목표

- URL shortener 도입
- 카카오/트위터 등 외부 공유 채널별 deep link 최적화
- SEO slug 기반 라우팅 전환
- 게시글 목록 카드 전반의 공유 버튼 추가

## 권장 설계

### 설계 원칙

1. 공유 링크는 `title`이 아니라 `postId` 기반 경로를 사용한다.
2. 절대 URL 생성은 공통 유틸이 담당한다.
3. 도메인은 `env -> window.location.origin -> 상대경로 금지` 순으로 결정한다.
4. UI는 `buildPostShareUrl(postId)` 같은 함수만 호출한다.

### 추천 env 이름

`VITE_APP_BASE_URL`

이 이름을 추천하는 이유:

- `VITE_API_BASE_URL`과 역할이 다르다.
- "이 앱이 사용자에게 노출되는 기준 URL"이라는 의미가 분명하다.
- backend origin, CDN origin, SSO origin과 혼동되지 않는다.

### 추천 우선순위

공유 URL 기준 origin은 아래 순서로 결정한다.

1. `import.meta.env.VITE_APP_BASE_URL`
2. 브라우저 환경이면 `window.location.origin`
3. 둘 다 없으면 URL 생성 실패로 간주하고 예외 처리 또는 빈 문자열 반환

이 우선순위를 쓰면:

- 운영에서는 명시적 도메인 사용 가능
- preview/로컬에서는 별도 설정 없이 현재 origin 사용 가능
- SSR 또는 테스트 환경에서는 조용한 오동작 대신 명시적으로 대응 가능

## 추천 구현 구조

### 1. 공유 URL 유틸 추가

예상 파일:

- `/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/shared/lib/share-url.ts`

권장 함수:

```ts
export const resolveAppBaseUrl = (): string
export const buildPostShareUrl = (postId: number): string
```

### 2. 상세 카드에서 문자열 직접 생성 제거

현재:

- [PostDetailCard.tsx](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/shared/ui/PostDetailCard/PostDetailCard.tsx)

개선 후 역할:

- 카드 컴포넌트는 `shareUrl` prop만 받는다.
- 또는 상위 레벨이 `buildPostShareUrl(postId)` 결과를 넘긴다.

추천 방향은 "상위에서 생성 후 prop으로 전달"이다.  
이유는 카드가 더 순수해지고 테스트가 쉬워지기 때문이다.

### 3. 상세 페이지에서 shareUrl 생성

예상 적용 지점:

- [PostPage.tsx](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/pages/PostPage.tsx)

`postId`를 이미 알고 있으므로 여기서 생성하는 쪽이 자연스럽다.

## 추천 구현안

### `.env.example`

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_BASE_URL=http://localhost:5173
```

### 개발자별 `.env.local`

```env
VITE_API_BASE_URL=https://example-ngrok.ngrok-free.dev/comit-staging/api
VITE_APP_BASE_URL=http://localhost:5173
```

### 운영 환경

운영 또는 preview에서 `VITE_APP_BASE_URL`을 명시적으로 넣지 않더라도 `window.location.origin` fallback으로 충분할 수 있다.  
다만 다음 경우에는 env를 명시하는 편이 낫다.

- 프론트가 reverse proxy 아래 path prefix를 가질 때
- canonical domain과 실제 runtime origin이 다를 때
- 메타 공유 정책상 canonical URL을 강제해야 할 때

## 상태 흐름

### 현재

1. 사용자가 공유 버튼 클릭
2. 카드 내부에서 `https://yourdomain.com/post/${title}` 생성
3. 잘못된 도메인 또는 깨지는 경로 복사 가능

### 목표

1. 상세 페이지가 `buildPostShareUrl(postId)` 호출
2. 유틸이 `env -> window.location.origin` 순으로 base 결정
3. `/post/{postId}` 절대 URL 생성
4. `ShareButton`은 전달받은 URL만 복사 또는 공유

## 왜 `title` 기반이 아니라 `postId` 기반이어야 하나

### `title` 기반의 문제

- 공백/특수문자 인코딩 필요
- 제목 수정 시 링크 안정성 깨짐
- 중복 제목 구분 어려움
- 현재 라우팅 규칙과도 불일치 가능성 큼

### `postId` 기반의 장점

- 현재 상세 페이지 라우팅과 일관됨
- 변하지 않는 식별자
- URL 생성 로직이 단순함

## fallback 정책

### 허용할 fallback

- `VITE_APP_BASE_URL`이 없으면 `window.location.origin`

### 허용하지 않을 fallback

- `https://yourdomain.com`
- 빈 문자열에 상대경로만 반환
- title 기반 문자열 조합

즉 "임시라도 하드코딩 도메인"은 fallback이 아니라 버그로 봐야 한다.

## 테스트 체크리스트

### 단위 수준

- `VITE_APP_BASE_URL`이 있으면 그 값을 사용한다.
- env가 없고 브라우저 환경이면 `window.location.origin`을 사용한다.
- `postId=123`이면 `/post/123`가 생성된다.
- trailing slash가 있어도 `//post/123`처럼 깨지지 않는다.

### 화면 수준

- 로컬 `localhost:5173`에서 공유 버튼 클릭 시 localhost 링크가 만들어진다.
- preview 환경에서 현재 preview origin 기준 링크가 만들어진다.
- 운영 환경에서 실제 서비스 도메인 링크가 만들어진다.

### 회귀 체크

- 상세 페이지 렌더가 env 부재 때문에 깨지지 않는다.
- `ShareButton`은 URL 생성 책임을 새로 가지지 않는다.

## 롤아웃 순서

1. 공통 URL 유틸 추가
2. `.env.example`에 `VITE_APP_BASE_URL` 추가
3. 상세 페이지에서 `shareUrl` 생성
4. 상세 카드에서는 prop만 사용하도록 변경
5. 로컬/preview/운영 환경 검증

## 관찰 포인트

- 잘못된 도메인으로 복사된 링크 제보가 사라지는지
- preview 환경에서 링크가 실제 preview origin을 가리키는지
- 운영 배포 후 canonical domain 요구가 생기는지

## 최종 권장안

- 공유 URL 기준 도메인은 `VITE_APP_BASE_URL`로 명시할 수 있게 하되, 기본값은 `window.location.origin`으로 둔다.
- `buildPostShareUrl(postId)` 유틸을 공통화한다.
- `PostDetailCard`는 더 이상 URL 문자열을 직접 만들지 않는다.

이 방식이면 로컬과 배포 환경 모두에서 링크가 자연스럽고, 이후 slug 도입이나 canonical URL 정책 변경이 생겨도 한 곳만 바꾸면 된다.
