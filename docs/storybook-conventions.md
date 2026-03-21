# Storybook Conventions

## 목적
- 프론트 3명이 동시에 컴포넌트를 개발할 때 UI 품질과 문서화 포맷을 통일한다.

## 기본 원칙
- 스토리는 CSF3 + TypeScript 기준으로 작성한다.
- 각 컴포넌트는 최소 `Default`, `Disabled`, `EdgeCase` 스토리를 가진다.
- `tags: ["autodocs"]`를 기본으로 사용한다.

## 파일 규칙
- 컴포넌트: `src/shared/ui/<Component>/<Component>.tsx`
- 스토리: `src/shared/ui/<Component>/<Component>.stories.tsx`
- 샘플 템플릿: `src/stories/Foundations/StoryTemplate.stories.tsx`

## 전역 환경
- 전역 다크 배경: `#121212`
- 기본 뷰포트: `Desktop 1440 (base)`
- 제공 뷰포트: 1200 / 1440 / 1920
- 전역 데코레이터: `MemoryRouter`, `QueryClientProvider`

## PR 체크리스트
- 스토리 기본 3종(`Default`, `Disabled`, `EdgeCase`) 작성
- 접근성 경고(`a11y`) 확인
- `pnpm storybook` 또는 `pnpm build-storybook` 통과
