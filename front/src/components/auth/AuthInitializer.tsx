import {useEffect} from "react";
import {authService} from "@/services/api/services/authService.ts";

export function AuthInitializer () {
//앱 시작 시 silent refresh
    useEffect(() => {
        authService.restoreSession();
    }, []);

    return null;
}

