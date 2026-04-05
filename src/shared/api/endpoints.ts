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
    helpful: (commentId: number) => `/comments/${commentId}/helpful`,
    report: (commentId: number) => `/comments/${commentId}/reports`,
  },
  member: {
    me: "/members/me",
    studentNumberVisibility: "/members/me/student-number-visibility",
    myPosts: "/members/me/posts",
    myComments: "/members/me/comments",
    myLikes: "/members/me/likes",
  },
  post: {
    base: "/posts",
    detail: (postId: number) => `/posts/${postId}`,
    hot: "/posts/hot",
    like: (postId: number) => `/posts/${postId}/like`,
    report: (postId: number) => `/posts/${postId}/reports`,
  },
} as const;
