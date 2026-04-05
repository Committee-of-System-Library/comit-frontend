# Post Domain Error Handling Refactor Guide

```ts
/**
 * [Intent]
 * 포스트 도메인의 모든 읽기/쓰기 실패를 같은 방식으로 해석하고,
 * 서버 ProblemDetail을 잃지 않으면서도 화면별로 토스트/인라인/페이지 상태를 일관되게 분기한다.
 */

const FQA = {
  intent:
    "포스트 도메인의 에러는 클라이언트 구현이 아니라 서버 계약을 기준으로 정규화되어야 한다.",
  userSignal:
    "사용자는 게시글 상세, 작성, 수정, 신고, 관리 작업에서 실패 이유를 일관된 형태로 보고 즉시 다음 행동을 선택할 수 있어야 한다.",
  happyPath:
    "정상 응답은 기존처럼 캐시와 화면에 반영하고, 실패 응답은 status/code/field 정보를 보존한 채 읽기 화면은 상태 배너로, 쓰기 화면은 토스트 또는 필드 에러로 처리한다.",
  edgeCases: [
    {
      case: "상세 조회 404",
      check: "삭제되었거나 없는 게시글 상세로 진입한다.",
      expected:
        "상세 카드가 깨진 상태로 남지 않고, 게시글 없음 상태와 복귀 동작이 보여야 한다.",
    },
    {
      case: "작성/수정 400 validation",
      check: "title/content/tags가 서버 규칙을 벗어나도록 제출한다.",
      expected:
        "서버 invalidFields가 폼 필드에 매핑되고, 화면은 성공 토스트 없이 입력 위치를 유지한다.",
    },
    {
      case: "신고 409",
      check: "이미 신고한 게시글을 다시 신고한다.",
      expected:
        "중복 신고로 해석되고 재시도하지 않으며, 사용자에게 같은 행동을 반복하라는 메시지를 주지 않는다.",
    },
    {
      case: "legacy client path",
      check: "admin-post 경로처럼 `src/apis/client.ts`를 타는 호출을 실행한다.",
      expected:
        "plain Error 문자열만 남지 않고, post-domain 공통 에러 모델로 다시 해석되어야 한다.",
    },
  ],
  guards: [
    "포스트 도메인에서는 `error.message`만 믿고 분기하지 않는다.",
    "401/403/404/409는 리트라이 대상이 아니어야 한다.",
    "필드 에러가 있으면 먼저 인라인 매핑을 시도하고, 남는 메시지만 토스트로 보낸다.",
    "공통 파서 없이 페이지별로 `try/catch` 메시지 문자열을 제각각 만들지 않는다.",
  ],
  invariants: [
    "서버가 준 status, errorCode, detail, invalidFields, errorTrackingId는 가능한 한 보존한다.",
    "같은 post-domain 실패는 읽기/쓰기/관리자 화면에서 같은 의미로 분류되어야 한다.",
    "validation 실패는 사용자가 입력한 값과 현재 폼 상태를 날리지 않는다.",
    "network/5xx와 business error를 같은 문구로 뭉개지 않는다.",
  ],
  observability: [
    "에러 파서가 만든 정규화 결과에는 method/url/status/code/trackingId를 남긴다.",
    "사용자에게 노출하는 문구와 디버깅 로그를 분리한다.",
    "trackingId가 있으면 콘솔/원격 로그에서 바로 찾을 수 있어야 한다.",
  ],
}
```

## 범위

이 문서는 게시글 도메인에서 발생하는 서버 에러를 프론트가 같은 규칙으로 해석하도록 바꾸는 리팩터 가이드다.

대상은 다음 흐름이다.

- 게시글 목록/상세/인기글 읽기
- 게시글 작성/수정/삭제/신고/좋아요 쓰기
- 관리자 게시글 목록/숨김/복원/삭제
- `shared/api/client.ts`와 `src/apis/client.ts`가 섞여 있는 현재 호출 경로

