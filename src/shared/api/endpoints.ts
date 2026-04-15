export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    registerProfileImagePresigned: "/auth/register/profile-image/presigned",
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
    nicknameCheck: "/members/nicknames/check",
    me: "/members/me",
    studentNumberVisibility: "/members/me/student-number-visibility",
    myActivity: "/members/me/activity",
    myPosts: "/members/me/posts",
    myComments: "/members/me/comments",
    myLikes: "/members/me/likes",
  },
  post: {
    base: "/posts",
    delete: (postId: number) => `/posts/${postId}`,
    detail: (postId: number) => `/posts/${postId}`,
    hot: "/posts/hot",
    like: (postId: number) => `/posts/${postId}/like`,
    report: (postId: number) => `/posts/${postId}/reports`,
    search: "/posts/search",
    update: (postId: number) => `/posts/${postId}`,
  },
} as const;
