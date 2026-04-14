export interface RegisterPrefill {
  major: string | null;
  name: string | null;
  studentNumber: string | null;
}

export interface RegisterRequest {
  agreedToTerms: boolean;
  nickname: string;
  phone: string;
  profileImageUrl?: string;
}

export interface RegisterProfileImagePresignedRequest {
  contentType: string;
  fileName: string;
}

export interface RegisterProfileImagePresignedResponse {
  imageUrl: string;
  presignedUrl: string;
}

export interface SsoCallbackQuery {
  state: string;
  token: string;
}
