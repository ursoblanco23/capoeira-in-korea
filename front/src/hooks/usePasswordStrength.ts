import { useMemo } from "react";

export interface PasswordStrength {
    score: number;
    hasLen: boolean;
    hasNum: boolean;
    hasAlpha: boolean;
    hasSpecial: boolean;
}

export function usePasswordStrength(password: string): PasswordStrength {
    return useMemo(() => {
        const hasLen = password.length >= 12;
        const hasNum = /\d/.test(password);
        const hasAlpha = /[A-Za-z]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);

        return {
            score: [hasLen, hasNum, hasAlpha, hasSpecial].filter(Boolean).length,
            hasLen,
            hasNum,
            hasAlpha,
            hasSpecial,
        };
    }, [password]);
}
