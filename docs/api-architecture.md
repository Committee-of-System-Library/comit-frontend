# Comit FE 공통 API 구조 가이드

## 1) 목적

- 팀원이 병렬로 작업해도 API 호출 방식, 에러 처리, 캐싱 정책이 섞이지 않도록 기준점을 통일합니다.
- 피그마/UI 구현 코드와 API 코드를 분리해서 유지보수 비용을 낮춥니다.
- 백엔드 명세 변경 시 수정 범위를 최소화합니다.

## 1-1) 왜 공통 구조를 사용하는가

공통 구조를 쓰는 이유는 단순히 "코드를 예쁘게" 만들기 위함이 아니라, 실제 장애와 협업 비용을 줄이기 위함입니다.

1. 요청/응답 규칙을 한 곳에서 통일할 수 있습니다.
2. 서버 스펙 변경 시 수정 범위를 `entities` 중심으로 제한할 수 있습니다.
3. React Query 캐시 키 규칙을 통일해 데이터 불일치 문제를 줄일 수 있습니다.
4. UI 담당자가 API 세부 구현을 몰라도 화면 조립에 집중할 수 있습니다.
5. 코드 리뷰 기준이 명확해집니다.  
   예: "컴포넌트에서 fetch 직접 호출 금지", "query key는 query-keys.ts만 사용"

## 1-2) 공통 구조를 사용하지 않았을 때 겪는 에러 예시

## 케이스 A: 환경별 URL 하드코딩으로 인한 호출 실패

```ts
// 페이지 내부에서 직접 호출
await fetch("http://localhost:8080/posts?boardType=QNA");
```

- 로컬에서는 동작, 배포 환경에서는 CORS/네트워크 오류
- 팀원마다 URL 작성 방식이 달라 dev/stage/prod에서 오작동

## 케이스 B: 인증 쿠키 누락으로 401 반복

```ts
await fetch("/members/me"); // credentials 미설정
```

- 쿠키 기반 인증인데 `credentials: "include"` 누락
- 로그인 상태인데도 "인증 필요" 오류가 반복 발생

## 케이스 C: 백엔드 `result/data` 포맷 미처리

```ts
const response = await fetch("/posts?boardType=QNA");
const json = await response.json();
return json.posts; // 실제는 json.data.posts
```

- 런타임에서 `undefined` 접근 오류
- 화면은 빈 목록으로 보이고 원인 파악이 어려움

## 케이스 D: 에러 응답 분기 누락

```ts
const response = await fetch("/posts/1/like", { method: "POST" });
const data = await response.json(); // 400/401도 그대로 통과
showSuccessToast();
```

- 실패 요청에도 성공 토스트가 뜨는 UX 버그
- 에러코드 기반 분기(`DUPLICATE_NICKNAME`, `UNAUTHORIZED`) 불가능

## 케이스 E: Query Key 규칙 불일치로 캐시 꼬임

```ts
// 팀원 A
useQuery({ queryKey: ["posts", "qna"], ... });
// 팀원 B
useQuery({ queryKey: ["post", { boardType: "QNA" }], ... });
```

- invalidate 시 일부 목록만 갱신
- "작성했는데 목록에 안 보임", "좋아요가 늦게 반영됨" 같은 이슈 발생

## 케이스 F: 파라미터 규칙 불일치

```ts
// 잘못된 파라미터 명/타입
fetch("/posts?board=qna&pageSize=50");
```

- 서버 기대값(`boardType`, `size`)과 불일치
- 400 에러 또는 fallback 동작으로 잘못된 데이터 노출

## 2) 참고 명세

- 백엔드 API 문서: `https://committee-of-system-library.github.io/knu-cse-comit-server/`

## 3) 폴더 구조

```text
src/
  shared/
    api/
      client.ts            # fetch 래퍼(공통 옵션, data 언랩, 에러 변환)
      endpoints.ts         # endpoint 상수/함수
      http-error.ts        # 공통 HTTP 에러 타입
      query-client.ts      # React Query 전역 설정
      query-keys.ts        # Query Key 팩토리
      response.ts          # 성공/에러 응답 타입 가드
  entities/
    auth/
      api/
      model/
    member/
      api/
      model/
    post/
      api/
      model/
    comment/
      api/
      model/
  features/
    signup/
      model/               # useQuery/useMutation 조합 훅
    member/
      model/
```

## 4) 응답/에러 규칙

### 성공 응답

백엔드 성공 응답은 공통적으로 아래 형태를 사용합니다.

```json
{
  "result": "SUCCESS",
  "data": {}
}
```

- `apiClient`는 기본적으로 `data`만 반환합니다.
- `data`가 없는 성공 응답(`{ "result": "SUCCESS" }`)은 `void`로 처리합니다.

### 에러 응답

에러는 Problem Details 확장 형태를 사용합니다.

```json
{
  "type": "/problems/common/unauthorized",
  "title": "Unauthorized",
  "status": 401,
  "detail": "인증이 필요합니다.",
  "errorCode": "UNAUTHORIZED",
  "invalidFields": [],
  "errorTrackingId": "..."
}
```

- `apiClient`는 실패 시 `ApiHttpError`를 throw 합니다.
- UI/feature 레벨에서는 `errorCode`, `status`, `invalidFields`를 우선 사용합니다.

