import React, { useState } from "react";
import "@/assets/styles/Login.css";
import { authService } from "../services/api/auth/service/authService";
import {toast} from "react-toastify";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {PAGE} from "@/constants/routes.ts";
import type {LoginRequestDto} from "@/services/api/types/authApiTypes.ts";



const Login: React.FC = () => {
    const [form, setForm] = useState<LoginRequestDto>({ id: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const onChange =
        (key: keyof LoginRequestDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({ ...prev, [key]: e.target.value }));
        };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        const id = form.id.trim();
        const pw = form.password;

        if (!id || !pw) {
            setErrorMsg("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            await authService.login({ id, password: pw });

            //TODO: 로그인 성공 후 원래 페이지로 보내기
            const from = location.state?.from;
            const previousUrl = from ? from.pathname + from.search : "/";
            navigate(previousUrl, {replace: true});
        } catch (err: any) {
            // toast로 즉시 피드백
            toast.error(err?.message ?? "로그인에 실패했습니다. 다시 시도해주세요.");
            setErrorMsg(err?.message ?? "로그인에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-root">
            <div className="login-hero"/>

            <div className="login-card">
                <header className="login-header">
                    <div className="login-logo">Capoeira Korea</div>
                    <p className="login-subtitle">카포에라 커뮤니티에 로그인하세요</p>
                </header>

                <div className="social-login-group">
                    <button className="social-btn social-google" type="button">
                        <span className="social-icon">G</span>
                        <span>Google로 계속하기</span>
                    </button>
                    <button className="social-btn social-kakao" type="button">
                        <span className="social-icon">K</span>
                        <span>카카오톡으로 계속하기</span>
                    </button>
                    <button className="social-btn social-naver" type="button">
                        <span className="social-icon">N</span>
                        <span>네이버로 계속하기</span>
                    </button>
                </div>

                <div className="divider">
                    <span className="divider-line"/>
                    <span className="divider-text">또는 이메일로 로그인</span>
                    <span className="divider-line"/>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="login-id">아이디</label>
                        <input
                            id="login-id"
                            type="text"
                            placeholder="아이디를 입력하세요"
                            value={form.id}
                            onChange={onChange("id")}
                            autoComplete="username"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="login-password">비밀번호</label>
                        <input
                            id="login-password"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={form.password}
                            onChange={onChange("password")}
                            autoComplete="current-password"
                            minLength={12}
                            maxLength={64}
                            disabled={loading}
                        />
                    </div>

                    {errorMsg && <p className="form-error">{errorMsg}</p>}

                    <button className="primary-btn" type="submit" disabled={loading}>
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div className="login-footer">
                    <div className="footer-links-left">
                        <button type="button" className="text-link">
                            아이디 찾기
                        </button>
                        <span className="dot">·</span>
                        <button type="button" className="text-link">
                            비밀번호 찾기
                        </button>
                    </div>
                    <div className="footer-links-right">
                        <span>아직 회원이 아니신가요?</span>
                        <Link
                            to={PAGE.SIGN_UP}
                            className="text-link strong">
                            회원가입
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
