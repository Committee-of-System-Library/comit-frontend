import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import { ChevronLeft, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import defaultMascotImage from "@/assets/Ori_defualt.svg";
import greetingMascotImage from "@/assets/Ori_happy.svg";
import sadMascotImage from "@/assets/Ori_sad.svg";
import { useRegisterMutation } from "@/features/signup/model/useRegisterMutation";
import { useRegisterPrefillQuery } from "@/features/signup/model/useRegisterPrefillQuery";
import { isApiHttpError } from "@/shared/api/http-error";
import { SignupCheckbox } from "@/shared/ui/SignupCheckbox/SignupCheckbox";
import { SignupMascotBubble } from "@/shared/ui/SignupMascotBubble/SignupMascotBubble";
import { SignupStepBadge } from "@/shared/ui/SignupStepBadge/SignupStepBadge";
import { SignupTextInput } from "@/shared/ui/SignupTextInput/SignupTextInput";
import { WritingButton } from "@/shared/ui/WritingButton/WritingButton";
import { cn } from "@/utils/cn";

type SignupStep = 1 | 2;
type NicknameValidationStatus = "idle" | "error" | "success";
type SignupGuideMode = "preview" | "register";

const DUPLICATED_NICKNAME_SET = new Set(["admin", "comit", "관리자", "운영자"]);

export interface SignupGuideModalProps {
  className?: string;
  defaultStep?: SignupStep;
  isCseStudent?: boolean;
  mode?: SignupGuideMode;
  open: boolean;
  onClose: () => void;
}

export const SignupGuideModal = ({
  className,
  defaultStep = 1,
  isCseStudent = false,
  mode = "preview",
  open,
  onClose,
}: SignupGuideModalProps) => {
  const navigate = useNavigate();
  const isRegisterMode = mode === "register";
  const [step, setStep] = useState<SignupStep>(defaultStep);
  const [name, setName] = useState("");
  const [phoneFirst, setPhoneFirst] = useState("");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknameValidationStatus, setNicknameValidationStatus] =
    useState<NicknameValidationStatus>("idle");
  const [nicknameValidationMessage, setNicknameValidationMessage] =
    useState("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const {
    data: registerPrefill,
    error: registerPrefillError,
    isError: isRegisterPrefillError,
    isLoading: isRegisterPrefillLoading,
  } = useRegisterPrefillQuery({
    enabled: open && isRegisterMode,
  });
  const registerMutation = useRegisterMutation();
  const effectiveCseStudent = isRegisterMode ? true : isCseStudent;

  const isStep1Valid =
    (isRegisterMode ? true : name.trim().length > 0) &&
    phoneFirst.length === 3 &&
    phoneMiddle.length === 4 &&
    phoneLast.length === 4 &&
    isPrivacyAgreed;
  const isStep2Valid = nicknameValidationStatus === "success";

  const handlePhoneChange =
    (setter: (value: string) => void, maxLength: number) => (value: string) => {
      const nextValue = value.replace(/\D/g, "").slice(0, maxLength);
      setter(nextValue);
    };

  const resetSignupState = useCallback(() => {
    setStep(defaultStep);
    setName("");
    setPhoneFirst("");
    setPhoneMiddle("");
    setPhoneLast("");
    setIsPrivacyAgreed(false);
    setNickname("");
    setNicknameValidationStatus("idle");
    setNicknameValidationMessage("");
    setProfileImageUrl(null);
  }, [defaultStep]);

  const handleCloseModal = useCallback(() => {
    resetSignupState();
    onClose();
  }, [onClose, resetSignupState]);

  const modalMaxWidthClass = effectiveCseStudent
    ? "max-w-[400px]"
    : "max-w-[447px]";
  const bubblePositionClass = effectiveCseStudent
    ? step === 1
      ? "absolute -right-[340px] top-[200px] inline-flex"
      : "absolute -right-[295px] top-[370px] inline-flex"
    : "absolute -right-[75px] top-[110px] inline-flex";

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, [profileImageUrl]);

  useEffect(() => {
    if (!isRegisterMode || !isRegisterPrefillError) {
      return;
    }

    if (isApiHttpError(registerPrefillError)) {
      if (
        registerPrefillError.status === 409 ||
        registerPrefillError.code === "MEMBER_ALREADY_EXISTS"
      ) {
        toast.success("이미 회원가입이 완료된 계정입니다.");
        onClose();
        navigate("/", { replace: true });
        return;
      }

      if (registerPrefillError.status === 401) {
        toast.error("인증 정보가 만료되었습니다. 다시 로그인해 주세요.");
        onClose();
        navigate("/", { replace: true });
        return;
      }
    }

    toast.error("회원가입 사전 정보를 불러오지 못했습니다.");
    onClose();
    navigate("/", { replace: true });
  }, [
    isRegisterMode,
    isRegisterPrefillError,
    navigate,
    onClose,
    registerPrefillError,
  ]);

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);

    if (nicknameValidationStatus !== "idle") {
      setNicknameValidationStatus("idle");
      setNicknameValidationMessage("");
    }
  };

  const handleNicknameDuplicateCheck = () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setNicknameValidationStatus("error");
      setNicknameValidationMessage("닉네임을 입력해 주세요");
      return;
    }

    const normalizedNickname = trimmedNickname.toLowerCase();

    if (DUPLICATED_NICKNAME_SET.has(normalizedNickname)) {
      setNicknameValidationStatus("error");
      setNicknameValidationMessage("이미 존재하는 닉네임입니다");
      return;
    }

    setNicknameValidationStatus("success");
    setNicknameValidationMessage("사용 가능한 닉네임입니다");
  };

  const handleProfileImageUploadClick = () => {
    profileImageInputRef.current?.click();
  };

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    setProfileImageUrl(URL.createObjectURL(file));
    event.target.value = "";
  };

  const handleProfileImageRemove = () => {
    setProfileImageUrl(null);
  };

  const handleRegisterComplete = async () => {
    if (!isStep2Valid) {
      return;
    }

    if (!isRegisterMode) {
      handleCloseModal();
      return;
    }

    try {
      await registerMutation.mutateAsync({
        agreedToTerms: true,
        nickname: nickname.trim(),
        phone: `${phoneFirst}-${phoneMiddle}-${phoneLast}`,
      });

      toast.success("회원가입이 완료되었습니다.");
      handleCloseModal();
      navigate("/", { replace: true });
    } catch (error) {
      if (isApiHttpError(error)) {
        if (error.code === "DUPLICATE_NICKNAME") {
          setNicknameValidationStatus("error");
          setNicknameValidationMessage("이미 사용 중인 닉네임입니다");
          return;
        }

        if (error.status === 401 || error.code === "UNAUTHORIZED") {
          toast.error("인증 정보가 만료되었습니다. 다시 로그인해 주세요.");
          handleCloseModal();
          navigate("/", { replace: true });
          return;
        }

        if (error.status === 409 || error.code === "MEMBER_ALREADY_EXISTS") {
          toast.success("이미 회원가입이 완료된 계정입니다.");
          handleCloseModal();
          navigate("/", { replace: true });
          return;
        }
      }

      toast.error("회원가입 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0" />
      <div
        aria-modal
        className={cn(
          "relative z-10 w-full rounded-xl bg-background-light p-8 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.12)]",
          modalMaxWidthClass,
        )}
        role="dialog"
      >
        {effectiveCseStudent && step === 1 ? (
          <div className="flex min-h-[476px] flex-col items-center gap-8">
            <div className="flex items-center gap-2">
              <SignupStepBadge active step={1} />
              <span className="h-px w-6 bg-border-default" />
              <SignupStepBadge step={2} />
            </div>

            <p className="text-center text-subtitle-01 text-text-primary">
              경북대학교 컴퓨터학부생을 위한 서비스
              <br />
              Comit에 오신 걸 환영합니다
            </p>

            <div className="w-full space-y-6">
              <div className="space-y-2">
                <label
                  className="block pl-1 text-label-01 text-text-tertiary"
                  htmlFor="signup-name"
                >
                  이름 <span className="text-error-03">*</span>
                </label>
                <SignupTextInput
                  disabled={isRegisterMode}
                  id="signup-name"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="이름을 입력해 주세요"
                  value={isRegisterMode ? (registerPrefill?.name ?? "") : name}
                />
              </div>

              <fieldset className="space-y-2">
                <legend className="block pl-1 text-label-01 text-text-tertiary">
                  연락처 <span className="text-error-03">*</span>
                </legend>
                <div className="flex items-center gap-1">
                  <SignupTextInput
                    aria-label="연락처 앞자리"
                    className="w-[63px]"
                    inputMode="numeric"
                    maxLength={3}
                    onChange={(event) =>
                      handlePhoneChange(setPhoneFirst, 3)(event.target.value)
                    }
                    placeholder="010"
                    value={phoneFirst}
                  />
                  <span className="text-body-01 text-text-tertiary">-</span>
                  <SignupTextInput
                    aria-label="연락처 가운데 자리"
                    className="w-[76px]"
                    inputMode="numeric"
                    maxLength={4}
                    onChange={(event) =>
                      handlePhoneChange(setPhoneMiddle, 4)(event.target.value)
                    }
                    placeholder="0000"
                    value={phoneMiddle}
                  />
                  <span className="text-body-01 text-text-tertiary">-</span>
                  <SignupTextInput
                    aria-label="연락처 마지막 자리"
                    className="w-[76px]"
                    inputMode="numeric"
                    maxLength={4}
                    onChange={(event) =>
                      handlePhoneChange(setPhoneLast, 4)(event.target.value)
                    }
                    placeholder="0000"
                    value={phoneLast}
                  />
                </div>
              </fieldset>

              <fieldset className="space-y-2">
                <legend className="block pl-1 text-label-01 text-text-tertiary">
                  개인정보 수집 및 이용 동의{" "}
                  <span className="text-error-03">*</span>
                </legend>
                <div className="flex items-center gap-3">
                  <SignupCheckbox
                    checked={isPrivacyAgreed}
                    onCheckedChange={setIsPrivacyAgreed}
                  />
                  <button
                    className="text-label-04 text-info-01 underline underline-offset-2"
                    type="button"
                  >
                    전문보기
                  </button>
                </div>
              </fieldset>
            </div>

            <WritingButton
              className={cn(
                isStep1Valid
                  ? "bg-primary-600 hover:bg-primary-1000 active:bg-primary-800"
                  : "bg-primary-200 hover:bg-primary-200 active:bg-primary-200",
              )}
              disabled={!isStep1Valid}
              icon={null}
              onClick={() => {
                if (isStep1Valid) {
                  setStep(2);
                }
              }}
              variant="action"
            >
              프로필 설정하러 가기
            </WritingButton>
          </div>
        ) : effectiveCseStudent && step === 2 ? (
          <div className="flex min-h-[616px] flex-col items-center gap-8">
            <div className="relative flex w-full items-center justify-center">
              <button
                aria-label="이전 단계로 이동"
                className="absolute left-0 inline-flex size-6 items-center justify-center rounded-md text-text-primary transition-colors hover:bg-gray-100"
                onClick={() => setStep(1)}
                type="button"
              >
                <ChevronLeft className="size-4" />
              </button>

              <div className="flex items-center gap-2">
                <SignupStepBadge step={1} />
                <span className="h-px w-6 bg-border-default" />
                <SignupStepBadge active step={2} />
              </div>
            </div>

            <p className="text-center text-subtitle-01 text-text-primary">
              원활한 이용을 위해
              <br />
              프로필 정보를 입력해 주세요
            </p>

            <div className="relative">
              <button
                className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-border-deactivated bg-background-dark"
                onClick={handleProfileImageUploadClick}
                type="button"
              >
                {profileImageUrl ? (
                  <img
                    alt="프로필 이미지 미리보기"
                    className="size-full object-cover"
                    src={profileImageUrl}
                  />
                ) : (
                  <ImageIcon className="size-6 text-text-placeholder" />
                )}
              </button>

              {profileImageUrl ? (
                <button
                  aria-label="프로필 이미지 삭제"
                  className="absolute -top-1 -right-1 inline-flex size-5 items-center justify-center rounded-full border border-border-deactivated bg-background-light text-text-deactivated transition-colors hover:text-text-primary"
                  onClick={handleProfileImageRemove}
                  type="button"
                >
                  <X className="size-3" />
                </button>
              ) : null}

              <input
                ref={profileImageInputRef}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleProfileImageChange}
                type="file"
              />
            </div>

            <div className="w-full space-y-6">
              <div className="space-y-2">
                <label
                  className="block pl-1 text-label-01 text-text-tertiary"
                  htmlFor="signup-nickname"
                >
                  닉네임 <span className="text-error-03">*</span>
                </label>
                <SignupTextInput
                  actionLabel="중복 확인"
                  id="signup-nickname"
                  onActionClick={handleNicknameDuplicateCheck}
                  onChange={handleNicknameChange}
                  placeholder="닉네임을 입력해 주세요"
                  value={nickname}
                />

                {nicknameValidationStatus !== "idle" ? (
                  <p
                    className={cn(
                      "pl-2 text-caption-02",
                      nicknameValidationStatus === "error"
                        ? "text-error-01"
                        : "text-success-01",
                    )}
                  >
                    {nicknameValidationMessage}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label
                  className="block pl-1 text-label-01 text-text-tertiary"
                  htmlFor="signup-student-id"
                >
                  학번
                </label>
                <SignupTextInput
                  disabled
                  id="signup-student-id"
                  placeholder="2023..."
                  value={
                    isRegisterMode ? (registerPrefill?.studentNumber ?? "") : ""
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block pl-1 text-label-01 text-text-tertiary"
                  htmlFor="signup-major"
                >
                  세부 전공
                </label>
                <SignupTextInput
                  disabled
                  id="signup-major"
                  placeholder="전공이름"
                  value={isRegisterMode ? (registerPrefill?.major ?? "") : ""}
                />
              </div>
            </div>

            <WritingButton
              className={cn(
                isStep2Valid
                  ? "bg-primary-600 hover:bg-primary-1000 active:bg-primary-800"
                  : "bg-primary-200 hover:bg-primary-200 active:bg-primary-200",
              )}
              disabled={!isStep2Valid || registerMutation.isPending}
              icon={null}
              onClick={handleRegisterComplete}
              variant="action"
            >
              {registerMutation.isPending
                ? "회원가입 처리 중..."
                : "Comit의 세계로 빠져들기"}
            </WritingButton>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            <p className="text-center text-subtitle-01 text-text-primary">
              <span className="block whitespace-nowrap">
                컴퓨터학부 학생이 아니면
              </span>
              <span className="block whitespace-nowrap">
                아직 Comit 서비스 회원가입이 불가능해요ㅜㅜ
              </span>
            </p>

            <img
              alt="슬퍼하는 Comit 마스코트"
              className="h-[228px] w-[163px] object-contain"
              src={sadMascotImage}
            />

            <WritingButton
              icon={null}
              onClick={handleCloseModal}
              variant="action"
            >
              확인
            </WritingButton>
          </div>
        )}

        <SignupMascotBubble
          className={bubblePositionClass}
          text={
            effectiveCseStudent
              ? step === 1
                ? "서비스를 이용하기 위한\n필수 정보다꿱🐥"
                : "거의 다 끝났꿱🐥"
              : "다음에 만나꿱🐥"
          }
        />
        {isRegisterMode && isRegisterPrefillLoading ? (
          <p className="absolute right-8 top-8 text-caption-02 text-text-placeholder">
            회원가입 정보 확인 중...
          </p>
        ) : null}
        {effectiveCseStudent ? (
          <img
            alt="Comit 마스코트"
            className="absolute -right-[140px] bottom-[-40px] block h-[287px] w-[205px] object-contain"
            src={step === 1 ? defaultMascotImage : greetingMascotImage}
          />
        ) : null}
      </div>
    </div>
  );
};
