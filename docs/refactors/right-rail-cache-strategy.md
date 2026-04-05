# Right Rail 캐시 전략 리팩터 가이드

```ts
/**
 * [Intent]
 * 우측 레일의 공지/이벤트/인기글 데이터를 화면 렌더링과 분리하고,
 * 지원되지 않는 `/posts` 조회를 반복하지 않도록 캐시와 fallback 정책을 고정한다.
 */

const FQA = {
  intent:
    "우측 레일은 보조 정보 영역이므로, 빠른 표시와 낮은 네트워크 비용을 동시에 만족해야 한다.",
  userSignal:
    "현재 `DefaultRightRail`가 마운트될 때 공지, 이벤트, 인기글을 각각 즉시 조회하며, 실패 시에도 기본 retry가 붙어 동일 요청이 반복될 수 있다.",
  happyPath:
    "레이아웃 진입 시 우측 레일은 먼저 캐시를 사용하고, 지원되는 데이터만 정해진 주기로 한 번만 갱신한다.",
  edgeCases: [
    {
      case: "backend가 `/posts`에서 `NOTICE`/`EVENT`를 지원하지 않음",
      check: "boardType allow-list가 있는지 확인한다",
      expected: "네트워크 요청을 보내지 않고 fallback 또는 캐시를 사용한다",
    },
    {
      case: "초기 진입 시 캐시가 비어 있음",
      check: "cold start에서 right rail이 어떻게 채워지는지 확인한다",
      expected: "스켈레톤 또는 mock fallback으로 즉시 렌더링한다",
    },
    {
      case: "네트워크 오류가 발생함",
      check: "react-query retry와 refetch 정책을 확인한다",
      expected: "불필요한 재시도를 막고 마지막 성공값 또는 fallback으로 유지한다",
    },
  ],
  guards: [
    "right rail이 실제로 렌더링될 때만 쿼리를 활성화한다",
    "지원되지 않는 boardType은 queryFn 실행 전에 차단한다",
    "API mismatch로 판단되면 같은 세션에서 반복 재시도를 중단한다",
  ],
  invariants: [
    "우측 레일은 UI 컴포넌트가 아니라 데이터 소비자이므로, 데이터 소유권을 직접 가져가지 않는다",
    "NOTICE/EVENT는 `/posts` 일반 목록 계약과 분리한다",
    "보조 피드는 메인 게시판 목록 페이지의 캐시 정책과 같은 기준으로 취급하지 않는다",
  ],
  persistence: [
    "반복 방문 시에는 같은 세션의 마지막 성공값을 우선 사용한다",
    "TanStack Query v5 기준 `gcTime`(기존 `cacheTime`)으로 짧은 재방문 캐시를 유지한다",
  ],
  observability: [
    "캐시 히트/미스, fallback 사용, API mismatch, retry suppression을 계측한다",
  ],
}
```

## 1. 현재 코드 기준

현재 `DefaultRightRail`는 렌더링 시 다음 쿼리를 바로 실행한다.

- `usePostListQuery({ boardType: "NOTICE", size: 3 })`
- `usePostListQuery({ boardType: "EVENT", size: 3 })`
- `useHotPostsQuery()`

관련 훅은 현재 `enabled` 외에 별도 정책이 없다.

- `usePostListQuery`는 `queryKey: queryKeys.post.list({ boardType, cursor, size })`만 사용한다.
- `useHotPostsQuery`는 `queryKey: queryKeys.post.hot()`만 사용한다.
- 둘 다 기본 `react-query` 동작에 기대므로, stale 상태 판단과 retry가 기본값으로 적용된다.

중요한 현실 제약은 backend `/posts` 계약이다.

- 현재 backend는 `/posts`에서 `FREE`와 `QNA`만 지원한다.
- 따라서 `NOTICE`/`EVENT`를 일반 `getPosts`로 조회하는 방식은 서버 계약과 맞지 않는다.
- 이 상태에서 right rail이 공지/이벤트를 계속 조회하면, 실패 요청이 반복되거나 빈 응답을 잘못된 정상 상태로 오해할 수 있다.

## 2. 지금 생기는 duplicate request

문제는 단순히 "같은 쿼리가 두 번 호출된다"가 아니다.

- 우측 레일이 마운트될 때마다 공지, 이벤트, 인기글을 모두 조회한다.
- 기본 `staleTime`이 0이면, 짧은 재진입이나 리렌더 이후에도 다시 stale로 판단될 수 있다.
- 기본 `retry`가 남아 있으면, 실패한 `/posts?boardType=NOTICE`나 `/posts?boardType=EVENT` 요청이 한 번 더, 또는 여러 번 반복된다.
- UI는 mock fallback으로 버티기 때문에, 네트워크 문제와 계약 문제를 개발자가 늦게 발견하기 쉽다.

