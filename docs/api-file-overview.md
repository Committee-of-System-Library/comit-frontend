# API 파일별 역할 정리

이 문서는 이번에 추가된 API 레이어 파일들이 **무엇을 하는지**와 **왜 필요한지**를 빠르게 파악하기 위한 용도입니다.

## 1) `shared/api` (공통 기반)

| 파일                             | 하는 작업                                                                                                  | 작성 이유                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `src/shared/api/client.ts`       | `fetch` 공통 래퍼, 쿼리스트링 처리, JSON body 직렬화, 성공 응답의 `data` 언랩, 실패 시 `ApiHttpError` 변환 | 컴포넌트/페이지에서 제각각 `fetch`를 쓰지 않고, 요청/응답/에러 처리를 한 곳에서 통일하기 위해 |
| `src/shared/api/endpoints.ts`    | API 경로 상수 및 path param 함수(`detail(postId)` 등) 관리                                                 | 문자열 하드코딩을 줄이고 경로 변경 시 수정 포인트를 단일화하기 위해                           |
| `src/shared/api/http-error.ts`   | 공통 HTTP 에러 클래스(`status`, `errorCode`, `invalidFields` 등) 정의                                      | UI/feature 레벨에서 에러 정보를 타입 안전하게 활용하기 위해                                   |
| `src/shared/api/response.ts`     | 성공/에러 응답 타입(`ApiSuccessResponse`, `ApiErrorResponse`)과 타입 가드 제공                             | 백엔드 응답 포맷(`result/data`, Problem Details)을 프론트에서 명확히 판별하기 위해            |
| `src/shared/api/query-client.ts` | React Query 전역 설정(`retry`, `staleTime`, `refetchOnWindowFocus`)                                        | 캐싱/재시도 정책을 프로젝트 공통 규칙으로 고정하기 위해                                       |
| `src/shared/api/query-keys.ts`   | 도메인별 query key 팩토리 제공                                                                             | key 규칙을 통일하고 캐시 무효화/재조회 실수를 줄이기 위해                                     |

---

## 2) `features` (도메인 동작 조합 훅)

### `signup`

| 파일                                                   | 하는 작업                                                             | 작성 이유                                                              |
| ------------------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `src/features/signup/model/useRegisterPrefillQuery.ts` | 회원가입 prefill 조회용 `useQuery` 훅 제공                            | UI에서 직접 query key/queryFn 조립을 반복하지 않도록 추상화하기 위해   |
| `src/features/signup/model/useRegisterMutation.ts`     | 회원가입 `useMutation` 훅 제공 + 성공 시 auth/member 관련 캐시 무효화 | 회원가입 완료 직후 화면 상태를 최신화(내 정보/인증 상태 반영)하기 위해 |

### `member`

| 파일                                             | 하는 작업                         | 작성 이유                                                   |
| ------------------------------------------------ | --------------------------------- | ----------------------------------------------------------- |
| `src/features/member/model/useMyProfileQuery.ts` | 내 정보 조회용 `useQuery` 훅 제공 | 프로필 데이터 호출 패턴을 공통화하고 재사용성을 높이기 위해 |

### `post`

| 파일 | 하는 작업 | 작성 이유 |
| --- | --- | --- |
| `src/features/post/model/usePostListQuery.ts` | 게시판별 게시글 목록 조회 훅 (`boardType/cursor/size`) | 목록 조회 조건과 queryKey를 통일하기 위해 |
| `src/features/post/model/useHotPostsQuery.ts` | 인기글 상위 5개 조회 훅 | 홈/사이드바에서 동일한 인기글 데이터를 재사용하기 위해 |
| `src/features/post/model/usePostDetailQuery.ts` | 게시글 상세 조회 훅 | 상세 조회와 캐시 키 관리 규칙을 공통화하기 위해 |
| `src/features/post/model/useCreatePostMutation.ts` | 게시글 작성 mutation 훅 + 성공 시 post 캐시 무효화 | 작성 후 목록/연관 데이터 최신화를 자동화하기 위해 |
| `src/features/post/model/useUpdatePostMutation.ts` | 게시글 수정 mutation 훅 + 성공 시 상세/목록 캐시 무효화 | 수정 결과를 상세/목록 화면에 즉시 반영하기 위해 |
| `src/features/post/model/useDeletePostMutation.ts` | 게시글 삭제 mutation 훅 + 성공 시 상세 캐시 제거/목록 갱신 | 삭제된 게시글 데이터가 캐시에 남지 않게 하기 위해 |
| `src/features/post/model/useTogglePostLikeMutation.ts` | 게시글 좋아요 토글 mutation 훅 + 캐시 갱신 | 좋아요 수/상태를 화면 전반에서 일관되게 갱신하기 위해 |
| `src/features/post/model/useReportPostMutation.ts` | 게시글 신고 mutation 훅 | 신고 흐름을 페이지 코드에서 분리해 재사용성을 높이기 위해 |

---

## 3) `entities` (API 스펙 타입 + 단일 호출 함수)

## `auth`

### model

| 파일                               | 하는 작업                                                          | 작성 이유                                                            |
| ---------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `src/entities/auth/model/types.ts` | `RegisterPrefill`, `RegisterRequest`, `SsoCallbackQuery` 타입 정의 | auth 도메인 요청/응답 구조를 타입으로 고정해 화면/훅과 분리하기 위해 |

