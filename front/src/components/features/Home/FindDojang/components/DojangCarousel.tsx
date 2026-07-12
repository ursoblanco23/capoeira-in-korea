import React, { useState, useEffect, useRef } from 'react';

export interface Dojang {
    id: string;
    name: string;
    address: string;
    region: string;
    district: string;
    instructorName: string;
    // 기타 필요한 필드들...
}

const DojangCarousel: React.FC = () => {
    const [dojangs, setDojangs] = useState<Dojang[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAll, setShowAll] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    // 샘플 데이터 (실제로는 API에서 가져옵니다)
    useEffect(() => {
        const sampleData: Dojang[] = [
            { id: '1', name: '카포에라 브라질 강남점', region: '서울', district: '강남구', address: '서울 강남구 테헤란로', instructorName: '오 마르코스 실바' },
            { id: '2', name: '컬바 카포에라 대구센터', region: '대구', district: '중구', address: '대구 중구 동성로', instructorName: '오 안드레 코스타' },
            { id: '3', name: '아사 카포에라 스튜디오', region: '서울', district: '마포구', address: '서울 마포구 홍익로', instructorName: '오 카톨로스 신토스' },
            { id: '4', name: '바투카다 카포에라 송도', region: '인천', district: '연수구', address: '인천 연수구 컨벤시아대로', instructorName: '오 라파엘 메데이로스' },
            { id: '5', name: '마르 카포에라 해운대', region: '부산', district: '해운대구', address: '부산 해운대구 해운대로', instructorName: '오 페드로 올리베이라' },
            // 추가 데이터...
        ];
        setDojangs(sampleData);
    }, []);

    const handlePrev = () => {
        setCurrentIndex(prev => (prev === 0 ? Math.ceil(dojangs.length / 3) - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev === Math.ceil(dojangs.length / 3) - 1 ? 0 : prev + 1));
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.deltaY > 0) {
            handleNext();
        } else {
            handlePrev();
        }
    };

    // const visibleDojangs = showAll ? dojangs : dojangs.slice(currentIndex * 3, currentIndex * 3 + 3);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">이런 도장은 어떠세요?</h2>
                {!showAll && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="text-primary hover:underline flex items-center"
                    >
                        모든 도장 보기
                        <i className="ri-arrow-right-line ml-1"></i>
                    </button>
                )}
            </div>

            {!showAll ? (
                <div
                    ref={carouselRef}
                    onWheel={handleWheel}
                    className="relative overflow-hidden"
                >
                    <div className="flex transition-transform duration-300">
                        {dojangs.map((dojang, index) => (
                            <div
                                key={dojang.id}
                                className="flex-shrink-0 w-1/3 px-3"
                                style={{
                                    transform: `translateX(-${currentIndex * 100}%)`,
                                    transition: 'transform 0.3s ease'
                                }}
                            >
                                <div className="card-hover-effect bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 h-full">
                                    <div className="h-48 bg-gray-200 relative">
                                        <img
                                            src={`https://source.unsplash.com/random/300x200/?capoeira,${index}`}
                                            alt={dojang.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                                            인기
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-xl font-bold mb-2">{dojang.name}</h4>
                                        <p className="text-gray-600 mb-4">{dojang.region} {dojang.district}</p>
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <div className="flex items-center mr-4">
                                                <i className="ri-user-line mr-1"></i>
                                                <span>{dojang.instructorName}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <i className="ri-star-fill text-yellow-400 mr-1"></i>
                                                <span>4.9 (42)</span>
                                            </div>
                                        </div>
                                        <a href="#" className="text-primary font-medium hover:underline flex items-center">
                                            자세히 보기
                                            <i className="ri-arrow-right-line ml-1"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md p-2 z-10 ml-2"
                    >
                        <i className="ri-arrow-left-s-line text-2xl"></i>
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md p-2 z-10 mr-2"
                    >
                        <i className="ri-arrow-right-s-line text-2xl"></i>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dojangs.map(dojang => (
                        <div
                            key={dojang.id}
                            className="card-hover-effect bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
                        >
                            <div className="h-48 bg-gray-200 relative">
                                <img
                                    src={`https://source.unsplash.com/random/300x200/?capoeira,${dojang.id}`}
                                    alt={dojang.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                                    인기
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-xl font-bold mb-2">{dojang.name}</h4>
                                <p className="text-gray-600 mb-4">{dojang.region} {dojang.district}</p>
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <div className="flex items-center mr-4">
                                        <i className="ri-user-line mr-1"></i>
                                        <span>{dojang.instructorName}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="ri-star-fill text-yellow-400 mr-1"></i>
                                        <span>4.9 (42)</span>
                                    </div>
                                </div>
                                <a href="#" className="text-primary font-medium hover:underline flex items-center">
                                    자세히 보기
                                    <i className="ri-arrow-right-line ml-1"></i>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DojangCarousel;