import type {SignupRequestDto} from "@/services/api/types/authApiTypes.ts";
import type {SignupForm} from "@/services/api/user/types/SignupForm.ts";
import {normalizeKoreanPhone} from "@/utils";
import {toNullableAddress} from "@/services/api/adapters/addressAdapter.ts";

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
        phoneRegionCode: form.phoneRegionCode,
        birthDate: form.birthDate,
        gender: form.gender,

        address: toNullableAddress(form.address),
    };
}