즉, 현재 구조는 "화면은 보이지만 잘못된 요청이 계속 나가는 상태"다.

## 3. 리팩터 목표

리팩터의 목표는 세 가지다.

1. 우측 레일은 데이터를 소유하지 않고, 이미 검증된 데이터만 소비한다.
2. 공지/이벤트는 지원되지 않는 `/posts` 경로를 반복 호출하지 않는다.
3. 인기글과 공지/이벤트의 캐시 정책을 분리해서, 각 피드의 freshness 요구를 다르게 관리한다.

## 4. 권장 캐시 소유권

권장은 `DefaultRightRail` 내부에 쿼리를 두지 않는 것이다.

### 권장 구조

- `DefaultRightRail`: 순수 렌더링 컴포넌트
- `useRightRailData` 같은 전용 훅: 우측 레일의 데이터 전략을 한곳에서 제어
- `usePostListQuery`: 게시판 페이지 전용 목록 조회
- `useHotPostsQuery`: 인기글처럼 공용성이 높은 피드 전용 조회

### 왜 분리해야 하는가

- 게시판 페이지는 페이지네이션과 검색이 핵심이고, 우측 레일은 고정 소형 리스트가 핵심이다.
- 두 화면이 같은 `post.list` 개념을 공유해도, freshness와 fallback 규칙은 같지 않다.
- 공지/이벤트는 게시판 목록과 다른 생명주기를 가지므로, 같은 `boardType` 목록 훅에 억지로 얹지 않는 편이 낫다.

### 캐시 키 원칙

- `post.list` 키는 실제로 지원되는 목록 조회에만 사용한다.
- 우측 레일 전용 피드는 별도 키를 둔다.
- unsupported boardType을 "존재하는 캐시 키"로 가장하지 않는다.

## 5. fallback 정책

우측 레일은 실패를 사용자에게 바로 노출하는 영역이 아니다. 따라서 fallback이 중요하다.

### 권장 우선순위

1. 명시적으로 전달된 props
2. 같은 세션의 마지막 성공 캐시
3. 서버 응답
4. 정적 fallback mock

### 정책 세부

- unsupported boardType 에러는 일반 네트워크 실패와 다르게 취급한다.
- 404/400/422처럼 계약 불일치가 명확하면 즉시 fallback으로 전환한다.
- empty list는 실패가 아니라 정상 상태로 본다.
- fallback은 "데이터가 없는 것"과 "요청이 실패한 것"을 구분해서 렌더링해야 한다.

### 금지

- 실패한 동일 요청을 자동으로 재시도하면서 mock으로 덮어쓰는 패턴
- 서버 미지원 boardType을 "잠깐 비어 있는 목록"으로 취급하는 패턴

## 6. staleTime / cacheTime 전략

우측 레일은 메인 콘텐츠가 아니므로 초 단위 최신성이 필요하지 않다.

### 권장 기본값

- `hotPosts`: `staleTime` 1~5분, `cacheTime/gcTime` 30분 내외
- `notice/event`: `staleTime` 10~30분, `cacheTime/gcTime` 6~24시간
- mock fallback: query cache 대상이 아니라 상수 데이터로 유지

### 적용 원칙

- `refetchOnWindowFocus`는 기본적으로 끈다.
- `refetchOnMount`는 staleTime과 함께 판단한다.
- `retry`는 unsupported boardType이나 contract error에 대해 사실상 0으로 둔다.

### 실무 해석

- 인기글은 다른 사용자 행동에 따라 상대적으로 자주 바뀌므로 더 짧게 잡는다.
- 공지/이벤트는 변경 빈도가 낮으므로 더 길게 잡는다.
- 우측 레일은 "항상 최신"보다 "항상 빨리"가 더 중요하다.

## 7. query enable / disable 조건

쿼리는 "컴포넌트가 존재한다"는 이유만으로 켜지면 안 된다.

### 반드시 켜져야 하는 조건

- 우측 레일이 실제로 화면에 보인다
- boardType이 backend에서 지원된다
- 해당 데이터가 이번 라우트에서 실제로 필요하다

### 반드시 꺼야 하는 조건

- 모바일/브레이크포인트에서 우측 레일이 숨겨진다
- boardType이 `/posts` 계약 밖이다
- 이전 응답이 contract mismatch로 판정되었다
- 상위 페이지가 이미 동일 데이터를 충분히 제공한다

