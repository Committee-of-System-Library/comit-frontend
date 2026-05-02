export type InlineFormatAction = "bold" | "blue" | "red";
export type BlockFormatAction = "heading1" | "heading2" | "list" | "quote";

interface ContentFormatResult {
  nextValue: string;
  selectionEnd: number;
  selectionStart: number;
}

interface ApplyInlineContentFormatParams {
  action: InlineFormatAction;
  placeholder: string;
  selectionEnd: number;
  selectionStart: number;
  value: string;
}

interface ApplyBlockContentFormatParams {
  action: BlockFormatAction;
  selectionEnd: number;
  selectionStart: number;
  value: string;
}

type InlineMarkerAction = InlineFormatAction | "green" | "orange";

const INLINE_MARKER_WRAPPERS: Record<
  InlineMarkerAction,
  { close: string; open: string }
> = {
  blue: { close: "[/blue]", open: "[blue]" },
  bold: { close: "**", open: "**" },
  green: { close: "[/green]", open: "[green]" },
  orange: { close: "[/orange]", open: "[orange]" },
  red: { close: "[/red]", open: "[red]" },
};

const INLINE_MARKER_ACTIONS = Object.keys(
  INLINE_MARKER_WRAPPERS,
) as InlineMarkerAction[];

const BLOCK_FORMAT_PREFIXES: Record<BlockFormatAction, string> = {
  heading1: "# ",
  heading2: "## ",
  list: "- ",
  quote: "> ",
};

const BLOCK_PREFIX_MATCH_ORDER: BlockFormatAction[] = [
  "heading2",
  "heading1",
  "quote",
  "list",
];

const INLINE_COLOR_TAG_PATTERN = /\[\/?(blue|green|orange|red)\]/g;
const INLINE_BOLD_MARKER_PATTERN = /\*\*/g;

const replaceRange = (
  value: string,
  start: number,
  end: number,
  replacement: string,
): ContentFormatResult => ({
  nextValue: value.slice(0, start) + replacement + value.slice(end),
  selectionEnd: start + replacement.length,
  selectionStart: start,
});

const stripInlineMarkers = (text: string) =>
  text
    .replace(INLINE_COLOR_TAG_PATTERN, "")
    .replace(INLINE_BOLD_MARKER_PATTERN, "");

const findImmediateEnclosingInlineMarker = (
  value: string,
  selectionStart: number,
  selectionEnd: number,
): InlineMarkerAction | null => {
  for (const action of INLINE_MARKER_ACTIONS) {
    const wrapper = INLINE_MARKER_WRAPPERS[action];

    if (
      selectionStart >= wrapper.open.length &&
      value.slice(selectionStart - wrapper.open.length, selectionStart) ===
        wrapper.open &&
      value.slice(selectionEnd, selectionEnd + wrapper.close.length) ===
        wrapper.close
    ) {
      return action;
    }
  }

  return null;
};

const unwrapSurroundingInlineMarkers = (
  value: string,
  selectionStart: number,
  selectionEnd: number,
) => {
  const removedActions: InlineMarkerAction[] = [];
  let replaceStart = selectionStart;
  let replaceEnd = selectionEnd;

  while (true) {
    const action = findImmediateEnclosingInlineMarker(
      value,
      replaceStart,
      replaceEnd,
    );

    if (!action) {
      break;
    }

    const wrapper = INLINE_MARKER_WRAPPERS[action];
    replaceStart -= wrapper.open.length;
    replaceEnd += wrapper.close.length;
    removedActions.push(action);
  }

  return { removedActions, replaceEnd, replaceStart };
};

const unwrapOuterInlineMarkers = (text: string) => {
  const removedActions: InlineMarkerAction[] = [];
  let nextText = text;

  while (true) {
    const action = INLINE_MARKER_ACTIONS.find((item) => {
      const wrapper = INLINE_MARKER_WRAPPERS[item];
      return (
        nextText.startsWith(wrapper.open) && nextText.endsWith(wrapper.close)
      );
    });

    if (!action) {
      break;
    }

    const wrapper = INLINE_MARKER_WRAPPERS[action];
    nextText = nextText.slice(
      wrapper.open.length,
      nextText.length - wrapper.close.length,
    );
    removedActions.push(action);
  }

  return { removedActions, text: nextText };
};

