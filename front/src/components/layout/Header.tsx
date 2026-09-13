// src/components/header.tsx
import { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import {PAGE} from "@/constants/routes.ts";
import {HeaderAuthActions} from "@/components/layout/header/HeaderAuthActions.tsx";

const Header = () => {


    // ========== 모바일 메뉴 상태 관리 ==========
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // ========== 모바일 메뉴 자동 닫기 기능들 ==========

    // 1. 모바일 메뉴 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const isClickOnMenu = target.closest('.mobile-nav');
            const isClickOnMenuButton = target.closest('.mobile-menu-button');

            if (isMobileMenuOpen && !isClickOnMenu && !isClickOnMenuButton) {
                closeMobileMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    // 2. 화면 크기가 데스크톱으로 변경되면 모바일 메뉴 닫기
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // md breakpoint (768px)
                closeMobileMenu();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ========== CSS 클래스 정의 ==========

    // 데스크톱 네비게이션 스타일
    const desktopNavStyles = "hidden md:flex items-center space-x-8";

    // 모바일 네비게이션 스타일 (드롭다운)
    const mobileNavStyles = "flex flex-col absolute top-16 right-4 bg-white shadow-lg p-4 rounded-lg space-y-4 space-x-0 z-50 min-w-[200px]";

    // 네비게이션 최종 스타일 (조건부)
    const navigationStyles = `transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? mobileNavStyles : desktopNavStyles
    }`;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">

                {/* ========== 로고 섹션 ========== */}
                <div className="flex items-center">
                    <Link to="/" className="text-3xl font-['Pacifico'] text-primary">
                        Capoeira Korea
                    </Link>
                </div>

                {/* ========== 네비게이션 메뉴 (데스크톱 + 모바일) ========== */}
                <nav className={`mobile-nav ${navigationStyles}`}>
                    <a
                        href="#find-dojang"
                        className="text-gray-700 hover:text-primary font-medium transition-colors"
                        onClick={closeMobileMenu} // 모바일에서 링크 클릭 시 메뉴 닫기
                    >
                        도장찾기
                    </a>
                    <a
                        href="#events"
                        className="text-gray-700 hover:text-primary font-medium transition-colors"
                        onClick={closeMobileMenu}
                    >
                        이벤트/모임
                    </a>
                    <a
                        href="#community"
                        className="text-gray-700 hover:text-primary font-medium transition-colors"
                        onClick={closeMobileMenu}
                    >
                        커뮤니티
                    </a>
                    <a
                        href="#about"
                        className="text-gray-700 hover:text-primary font-medium transition-colors"
                        onClick={closeMobileMenu}
                    >
                        소개
                    </a>
                    {/*TODO 로그인 기능 완성 후 user?.isAdmin && (<Link />) 이렇게 바꿔줘야 함. -> 관리자용 페이지*/}
                    <Link to={PAGE.ADMIN_DOJANG}
                          className="text-gray-700 hover:text-primary font-medium transition-colors"
                          onClick={closeMobileMenu}>
                        도장관리
                    </Link>
                </nav>

                {/* ========== 우측 버튼들 & 모바일 햄버거 메뉴 ========== */}
                <div className="flex items-center space-x-4">
                    <HeaderAuthActions />
                    {/* ========== 모바일 햄버거 메뉴 버튼 ========== */}
                    <button
                        className="mobile-menu-button md:hidden w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={toggleMobileMenu}
                        aria-label="모바일 메뉴 토글"
                    >
                        {/* 햄버거 아이콘 ↔ X 아이콘 토글 */}
                        <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-gray-700 ri-lg transition-transform duration-300`}></i>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;