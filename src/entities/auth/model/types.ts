export interface RegisterPrefill {
  major: string | null;
  name: string | null;
  studentNumber: string | null;
}

export interface RegisterRequest {
  agreedToTerms: boolean;
  nickname: string;
  phone: string;
}

export interface SsoCallbackQuery {
  state: string;
  token: string;
}