const splitLeadingBlockPrefixes = (line: string) => {
  const removedActions: BlockFormatAction[] = [];
  let content = line;
  let prefixText = "";

  while (true) {
    const action = BLOCK_PREFIX_MATCH_ORDER.find((item) =>
      content.startsWith(BLOCK_FORMAT_PREFIXES[item]),
    );

    if (!action) {
      break;
    }

    const prefix = BLOCK_FORMAT_PREFIXES[action];
    removedActions.push(action);
    prefixText += prefix;
    content = content.slice(prefix.length);
  }

  return { content, prefixText, removedActions };
};

const wrapInlineFormatOnLines = (
  text: string,
  action: InlineFormatAction,
): string => {
  const wrapper = INLINE_MARKER_WRAPPERS[action];

  return text
    .split("\n")
    .map((line) => {
      if (!line.trim()) {
        return line;
      }

      const { content, prefixText } = splitLeadingBlockPrefixes(line);
      const cleanedContent = stripInlineMarkers(content);

      if (!cleanedContent.trim()) {
        return line;
      }

      return `${prefixText}${wrapper.open}${cleanedContent}${wrapper.close}`;
    })
    .join("\n");
};

const replaceInlineFormatOnLines = (
  text: string,
  action: InlineFormatAction,
): string => {
  const wrapper = INLINE_MARKER_WRAPPERS[action];

  return text
    .split("\n")
    .map((line) => {
      if (!line.trim()) {
        return line;
      }

      const { content, prefixText } = splitLeadingBlockPrefixes(line);
      const { removedActions, text: unwrappedContent } =
        unwrapOuterInlineMarkers(content);
      const cleanedContent = stripInlineMarkers(unwrappedContent);

      if (!cleanedContent.trim()) {
        return line;
      }

      if (
        removedActions.length > 0 &&
        removedActions.every((removedAction) => removedAction === action)
      ) {
        return `${prefixText}${cleanedContent}`;
      }

      return `${prefixText}${wrapper.open}${cleanedContent}${wrapper.close}`;
    })
    .join("\n");
};

export const applyInlineContentFormat = ({
  action,
  placeholder,
  selectionEnd,
  selectionStart,
  value,
}: ApplyInlineContentFormatParams): ContentFormatResult => {
  const wrapper = INLINE_MARKER_WRAPPERS[action];

  if (selectionStart === selectionEnd) {
    return replaceRange(
      value,
      selectionStart,
      selectionEnd,
      `${wrapper.open}${placeholder}${wrapper.close}`,
    );
  }

  const surrounding = unwrapSurroundingInlineMarkers(
    value,
    selectionStart,
    selectionEnd,
  );

  if (surrounding.removedActions.length > 0) {
    const selectedText = stripInlineMarkers(
      value.slice(selectionStart, selectionEnd),
    );
    const replacementText = surrounding.removedActions.every(
      (removedAction) => removedAction === action,
    )
      ? selectedText
      : wrapInlineFormatOnLines(selectedText, action);

    return replaceRange(
      value,
      surrounding.replaceStart,
      surrounding.replaceEnd,
      replacementText,
    );
  }

  const selectedText = value.slice(selectionStart, selectionEnd);
  const replacementText = replaceInlineFormatOnLines(selectedText, action);

  return replaceRange(value, selectionStart, selectionEnd, replacementText);
};

export const applyBlockContentFormat = ({
  action,
  selectionEnd,
  selectionStart,
  value,
}: ApplyBlockContentFormatParams): ContentFormatResult => {
  const start = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const endLineBreak = value.indexOf("\n", selectionEnd);
  const end = endLineBreak === -1 ? value.length : endLineBreak;
  const selectedBlock = value.slice(start, end);
  const lines = selectedBlock.split("\n");
  const targetPrefix = BLOCK_FORMAT_PREFIXES[action];

  const parsedLines = lines.map((line) => ({
    line,
    ...splitLeadingBlockPrefixes(line),
  }));

  const nonEmptyLines = parsedLines.filter(
    ({ line }) => line.trim().length > 0,
  );

  if (nonEmptyLines.length === 0) {
    return {
      nextValue: value,
      selectionEnd,
      selectionStart,
    };
  }

  const shouldToggleOff = nonEmptyLines.every(
    ({ removedActions }) =>
      removedActions.length === 1 && removedActions[0] === action,
  );

  const nextBlock = parsedLines
    .map(({ content, line }) => {
      if (!line.trim()) {
        return line;
      }

      return shouldToggleOff ? content : `${targetPrefix}${content}`;
    })
    .join("\n");

  return replaceRange(value, start, end, nextBlock);
};
