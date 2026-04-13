import { useState, type ChangeEvent } from "react";

import { createPortal } from "react-dom";

import { useReportCommentMutation } from "@/features/comment/model/useReportCommentMutation";
import { useReportPostMutation } from "@/features/post/model/useReportPostMutation";

export type ReportTarget =
  | { type: "comment"; id: number }
  | { type: "post"; id: number };

interface ReportModalProps {
  user?: string;
  contents?: string;
  target: ReportTarget;
  disabled?: boolean;
  onClose: () => void;
}

export const ReportModal = ({
  user = "",
  contents = "",
  target,
  disabled = false,
  onClose,
}: ReportModalProps) => {
  const [reason, setReason] = useState("");
  const MAX_LENGTH = 30;

  const { mutate: reportComment, isPending: isCommentPending } =
    useReportCommentMutation();
  const { mutate: reportPost, isPending: isPostPending } =
    useReportPostMutation();
  const isPending =
    target.type === "comment" ? isCommentPending : isPostPending;
  const isActivated = reason.trim().length > 0 && !disabled && !isPending;

  const portalRoot = document.getElementById("modal-portal");
  if (!portalRoot) return null;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setReason(e.target.value);
    }
  };

  const handleConfirm = () => {
    if (!isActivated) return;

    if (target.type === "comment") {
      reportComment(
        {
          commentId: target.id,
          payload: { message: reason.trim() },
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
      return;
    }

    reportPost(
      {
        postId: target.id,
        payload: { message: reason.trim() },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50">
      <section className="w-[320px] bg-white rounded-2xl flex flex-col gap-4 pt-6 px-4 pb-4 items-center shadow-xl">
        <p className="text-center text-subtitle-03 text-text-primary">
          신고 사유 입력
        </p>
        <p className="px-2 text-center text-label-04 line-clamp-1 text-text-secondary">
          {`[${user}] ${contents}`}
        </p>
        <div className="w-full flex flex-col gap-2">
          <textarea
            value={reason}
            onChange={handleChange}
            placeholder="신고 사유를 입력해주세요"
            className="w-full h-14 pl-4 pr-3 py-2 rounded-lg text-label-04 overflow-hidden text-text-primary placeholder:text-text-placeholder border border-border-deactivated outline-none resize-none"
          ></textarea>
          <p className="self-end text-caption-02 text-text-placeholder">
            {reason.length}자/{MAX_LENGTH}자
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-xl h-11 w-34 border border-border-deactivated transition-colors duration-200 hover:bg-background-dark text-label-04 text-text-deactivated"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!isActivated}
            onClick={handleConfirm}
            className="flex items-center justify-center rounded-xl h-11 w-34 border bg-info-01 transition-colors duration-200 hover:bg-[#006DCC] disabled:bg-info-03 disabled:cursor-not-allowed text-label-04 text-text-inverse"
          >
            {isPending ? "처리 중" : "확인"}
          </button>
        </div>
      </section>
    </div>,
    portalRoot,
  );
};
