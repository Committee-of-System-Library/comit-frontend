import { Component, type ReactNode } from "react";

import { OriErrorState } from "@/shared/ui/OriErrorState/OriErrorState";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  private handleGoLanding = () => {
    window.location.assign("/landing");
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen w-full items-center justify-center bg-background-dark px-4">
          <OriErrorState
            description={
              "일시적인 문제로 화면을 불러오지 못했어요.\n다시 시도해 주세요."
            }
            primaryAction={{
              label: "다시 시도",
              onClick: this.handleRetry,
              variant: "primary",
            }}
            secondaryAction={{
              label: "랜딩으로 이동",
              onClick: this.handleGoLanding,
              variant: "secondary",
            }}
            variant="server"
          />
        </main>
      );
    }

    return this.props.children;
  }
}
