export interface SignupRequestDto {
    loginId: string;
    email?: string;
    password: string;
    nickname: string;

    realName?: string;
    phone?: string;
    birthDate?: string;
    gender?: "M" | "F" | "U";

    zipCode?: string;
    roadAddress?: string;
    detailAddress?: string;
    sidoName?: string;
    sigunguName?: string;
    eupmyeondongName?: string;
}

export interface SignupResponse {
    userId: number; // 회원 고유 ID (pk)
    nickname: string;
    loginId: string;
}

export interface LoginRequestDto {
    id: string; // 일반 id 또는 이메일 형식
    password: string;
}

export interface AccessTokenDto {
    accessToken: string;
    tokenType: "Bearer";
    expiresInSeconds: number;     // 예: 1800 (30분)
}