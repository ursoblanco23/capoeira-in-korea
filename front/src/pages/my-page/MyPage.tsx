import {useAuthStore} from "@/stores/authStore.ts";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {UserProfileCard} from "@/pages/my-page/components/UserProfileCard.tsx";
import {PAGE} from "@/constants/routes.ts";
import {userService} from "@/services/api/user/service/userService.ts";
import {toast} from "react-toastify";
import {useState} from "react";
import {extractErrorMessage} from "@/utils/error.ts";
import {formatPhoneForDisplay} from "@/utils";

export function MyPage() {
    const authStatus = useAuthStore((state) => state.authStatus);
    const me = useAuthStore((state) => state.me);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // MyPage init start ------------
    if (authStatus === "checking") {
        return null;
    }

    if (authStatus === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    if (!me) {
        return null;
    }
    // init end ------------



    const handleWithdrawMyAccount = async () => {
        const confirmed = window.confirm(
            "정말 회원 탈퇴하시겠습니까?\n탈퇴한 계정은 복구할 수 없습니다."
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);

        try {
            await userService.withdrawMyAccount();

            toast.success(
                "회원 탈퇴가 완료되었습니다. 그동안 함께해 주셔서 감사합니다."
            );

            useAuthStore.getState().clearSession();
            navigate(PAGE.HOME, { replace: true });
        } catch (error: unknown) {
            console.warn(extractErrorMessage(error));
            toast.error("회원 탈퇴 처리 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <main className="min-h-screen bg-gray-50">
            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        마이페이지
                    </h1>
                    <p className="mt-2 text-gray-500">
                        내 프로필 정보와 계정 설정을 관리할 수 있습니다.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                    {/* Left Profile Card */}
                    <UserProfileCard me={me} />

                    {/* Right Content */}
                    <section className="space-y-6">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900">
                                기본 정보
                            </h3>

                            <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                <InfoItem label="아이디" value={me.loginId}/>
                                <InfoItem label="닉네임" value={me.nickname}/>
                                <InfoItem label="이메일" value={me.email}/>
                                <InfoItem
                                    label="전화번호"
                                    value={me.phone ? formatPhoneForDisplay(me.phone, "international") : "미등록"}
                                />
                            </div>
                        </div>

                        {/* TODO: 추후 개발 내용 */}
                        {/*<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900">
                                활동 정보
                            </h3>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                <StatCard label="등록한 도장" value="0" />
                                <StatCard label="참여한 이벤트" value="0" />
                                <StatCard label="작성한 글" value="0" />
                            </div>
                        </div>*/}

                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900">
                                계정 관리
                            </h3>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    to={PAGE.CHANGE_PASSWORD}
                                    className="rounded-button border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                >
                                    비밀번호 변경
                                </Link>

                                <button
                                    type="button"
                                    disabled={loading}
                                    aria-busy={loading}
                                    className="rounded-button border border-red-300 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    onClick={handleWithdrawMyAccount}
                                >
                                    {loading ? "탈퇴 처리 중..." : "회원 탈퇴"}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
};

type InfoItemProps = {
    label: string;
    value: string;
};

const InfoItem = ({label, value}: InfoItemProps) => {
    return (
        <div>
            <p className="text-sm font-medium text-gray-500">
                {label}
            </p>
            <p className="mt-1 text-base font-semibold text-gray-900">
                {value}
            </p>
        </div>
    );
};

/*type StatCardProps = {
    label: string;
    value: string;
};

const StatCard = ({label, value}: StatCardProps) => {
    return (
        <div className="rounded-xl bg-gray-50 p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">
                {value}
            </p>
            <p className="mt-1 text-sm text-gray-500">
                {label}
            </p>
        </div>
    );
};*/