이 문서는 에러 응답 포맷 자체를 바꾸자는 문서가 아니다. 서버 계약은 그대로 두고, 프론트가 그 계약을 잃지 않게 정규화하는 것이 목표다.

## 현재 코드 현실

### 1. `shared/api/client.ts`는 ProblemDetail을 어느 정도 이해한다

[`src/shared/api/client.ts`](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/shared/api/client.ts)는 `fetch` 응답이 실패하면 `ApiHttpError`를 던진다.

- `ApiErrorResponse`로 판별되면 `status`, `detail`, `errorCode`, `invalidFields`, `errorTrackingId`를 보존한다.
- 성공 응답은 `result`/`data` envelope를 풀어준다.
- `queryClient`가 이 에러 타입을 기준으로 일부 retry 정책을 적용할 수 있다.

즉, 이 경로는 최소한 상태 코드와 구조화된 필드를 유지한다.

### 2. `src/apis/client.ts`는 문자열 Error로 축약한다

[`src/apis/client.ts`](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/apis/client.ts)는 실패 시 `new Error(await parseErrorMessage(response))`만 던진다.

- `status`, `errorCode`, `invalidFields`, `errorTrackingId`가 사라진다.
- JSON이 아니면 `statusText` 한 줄만 남는다.
- 성공 응답은 `data`만 꺼내지만, 실패는 구조화된 의미를 잃는다.

이 차이 때문에 같은 “게시글 실패”라도 화면마다 분기 가능성이 달라진다.

### 3. 포스트 화면은 두 클라이언트를 동시에 쓴다

현재 포스트 관련 호출은 두 갈래다.

- 일반 포스트 기능은 `shared/api/client.ts`를 탄다.
- 관리자 포스트 기능은 `src/apis/client.ts`를 탄다.

관련 파일:

- [`src/pages/PostPage.tsx`](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/pages/PostPage.tsx)
- [`src/pages/write/WritePage.tsx`](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/pages/write/WritePage.tsx)
- [`src/pages/admin/AdminPostPage.tsx`](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/pages/admin/AdminPostPage.tsx)
- [`src/features/post/model/useCreatePostMutation.ts`](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/features/post/model/useCreatePostMutation.ts)
- [`src/features/post/model/usePostDetailQuery.ts`](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/features/post/model/usePostDetailQuery.ts)
- [`src/features/post/model/useTogglePostLikeMutation.ts`](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/features/post/model/useTogglePostLikeMutation.ts)
- [`src/apis/modules/admin-post.ts`](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/apis/modules/admin-post.ts)

이 구조가 제일 큰 문제다. 같은 도메인인데 에러 모델이 서로 다르다.

### 4. 현재 화면별 처리 방식은 서로 다르다

- `WritePage`는 mutation 실패를 `error.message`로 토스트만 띄운다.
- `PostPage`는 좋아요 401만 따로 처리하고 나머지는 일반 토스트로 처리한다.
- `AdminPostPage`도 `error.message`를 바로 사용자 문구로 노출한다.
- 상세 쿼리 실패는 지금 단순한 빈 상태/에러 상태로만 나뉘어 있다.

즉, 서버가 준 `invalidFields`나 `errorCode`를 화면이 거의 활용하지 못한다.

### 5. 서버는 ProblemDetail 중심 계약을 이미 문서화했다

서버 쪽 기준은 다음 문서를 따른다.

- [`docs/api/index.html`](/Users/bohyeong/IdeaProjects/knu-cse-comit-server/docs/api/index.html)
- [`docs/adr/002-problem-detail-error-response.md`](/Users/bohyeong/IdeaProjects/knu-cse-comit-server/docs/adr/002-problem-detail-error-response.md)

핵심은 아래와 같다.

- 기본 `ProblemDetail` 필드 `type`, `title`, `status`, `detail`, `instance`를 유지한다.
- `errorCode`는 프론트 분기용 확장 필드다.
- validation 실패는 `invalidFields[]` 배열로 노출한다.
- 시스템 에러는 `errorTrackingId`로 로그 추적이 가능해야 한다.

