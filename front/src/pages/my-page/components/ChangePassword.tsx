import {useState} from "react";
import type {ChangePasswordRequest} from "@/services/api/auth/types/ChangePasswordRequest.ts";
import {PasswordStrengthMeter} from "@/components/auth/PasswordStrengthMeter.tsx";
import {extractErrorMessage} from "@/utils/error.ts";
import {PasswordField} from "@/components/auth/PasswordField.tsx";
import {authService} from "@/services/api/auth/service/authService.ts";
import {useNavigate} from "react-router-dom";
import {PAGE} from "@/constants/routes.ts";
import {toast} from "react-toastify";

interface ChangePasswordForm extends ChangePasswordRequest {
    newPasswordConfirm: string
}

type FieldErrors = Partial<Record<keyof ChangePasswordForm, string>>;

const initialForm: ChangePasswordForm = {
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
}


export function ChangePassword() {
    const [form, setForm] = useState<ChangePasswordForm>(initialForm);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPw, setShowPw] = useState(false);
    const [showPw2, setShowPw2] = useState(false);
    const navigate = useNavigate()


    function validate(): FieldErrors {
        const e: FieldErrors = {};

        if (!form.currentPassword) e.currentPassword = "현재 비밀번호를 입력해주세요.";

        if (!form.newPassword) e.newPassword = "새 비밀번호를 입력해주세요.";
        else if (form.newPassword.length < 12) e.newPassword = "비밀번호는 12자 이상이어야 해요.";

        if (!form.newPasswordConfirm) e.newPasswordConfirm = "비밀번호 확인을 입력해주세요.";
        else if (form.newPasswordConfirm !== form.newPassword)
            e.newPasswordConfirm = "비밀번호가 일치하지 않아요.";

        return e;
    }

    function setField<K extends keyof ChangePasswordForm>(key: K, value: ChangePasswordForm[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
        setServerError(null);
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

        try {
            const payload: ChangePasswordRequest = {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            };


            await authService.changePassword(payload);

            toast.success(
                <span>
                    비밀번호가 변경되었습니다.
                    <br />
                    보안을 위해 다시 로그인해 주세요.
                </span>
            );
            setForm(initialForm);
            navigate(PAGE.HOME, {replace: true})
        } catch (err) {
            setServerError(extractErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    }


    return (
        <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-10 sm:px-6">
            <section className="mx-auto max-w-xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    {serverError && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                비밀번호 변경
                            </h3>

                            <div className="mt-6 space-y-5">
                                <div className="space-y-4">
                                    <PasswordField
                                        label="기존 비밀번호"
                                        value={form.currentPassword}
                                        onChange={(v) => setField("currentPassword", v)}
                                        error={errors.currentPassword}
                                        autoComplete="current-password"
                                        show={showPw}
                                        onToggle={() => setShowPw((p) => !p)}
                                    />
                                    <PasswordField
                                        label="새 비밀번호"
                                        value={form.newPassword}
                                        onChange={(v) => setField("newPassword", v)}
                                        error={errors.newPassword}
                                        autoComplete="new-password"
                                        show={showPw}
                                        onToggle={() => setShowPw((p) => !p)}
                                    />
                                    <PasswordField
                                        label="새 비밀번호 확인"
                                        value={form.newPasswordConfirm}
                                        onChange={(v) => setField("newPasswordConfirm", v)}
                                        error={errors.newPasswordConfirm}
                                        autoComplete="new-password"
                                        show={showPw2}
                                        onToggle={() => setShowPw2((p) => !p)}
                                    />
                                </div>

                                <PasswordStrengthMeter password={form.newPassword}/>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? "비밀번호 변경 중..." : "변경완료"}
                            </button>

                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}