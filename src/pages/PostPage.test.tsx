import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import PostPage from "./PostPage";

const mocks = vi.hoisted(() => ({
  createCommentMutate: vi.fn(),
  deleteCommentMutate: vi.fn(),
  deletePostMutateAsync: vi.fn(),
  navigate: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
  toggleLikeMutateAsync: vi.fn(),
  useCommentsQuery: vi.fn(),
  useCreateCommentMutation: vi.fn(),
  useDeleteCommentMutation: vi.fn(),
  useDeletePostMutation: vi.fn(),
  useMyProfileQuery: vi.fn(),
  usePostDetailQuery: vi.fn(),
  useTogglePostLikeMutation: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: mocks.toastError,
    success: mocks.toastSuccess,
  },
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
  useParams: () => ({ postId: "123" }),
}));

vi.mock("@/features/comment/model/useCommentsQuery", () => ({
  useCommentsQuery: mocks.useCommentsQuery,
}));

vi.mock("@/features/comment/model/useCreateCommentMutation", () => ({
  useCreateCommentMutation: mocks.useCreateCommentMutation,
}));

vi.mock("@/features/comment/model/useDeleteCommentMutation", () => ({
  useDeleteCommentMutation: mocks.useDeleteCommentMutation,
}));

vi.mock("@/features/member/model/useMyProfileQuery", () => ({
  useMyProfileQuery: mocks.useMyProfileQuery,
}));

vi.mock("@/features/post/model/usePostDetailQuery", () => ({
  usePostDetailQuery: mocks.usePostDetailQuery,
}));

vi.mock("@/features/post/model/useTogglePostLikeMutation", () => ({
  useTogglePostLikeMutation: mocks.useTogglePostLikeMutation,
}));

vi.mock("@/features/post/model/useDeletePostMutation", () => ({
  useDeletePostMutation: mocks.useDeletePostMutation,
}));

vi.mock("@/shared/ui/PostDetailCard/PostDetailCard", () => ({
  PostDetailCard: ({
    isMine,
    onDelete,
  }: {
    isMine?: boolean;
    onDelete?: () => void;
  }) => (
    <div>
      {isMine ? (
        <button onClick={onDelete} type="button">
          게시글 삭제 열기
        </button>
      ) : (
        <div>내 글 아님</div>
      )}
    </div>
  ),
}));

vi.mock("@/shared/ui/CommentInput/CommentInput", () => ({
  CommentInput: () => <div>comment-input</div>,
}));

vi.mock("@/shared/ui/CommentGroup/CommentGroup", () => ({
  CommentGroup: () => <div>comment-group</div>,
}));

vi.mock("@/shared/ui/ReportModal/ReportModal", () => ({
  ReportModal: () => <div>report-modal</div>,
}));

vi.mock("@/shared/ui/DeleteModal/DeleteModal", () => ({
  DeleteModal: ({
    target,
    onClose,
    onConfirm,
  }: {
    target: "comment" | "post";
    onClose: () => void;
    onConfirm: () => void;
  }) => (
    <div data-testid={`delete-modal-${target}`}>
      <button onClick={onConfirm} type="button">
        {`${target}-confirm`}
      </button>
      <button onClick={onClose} type="button">
        {`${target}-close`}
      </button>
    </div>
  ),
}));

describe("PostPage delete post flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const postDetail = {
    authorNickname: "작성자닉네임",
    boardType: "QNA" as const,
    content: "게시글 본문입니다.",
    createdAt: "2026-04-01T00:00:00Z",
    id: 123,
    likeCount: 3,
    likedByMe: false,
    tags: [],
    title: "게시글 제목",
    updatedAt: null,
    viewCount: 10,
  };

  const setupCommonMocks = () => {
    mocks.useMyProfileQuery.mockReturnValue({
      data: { nickname: "작성자닉네임" },
    });
    mocks.usePostDetailQuery.mockReturnValue({
      data: postDetail,
      error: null,
      isError: false,
      isLoading: false,
    });
    mocks.useTogglePostLikeMutation.mockReturnValue({
      isPending: false,
      mutateAsync: mocks.toggleLikeMutateAsync,
    });
    mocks.useCommentsQuery.mockReturnValue({
      data: { comments: [] },
      isLoading: false,
    });
    mocks.useCreateCommentMutation.mockReturnValue({
      isPending: false,
      mutate: mocks.createCommentMutate,
    });
    mocks.useDeleteCommentMutation.mockReturnValue({
      mutate: mocks.deleteCommentMutate,
    });
    mocks.useDeletePostMutation.mockReturnValue({
      isPending: false,
      mutateAsync: mocks.deletePostMutateAsync,
    });
  };

  it("내 게시글 삭제 확인 시 deletePost를 호출하고 게시판으로 이동한다", async () => {
    setupCommonMocks();
    mocks.deletePostMutateAsync.mockResolvedValueOnce(undefined);

    const { getByRole, getByTestId } = render(<PostPage />);

    fireEvent.click(getByRole("button", { name: "게시글 삭제 열기" }));
    expect(getByTestId("delete-modal-post")).toBeInTheDocument();

    fireEvent.click(getByRole("button", { name: "post-confirm" }));

    await vi.waitFor(() => {
      expect(mocks.deletePostMutateAsync).toHaveBeenCalledWith(123);
      expect(mocks.toastSuccess).toHaveBeenCalledWith(
        "게시글이 삭제되었습니다.",
      );
      expect(mocks.navigate).toHaveBeenCalledWith("/board/qna", {
        replace: true,
      });
    });
  });

  it("게시글 삭제 실패 시 에러 토스트를 노출한다", async () => {
    setupCommonMocks();
    mocks.deletePostMutateAsync.mockRejectedValueOnce(new Error("삭제 실패"));

    const { getByRole } = render(<PostPage />);

    fireEvent.click(getByRole("button", { name: "게시글 삭제 열기" }));
    fireEvent.click(getByRole("button", { name: "post-confirm" }));

    await vi.waitFor(() => {
      expect(mocks.toastError).toHaveBeenCalled();
      expect(mocks.navigate).not.toHaveBeenCalled();
    });
  });
});