포스트 API 문서에서는 실제로 다음 상태 코드들이 반복된다.

- `400` validation / invalid request
- `401` 인증 문제
- `403` 권한 문제
- `404` 게시글 없음
- `409` 중복 신고 같은 비즈니스 충돌
- `5xx` 서버 오류

## gap 요약

| 현재 | 문제 | 목표 |
|---|---|---|
| `shared/api/client.ts` | 구조화된 에러를 보존함 | 유지 |
| `src/apis/client.ts` | `Error(message)`로 축약 | 같은 정규화 모델로 통일 |
| 페이지별 `catch` | 문자열에 의존 | `status/code/field` 기반 분기 |
| `invalidFields` | 거의 사용하지 않음 | RHF 인라인 에러로 매핑 |
| `401/403/404/409` | 화면마다 반응이 다름 | 공통 정책으로 분기 |
| query retry | 일부 비정상 상태를 retry 후보로 둘 수 있음 | read/write 성격에 맞게 제한 |

## 목표 에러 모델

프론트는 서버 payload를 바로 UI에 흘리지 말고, 도메인용 정규화 객체로 바꿔야 한다.

권장 모델은 아래 수준이면 충분하다.

```ts
type PostDomainErrorKind =
  | "validation"
  | "auth"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "network"
  | "server"
  | "unknown";

interface PostDomainError {
  kind: PostDomainErrorKind;
  status?: number;
  code?: string;
  title: string;
  detail?: string;
  message: string;
  instance?: string;
  trackingId?: string;
  invalidFields?: Array<{
    field: string;
    reason: string;
    rejectedValue?: string;
  }>;
  method?: string;
  url?: string;
  raw?: unknown;
  isRetryable: boolean;
}
```

이 모델의 목적은 UI를 편하게 하려는 것이 아니라, 서버 계약을 잃지 않고 화면별 처리를 단순화하는 것이다.

### 정규화 규칙

- `400 + invalidFields`면 `validation`이다.
- `401`이면 `auth`다.
- `403`이면 `forbidden`이다.
- `404`이면 `not_found`다.
- `409`이면 `conflict`다.
- `5xx`면 `server`다.
- 네트워크 실패나 JSON 파싱 실패는 `network` 또는 `unknown`으로 남긴다.

### 보존 규칙

- `status`, `errorCode`, `detail`, `instance`, `errorTrackingId`, `invalidFields`는 버리지 않는다.
- 사용자 문구는 `message`에 둔다.
- 개발/관측용 원본은 `raw` 또는 별도 logger 입력으로 남긴다.

## 구현 전략

### 1. 공통 파서는 하나만 둔다

포스트 도메인에서 새 에러 파서를 각각 만들지 말고, 공통 유틸 하나를 기준으로 삼는다.

권장 방향은 두 가지 중 하나다.

1. `shared/api/client.ts`의 `ApiHttpError`를 포스트 도메인 표준 에러로 승격한다.
2. `src/apis/client.ts`도 `ApiHttpError`와 같은 구조를 반환하도록 교체한다.

둘 중 무엇을 택하든 결론은 같다.

- post-domain은 문자열 `Error`를 직접 다루지 않는다.
- page/component는 `status`와 `kind`를 보고 분기한다.
- `errorCode`는 사용자 메시지보다 우선하는 분기 키다.

### 2. legacy client는 bridge로만 쓴다

관리자 포스트 경로가 당장 `src/apis/client.ts`를 쓰고 있다면, 그 호출부부터 공통 정규화 함수로 감싸야 한다.

이유는 단순하다.

- 현재 경로를 한 번에 다 바꾸기 어렵다.
- 그렇다고 `AdminPostPage`만 별도 규칙을 유지하면 도메인 정책이 다시 갈라진다.

### 3. UI는 raw payload를 보지 않는다

