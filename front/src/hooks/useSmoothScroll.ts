// hooks/useSmoothScroll.ts
import { useEffect } from 'react';

export const useSmoothScroll = (offset: number = 80) => {
    useEffect(() => {
        const handleSmoothScroll = (e: Event) => {
            const target = e.target as HTMLAnchorElement;

            // 앵커 링크인지 확인
            if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
                e.preventDefault();

                const targetId = target.getAttribute('href');
                if (targetId === '#' || !targetId) return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.getBoundingClientRect().top + window.pageYOffset - offset,
                        behavior: 'smooth',
                    });
                }
            }
        };

        // 이벤트 위임 사용 (더 효율적)
        document.addEventListener('click', handleSmoothScroll);

        return () => {
            document.removeEventListener('click', handleSmoothScroll);
        };
    }, [offset]);
};

