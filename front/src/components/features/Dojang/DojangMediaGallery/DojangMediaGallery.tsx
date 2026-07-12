import React, { useState } from "react";

interface VideoData {
    title: string;
    description: string;
    videoUrl: string;
}

const DojangMediaGallery = () => {
    const [tabState, setTabState] = useState('photos');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<{
        type: 'photo' | 'video';
        src?: string;
        alt?: string;
        videoData?: VideoData;
    } | null>(null);

    const videoData: VideoData[] = [
        {
            title: '카포에라 기초 동작 가이드',
            description: '초보자를 위한 기본 동작과 스텝을 상세히 설명하는 가이드 영상입니다. 집에서도 따라할 수 있는 기초 동작들을 마스터 호세 실바가 직접 시연합니다.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            title: '2025 카포에라 시연회 하이라이트',
            description: '2025년 상반기 카포에라 마스터 아카데미 시연회의 하이라이트 영상입니다. 수련생들의 화려한 기술과 열정적인 공연을 담았습니다.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
    ];

    const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const tabName = e.currentTarget.dataset.tab;
        if (tabName === 'photos' || tabName === 'videos') {
            setTabState(tabName);
        }
    };

    const handlePhotoClick = (src: string, alt: string) => {
        setModalContent({
            type: 'photo',
            src,
            alt
        });
        setShowModal(true);
    };

    const handleVideoClick = (index: number) => {
        setModalContent({
            type: 'video',
            videoData: videoData[index]
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalContent(null);
    };

    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <>
            <section className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">사진 및 영상</h2>
                    <div className="flex space-x-4">
                        <button
                            className={`text-gray-500 hover:text-primary ${tabState === 'photos' ? 'text-primary' : ''}`}
                            data-tab="photos"
                            onClick={handleTabClick}
                        >
                            <div className="w-6 h-6 flex items-center justify-center">
                                <i className="ri-image-line"></i>
                            </div>
                        </button>
                        <button
                            className={`text-gray-500 hover:text-primary ${tabState === 'videos' ? 'text-primary' : ''}`}
                            data-tab="videos"
                            onClick={handleTabClick}
                        >
                            <div className="w-6 h-6 flex items-center justify-center">
                                <i className="ri-video-line"></i>
                            </div>
                        </button>
                    </div>
                </div>

                {/* 사진 갤러리 */}
                {tabState === 'photos' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => handlePhotoClick(
                                "https://readdy.ai/api/search-image?query=capoeira%20training%20session%20in%20a%20modern%20gym%20with%20natural%20lighting%2C%20students%20practicing%20basic%20movements%20on%20wooden%20floor%2C%20high%20quality%20professional%20photo&width=400&height=400&seq=1&orientation=squarish",
                                "카포에라 수업"
                            )}
                        >
                            <img
                                src="https://readdy.ai/api/search-image?query=capoeira%20training%20session%20in%20a%20modern%20gym%20with%20natural%20lighting%2C%20students%20practicing%20basic%20movements%20on%20wooden%20floor%2C%20high%20quality%20professional%20photo&width=400&height=400&seq=1&orientation=squarish"
                                className="w-full h-full object-cover"
                                alt="카포에라 수업"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-8 h-8 flex items-center justify-center text-white">
                                    <i className="ri-zoom-in-line"></i>
                                </div>
                            </div>
                        </div>
                        <div
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => handlePhotoClick(
                                "https://readdy.ai/api/search-image?query=capoeira%20performance%20with%20traditional%20instruments%2C%20berimbau%20and%20pandeiro%2C%20students%20in%20white%20uniforms%20performing%20in%20a%20circle%2C%20vibrant%20atmosphere&width=400&height=400&seq=2&orientation=squarish",
                                "카포에라 공연"
                            )}
                        >
                            <img
                                src="https://readdy.ai/api/search-image?query=capoeira%20performance%20with%20traditional%20instruments%2C%20berimbau%20and%20pandeiro%2C%20students%20in%20white%20uniforms%20performing%20in%20a%20circle%2C%20vibrant%20atmosphere&width=400&height=400&seq=2&orientation=squarish"
                                className="w-full h-full object-cover"
                                alt="카포에라 공연"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-8 h-8 flex items-center justify-center text-white">
                                    <i className="ri-zoom-in-line"></i>
                                </div>
                            </div>
                        </div>
                        <div
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => handlePhotoClick(
                                "https://readdy.ai/api/search-image?query=capoeira%20master%20teaching%20advanced%20moves%2C%20demonstrating%20acrobatic%20techniques%2C%20students%20watching%20attentively%20in%20a%20modern%20training%20facility&width=400&height=400&seq=3&orientation=squarish",
                                "마스터 클래스"
                            )}
                        >
                            <img
                                src="https://readdy.ai/api/search-image?query=capoeira%20master%20teaching%20advanced%20moves%2C%20demonstrating%20acrobatic%20techniques%2C%20students%20watching%20attentively%20in%20a%20modern%20training%20facility&width=400&height=400&seq=3&orientation=squarish"
                                className="w-full h-full object-cover"
                                alt="마스터 클래스"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-8 h-8 flex items-center justify-center text-white">
                                    <i className="ri-zoom-in-line"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 영상 갤러리 */}
                {tabState === 'videos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {videoData.map((video, index) => (
                            <div
                                key={index}
                                className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer group relative"
                                onClick={() => handleVideoClick(index)}
                            >
                                <div className="w-16 h-16 flex items-center justify-center text-primary">
                                    <i className="ri-play-circle-line ri-3x"></i>
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="absolute bottom-2 left-2 text-white text-sm">{video.title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 모달 */}
            {showModal && modalContent && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                    style={{ marginTop: 0}}
                    onClick={handleModalClick}
                >
                    {modalContent.type === 'photo' ? (
                        <div className="relative max-w-4xl w-full mx-4">
                            <img
                                src={modalContent.src}
                                className="w-full h-auto rounded-lg"
                                alt={modalContent.alt}
                            />
                            <button
                                className="absolute top-4 right-4 text-white hover:text-gray-300"
                                onClick={closeModal}
                            >
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <i className="ri-close-line ri-2x"></i>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="relative max-w-5xl w-full mx-4">
                            <div className="aspect-video w-full">
                                <iframe
                                    src={modalContent.videoData?.videoUrl}
                                    className="w-full h-full rounded-lg"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="mt-4 text-white">
                                <h3 className="text-xl font-bold">{modalContent.videoData?.title}</h3>
                                <p className="mt-2 text-gray-300">{modalContent.videoData?.description}</p>
                            </div>
                            <button
                                className="absolute -top-12 right-0 text-white hover:text-gray-300"
                                onClick={closeModal}
                            >
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <i className="ri-close-line ri-2x"></i>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default DojangMediaGallery;