화면은 다음만 본다.

- `kind`
- `status`
- `message`
- `invalidFields`
- `trackingId`

`title`, `detail`, `instance`는 디버깅과 예외 복구를 위해 보조 정보로만 둔다.

## 읽기 에러 규칙

읽기 요청은 `getPostDetail`, `getPosts`, `getHotPosts`, `useAdminPosts` 같은 query에 해당한다.

### 400

- 일반적으로 잘못된 query parameter다.
- 예: cursor, size, boardType 등이 규격 밖인 경우.
- 사용자에게는 재시도 유도보다 입력/탭 상태를 고치라는 안내가 맞다.

### 401

- 현재 로그인 세션이 없거나 만료됐다.
- 읽기 화면에서는 페이지 전체를 날리기보다, 인증이 필요한 화면이면 로그인 유도 상태로 바꾸는 것이 낫다.
- public read라도 401이 오면 자동 재시도하지 않는다.

### 403

- 관리자 전용 목록이나 숨김/복원처럼 권한이 명확한 영역에서 주로 나온다.
- 화면은 “권한 없음” 상태를 보여주고, 버튼만 막는 방식보다 상위 상태를 바꾸는 것이 낫다.

### 404

- 상세 조회에서 가장 중요하다.
- 게시글이 삭제되었거나 존재하지 않으면 상세 카드 대신 “게시글을 찾을 수 없음” 상태를 보여준다.
- 상세 페이지에서는 뒤로가기 또는 목록 이동을 제공해야 한다.

### 5xx / network

- 재시도 후보다.
- 단, 사용자가 이미 입력한 데이터를 잃게 만드는 식의 자동 재시도는 금지한다.
- 읽기 화면은 skeleton 또는 error banner로 되돌린다.

## 쓰기 에러 규칙

쓰기 요청은 `createPost`, `updatePost`, `deletePost`, `reportPost`, `togglePostLike`, `usePatchPostVisibility`, `useDeletePost` 같은 mutation을 말한다.

### 공통 원칙

- mutation은 기본적으로 retry 0이어야 한다.
- 실패 시에는 “왜 실패했는지”만 보여주고, 자동 재시도는 사용자가 직접 누를 때만 한다.
- 성공 토스트와 실패 토스트는 동시에 나오지 않아야 한다.

### 400 validation

- 작성/수정/신고 폼은 `invalidFields`를 우선 사용한다.
- 서버가 내려준 필드 이름을 RHF field name으로 매핑한다.
- 필드가 실제로 보이는 영역이 없으면 form-level message로 격상한다.

### 401

- 로그인 세션 문제다.
- 쓰기에서는 성공 상태를 계속 기다리지 말고 즉시 auth 상태로 분기한다.
- 문구는 `로그인이 필요합니다` 계열로 통일한다.

### 403

- 권한 문제다.
- 예: 작성자가 아닌 사용자의 수정/삭제, 관리자 아닌 사용자의 관리 작업.
- 이런 경우는 토스트만 띄우고 끝내지 말고, 어떤 행위를 막았는지 명확히 보여줘야 한다.

### 404

- 대상 리소스가 사라졌다는 뜻이다.
- 수정/삭제/신고/좋아요 같은 액션에서는 “이미 사라진 게시글”로 취급한다.
- detail 화면에서 나왔으면 이전 화면으로 돌려보내고, list/admin 화면에서는 목록을 갱신한다.

### 409

- 중복 신고, 이미 처리된 상태, 동시성 충돌 같은 비즈니스 충돌이다.
- 재시도 대상이 아니다.
- 사용자 메시지는 “이미 처리된 요청”으로 정리하고, 같은 행동을 반복하라고 유도하지 않는다.

### 5xx / network

- mutation은 자동 재시도보다 실패 복구를 우선한다.
- 버튼 pending 상태를 풀고, 사용자가 다시 시도할 수 있게 한다.
- 서버 장애면 공통 실패 문구를 보여주고, trackingId가 있으면 로그로 연결한다.

