import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PAGE } from "@/constants/routes";
import {useAuthStore, useIsAuthenticated} from "@/stores/authStore";

export default function RequireAuth() {
    const authStatus = useAuthStore((state) => state.authStatus);
    const isAuthenticated = useIsAuthenticated();

    const location = useLocation();

    if (authStatus === "checking") {
        return null;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to={PAGE.LOGIN}
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
}