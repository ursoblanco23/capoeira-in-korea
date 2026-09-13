import {createBrowserRouter, Navigate, Outlet} from 'react-router-dom';
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Test from "../Test";
import NotFound from "../pages/NotFound.tsx";
import {PAGE} from "@/constants/routes.ts";
import DojangManage from "@/pages/DojangManage.tsx";
import DojangCreate from "@/pages/DojangCreate.tsx";
import DojangUpdate from "@/pages/DojangUpdate.tsx";
import RequireRole from "@/components/auth/RequireRole.tsx";
import Unauthorized from "@/pages/Unauthorized.tsx";
import DojangDetail from "@/pages/DojangDetail.tsx";
import Login from "@/pages/Login.tsx";
import SignupPage from "@/pages/SignupPage.tsx";
import {MyPage} from "../pages/my-page/MyPage.tsx";
import {ChangePassword} from "@/pages/my-page/components/ChangePassword.tsx";
import RequireAuth from "@/components/auth/RequireAuth.tsx";
import {ROLE} from "@/constants/role.ts"; // type으로만 쓰이고 있으면 import type 으로 변경하라는데 아래에서 쓰이고 있음.

const router = createBrowserRouter([
    {
        element: <Layout />, // 공통 레이아웃을 여기에 정의
        children: [
            {
                path: PAGE.HOME,
                element: <Home />,
            },
            {
                path: PAGE.LOGIN,
                element: <Login />,
            },
            {
                path: PAGE.DOJANG(':dojangId'),
                element: <DojangDetail />
            },
            {
                path: PAGE.SIGN_UP,
                element: <SignupPage />,
            },
            // 로그인 사용자 전용 라우트
            {
                element: <RequireAuth />,
                children: [
                    {
                        path: PAGE.MY_PAGE,
                        element: <MyPage />,
                    },
                    {
                        path: PAGE.CHANGE_PASSWORD,
                        element: <ChangePassword />,
                    },
                    {
                        path: PAGE.ADMIN_DOJANG,
                        element: (
                            <RequireRole allowedRoles={[ROLE.DOJANG_ADMIN, ROLE.SITE_ADMIN]}>
                                <Outlet />
                            </RequireRole>
                        ),
                        children: [
                            {
                                index: true,
                                element: <DojangManage />,
                            },
                            {
                                path: PAGE.ADMIN_DOJANG_REGISTER,
                                element: <DojangCreate />,
                            },
                            {
                                path: PAGE.ADMIN_DOJANG_EDIT(':dojangId'),
                                element: <DojangUpdate />,
                            },
                        ]
                    },
                ],
            },
        ],
    },
    // 레이아웃이 적용되지 않는 라우트들
    {
        path: '/test',
        element: <Test />,
    },
    // unauthorized 페이지
    { path: PAGE.UNAUTHORIZED, element: <Unauthorized /> },
    // 404 페이지
    { path: PAGE.NOT_FOUND, element: <NotFound /> },
    {
        path: '*',
        element: <Navigate to={PAGE.NOT_FOUND} replace />
    },
]);

export default router;