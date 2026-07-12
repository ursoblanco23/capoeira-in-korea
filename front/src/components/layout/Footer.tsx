const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h3 className="text-2xl font-['Pacifico'] mb-6">Capoeira Korea</h3>
                        <p className="text-gray-400 mb-6">한국 카포에라 커뮤니티를 위한 통합 플랫폼으로, 도장 정보, 이벤트, 커뮤니티 소통을 한 곳에서 제공합니다.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <i className="ri-instagram-line"></i>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <i className="ri-facebook-fill"></i>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <i className="ri-youtube-fill"></i>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <i className="ri-kakao-talk-fill"></i>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-6">빠른 링크</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">도장 찾기</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">이벤트 캘린더</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">커뮤니티</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">카포에라 소개</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">자주 묻는 질문</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-6">연락처</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center">
                                <i className="ri-map-pin-line mr-3"></i>
                                <span className="text-gray-400">서울시 마포구 홍대로 12길 20</span>
                            </li>
                            <li className="flex items-center">
                                <i className="ri-mail-line mr-3"></i>
                                <a href="mailto:info@capoeirakorea.com" className="text-gray-400 hover:text-white transition-colors">info@capoeirakorea.com</a>
                            </li>
                            <li className="flex items-center">
                                <i className="ri-phone-line mr-3"></i>
                                <a href="tel:+82-2-1234-5678" className="text-gray-400 hover:text-white transition-colors">02-1234-5678</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-6">운영 시간</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex justify-between">
                                <span>월요일 - 금요일:</span>
                                <span>09:00 - 18:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>토요일:</span>
                                <span>10:00 - 15:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>일요일:</span>
                                <span>휴무</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 mb-4 md:mb-0">© 2025 코리아 카포에라. All rights reserved.</p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-500 hover:text-white transition-colors">이용약관</a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors">개인정보처리방침</a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors">사이트맵</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;