import {Link, useLocation} from "react-router-dom";
import {PAGE} from "@/constants/routes.ts";
import {useAuthStore} from "@/stores/authStore.ts";
import {useState} from "react";
import {authService} from "../../../services/api/auth/service/authService.ts";
import {toast} from "react-toastify";
import {getLocationFrom} from "@/utils/getLocationFrom.ts";


// 아래와 같이 export 시 HeaderAuthActions 이름 그대로 import 해야함.
export function HeaderAuthActions() {
    const authStatus = useAuthStore((state) => state.authStatus);
    const me = useAuthStore((state) => state.me);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const isAuthenticated = authStatus === 'authenticated';
    const isChecking = authStatus === 'checking'
    const location = useLocation();
    const from = getLocationFrom(location);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            const logoutResult = await authService.logout();
            toast.success("로그아웃 처리가 완료되었습니다.");
            return logoutResult;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "로그아웃 처리 중 문제가 발생했습니다.";
            toast.error(errorMessage);
        } finally {
            setIsLoggingOut(false);
        }
    };

    // silent refresh 시에 헤더 깜빡임 방지
    if (isChecking) return null;

    if (!isAuthenticated) {
        return (
            <>
                <Link
                    to={PAGE.LOGIN}
                    state={from ? { from } : undefined }
                    className="px-4 py-2 text-primary border border-primary hover:bg-primary hover:text-white transition-colors rounded-lg whitespace-nowrap"
                >
                    로그인
                </Link>
                <Link
                    to={PAGE.SIGN_UP}
                    state={from ? { from } : undefined }
                    className="px-4 py-2 bg-primary text-white hover:bg-primary/90 transition-colors rounded-lg whitespace-nowrap">
                    회원가입
                </Link>
            </>
        )
    }

    return ( //authStatus === 'authenticated'
        <>
            {/* todo: MY_PAGE 작업 중 */}
            {me != null && (
                <button
                    type="button"
                    className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary/10 text-base font-bold text-primary cursor-default"
                    aria-label="프로필 이미지"
                >
                    {me.profileImgUrl ? (
                        <img
                            src={me.profileImgUrl}
                            alt={`${me.nickname} 프로필 이미지`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center">
                            {me.nickname.charAt(0)}
                        </span>
                    )}
                </button>
            )}

            <Link
                to={PAGE.MY_PAGE}
                className="px-4 py-2 text-primary border border-primary hover:bg-primary hover:text-white transition-colors rounded-lg whitespace-nowrap"
            >
                마이페이지
            </Link>
            <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-busy={isLoggingOut}
                className="px-4 py-2 text-primary border border-primary hover:bg-primary hover:text-white transition-colors rounded-lg whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
        </>
    )

}

