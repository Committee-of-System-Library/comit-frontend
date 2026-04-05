export interface MyProfile {
  id: number;
  nickname: string;
  studentNumber: string;
  studentNumberVisible: boolean;
}

export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdateStudentNumberVisibilityRequest {
  visible: boolean;
}
