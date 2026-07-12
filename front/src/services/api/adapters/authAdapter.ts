import type {SignupRequestDto} from "@/services/api/types/authApiTypes.ts";
import type {SignupForm} from "@/services/api/user/types/SignupForm.ts";
import {normalizeKoreanPhone} from "@/utils";

export function toSignupRequestPayload(
    form: SignupForm
): SignupRequestDto {

    return {
        loginId: form.loginId,
        email: form.email || undefined,
        password: form.password,
        nickname: form.nickname,

        realName: form.realName,
        phone: normalizeKoreanPhone(form.phone),
        birthDate: form.birthDate,
        gender: form.gender,

        zipCode: form.zipCode,
        roadAddress: form.roadAddress,
        detailAddress: form.detailAddress,
        sidoName: form.sidoName,
        sigunguName: form.sigunguName,
        eupmyeondongName: form.eupmyeondongName,
    };
}