## toast vs inline 규칙

이 리팩터의 핵심은 “무조건 토스트”도 아니고 “무조건 인라인”도 아니라는 점이다.

### 인라인으로 보여야 하는 경우

- 현재 보고 있는 폼의 특정 필드에 귀속되는 validation 에러
- 제출 직후 바로 수정 가능한 에러
- 사용자가 입력을 유지한 채 고칠 수 있는 에러

예:

- `title` 길이 초과
- `content` 필수/길이 오류
- `tags` 개수 초과

### 토스트로 보여야 하는 경우

- 네트워크 장애
- 5xx
- 권한 문제
- 중복 신고 같은 전역 action 실패
- 필드로 매핑할 수 없는 서버 에러

### 페이지 상태로 보여야 하는 경우

- 상세 조회 404
- 목록 조회 실패
- 관리자 목록 실패

이 경우는 토스트만 띄우고 끝내지 말고, 화면 자체에 실패 상태를 남겨야 한다.

### 우선순위

1. 필드 매핑 가능하면 인라인
2. action이 실패했지만 사용자가 같은 화면에 머물면 토스트
3. 화면 자체가 성립하지 않으면 페이지 상태

## 필드 validation 매핑

서버 `invalidFields[].field`를 그대로 화면에 꽂지 말고, 도메인 폼 이름과 매칭한다.

### 권장 매핑

| 서버 field | 프론트 대상 | 처리 |
|---|---|---|
| `title` | `title` | `setError("title", ...)` |
| `content` | `content` | `setError("content", ...)` |
| `tags` | `tags` | `setError("tags", ...)` |
| `boardType` | `board` 또는 `root` | 현재 선택 UI 이름에 맞춰 변환 |
| `reason` | 신고 폼 필드 | 신고 폼이 있으면 해당 필드로 매핑 |
| 알 수 없는 field | form-level | 누락 없이 상단 메시지에 합친다 |

### 매핑 원칙

- 서버 field 이름과 프론트 field 이름이 다르면 변환 테이블을 둔다.
- 하나의 field에 여러 에러가 오면 첫 번째만 쓰지 말고 합쳐서 보여줄 수 있어야 한다.
- `rejectedValue`는 사용자 노출용이 아니라 디버깅용이다.
- zod/RHF의 로컬 검증이 먼저, 서버 validation은 submit 후 최종 판정이다.

### 현재 `WritePage`에 적용할 기준

[`src/pages/write/WritePage.tsx`](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/pages/write/WritePage.tsx)에서는 이미 로컬 검증이 있다.

- 로컬 검증은 즉시 피드백용이다.
- 서버 validation은 submit 응답 기준으로 덮어쓴다.
- 서버가 거절한 필드는 값은 유지하고 에러만 추가한다.

## 포스트 화면별 처리 규칙

### `PostPage.tsx`

- 상세 조회 실패는 페이지 상태로 보여준다.
- `404`는 “게시글 없음”으로 분기하고, 일반 실패와 구분한다.
- 좋아요 실패는 `401`, `403`, `404`, `409`, 그 외로 분리한다.
- `401`은 로그인 유도 토스트를 별도로 보여줄 수 있지만, 같은 에러를 그냥 일반 실패로 뭉개면 안 된다.

### `WritePage.tsx`

- 작성 실패 중 validation은 인라인이다.
- 나머지는 토스트다.
- `createPost` 성공 후에만 이동한다.
- 실패 시에는 작성한 내용이 유지되어야 한다.

### `AdminPostPage.tsx`

- 현재는 legacy client를 쓰므로 우선 bridge가 필요하다.
- 숨김/복원/삭제 실패는 사용자가 바로 다시 조치할 수 있도록 명확한 토스트가 필요하다.
- `403`은 관리자 권한 문제로 분리해서 보여준다.
- `404`는 해당 게시글이 이미 사라졌다는 뜻으로 취급한다.

