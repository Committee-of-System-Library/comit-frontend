# SSO 인증 이관 가이드

> `comit-sso-smoke` 파일럿 페이지에서 검증한 SSO 인증 흐름을 `knu-cse-comit-client`로 이관하기 위한 문서입니다.

---

## 전체 플로우

```
[프론트] GET /auth/sso/login
         ↓ 302 redirect
[SSO 서버] 로그인 화면
         ↓ 로그인 완료
[백엔드] GET /auth/sso/callback?state=...&token=...
         ↓ 가입 여부 판단
         ├─ 기존 회원 → redirect → /?stage=success
         ├─ 신규 회원 → redirect → /register?stage=register
         └─ 에러 → redirect → /?stage=error&reason=...

[신규 회원 경로]
[프론트] GET /auth/register/prefill      ← 학번·이름·전공 자동완성용
         ↓
[프론트] POST /auth/register             ← 닉네임·연락처·약관 동의 입력
         ↓
[프론트] GET /members/me                 ← 로그인 상태 확인
```

---

## 백엔드 API 명세

### 1. SSO 로그인 시작

```
GET /auth/sso/login
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `redirectUri` | String | 선택 | 콜백 후 돌아올 프론트 base URL. allowlist 검증 통과해야 함 |

- 호출하면 **브라우저를 SSO 서버 로그인 화면으로 리다이렉트**시킴 (`window.location.assign` 사용)
- `credentials: "include"` 필요 (state 쿠키 발급)
- `redirectUri`를 넘기면 콜백 후 해당 URL에 `?stage=...` 붙여서 복귀

**에러**

| errorCode | 상태 | 발생 조건 |
|-----------|------|---------|
| `INVALID_REQUEST` | 400 | redirectUri가 절대 URI가 아니거나 allowlist 미등록 도메인 |

---

### 2. SSO 콜백 처리 (백엔드 내부 처리)

```
GET /auth/sso/callback?state=...&token=...
```

프론트에서 직접 호출하지 않음. 백엔드가 처리한 뒤 **아래 URL로 리다이렉트**시킴.

| stage | 이동 URL | 의미 |
|-------|---------|------|
| `success` | `{redirectUri}?stage=success` | 기존 회원 로그인 성공, 세션 쿠키 발급됨 |
| `register` | `{redirectUri}?stage=register` | 신규 회원, SSO 토큰 쿠키 보유 상태 |
| `error` | `{redirectUri}?stage=error&reason=...` | 인증 실패 |

---

### 3. 회원가입 prefill 조회

```
GET /auth/register/prefill
credentials: "include"
```

**응답 바디**

```ts
interface RegisterPrefillResponse {
  name: string | null;
  studentNumber: string | null;
  major: string | null;
}
```

**에러**

| errorCode | 상태 | 발생 조건 |
|-----------|------|---------|
| `UNAUTHORIZED` | 401 | SSO 토큰 쿠키 없거나 만료 |
| `MEMBER_ALREADY_EXISTS` | 409 | 이미 가입된 회원 |

---

### 4. 회원가입 완료

```
POST /auth/register
Content-Type: application/json
credentials: "include"
```

**요청 바디**

```ts
interface RegisterRequest {
  nickname: string;   // 1~15자
  phone: string;      // 숫자·하이픈만, 10~15자 (예: "010-1234-5678")
  agreedToTerms: boolean; // 반드시 true
}
```

**응답:** `{ result: "SUCCESS" }`

**에러**

| errorCode | 상태 | 발생 조건 |
|-----------|------|---------|
| `INVALID_REQUEST` | 400 | agreedToTerms가 false이거나 형식 오류 |
| `UNAUTHORIZED` | 401 | SSO 토큰 쿠키 없거나 만료 |
| `MEMBER_ALREADY_EXISTS` | 409 | 이미 가입된 ssoSub |
| `DUPLICATE_NICKNAME` | 409 | 닉네임 중복 |

---

### 5. SSO 로그아웃

```
POST /auth/sso/logout
credentials: "include"
```

- SSO 토큰 쿠키 + state 쿠키 제거
- 응답: `{}`

---

## 프론트엔드 구현 체크리스트

### 라우트 설계

| 경로 | 역할 |
|------|------|
| `/login` | SSO 로그인 시작 버튼 |
| `/register` | 회원가입 폼 (prefill → 입력 → 완료) |

### 환경변수

백엔드 staging에서 아래 값을 클라이언트 도메인으로 설정해야 콜백이 돌아옴:

```env
COMIT_AUTH_SSO_FRONTEND_SUCCESS_URL=https://<your-domain>?stage=success
COMIT_AUTH_SSO_FRONTEND_REGISTER_URL=https://<your-domain>/register?stage=register
COMIT_AUTH_SSO_FRONTEND_ERROR_URL=https://<your-domain>/login?stage=error
```

CORS도 추가:

```env
COMIT_WEB_CORS_ALLOWED_ORIGINS=https://<your-domain>,...
```

### 로그인 시작

```ts
// credentials: "include" 불필요 (리다이렉트이므로)
// window.location.assign으로 이동
const startSsoLogin = () => {
  window.location.assign(`${API_BASE_URL}/auth/sso/login`);
};
```

`redirectUri`를 넘기면 콜백 후 해당 URL 기준으로 복귀:

```ts
const startSsoLogin = (currentOrigin: string) => {
  const url = new URL(`${API_BASE_URL}/auth/sso/login`);
  url.searchParams.set("redirectUri", currentOrigin);
  window.location.assign(url.toString());
};
```

### 콜백 처리 (URL query param 읽기)

SSO 콜백 후 백엔드가 `?stage=success|register|error`를 붙여 돌려보냄.

```ts
const params = new URLSearchParams(window.location.search);
const stage = params.get("stage");
const reason = params.get("reason");

