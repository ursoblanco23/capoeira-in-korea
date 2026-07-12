import type {Gender} from "@/services/api/user/types/Gender.ts";

export interface SignupForm {
    loginId: string;
    email: string;
    password: string;
    passwordConfirm: string; // 서버에서는 해당 값 받을 필요x
    nickname: string;

    realName: string;
    phone: string;
    birthDate: string; // YYYY-MM-DD
    gender: Gender;

    //TODO: 후에 UserAddressDto로 묶어서 관리할 것. -> 서버 쪽도 UserAddressDto로 묶어서 받도록 변경 필요.
    //  address: UserAddressDto;
    zipCode: string;
    roadAddress: string;
    detailAddress: string;
    sidoName: string;
    sigunguName: string;
    eupmyeondongName: string;
};