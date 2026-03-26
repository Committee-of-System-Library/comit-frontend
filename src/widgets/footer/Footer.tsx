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
    <div className="mx-auto w-full max-w-[1440px] px-[120px] py-10">
      <div className="flex items-start justify-between">
        <div className="flex w-[714px] items-start justify-between">
          <section className="w-full pr-10 space-y-6">
            <h2 className="text-subtitle-01 text-text-primary">로고</h2>
            <p className="text-body-02 text-text-placeholder">
              경북대학교 컴퓨터학부 학생들을 위한 지식 나눔 커뮤니티입니다.
              <br />
              올바른 대화의 장을 만들어 갑니다.
            </p>
          </section>

          <section className="w-[101px] space-y-4">
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

        <section className="flex items-start gap-4">
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
