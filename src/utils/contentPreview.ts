export const LIST_CONTENT_PREVIEW_FALLBACK =
  "본문 미리보기는 상세 페이지에서 확인해 주세요.";

export function normalizeContentPreview(
  contentPreview?: string | null,
): string | null {
  if (!contentPreview) {
    return null;
  }

  const normalized = contentPreview.replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : null;
}

export function resolveContentPreview(
  contentPreview?: string | null,
  fallback = LIST_CONTENT_PREVIEW_FALLBACK,
): string {
  return normalizeContentPreview(contentPreview) ?? fallback;
}
