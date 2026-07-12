import {useAuthStore} from "@/stores/authStore.ts";
import {Navigate} from "react-router-dom";
import {UserProfileCard} from "@/pages/my-page/components/UserProfileCard.tsx";

export function MyPage() {
    const authStatus = useAuthStore((state) => state.authStatus);
    const me = useAuthStore((state) => state.me);

    if (authStatus === "checking") {
        return null;
    }

    if (authStatus === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    if (!me) {
        return null;
    }

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
                                <InfoItem label="전화번호" value={me.phone ?? "미등록"} />
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
                                <button
                                    type="button"
                                    className="rounded-button border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                >
                                    비밀번호 변경
                                </button>

                                <button
                                    type="button"
                                    className="rounded-button border border-red-300 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                                >
                                    회원 탈퇴
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
