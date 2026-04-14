import { createPortal } from "react-dom";

type DeleteType = "post" | "comment";

const DELETE_MAP: Record<DeleteType, string> = {
  post: "게시글",
  comment: "댓글",
};

interface DeleteModalProps {
  target: DeleteType;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal = ({
  target,
  onClose,
  onConfirm,
}: DeleteModalProps) => {
  const targetName = DELETE_MAP[target];

  const portalRoot = document.getElementById("modal-portal");
  if (!portalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <section className="w-[320px] bg-white rounded-2xl flex flex-col gap-8 pt-6 pb-4 items-center shadow-xl">
        <p className="text-center text-label-02 text-text-primary">
          해당 {targetName}을 삭제하시겠습니까?
        </p>
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
            onClick={onConfirm}
            className="flex items-center justify-center rounded-xl h-11 w-34 border bg-info-01 transition-colors duration-200 hover:bg-[#006DCC] text-label-04 text-text-inverse"
          >
            확인
          </button>
        </div>
      </section>
    </div>,
    portalRoot,
  );
};
