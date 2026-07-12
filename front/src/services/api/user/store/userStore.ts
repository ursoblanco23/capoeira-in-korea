import type { UserWithRoles } from "@/services/api/user/types/UserDto.ts";
import { create } from "zustand";
import {devtools, persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";

interface UserState {
    //state
    user: UserWithRoles | null;
    lastFetchTime: number | null;

    //actions
    setUser: (user: UserWithRoles) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>()(
    devtools(
        persist(
            immer((set) => ({
                // TODO : 로그인 기능 완성후 getUser() 함수로 서버에서 유저 정보 가져오기
                // user: null,
                //로그인 기능 완성 전 임시로 가데이터 사용
                user: {
                    id: 1,
                    username: 'marcos_silva',
                    nickname: '마르코스 실바',
                    // roles: ['user']
                    roles: ['dojang_admin']
                    // roles: ['site_admin']
                },
                lastFetchTime: null,

                //actions
                setUser: (user) => set({ user:  user }),

                //clears
                clearUser: () => set({ user: null }),
                }),
            ),
            {
                name: 'user-store',
                partialize: (state) => ({
                    user: state.user,
                    lastFetchTime: state.lastFetchTime,
                })
            }
        ),
        {
            name: 'user-store-devtools',
            enabled: process.env.NODE_ENV === 'development',
        }
    )
);

//구독 추가

// 셀렉터 훅들
export const useUser = () => useUserStore(state => state.user);