import {PAGE} from "@/constants/routes.ts";
import type {Location} from "react-router-dom";

interface AuthLocationState {
    from?: Location;
}

// 로그인, 회원가입 페이지끼리 이동 시 그 이전 페이지의 location을 전달하도록 함.
export function getLocationFrom(location: Location): Location | undefined {
    const isAuthPage =
        location.pathname === PAGE.LOGIN ||
        location.pathname === PAGE.SIGN_UP;

    if (isAuthPage) {
        return (location.state as AuthLocationState).from;
    }

    return location;
}