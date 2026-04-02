export interface RegisterPrefill {
  major: string;
  name: string;
  studentNumber: string;
}

export interface RegisterRequest {
  nickname: string;
  phone: string;
}

export interface SsoCallbackQuery {
  state: string;
  token: string;
}