### api

| 파일                                          | 하는 작업                                                 | 작성 이유                                                          |
| --------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------ |
| `src/entities/auth/api/getRegisterPrefill.ts` | `GET /auth/register/prefill` 호출                         | 회원가입 화면 진입 시 사전 정보 조회를 표준 함수로 제공하기 위해   |
| `src/entities/auth/api/register.ts`           | `POST /auth/register` 호출                                | 회원가입 제출 요청을 분리해 재사용/테스트 용이성을 확보하기 위해   |
| `src/entities/auth/api/logout.ts`             | `POST /auth/sso/logout` 호출 + SSO 로그인 URL helper 제공 | 로그아웃 요청과 SSO 이동 URL 조립 로직을 auth 도메인에 모으기 위해 |

## `member`

### model

| 파일                                 | 하는 작업                                           | 작성 이유                                                       |
| ------------------------------------ | --------------------------------------------------- | --------------------------------------------------------------- |
| `src/entities/member/model/types.ts` | `MyProfile`, 닉네임/학번공개 수정 request 타입 정의 | member 도메인 스펙을 UI와 분리하고 변경 영향 범위를 줄이기 위해 |

### api

| 파일                                                       | 하는 작업                                          | 작성 이유                                          |
| ---------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- |
| `src/entities/member/api/getMyProfile.ts`                  | `GET /members/me` 호출                             | 로그인 사용자 기본 프로필 조회를 표준화하기 위해   |
| `src/entities/member/api/updateNickname.ts`                | `PATCH /members/me` 호출                           | 닉네임 변경 로직을 도메인 API 함수로 분리하기 위해 |
| `src/entities/member/api/updateStudentNumberVisibility.ts` | `PATCH /members/me/student-number-visibility` 호출 | 학번 공개 여부 변경 요청을 명확히 분리하기 위해    |

## `post`

### model

| 파일                               | 하는 작업                                             | 작성 이유                                               |
| ---------------------------------- | ----------------------------------------------------- | ------------------------------------------------------- |
| `src/entities/post/model/types.ts` | 게시글 목록/상세/생성/신고/좋아요 토글 관련 타입 정의 | 게시글 API 응답과 화면 모델의 계약을 명확히 맞추기 위해 |

### api

| 파일 | 하는 작업 | 작성 이유 |
| --- | --- | --- |
| `src/entities/post/api/getPosts.ts` | `GET /posts` (boardType, cursor, size) 호출 | 커서 기반 목록 조회를 재사용 가능한 단일 함수로 제공하기 위해 |
| `src/entities/post/api/getHotPosts.ts` | `GET /posts/hot` 호출 | 인기글 상위 5개 조회를 홈/위젯에서 공통으로 사용하기 위해 |
| `src/entities/post/api/getPostDetail.ts` | `GET /posts/{postId}` 호출 | 상세 페이지 조회를 표준화하기 위해 |
| `src/entities/post/api/createPost.ts` | `POST /posts` 호출 | 작성 페이지 제출 로직을 도메인 레이어로 분리하기 위해 |
| `src/entities/post/api/updatePost.ts` | `PATCH /posts/{postId}` 호출 | 게시글 수정 요청을 명시적 API 함수로 분리하기 위해 |
| `src/entities/post/api/deletePost.ts` | `DELETE /posts/{postId}` 호출 | 게시글 삭제 요청을 일관된 API 레이어에서 처리하기 위해 |
| `src/entities/post/api/togglePostLike.ts` | `POST /posts/{postId}/like` 호출 | 좋아요 토글 API를 명확히 캡슐화하기 위해 |
| `src/entities/post/api/reportPost.ts` | `POST /posts/{postId}/reports` 호출 | 신고 요청/응답(`reportId`) 처리를 공통 함수로 제공하기 위해 |

## `comment`

### model

| 파일                                  | 하는 작업                                      | 작성 이유                                     |
| ------------------------------------- | ---------------------------------------------- | --------------------------------------------- |
| `src/entities/comment/model/types.ts` | 댓글/대댓글 트리, 신고/도움돼요 토글 타입 정의 | 댓글 도메인 스키마를 일관되게 재사용하기 위해 |

### api

| 파일                                            | 하는 작업                                 | 작성 이유                                                |
| ----------------------------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `src/entities/comment/api/getComments.ts`       | `GET /posts/{postId}/comments` 호출       | 댓글 목록 조회를 상세 페이지/위젯에서 공통 사용하기 위해 |
| `src/entities/comment/api/toggleCommentLike.ts` | `POST /comments/{commentId}/like` 호출    | 도움이 됐어요 토글 동작을 분리하기 위해                  |
| `src/entities/comment/api/reportComment.ts`     | `POST /comments/{commentId}/reports` 호출 | 댓글 신고 로직과 응답 타입을 통일하기 위해               |

---

## 4) 흐름 요약

1. 화면 컴포넌트는 `features/*/model` 훅을 사용
2. 훅은 `entities/*/api` 함수를 호출
3. API 함수는 `shared/api/client.ts`를 통해 요청
4. 공통 에러/응답/캐시 정책은 `shared/api/*`에서 일괄 관리

이 구조를 유지하면, 백엔드 스펙 변경 시 주로 `entities/model + entities/api`만 수정하면 되고, 화면 영향 범위를 줄일 수 있습니다.
