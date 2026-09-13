import { Navigate } from "react-router-dom";
import {useAuthStore} from "@/stores/authStore.ts";
import type {RoleName} from "@/constants/role.ts";

interface Props {
    allowedRoles: RoleName[]
    children: React.ReactNode;
}

export const RequireRole = ({ allowedRoles, children }: Props) => {
    const me = useAuthStore((state) => state.me);

    if (!me) return null;

    const hasPermission = me.roles.some((role) =>
        allowedRoles.includes(role.roleName)
    );

    if (!hasPermission) return <Navigate to="/unauthorized" replace />;

    return <>{children}</>;
};

export default RequireRole;