type PostListKeyParams = {
  boardType: string;
  cursor?: number | null;
  size?: number;
};

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    registerPrefill: () => ["auth", "register-prefill"] as const,
  },
  comment: {
    all: ["comment"] as const,
    byPost: (postId: number) => ["comment", "post", postId] as const,
  },
  member: {
    all: ["member"] as const,
    me: () => ["member", "me"] as const,
    myActivity: () => ["member", "my-activity"] as const,
    myPosts: () => ["member", "my-posts"] as const,
    myComments: () => ["member", "my-comments"] as const,
    myLikes: () => ["member", "my-likes"] as const,
  },
  post: {
    all: ["post"] as const,
    detail: (postId: number) => ["post", "detail", postId] as const,
    hot: () => ["post", "hot"] as const,
    list: (params: PostListKeyParams) => ["post", "list", params] as const,
    search: (
      keyword: string,
      cursor?: number,
      boardType?: string,
      size?: number,
    ) => ["post", "search", keyword, cursor, boardType, size] as const,
  },
};
