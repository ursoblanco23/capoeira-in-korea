import type {RoleName} from "@/constants/role.ts";

export interface UserRoleDto {
    id: number;
    roleName: RoleName;
    displayName: string;
}
