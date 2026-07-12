import type React from "react"
import {useNavigate} from "react-router-dom";

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate('/');
    }

    // const handleLogin = () => {
    //     window.location.href = "/login"
    // }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-yellow-400 to-primary"></div>

                    {/* Capoeira Icon */}
                    <div className="mb-6">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Acesso Negado</h1>

                    {/* Subtitle */}
                    <p className="text-lg text-gray-600 mb-6">Unauthorized Access</p>

                    {/* Message */}
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6 rounded-md">
                        <p className="text-gray-700 leading-relaxed">
                            죄송합니다. 이 페이지에 접근할 권한이 없습니다.
                            <br />
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        {/*<button*/}
                        {/*    onClick={handleLogin}*/}
                        {/*    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-button shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 hover:from-blue-600 hover:to-green-600"*/}
                        {/*>*/}
                        {/*    로그인하기*/}
                        {/*</button>*/}

                        <button
                            onClick={handleGoHome}
                            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-button border border-gray-200 hover:bg-gray-200 hover:shadow-md transform hover:-translate-y-1 transition-all duration-200"
                        >
                            홈으로 돌아가기
                        </button>
                    </div>

                    {/* Footer Message */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-500">카포에라의 정신으로 함께해요! 🥋</p>
                        <div className="flex justify-center space-x-1 mt-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        문제가 지속되면{" "}
                        <a href="/contact" className="text-primary hover:text-blue-700 font-medium underline">
                            관리자에게 문의
                        </a>
                        해주세요.
                    </p>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="fixed top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="fixed bottom-10 right-10 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
            <div className="fixed top-1/2 right-20 w-12 h-12 bg-blue-200 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>
    )
}

export default Unauthorized
