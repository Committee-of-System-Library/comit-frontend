# Post Refactor Docs

게시글 도메인 프론트 리팩토링을 구현 전에 정렬하기 위한 상세 문서 모음.

## 목적

- 구현 전에 왜 바꾸는지, 어떤 흐름을 고정할지, 어디까지를 이번 범위로 볼지 명확히 한다.
- 화면별 임시 처리와 실제 계약 차이를 줄인다.
- 공통 규칙을 먼저 문서화해 같은 문제가 카드/상세/관리자 화면에서 반복되지 않게 한다.

## 공통 원칙

- UI 컴포넌트는 표현 책임만 가진다.
- 상태 전환, 캐시, 에러 파싱, URL 조합 규칙은 공통 레이어에서 결정한다.
- 백엔드 계약이 있는 항목은 가능한 한 응답 모델과 가깝게 정규화한다.
- 임시 fallback은 허용하되, fallback이 실제 소스 오브 트루스처럼 보이지 않게 한다.
- 구현 전 검증 포인트는 `frontend-intent-qa` 형식으로 먼저 정리한다.

## 문서 목록

- [좋아요 낙관적 업데이트 리팩토링](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/docs/refactors/post-like-optimistic-update.md)
- [오른쪽 레일 캐시 전략 리팩토링](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/docs/refactors/right-rail-cache-strategy.md)
- [포스트 도메인 에러 처리 리팩토링](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/docs/refactors/post-domain-error-handling.md)
- [게시글 공유 URL 도메인 리팩토링](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/docs/refactors/post-share-domain-config.md)

## 참고 자료

- 프론트 레포: [knu-cse-comit-client](/Users/bohyeong/IdeaProjects/knu-cse-comit-client)
- 백엔드 API 문서: [index.html](/Users/bohyeong/IdeaProjects/knu-cse-comit-server/docs/api/index.html)
- 현재 게시글 상세 카드: [PostDetailCard.tsx](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/shared/ui/PostDetailCard/PostDetailCard.tsx)
- 현재 게시글 상세 페이지: [PostPage.tsx](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/pages/PostPage.tsx)
- 현재 오른쪽 레일: [DefaultRightRail.tsx](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/widgets/layout/DefaultRightRail.tsx)
- 현재 공통 API 클라이언트: [client.ts](/Users/bohyeong/IdeaProjects/knu-cse-comit-client/src/shared/api/client.ts)

## 권장 적용 순서

1. 에러 처리 규칙을 먼저 통일한다.
2. 오른쪽 레일의 불필요한 요청과 unsupported board 요청을 정리한다.
3. 좋아요 낙관적 업데이트를 짧은 optimistic window 기준으로 정리한다.
4. 공유 URL 도메인 생성을 env + 런타임 fallback 규칙으로 통일한다.

## 완료 기준

- 각 문서가 구현 단위와 파일 영향 범위를 분명히 설명한다.
- 테스트 체크리스트가 포함되어 있다.
- 비목표가 적혀 있어 후속 작업과 경계가 분리된다.