### 구현 팁

- `enabled`는 단순 boolean이 아니라, "보여야 하는가"와 "요청해도 되는가"를 함께 반영한다.
- `DefaultRightRail`이 오직 시각 컴포넌트가 되면, enable 조건을 외부에서 주입하기 쉬워진다.

## 8. API mismatch 처리

현재 상황에서 가장 중요한 부분이다.

### 판정 기준

- `boardType`이 `FREE` 또는 `QNA`가 아닌데 `/posts`로 가려고 하면 mismatch 후보로 본다.
- 서버가 4xx를 반환하고, 메시지나 에러 코드가 계약 불일치를 시사하면 mismatch로 분류한다.
- 단순 5xx는 인프라 실패로 보고 별도 fallback을 쓴다.

### 처리 원칙

- mismatch는 한 번만 기록한다.
- 같은 세션에서 같은 unsupported 요청을 다시 시도하지 않는다.
- mismatch가 나면 우측 레일은 안정적으로 mock 또는 마지막 성공값으로 내려간다.

### 추가 권장

- boardType allow-list를 공용 상수로 둔다.
- `/posts`를 호출하는 훅 내부에서 mismatch를 발견하면 queryFn 전에 바로 실패시킨다.
- 로그에는 요청 파라미터 전체를 남기되, 사용자 화면에는 과한 에러 문구를 노출하지 않는다.

## 9. observability

이 리팩터는 네트워크 최적화이므로 측정이 필요하다.

### 최소 계측 항목

- right rail 캐시 hit/miss 비율
- unsupported boardType 차단 횟수
- retry suppression 횟수
- fallback으로 전환된 횟수
- `/posts`에서 FREE/QNA 외 요청이 발생했는지 여부

### 운영 확인 포인트

- 개발 환경에서 브라우저 Network 탭에 `/posts?boardType=NOTICE`나 `/posts?boardType=EVENT`가 남지 않아야 한다.
- 오류 수집 도구가 있다면 mismatch를 별도 태그로 분류한다.
- hotPosts가 너무 자주 갱신되면 staleTime을 늘린다.

## 10. 테스트 체크리스트

### 단위 테스트

- unsupported boardType이면 queryFn이 호출되지 않는다.
- enabled가 false면 네트워크 요청이 발생하지 않는다.
- fallback 우선순위가 props > cache > server > mock 순서로 동작한다.

### 훅 테스트

- `useHotPostsQuery`가 staleTime 내 재진입 시 즉시 캐시를 반환한다.
- contract error 발생 시 retry가 반복되지 않는다.
- 동일 쿼리 키에 대해 중복 mount가 있어도 불필요한 추가 요청이 생기지 않는다.

### 통합 테스트

- `DefaultRightRail` 렌더링 시 `/posts`는 FREE/QNA만 호출되거나 아예 호출되지 않는다.
- 공지/이벤트가 미지원 상태일 때도 우측 레일 UI는 깨지지 않는다.
- 모바일/숨김 상태에서는 right rail 네트워크 요청이 없다.

### 회귀 테스트

- 게시판 페이지의 `usePostListQuery`는 기존 동작을 유지한다.
- 인기글 카드의 정렬/매핑 결과가 바뀌지 않는다.

## 11. 롤아웃 순서

1. 우측 레일 전용 데이터 경계와 allow-list를 만든다.
2. `DefaultRightRail`에서 직접 쿼리 호출을 제거한다.
3. notice/event fallback과 retry suppression을 추가한다.
4. hotPosts와 notice/event에 서로 다른 staleTime을 적용한다.
5. Network 로그와 테스트로 `/posts` 미지원 요청이 사라졌는지 확인한다.
6. 필요하면 mock fallback을 더 얇게 정리한다.

## 12. 비목표

이 문서는 다음을 목표로 하지 않는다.

- 우측 레일 UI 자체의 재디자인
- backend에 notice/event 전용 API를 새로 만드는 작업
- 전역 상태 관리 라이브러리 도입
- 실시간 소켓/폴링 기반 live update 도입
- 게시판 페이지의 전체 목록 캐시 전략 변경

## 13. 최종 판단

우측 레일은 "데이터를 빨리 보여주는 보조 영역"이지 "게시판 계약을 실험하는 진입점"이 아니다.

따라서 right rail은 지원된 데이터만 읽고, unsupported boardType은 초기에 차단하며, 실패는 한 번만 처리하고, 이후에는 캐시 또는 fallback으로 안정화하는 방향이 맞다.