if (stage === "success") {
  // 로그인 완료 → 메인으로 이동 + 쿼리 파라미터 제거
} else if (stage === "register") {
  // 회원가입 페이지로 이동
  navigate("/register");
} else if (stage === "error") {
  // 에러 안내 (reason 파라미터 참고)
}
```

### 회원가입 페이지 (`/register`)

```ts
// 1. prefill 조회
const prefill = await apiClient.get<RegisterPrefillResponse>("/auth/register/prefill");
// prefill.name, prefill.studentNumber, prefill.major → 폼에 자동완성 (읽기 전용 표시 권장)

// 2. 폼 입력 후 제출
await apiClient.post("/auth/register", {
  nickname,
  phone,
  agreedToTerms: true,
});

// 3. 완료 후 홈으로 이동
navigate("/");
```

### 에러 분기 포인트

- prefill 조회 시 `MEMBER_ALREADY_EXISTS` → 이미 가입됨, 로그인 페이지로 이동
- register 시 `DUPLICATE_NICKNAME` → 닉네임 중복 안내 (폼 에러 표시)
- register 시 `UNAUTHORIZED` → SSO 토큰 만료, 로그인 재시도 안내

### 로그아웃

```ts
await apiClient.post("/auth/sso/logout");
// 로컬 쿼리 캐시 전체 초기화
queryClient.clear();
navigate("/login");
```

---

## smoke 파일럿과 달라지는 점

| 항목 | smoke 페이지 | comit-client |
|------|------------|-------------|
| stage 감지 | URL query param 직접 읽기 | `useSearchParams` 훅 |
| API 호출 | 인라인 `fetch` | `apiClient` (공통 에러 처리 포함) |
| 인증 상태 | localStorage 미사용 | `useMyProfileQuery` (쿠키 기반) |
| 회원가입 폼 | 단순 input | react-hook-form + zod 스키마 검증 |
| 에러 처리 | alert | toast + 폼 필드 에러 표시 |
| 로그아웃 후 | 없음 | `queryClient.clear()` + 리다이렉트 |
