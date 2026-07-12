import type {UserAddressDto} from "@/services/api/user/types/UserAddressDto.ts";

export interface UserDto {
    id: number;
    username: string;
    email: string | null;
    nickname: string | null;
    profileImageUrl: string | null;
    bio: string | null;
    phone: string | null;
    birthDate: string | null;
    gender: string | null;
    location: string | null;
    address: UserAddressDto | null;
    isVerified: boolean;
    isActive: boolean;
    emailVerified: boolean;
    lastLoginAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export type Role = 'user' | 'dojang_admin' | 'site_admin';

export interface UserWithRoles extends UserDto {
    roles: Role[];
}