// src/pages/SignupPage.tsx
import React, { useMemo, useState } from "react";
import {authService} from "@/services/api/services/authService.ts";
import type {ApiResponse} from "@/services/api/types/apiResponse.ts";
import {extractErrorMessage} from "@/utils/error.ts";
import {normalizePhone} from "@/utils";
import type { SignupResponse } from "@/services/api/types/authApiTypes";
import type { SignupForm } from "@/services/api/user/types/SignupForm.ts";
import type {Gender} from "@/services/api/user/types/Gender.ts";

type FieldErrors = Partial<Record<keyof SignupForm, string>>;

const initialForm: SignupForm = {
    loginId: "",
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",

    realName: "",
    phone: "",
    birthDate: "",
    gender: "U",

    zipCode: "",
    roadAddress: "",
    detailAddress: "",
    sidoName: "",
    sigunguName: "",
    eupmyeondongName: "",
};

function isEmail(v: string) {
    // 실무에선 더 빡세게/또는 서버 검증이 중심
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}



export default function SignupPage() {
    const [form, setForm] = useState<SignupForm>(initialForm);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [showPw, setShowPw] = useState(false);
    const [showPw2, setShowPw2] = useState(false);

    const pwStrength = useMemo(() => {
        const p = form.password;
        const hasLen = p.length >= 8;
        const hasNum = /\d/.test(p);
        const hasAlpha = /[A-Za-z]/.test(p);
        const hasSpecial = /[^A-Za-z0-9]/.test(p);
        const score = [hasLen, hasNum, hasAlpha, hasSpecial].filter(Boolean).length;
        return { score, hasLen, hasNum, hasAlpha, hasSpecial };
    }, [form.password]);

    function setField<K extends keyof SignupForm>(key: K, value: SignupForm[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
        setServerError(null);
        setSuccessMsg(null);
    }

    function validate(): FieldErrors {
        const e: FieldErrors = {};

        // 필수: loginId/nickname/password
        if (!form.loginId.trim()) e.loginId = "아이디(loginId)를 입력해주세요.";
        else if (form.loginId.length < 4) e.loginId = "아이디는 4자 이상을 권장해요.";

        if (!form.nickname.trim()) e.nickname = "닉네임을 입력해주세요.";
        else if (form.nickname.length < 2) e.nickname = "닉네임은 2자 이상을 권장해요.";

        if (!form.password) e.password = "비밀번호를 입력해주세요.";
        else if (form.password.length < 8) e.password = "비밀번호는 8자 이상이어야 해요.";

        if (!form.passwordConfirm) e.passwordConfirm = "비밀번호 확인을 입력해주세요.";
        else if (form.passwordConfirm !== form.password)
            e.passwordConfirm = "비밀번호가 일치하지 않아요.";

        // email은 테이블상 nullable이지만, 로컬 가입에선 보통 받는 편
        if (!form.email.trim()) e.email = "이메일을 입력해주세요.";
        else if (!isEmail(form.email)) e.email = "이메일 형식이 올바르지 않아요.";

        if (form.phone && form.phone.replace(/[^\d]/g, "").length < 9) {
            // 숫자만 추렸을 때 9자리 미만이면 안 된다
            e.phone = "전화번호 형식이 올바르지 않아요.";
        }
        if (form.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.birthDate)) {
            e.birthDate = "생년월일은 YYYY-MM-DD 형식이에요.";
        }

        return e;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        const nextErrors = validate();
        if (Object.values(nextErrors).some(Boolean)) {
            setErrors(nextErrors);
            return;
        }

        setSubmitting(true);
        setServerError(null);
        setSuccessMsg(null);

        try {
            // 백엔드 DTO에 맞춰 payload를 구성해야 함.
            // 너가 전에 쓴 SignupRequest 기준(예상): loginId, email, password, nickname + optional fields
            const payload: SignupForm = {
                loginId: form.loginId.trim(),
                email: form.email.trim(),
                password: form.password,
                passwordConfirm: form.passwordConfirm,
                nickname: form.nickname.trim(),

                realName: form.realName.trim(),
                phone: form.phone.trim(),
                birthDate: form.birthDate,
                gender: form.gender,

                zipCode: form.zipCode.trim(),
                roadAddress: form.roadAddress.trim(),
                detailAddress: form.detailAddress.trim(),
                sidoName: form.sidoName.trim(),
                sigunguName: form.sigunguName.trim(),
                eupmyeondongName: form.eupmyeondongName.trim(),
            };

            // console.log("signup payload:", payload);
            // return; //테스트 용 임시막기

            // TODO: AXIOS API를 이용한 AuthService
            const res: ApiResponse<SignupResponse> = await authService.signup(payload);

            if (!res.success) {
                // 서버에서 공통 에러 포맷(ApiResponse 등)이면 여길 맞춰 파싱
                const message = res.message;
                throw new Error(message || "회원가입에 실패했어요.");
            }

            const data = res.data as SignupResponse;
            console.log("signup response:", data);

            // TODO: 토큰 저장 방식 결정
            // - accessToken: 메모리/상태관리(zustand) + 필요시 localStorage(보안 tradeoff)
            // - refreshToken: HttpOnly Cookie 추천 or 지금처럼 응답 바디로 주는 방식이면 저장 고민 필요
            // localStorage.setItem("accessToken", data.accessToken);

            setSuccessMsg("회원가입이 완료되었어요! 🎉");
            // 필요하면 라우팅
            // navigate("/");
            // 또는 자동 로그인 상태로 전환 처리

            setForm(initialForm);
        } catch (err) {
            setServerError(extractErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white">
            <div className="mx-auto max-w-5xl px-4 py-10">
                {/* 헤더 */}
                <div className="mb-8 flex flex-col items-start gap-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        회원가입
                    </h1>
                    <p className="text-slate-600">
                        카포에라 도장/이벤트/커뮤니티를 더 편하게 이용해보세요.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                    {/* 왼쪽: 안내 카드 */}
                    <aside className="lg:col-span-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                    {/* 아이콘 대용 */}
                                    <span className="text-lg font-bold">CK</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        가입 혜택
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600">
                                        즐겨찾기, 모임 참여, 커뮤니티 글쓰기 등 다양한 기능을
                                        사용할 수 있어요.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3 text-sm text-slate-700">
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <div className="font-semibold text-slate-900">아이디</div>
                                    <div className="mt-1 text-slate-600">
                                        영문/숫자 조합 4자 이상 권장
                                    </div>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <div className="font-semibold text-slate-900">비밀번호</div>
                                    <div className="mt-1 text-slate-600">
                                        8자 이상 + 숫자/문자/특수문자 조합 권장
                                    </div>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <div className="font-semibold text-slate-900">개인정보</div>
                                    <div className="mt-1 text-slate-600">
                                        주소/생년월일/성별은 선택 입력이에요.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* 오른쪽: 폼 카드 */}
                    <section className="lg:col-span-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            {serverError && (
                                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {serverError}
                                </div>
                            )}
                            {successMsg && (
                                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    {successMsg}
                                </div>
                            )}

                            <form onSubmit={onSubmit} className="space-y-6">
                                {/* 계정 정보 */}
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        계정 정보
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600">
                                        로그인에 필요한 기본 정보예요.
                                    </p>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <Field
                                            label="아이디(loginId)"
                                            placeholder="예) taemin01"
                                            value={form.loginId}
                                            onChange={(v) => setField("loginId", v)}
                                            error={errors.loginId}
                                            autoComplete="username"
                                        />
                                        <Field
                                            label="닉네임"
                                            placeholder="예) ursoblanco"
                                            value={form.nickname}
                                            onChange={(v) => setField("nickname", v)}
                                            error={errors.nickname}
                                            autoComplete="nickname"
                                        />

                                        <Field
                                            label="이메일"
                                            placeholder="예) taemin01@test.com"
                                            value={form.email}
                                            onChange={(v) => setField("email", v)}
                                            error={errors.email}
                                            autoComplete="email"
                                        />

                                        <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                                            <PasswordField
                                                label="비밀번호"
                                                value={form.password}
                                                onChange={(v) => setField("password", v)}
                                                error={errors.password}
                                                autoComplete="new-password"
                                                show={showPw}
                                                onToggle={() => setShowPw((p) => !p)}
                                            />
                                            <PasswordField
                                                label="비밀번호 확인"
                                                value={form.passwordConfirm}
                                                onChange={(v) => setField("passwordConfirm", v)}
                                                error={errors.passwordConfirm}
                                                autoComplete="new-password"
                                                show={showPw2}
                                                onToggle={() => setShowPw2((p) => !p)}
                                            />
                                        </div>

                                        <PasswordStrengthMeter strength={pwStrength} />
                                    </div>
                                </div>

                                {/* 프로필(선택) */}
                                <div className="border-t border-slate-100 pt-6">
                                    <h3 className="text-base font-bold text-slate-900">
                                        프로필 (선택)
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600">
                                        나중에 마이페이지에서 언제든 수정할 수 있어요.
                                    </p>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <Field
                                            label="실명"
                                            placeholder="예) 허태민"
                                            value={form.realName}
                                            onChange={(v) => setField("realName", v)}
                                            error={errors.realName}
                                            autoComplete="name"
                                        />
                                        <Field
                                            label="전화번호"
                                            placeholder="예) 010-1234-5678"
                                            value={form.phone}
                                            onChange={(v) => setField("phone", normalizePhone(v))}
                                            error={errors.phone}
                                            autoComplete="tel"
                                        />
                                        <Field
                                            label="생년월일"
                                            placeholder="YYYY-MM-DD"
                                            value={form.birthDate}
                                            onChange={(v) => setField("birthDate", v)}
                                            error={errors.birthDate}
                                            type="date"
                                            autoComplete="bday"
                                        />

                                        <SelectField<Gender>
                                            label="성별"
                                            value={form.gender}
                                            onChange={(v) => setField("gender", v)}
                                            options={[
                                                { value: "U", label: "선택 안 함" },
                                                { value: "M", label: "남성 (M)" },
                                                { value: "F", label: "여성 (F)" },
                                            ]}
                                            hint="gender_type: M/F/U"
                                        />
                                    </div>
                                </div>

                                {/* 주소(선택) */}
                                <div className="border-t border-slate-100 pt-6">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">
                                                주소 (선택)
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-600">
                                                추후 도장/이벤트 추천에 활용할 수 있어요.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                                            onClick={() => {
                                                // TODO: 다음/카카오 우편번호 연동 지점
                                                alert("TODO: 우편번호 검색 연동(다음/카카오)");
                                            }}
                                        >
                                            우편번호 검색
                                        </button>
                                    </div>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <Field
                                            label="우편번호"
                                            placeholder="예) 06236"
                                            value={form.zipCode}
                                            onChange={(v) => setField("zipCode", v)}
                                            error={errors.zipCode}
                                        />
                                        <Field
                                            label="도로명 주소"
                                            placeholder="예) 서울 강남구 테헤란로 123"
                                            value={form.roadAddress}
                                            onChange={(v) => setField("roadAddress", v)}
                                            error={errors.roadAddress}
                                        />

                                        <Field
                                            label="상세 주소"
                                            placeholder="예) 101동 202호"
                                            value={form.detailAddress}
                                            onChange={(v) => setField("detailAddress", v)}
                                            error={errors.detailAddress}
                                            className="sm:col-span-2"
                                        />

                                        <Field
                                            label="시/도"
                                            placeholder="예) 서울"
                                            value={form.sidoName}
                                            onChange={(v) => setField("sidoName", v)}
                                            error={errors.sidoName}
                                        />
                                        <Field
                                            label="시/군/구"
                                            placeholder="예) 강남구"
                                            value={form.sigunguName}
                                            onChange={(v) => setField("sigunguName", v)}
                                            error={errors.sigunguName}
                                        />
                                        <Field
                                            label="읍/면/동"
                                            placeholder="예) 역삼동"
                                            value={form.eupmyeondongName}
                                            onChange={(v) => setField("eupmyeondongName", v)}
                                            error={errors.eupmyeondongName}
                                            className="sm:col-span-2"
                                        />
                                    </div>
                                </div>

                                {/* 제출 */}
                                <div className="border-t border-slate-100 pt-6">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {submitting ? "가입 처리 중..." : "회원가입"}
                                    </button>

                                    <p className="mt-3 text-center text-xs text-slate-500">
                                        가입 시 서비스 이용약관 및 개인정보 처리방침에 동의한 것으로
                                        간주합니다.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

/* ----------------------------- UI Bits ----------------------------- */

function Field(props: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    error?: string;
    type?: React.HTMLInputTypeAttribute;
    autoComplete?: string;
    className?: string;
}) {
    const {
        label,
        value,
        onChange,
        placeholder,
        error,
        type = "text",
        autoComplete,
        className,
    } = props;

    return (
        <div className={className}>
            <label className="mb-1 block text-sm font-semibold text-slate-800">
                {label}
            </label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={[
                    "w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none",
                    "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100",
                    error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "",
                ].join(" ")}
            />
            {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
        </div>
    );
}

function PasswordField(props: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    autoComplete?: string;
    show: boolean;
    onToggle: () => void;
}) {
    const { label, value, onChange, error, autoComplete, show, onToggle } = props;

    return (
        <div>
            <label className="mb-1 block text-sm font-semibold text-slate-800">
                {label}
            </label>
            <div
                className={[
                    "flex items-center rounded-xl border bg-white shadow-sm",
                    error ? "border-red-300" : "border-slate-200",
                    "focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100",
                    error ? "focus-within:border-red-400 focus-within:ring-red-100" : "",
                ].join(" ")}
            >
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    type={show ? "text" : "password"}
                    autoComplete={autoComplete}
                    className="w-full rounded-xl bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="mx-2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                    {show ? "숨김" : "보기"}
                </button>
            </div>
            {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
        </div>
    );
}

function PasswordStrengthMeter(props: {
    strength: {
        score: number;
        hasLen: boolean;
        hasNum: boolean;
        hasAlpha: boolean;
        hasSpecial: boolean;
    };
}) {
    const { strength } = props;
    const pct = (strength.score / 4) * 100;

    return (
        <div className="sm:col-span-2">
            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">비밀번호 강도</p>
                    <p className="text-xs text-slate-600">
                        {strength.score <= 1 && "약함"}
                        {strength.score === 2 && "보통"}
                        {strength.score === 3 && "좋음"}
                        {strength.score === 4 && "강함"}
                    </p>
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{ width: `${pct}%` }}
                    />
                </div>

                <ul className="mt-3 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
                    <li className={strength.hasLen ? "text-emerald-700" : ""}>
                        • 8자 이상
                    </li>
                    <li className={strength.hasNum ? "text-emerald-700" : ""}>
                        • 숫자 포함
                    </li>
                    <li className={strength.hasAlpha ? "text-emerald-700" : ""}>
                        • 영문 포함
                    </li>
                    <li className={strength.hasSpecial ? "text-emerald-700" : ""}>
                        • 특수문자 포함
                    </li>
                </ul>
            </div>
        </div>
    );
}

function SelectField<T extends string>(props: {
    label: string;
    value: T;
    onChange: (v: T) => void;
    options: { value: T; label: string }[];
    hint?: string;
}) {
    const { label, value, onChange, options, hint } = props;
    return (
        <div>
            <label className="mb-1 block text-sm font-semibold text-slate-800">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
    );
}
