import type { Gender } from "./Gender";
import type { UserStatus } from "./UserStatus.ts";
import type { UserAddressDto } from "./UserAddressDto";
import type {UserRoleDto} from "@/services/api/user/types/UserRoleDto.ts";

export interface UserMeDto {
    id: number;
    loginId: string;
    email: string;
    nickname: string;
    bio: string | null;
    realName: string | null;
    phone: string | null;
    birthDate: string | null;
    gender: Gender | null;
    address: UserAddressDto | null;
    status: UserStatus;
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string | null;
    roles: UserRoleDto[];
    profileImgUrl: string | null;
}