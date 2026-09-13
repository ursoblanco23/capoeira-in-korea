import {useEffect} from "react";
import {authService} from "../../services/api/auth/service/authService.ts";

export function AuthInitializer () {
//앱 시작 시 silent refresh
    useEffect(() => {
        authService.restoreSession();
    }, []);

    return null;
}

