# Features 레이어 가이드

이 문서는 Comit FE에서 `features` 레이어를 **왜 도입하는지**, **어떻게 활용하는지**를 팀원이 빠르게 이해할 수 있도록 정리한 문서입니다.

## 1) 한 줄 정의

`features`는 **화면에서 바로 사용하는 비즈니스 단위 훅/로직**을 두는 레이어입니다.

- `entities`: 순수 API 함수/도메인 타입
- `features`: entities를 조합한 화면용 query/mutation 훅
- `pages/widgets`: UI 렌더링과 이벤트 연결

## 2) 왜 필요한가 (도입 이유)

## 2-1) UI 코드에서 데이터 로직을 분리하기 위해

페이지에서 직접 `useQuery/useMutation` + API 호출 + invalidate를 작성하면 파일이 빠르게 비대해집니다.  
`features`로 분리하면 UI는 렌더링에 집중할 수 있습니다.

## 2-2) 중복 방지

같은 API를 여러 화면에서 쓸 때, 매번 queryKey/재시도/후처리 코드를 복붙하지 않게 됩니다.

## 2-3) 정책 일관성

성공 후 캐시 무효화, 에러 처리 기준, enabled 조건 같은 정책을 한 곳에서 통일할 수 있습니다.

## 2-4) 유지보수 비용 절감

정책 변경이 생기면 `features`만 수정하면 되어 페이지 수정 범위를 줄일 수 있습니다.

---

## 3) 어디에 무엇을 둘지 기준

## `entities/*`
- API 스펙 단위 함수
- request/response 타입
- 부작용 없는 순수 호출 함수

예: `register(payload)`, `getPosts(params)`

## `features/*`
- `useQuery`, `useMutation`
- queryKey 선택
- invalidateQueries
- 화면에서 반복 사용하는 흐름 캡슐화

예: `useRegisterMutation()`, `usePostListQuery()`

## `pages/widgets`
- 버튼 클릭, 입력값 관리, 레이아웃 렌더링
- 가능한 한 `features` 훅만 호출

---

## 4) 현재 코드 기준 예시

### 4-1) 회원가입 mutation

`entities`는 순수 요청만 담당합니다.

```ts
// src/entities/auth/api/register.ts
export const register = (payload: RegisterRequest) => {
  return apiClient.post<void>(API_ENDPOINTS.auth.register, {
    body: payload,
  });
};
```

`features`는 화면 동작 규칙(캐시 무효화)을 추가합니다.

```ts
// src/features/signup/model/useRegisterMutation.ts
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.member.all }),
      ]);
    },
  });
};
```

페이지는 훅만 사용합니다.

```tsx
const { mutateAsync, isPending } = useRegisterMutation();

const onSubmit = async (form: RegisterFormValues) => {
  await mutateAsync({
    nickname: form.nickname,
    phone: form.phone,
  });
};
```

### 4-2) 회원가입 prefill 조회

```ts
// src/features/signup/model/useRegisterPrefillQuery.ts
export const useRegisterPrefillQuery = (
  options: UseRegisterPrefillQueryOptions = {},
) => {
  const { enabled = true } = options;

  return useQuery({
    enabled,
    queryFn: getRegisterPrefill,
    queryKey: queryKeys.auth.registerPrefill(),
  });
};
```

---

## 5) features를 쓰지 않았을 때 생기는 문제

1. 페이지마다 queryKey 이름이 달라짐  
2. mutation 성공 후 invalidate 누락  
3. 같은 에러를 화면마다 다르게 처리  
4. UI 파일이 API 상세 로직까지 떠안아 가독성 하락

---

## 6) axios/fetch와의 관계

`features`는 HTTP 도구(axios/fetch)와 별개입니다.

- axios/fetch: 요청을 보내는 기술 선택
- features: 화면 동작을 조립하는 아키텍처 선택

즉, axios를 쓰더라도 `features` 레이어는 그대로 필요합니다.

---

## 7) 새 기능 추가 시 추천 순서

예: 게시글 목록 조회 추가

1. `entities/post/model/types.ts`에 타입 추가  
2. `entities/post/api/getPosts.ts` 작성  
3. `features/post/model/usePostListQuery.ts` 작성  
4. `pages`에서 훅 연결

---

## 8) 작성 템플릿 (복붙용)

```ts
import { useQuery } from "@tanstack/react-query";

import { someApi } from "@/entities/some/api/someApi";
import { queryKeys } from "@/shared/api/query-keys";

interface UseSomeQueryParams {
  enabled?: boolean;
  id: number;
}

export const useSomeQuery = ({ id, enabled = true }: UseSomeQueryParams) => {
  return useQuery({
    enabled,
    queryFn: () => someApi(id),
    queryKey: queryKeys.some.detail(id),
  });
};
```

---

## 9) 코드 리뷰 체크리스트

- [ ] 페이지에서 직접 `fetch`/`apiClient`를 호출하지 않았는가?
- [ ] queryKey를 `queryKeys`에서만 생성했는가?
- [ ] mutation 성공 후 필요한 invalidate를 넣었는가?
- [ ] entities와 features의 책임이 섞이지 않았는가?

---

## 10) 요약

- `entities`는 “순수 API”
- `features`는 “화면용 완성 훅”
- `pages`는 “UI 조립”

이 분리를 지키면 팀 병렬 작업 시 충돌이 줄고, 유지보수 비용이 크게 낮아집니다.
