import { getSsoLoginUrl } from "@/entities/auth/api/logout";
import { WritingButton } from "@/shared/ui/WritingButton/WritingButton";

const LoginPage = () => {
  const handleStartSsoLogin = () => {
    const redirectUri =
      typeof window !== "undefined" ? window.location.origin : undefined;
    window.location.assign(getSsoLoginUrl({ redirectUri }));
  };

  return (
    <section className="mx-auto w-full max-w-[600px] rounded-xl border border-gray-200 bg-background-light p-8">
      <h1 className="text-head-02 text-text-primary">로그인/회원가입</h1>
      <p className="mt-3 text-body-02 text-text-secondary">
        경북대학교 SSO 인증 후 Comit 서비스로 돌아옵니다.
      </p>
      <div className="mt-8">
        <WritingButton icon={null} onClick={handleStartSsoLogin}>
          학교 계정으로 로그인
        </WritingButton>
      </div>
    </section>
  );
};

export default LoginPage;