## retry 정책

현재 `queryClient`는 mutation retry를 `0`으로 두고, query retry는 일부 상태를 제외하고 2회까지 허용한다.

권장 정책은 다음과 같다.

- mutation retry는 0 유지
- query retry는 transient error만 허용
- `400`, `401`, `403`, `404`, `409`는 retry 금지
- 네트워크 오류와 5xx만 제한적으로 retry

현재 구현은 `409`를 non-retryable에 넣지 않으므로, post-domain conflict가 queryFn으로 흘러올 수 있다면 반드시 보강해야 한다.

## logging / observability

에러 파싱은 사용자 문구와 관측 정보를 같이 다뤄야 한다.

권장 로그 항목:

- `method`
- `url`
- `status`
- `code`
- `kind`
- `trackingId`
- `route`
- `action` 또는 mutation 이름

권장 규칙:

- 사용자 토스트에는 raw payload를 넣지 않는다.
- 개발 콘솔과 원격 로그에는 정규화된 메타데이터를 남긴다.
- `errorTrackingId`가 있으면 서버 로그와 연결할 수 있도록 보관한다.
- 같은 에러가 여러 화면에서 반복되면, code 기준으로 모아 볼 수 있어야 한다.

## 롤아웃 순서

1. 공통 정규화 함수부터 만든다.
2. `shared/api/client.ts`와 `src/apis/client.ts`가 같은 `PostDomainError`를 반환하도록 맞춘다.
3. `WritePage`, `PostPage`, `AdminPostPage`의 `catch`를 문자열 분기에서 `kind/status/code` 분기로 바꾼다.
4. 폼 validation은 `invalidFields`를 사용해 인라인으로 내린다.
5. read 화면의 404/403/401 상태를 페이지 수준에서 구분한다.
6. query retry 정책에서 `409` 포함 여부를 재검토한다.
7. 로그와 토스트 문구를 최종 정리한다.

## 테스트 체크리스트

### 유닛

- `ApiErrorResponse`를 `PostDomainError`로 정규화하는 테스트
- `invalidFields`를 RHF field name으로 매핑하는 테스트
- `401/403/404/409/5xx` 분기 테스트
- legacy client의 문자열 Error를 같은 모델로 바꾸는 테스트

### 통합

- 게시글 상세 404
- 게시글 상세 401/403
- 게시글 작성 400 validation
- 게시글 수정 400 validation
- 신고 409 duplicate
- 좋아요 401/404
- 관리자 숨김/복원 403/404

### UI 회귀

- 토스트와 인라인 에러가 동시에 중복 노출되지 않는지 확인한다.
- 서버 validation 후에도 입력값이 유지되는지 확인한다.
- 상세 실패가 빈 화면이 아니라 의도된 상태 컴포넌트로 보이는지 확인한다.
- 실패 후 retry가 필요한 경우 사용자 주도로 다시 시도 가능한지 확인한다.

## 비목표

- 서버 ProblemDetail 계약을 다시 설계하는 일
- 게시글 API path 또는 response schema 자체를 바꾸는 일
- 전역 모달 하나로 모든 에러를 띄우는 일
- 오프라인 큐잉 또는 자동 재전송 기능 추가
- 포스트 도메인 외 다른 도메인의 에러 규칙까지 한 번에 통일하는 일
- UI 문구를 브랜드 카피 수준으로 재작성하는 일

## 결론

이 리팩터의 핵심은 “에러를 예쁘게 보이게 하는 것”이 아니라 “에러 의미를 잃지 않는 것”이다.

현재는 `shared/api/client.ts`와 `src/apis/client.ts`가 서로 다른 방식으로 실패를 처리해서, 같은 포스트 도메인인데도 화면마다 판단 기준이 달라진다. 이 문서의 목표는 그 차이를 없애고, 서버 ProblemDetail을 기준으로 읽기/쓰기/관리자 화면이 같은 규칙을 쓰게 만드는 것이다.
