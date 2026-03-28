import { useNavigate } from "react-router-dom";

import { WritingButton } from "@/shared/ui/WritingButton/WritingButton";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleMockOAuthRedirect = () => {
    navigate("/?oauth=success&signupGuide=1", { replace: true });
  };

  return (
    <section className="mx-auto w-full max-w-[600px] rounded-xl border border-gray-200 bg-background-light p-8">
      <h1 className="text-head-02 text-text-primary">로그인/회원가입</h1>
      <p className="mt-3 text-body-02 text-text-secondary">
        학교 OAuth 인증 완료 후 메인으로 돌아오는 흐름을 모킹한 페이지입니다.
      </p>
      <div className="mt-8">
        <WritingButton icon={null} onClick={handleMockOAuthRedirect}>
          OAuth 인증 후 메인으로 돌아가기
        </WritingButton>
      </div>
    </section>
  );
};

export default LoginPage;
