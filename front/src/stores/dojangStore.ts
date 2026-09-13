// store/dojangStore.ts
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { type Dojang } from '@/types/dojang';
import dojangService from '@/services/api/services/dojangService.ts';

interface DojangState {
    dojangs: Dojang[];
    isLoading: boolean;
    error: string | null;
    lastFetchTime: number | null;

    fetchDojangs: (forceRefresh?: boolean) => Promise<void>;
    findDojangById: (id: number) => Dojang | null;
    removeDojang: (id: number) => void;
    clearError: () => void;
    reset: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5분


/**
 * @deprecated 도장 서버 상태는 TanStack Query로 이전 중입니다.
 * 학습 참고용으로만 유지하며 신규 코드에서는 useDojangsQuery를 사용하세요.
 */
export const useDojangStore = create<DojangState>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer((set, get) => ({
                    dojangs: [],
                    isLoading: false,
                    error: null,
                    lastFetchTime: null,

                    fetchDojangs: async (forceRefresh = false) => {
                        const state = get();
                        const now = Date.now();

                        const isCacheValid =
                            state.lastFetchTime &&
                            now - state.lastFetchTime < CACHE_DURATION &&
                            state.dojangs.length > 0;

                        if (!forceRefresh && isCacheValid) {
                            return;
                        }

                        set((state) => {
                            state.isLoading = true;
                            state.error = null;
                        });

                        try {
                            const response = await dojangService.getDojangs();
                            set((state) => {
                                state.dojangs = response;
                                state.lastFetchTime = now;
                                state.isLoading = false;
                            });
                        } catch (error) {
                            set((state) => {
                                state.error =
                                    error instanceof Error
                                        ? error.message
                                        : '도장 목록을 불러오는데 실패했습니다.';
                                state.isLoading = false;
                            });
                        }
                    },

                    findDojangById: (id: number): Dojang | null => {
                        return get().dojangs.find((d) => d.id === id) || null;
                    },

                    removeDojang: (id: number) => set(state => ({
                        dojangs: state.dojangs.filter(d => d.id !== id)
                    })),

                    clearError: () => {
                        set((state) => {
                            state.error = null;
                        });
                    },

                    reset: () => {
                        set((state) => {
                            state.dojangs = [];
                            state.isLoading = false;
                            state.error = null;
                            state.lastFetchTime = null;
                        });
                    },
                }))
            ),
            {
                name: 'dojang-store',
                partialize: (state) => ({
                    dojangs: state.dojangs,
                    lastFetchTime: state.lastFetchTime,
                }),
            }
        ),
        {
            name: 'dojang-store-devtools', // devtool 옵션
            enabled: process.env.NODE_ENV === 'development',
        }
    )
);

// 구독 추가

// 셀렉터 훅들
export const useDojangList = () => useDojangStore((state) => state.dojangs);
export const useDojangLoading = () => useDojangStore((state) => state.isLoading);
export const useDojangError = () => useDojangStore((state) => state.error);
export const useFindDojangById = () => useDojangStore((state) => state.findDojangById);

// Action hooks
export const useRemoveDojang = () => useDojangStore((state) => state.removeDojang);