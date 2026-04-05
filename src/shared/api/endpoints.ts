export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    registerPrefill: "/auth/register/prefill",
    ssoCallback: "/auth/sso/callback",
    ssoLogin: "/auth/sso/login",
    ssoLogout: "/auth/sso/logout",
  },
  comment: {
    byPost: (postId: number) => `/posts/${postId}/comments`,
    detail: (commentId: number) => `/comments/${commentId}`,
    like: (commentId: number) => `/comments/${commentId}/like`,
    report: (commentId: number) => `/comments/${commentId}/reports`,
  },
  image: {
    base: "/images",
    presigned: "/images/presigned",
  },
  member: {
    me: "/members/me",
    studentNumberVisibility: "/members/me/student-number-visibility",
  },
  post: {
    base: "/posts",
    delete: (postId: number) => `/posts/${postId}`,
    detail: (postId: number) => `/posts/${postId}`,
    hot: "/posts/hot",
    like: (postId: number) => `/posts/${postId}/like`,
    report: (postId: number) => `/posts/${postId}/reports`,
    update: (postId: number) => `/posts/${postId}`,
  },
} as const;
