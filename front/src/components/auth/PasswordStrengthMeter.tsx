import { usePasswordStrength } from "@/hooks/usePasswordStrength.ts";

interface PasswordStrengthMeterProps {
    password: string;
}

export function PasswordStrengthMeter({
    password,
}: PasswordStrengthMeterProps) {
    const strength = usePasswordStrength(password);

    const percentage = (strength.score / 4) * 100;

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
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <ul className="mt-3 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
                    <li className={strength.hasLen ? "text-emerald-700" : ""}>
                        • 12자 이상
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