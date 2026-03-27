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
  <footer className={cn("w-full bg-background-light", className)}>
    <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 md:px-12 lg:px-[120px]">
      <div className="flex flex-wrap items-start justify-between gap-10">
        <div className="flex w-full max-w-[714px] flex-1 flex-wrap items-start justify-between gap-10">
          <section className="w-full space-y-6 md:flex-1 md:pr-10">
            <h2 className="text-subtitle-01 text-text-primary">로고</h2>
            <p className="text-body-02 text-text-placeholder">
              경북대학교 컴퓨터학부 학생들을 위한 지식 나눔 커뮤니티입니다.
              <br />
              올바른 대화의 장을 만들어 갑니다.
            </p>
          </section>

          <section className="w-full max-w-[101px] space-y-4 md:w-[101px]">
            <h3 className="text-subtitle-03 text-text-primary">서비스</h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    className="text-body-02 text-text-placeholder transition-colors hover:text-text-secondary"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="flex w-full items-start justify-start gap-4 md:w-auto md:justify-end">
          <a
            aria-label="Comit 인스타그램"
            className="flex size-[30px] items-center justify-center rounded-full bg-gray-900 text-white transition-opacity hover:opacity-80"
            href="https://www.instagram.com"
            rel="noreferrer"
            target="_blank"
          >
            <Instagram className="size-5" />
          </a>
          <a
            aria-label="Comit 깃허브"
            className="flex size-[30px] items-center justify-center rounded-full bg-gray-900 text-white transition-opacity hover:opacity-80"
            href="https://github.com"
            rel="noreferrer"
            target="_blank"
          >
            <Github className="size-5" />
          </a>
        </section>
      </div>

      <div className="mt-10 border-t border-gray-200" />
    </div>
  </footer>
);