## 5) endpoint 구성 원칙

- 문자열 하드코딩 대신 `shared/api/endpoints.ts`를 사용합니다.
- path parameter는 함수형 endpoint로 관리합니다.
  - 예: `API_ENDPOINTS.post.detail(postId)`

## 6) React Query 기준

- 전역 기본값:
  - `refetchOnWindowFocus: false`
  - `staleTime: 30s`
  - `queries.retry`: 400/401/403/404는 재시도하지 않음
  - `mutations.retry: 0`
- Query Key는 `queryKeys`에서만 생성합니다.

## 7) 도메인별 1차 연결 범위

### Auth

- `GET /auth/register/prefill`
- `POST /auth/register`
- `POST /auth/sso/logout`
- `GET /auth/sso/login`은 URL 이동 목적이므로 helper URL 함수로 사용

### Member

- `GET /members/me`
- `PATCH /members/me`
- `PATCH /members/me/student-number-visibility`

### Post

- `GET /posts` (cursor 기반)
- `GET /posts/{postId}`
- `POST /posts`
- `POST /posts/{postId}/like`
- `POST /posts/{postId}/reports`

### Comment

- `POST /posts/{postId}/comments`
- `DELETE /comments/{commentId}`
- `PATCH /comments/{commentId}`
- `GET /posts/{postId}/comments`
- `POST /comments/{commentId}/like` (1차 구현 생략)
- `POST /comments/{commentId}/reports`

## 8) 게시글 목록 조회 예시 (공통 구조 적용)

게시글 목록 조회를 예로 들면, 아래 순서로 흐릅니다.

1. endpoint는 `shared/api/endpoints.ts`에서 관리
2. 실제 호출은 `entities/post/api/getPosts.ts`에서 수행
3. 화면용 로직은 `features` 훅에서 감쌈
4. 페이지는 훅만 사용해 UI 렌더링

### 8-1) Entities API (이미 구현된 방식)

```ts
// src/entities/post/api/getPosts.ts
import type {
  PostListQuery,
  PostListResponse,
} from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const getPosts = (params: PostListQuery) => {
  return apiClient.get<PostListResponse>(API_ENDPOINTS.post.base, {
    params: {
      boardType: params.boardType,
      cursor: params.cursor,
      size: params.size,
    },
  });
};
```

### 8-2) Features 훅 (권장 패턴 예시)

```ts
// src/features/board/model/usePostListQuery.ts (예시)
import { useQuery } from "@tanstack/react-query";

import { getPosts } from "@/entities/post/api/getPosts";
import type { BoardType } from "@/entities/post/model/types";
import { queryKeys } from "@/shared/api/query-keys";

interface UsePostListQueryParams {
  boardType: BoardType;
  cursor?: number;
  size?: number;
}

export const usePostListQuery = ({
  boardType,
  cursor,
  size = 20,
}: UsePostListQueryParams) => {
  return useQuery({
    queryKey: queryKeys.post.list({ boardType, cursor, size }),
    queryFn: () => getPosts({ boardType, cursor, size }),
  });
};
```

### 8-3) 페이지 사용 예시

```tsx
// src/pages/board/QnABoardPage.tsx (예시)
const QnABoardPage = () => {
  const { data, isLoading, error } = usePostListQuery({
    boardType: "QNA",
    size: 20,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>목록을 불러오지 못했습니다.</div>;

  return (
    <ul>
      {data?.posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};
```

이렇게 하면 페이지는 API 세부사항(`baseURL`, `credentials`, `result/data`, 에러 파싱)을 알 필요가 없습니다.

## 9) 간단 사용 예시

```ts
import { useQuery } from "@tanstack/react-query";

import { getPosts } from "@/entities/post/api/getPosts";
import { queryKeys } from "@/shared/api/query-keys";

export const useQnaPostsQuery = () => {
  return useQuery({
    queryKey: queryKeys.post.list({ boardType: "QNA", size: 20 }),
    queryFn: () => getPosts({ boardType: "QNA", size: 20 }),
  });
};
```

## 10) 환경 변수

- `.env.local`
  - `VITE_API_BASE_URL=http://localhost:8080` (백엔드 서버 주소)
- 값이 비어 있으면 같은 origin 기준 상대 경로(`/posts` 등)로 호출합니다.

## 11) 팀 공통 작업 규칙

- API 호출은 컴포넌트에서 직접 `fetch`하지 않고 `entities/*/api`만 사용합니다.
- 페이지/위젯에서는 가능하면 `features/*/model`의 훅만 사용합니다.
- 서버 명세 변경 시 순서:
  1. `entities/*/model/types.ts` 수정
  2. `entities/*/api/*` 수정
  3. `features/*/model/*` 수정
  4. 화면 컴포넌트 수정

## 12) 추가 학습 추천

- React Query: query key 설계, mutation 후 invalidation 전략
- API 에러 UX: 도메인 에러코드(`errorCode`) 기반 메시지 매핑
- DTO ↔ UI ViewModel 분리
- Cursor Pagination 처리 패턴(infinite query 포함)
- 인증 세션 전략(Cookie 기반, 리다이렉트 콜백 처리)
