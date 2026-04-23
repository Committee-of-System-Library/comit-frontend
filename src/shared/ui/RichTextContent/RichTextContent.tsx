import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

interface RichTextContentProps {
  className?: string;
  content: string;
}

const COLOR_CLASS_MAP: Record<string, string> = {
  blue: "text-info-02",
  green: "text-success-01",
  orange: "text-warning-01",
  red: "text-error-01",
};

const INLINE_PATTERN =
  /(\*\*[^*]+\*\*|\[(blue|green|orange|red)\]([\s\S]+?)\[\/\2\])/g;

const parseInlineNodes = (text: string, keyPrefix: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let tokenIndex = 0;

  text.replace(
    INLINE_PATTERN,
    (match, _fullToken, color, colorText, offset: number) => {
      if (offset > lastIndex) {
        nodes.push(text.slice(lastIndex, offset));
      }

      if (match.startsWith("**")) {
        nodes.push(
          <strong key={`${keyPrefix}-bold-${tokenIndex}`} className="font-bold">
            {match.slice(2, -2)}
          </strong>,
        );
      } else if (color && colorText) {
        nodes.push(
          <span
            key={`${keyPrefix}-color-${tokenIndex}`}
            className={cn(
              "font-medium",
              COLOR_CLASS_MAP[color] ?? "text-text-primary",
            )}
          >
            {colorText}
          </span>,
        );
      }

      tokenIndex += 1;
      lastIndex = offset + match.length;
      return match;
    },
  );

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

const renderTextWithLineBreaks = (text: string, keyPrefix: string) => {
  const lines = text.split("\n");
  return lines.map((line, lineIndex) => (
    <span key={`${keyPrefix}-line-${lineIndex}`}>
      {parseInlineNodes(line, `${keyPrefix}-${lineIndex}`)}
      {lineIndex < lines.length - 1 ? <br /> : null}
    </span>
  ));
};

export const RichTextContent = ({
  className,
  content,
}: RichTextContentProps) => {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      blocks.push(
        <h3
          key={`block-h1-${i}`}
          className="text-subtitle-01 font-bold text-text-primary"
        >
          {parseInlineNodes(trimmed.slice(2), `h1-${i}`)}
        </h3>,
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push(
        <h4
          key={`block-h2-${i}`}
          className="text-label-01 font-bold text-text-primary"
        >
          {parseInlineNodes(trimmed.slice(3), `h2-${i}`)}
        </h4>,
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().slice(2));
        i += 1;
      }
      blocks.push(
        <blockquote
          key={`block-quote-${i}`}
          className="border-l-2 border-border-default bg-gray-50 px-3 py-2 text-body-02 text-text-secondary"
        >
          {renderTextWithLineBreaks(quoteLines.join("\n"), `quote-${i}`)}
        </blockquote>,
      );
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i += 1;
      }

      blocks.push(
        <ul
          key={`block-list-${i}`}
          className="list-disc space-y-1 pl-5 text-body-01 text-text-tertiary"
        >
          {items.map((item, itemIndex) => (
            <li key={`list-item-${i}-${itemIndex}`}>
              {parseInlineNodes(item, `list-${i}-${itemIndex}`)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("# ") &&
      !lines[i].trim().startsWith("## ") &&
      !lines[i].trim().startsWith("> ") &&
      !lines[i].trim().startsWith("- ")
    ) {
      paragraphLines.push(lines[i]);
      i += 1;
    }

    blocks.push(
      <p key={`block-p-${i}`} className="text-body-01 text-text-tertiary">
        {renderTextWithLineBreaks(paragraphLines.join("\n"), `p-${i}`)}
      </p>,
    );
  }

  if (blocks.length === 0) {
    return (
      <p className={cn("text-body-01 text-text-tertiary", className)}>
        {content}
      </p>
    );
  }

  return <div className={cn("space-y-2", className)}>{blocks}</div>;
};
