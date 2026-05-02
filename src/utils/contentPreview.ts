export const LIST_CONTENT_PREVIEW_FALLBACK =
  "본문 미리보기는 상세 페이지에서 확인해 주세요.";

const CONTENT_PREVIEW_BLOCK_MARKER_PATTERN = /^\s*(#{1,2}|>|-)\s+/gm;
const CONTENT_PREVIEW_INLINE_BLOCK_MARKER_PATTERN = /(^|\s)(#{1,2}|>|-)\s+/gm;
const CONTENT_PREVIEW_BOLD_MARKER_PATTERN = /\*\*/g;
const CONTENT_PREVIEW_COLOR_TAG_PATTERN = /\[\/?(blue|green|orange|red)\]/g;

function stripContentPreviewMarkdown(contentPreview: string): string {
  return contentPreview
    .replace(CONTENT_PREVIEW_COLOR_TAG_PATTERN, "")
    .replace(CONTENT_PREVIEW_BOLD_MARKER_PATTERN, "")
    .replace(CONTENT_PREVIEW_BLOCK_MARKER_PATTERN, "")
    .replace(CONTENT_PREVIEW_INLINE_BLOCK_MARKER_PATTERN, "$1");
}

export function normalizeContentPreview(
  contentPreview?: string | null,
): string | null {
  if (!contentPreview) {
    return null;
  }

  const normalized = stripContentPreviewMarkdown(contentPreview)
    .replace(/\s+/g, " ")
    .trim();
  return normalized.length > 0 ? normalized : null;
}

export function resolveContentPreview(
  contentPreview?: string | null,
  fallback = LIST_CONTENT_PREVIEW_FALLBACK,
): string {
  return normalizeContentPreview(contentPreview) ?? fallback;
}
