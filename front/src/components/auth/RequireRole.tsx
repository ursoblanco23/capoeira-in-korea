import { Navigate } from "react-router-dom";
import {useUser} from "@/services/api/user/store/userStore.ts";
import type {Role} from "@/services/api/user/types/UserDto.ts";

interface Props {
    allowedRoles: Role[]
    children: React.ReactNode;
}

export const RequireRole = ({ allowedRoles, children }: Props) => {
    const user = useUser();

    if (!user) return <Navigate to="/login" replace />;

    const hasPermission = user.roles.some((role) => allowedRoles.includes(role));
    if (!hasPermission) return <Navigate to="/unauthorized" replace />;

    return <>{children}</>;
};

export default RequireRole;