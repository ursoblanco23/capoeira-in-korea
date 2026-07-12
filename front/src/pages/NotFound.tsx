import React from 'react';

// Tailwind CSS와 사용자 정의 스타일을 위한 스크립트를 직접 HTML에 삽입하는 대신,
// 실제 React 프로젝트에서는 Tailwind CSS를 설정하고 일반 CSS 파일을 임포트하는 방식이 권장됩니다.
// 여기서는 편의상 스타일을 컴포넌트 내부에 직접 정의하거나,
// 외부에 별도의 CSS 모듈/파일로 분리하여 임포트하는 방식으로 처리하겠습니다.

// 이 예제에서는 인라인 스타일 태그를 사용하거나,
// 실제 프로젝트처럼 Tailwind를 빌드 파이프라인에 통합했다고 가정합니다.
// remixicon CSS는 CDN으로 로드되므로, 별도의 설치가 필요할 수 있습니다.

const NotFound: React.FC = () => {
    return (
        // Tailwind CSS 스크립트 설정은 일반적으로 index.html의 <head> 태그에 위치하며,
        // React 컴포넌트 내부에는 직접 넣지 않습니다.
        // 여기서는 Tailwind CSS가 이미 프로젝트에 설정되어 있다고 가정하고 클래스만 사용합니다.
        <div className="flex items-center justify-center p-4 min-h-screen" style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            background: 'linear-gradient(135deg, #f9fafb 0%, #edf2f7 100%)',
        }}>
            {/* Remixicon 스타일 오버라이드. 실제 프로젝트에서는 전역 CSS 파일에 포함하는 것이 좋습니다. */}
            <style>
                {`
          :where([class^="ri-"])::before { content: "\f3c2"; }
          .capoeira-gradient {
            background: linear-gradient(135deg, #4ade80 0%, #facc15 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }
          .animate-bounce-slow {
            animation: bounce 3s ease-in-out infinite;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .fade-in-delay-1 {
            animation-delay: 0.2s;
            opacity: 0;
          }
          .fade-in-delay-2 {
            animation-delay: 0.4s;
            opacity: 0;
          }
          .fade-in-delay-3 {
            animation-delay: 0.6s;
            opacity: 0;
          }
        `}
            </style>

            <div className="max-w-2xl w-full text-center fade-in">
                <div className="mb-8 animate-bounce-slow">
                    <img
                        src="https://readdy.ai/api/search-image?query=A%20stylized%20capoeira%20character%20in%20mid-air%20acrobatic%20move%2C%20dynamic%20pose%20showing%20the%20Brazilian%20martial%20art%20form%2C%20with%20green%20and%20yellow%20color%20scheme%2C%20minimalist%20design%2C%20white%20background%2C%20suitable%20for%20404%20error%20page%2C%20friendly%20and%20energetic%20character&width=300&height=300&seq=capoeira404&orientation=squarish"
                        alt="카포에라 캐릭터"
                        className="mx-auto h-60 object-contain"
                    />
                </div>

                <h1
                    className="text-9xl font-bold capoeira-gradient mb-4 fade-in fade-in-delay-1"
                >
                    404
                </h1>

                <h2 className="text-3xl font-bold text-gray-800 mb-4 fade-in fade-in-delay-2">
                    페이지를 찾을 수 없습니다
                </h2>

                <p className="text-gray-600 mb-8 max-w-md mx-auto fade-in fade-in-delay-2">
                    요청하신 페이지가 이동되었거나 삭제되었을 수 있습니다. 카포에라의
                    흐름처럼 다른 방향으로 움직여 보세요.
                </p>

                <div className="fade-in fade-in-delay-3">
                    <a
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-button transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 whitespace-nowrap"
                    >
            <span className="w-5 h-5 flex items-center justify-center mr-2">
              {/* Remixicon 폰트가 로드되어야 아이콘이 표시됩니다. */}
                <i className="ri-home-line"></i>
            </span>
                        홈으로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NotFound;