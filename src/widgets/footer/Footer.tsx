import { Github, Instagram } from "lucide-react";

import { cn } from "@/utils/cn";

type FooterLink = {
  href: string;
  label: string;
};

const defaultServiceLinks: FooterLink[] = [
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/contact", label: "문의하기" },
];

export interface FooterProps {
  className?: string;
  serviceLinks?: FooterLink[];
}

export const Footer = ({
  className,
  serviceLinks = defaultServiceLinks,
}: FooterProps) => (
  <footer className={cn("w-full border-t border-gray-200 bg-white", className)}>
    <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[1fr_auto_auto] items-start gap-8 px-6 py-10">
      <section className="space-y-4">
        <h2 className="text-head-03 text-gray-900">로고</h2>
        <p className="max-w-[460px] text-body-02 text-gray-600">
          경북대학교 컴퓨터학부 학생들을 위한 지식 나눔 커뮤니티입니다.
          <br />
          올바른 대화의 장을 만들어 갑니다.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-subtitle-01 text-gray-900">서비스</h3>
        <ul className="space-y-2">
          {serviceLinks.map((link) => (
            <li key={link.label}>
              <a
                className="text-body-02 text-gray-600 transition-colors hover:text-gray-900"
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-start gap-3">
        <a
          aria-label="Comit 인스타그램"
          className="rounded-full border border-gray-300 p-2 text-gray-800 transition-colors hover:bg-gray-100"
          href="https://www.instagram.com"
          rel="noreferrer"
          target="_blank"
        >
          <Instagram className="size-5" />
        </a>
        <a
          aria-label="Comit 깃허브"
          className="rounded-full border border-gray-300 p-2 text-gray-800 transition-colors hover:bg-gray-100"
          href="https://github.com"
          rel="noreferrer"
          target="_blank"
        >
          <Github className="size-5" />
        </a>
      </section>
    </div>
    <div className="mx-auto w-full max-w-[1440px] border-t border-gray-200" />
  </footer>
);
