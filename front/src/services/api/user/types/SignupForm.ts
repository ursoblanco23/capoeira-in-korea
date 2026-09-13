import type {Gender} from "@/services/api/user/types/Gender.ts";
import type {AddressDto} from "@/services/api/types/AddressDto.ts";
import type {PhoneRegionCode} from "@/constants/phoneRegions.ts";

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

    address: AddressDto;

    phoneRegionCode: PhoneRegionCode;
};
